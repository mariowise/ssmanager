angular.module('app.services.stateone', [])

.factory('StateOne', ['ResourceFactory', '$q', 'Session', 'Project', 'Media', 'File', function (ResourceFactory, $q, Session, Project, Media, File) {
	
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

	// Se expone el servicio
	return StateOne
}])
