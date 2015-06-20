angular.module('app.services.stateone', [])

.factory('StateOne', ['ResourceFactory', '$q', 'Session', 'Project', 'Media', 'File', 'Tag', function (ResourceFactory, $q, Session, Project, Media, File, Tag) {
	
	// Recurso local
	var StateOne = ResourceFactory('StateOne', 'state_one') // Nombre del recurso, Nombre del recurso en API (URL)	

	/*
	 * Para todos lor proyectos almacenados en la tabla Project, descarga su estado1 y sus medias
	 */
	StateOne.pull = function () {
		var d = $q.defer()
		
		Project.all()
		.then(function (projects) {
			var fns = []
			projects.forEach(function (project) {
				fns.push(function (callback) {
					StateOne._pull(project.id)
					.then(function(state) { callback(null, state) }, function (err) { callback(err) })
				})
			})
			async.series(fns, function (err, results) {
				if(err)
					d.reject(err)
				else
					d.resolve(results)
			})
		})
		
		return d.promise
	}

	/*
	 * Descarga de internet el StateOne de un projecto, descarga además todos los objetos media
	 * y los deja almacenados localmente en una columna local dentro del objeto StateOne llamada sortedMedias
	 * debe ser capaz de descargar todo el StateOne y todas sus medias, si falta 1, rechazará la promesa
	 */
	StateOne._pull = function (project_id) {
		var defer = $q.defer()

		StateOne.remote().query({ ssp_stateOne: project_id }, function (res) {

			if(res.length > 1)
				console.error("StateOne::_pull have found a project with more than one stateOne ("+res.length+"): " + project_id)

			res.forEach(function (stateOne) {
				// Se coleccionan todas las medias del state
				var medias = [].concat(stateOne.ssp_videos,stateOne.ssp_imagenes,stateOne.ssp_audios,stateOne.ssp_documentos)
				  , fns = []

				// Se buscan todas las medias del state y se ordenan por fecha
				medias.forEach(function (media_id) {
					fns.push(function (callback) {
						Media.fetch(media_id)
						.then(function (media) { callback(null, media) }, function (err) { callback(err) })
					})
				})
				async.series(fns, function (err, results) {
					if(err)
						defer.reject(err)
					else {
						results.sort(function (a, b) { return (-moment(a.date_media).unix() + moment(b.date_media).unix()) })
						stateOne.sortedMedias = results
						StateOne.set(stateOne.id, stateOne)
						.then(defer.resolve, defer.reject)
					}
				})
			})
		}, defer.reject)

		return defer.promise
	}

	/*
	 * Realiza un get al state y construye la columna sortedMedias sin realizar ninguna petición a la nube
	 * Fue diseñada para los casos en donde se pierde la columna como resultado de algun .find por ejemplo
	 * Es una pesadilla del mundo asíncrono
	 */
	StateOne.gather = function (project_id) {
		var d = $q.defer()

		// Se buscan todos los estados1 de un projecto por su id
		StateOne.where({ ssp_stateOne: project_id })
		.then(function (res) {
			var fns = []
			// Se coleccionan las medias desde la BD local y se ordenan
			res.forEach(function (state) {
				fns.push(function (callback) {
					var medias = [].concat(state.ssp_videos,state.ssp_imagenes,state.ssp_audios,state.ssp_documentos)
					  , jobs = []

					medias.forEach(function (media_id) {
						jobs.push(function (cb) {
							Media.get(media_id)
							.then(function (m) { cb(null, m) }, function (err) { cb(err) })
						})
					})
				    async.series(jobs, function (err, results) {
				    	if(err)
				    		callback(err) 
				    	else {
				    		results.sort(function (a, b) { return (-moment(a.date_media).unix() + moment(b.date_media).unix()) })
							state.sortedMedias = results
							StateOne.set(state.id, state)
							.then(function (state) { callback(null, state) }, function (err) { callback(err) })		
				    	}
				    })
				})
			})
			async.series(fns, function (err, results) {
				if(err)
					d.reject(err)
				else
					d.resolve(results)
			})
		})
		return d.promise
	}

	StateOne.fetchOne = function (key) {
		if(CONFIG.debug) console.log("StateOne::fetchOne " + key)
		var d = $q.defer()

		StateOne.find(key)
		.then(function (state) {
			var medias = [].concat(state.ssp_videos,state.ssp_imagenes,state.ssp_audios,state.ssp_documentos)
			return $q.all([
				state,
				Media.fetch(medias),
				Tag.find(state.tags_state)
			])
		}, d.reject, function (mstate) {
			if(mstate.medias && mstate.tags)
				d.notify(mstate)
		})
		.then(function (res) {
			var state = res[0]
			state.medias = res[1]
			state.tags = res[2]
			StateOne.set(state.id, state)
			.then(d.resolve, d.reject)
		})
		return d.promise
	}

	StateOne.addTag = function (state, newTag) {
		var d = $q.defer()

		Tag._create(newTag)
		.then(function (newTag) {
			return $q.all([
				newTag,
				StateOne.find(state)
			])
		})
		.then(function (res) {
			var state = res[1], tag = res[0]
			state.tags_state.push(tag.id)
			return StateOne.update(state)
		})
		.then(function (state) {
			StateOne.fetch(state)
			.then(d.resolve, d.reject)
		})
		.catch(d.reject)

		return d.promise
	}

	StateOne.updateTag = function (state, tag) {
		var d = $q.defer()

		Tag._update(tag)
		.then(function (tag) {
			return StateOne.fetch(state)
		})
		.then(d.resolve)
		.catch(d.reject)

		return d.promise
	}

	/*
	 * Actualiza el estado, quita la llave de la etiqueta, luego sube el estado
	 * y finalmente elimina la etiqueta en la nube. Si ocurre cualquier cosa, 
	 * rechaza
	 */
	StateOne.removeTag = function (state, tag) {
		var d = $q.defer()

		StateOne._find(state)
		.then(function (remote) {
			if((i = remote.tags_state.indexOf(tag.id)) != -1) {
				remote.tags_state.splice(i, 1)
				return StateOne.update(remote)
			} else d.reject("Tag::deatach no ha encontrado la llave de la etiqueta para ser eliminada")
		})
		.then(function (remote) {
			return Tag._destroy(tag)
		})
		.then(function () {
			return StateOne.fetch(state)
		})
		.then(d.resolve)
		.catch(d.reject)

		return d.promise
	}

	// Se expone el servicio
	return StateOne
}])
