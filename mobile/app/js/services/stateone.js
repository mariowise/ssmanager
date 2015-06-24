angular.module('app.services.stateone', [])

.factory('StateOne', ['Resource', '$q', 'Session', 'Project', 'Media', 'File', 'Tag', function (Resource, $q, Session, Project, Media, File, Tag) {
	
	// Recurso local
	var StateOne = Resource('StateOne', 'state_one') // Nombre del recurso, Nombre del recurso en API (URL)	

	StateOne.fetchOne = function (key) {
		console.log("StateOne::fetchOne " + JSON.stringify(key).substr(0, 20))
		var d = $q.defer()

		StateOne.find(key)
		.then(function (state) {
			var medias = [].concat(state.ssp_videos,state.ssp_imagenes,state.ssp_audios,state.ssp_documentos)
			return $q.all([
				state,
				Media.find(medias),
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
			var tag = res[0], state = res[1]
			state.tags_state.push(tag.id)
			return StateOne._update(state)
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
				return StateOne._update(remote)
			} else d.reject("Tag::deatach no ha encontrado la llave de la etiqueta para ser eliminada")
		})
		.then(function (remote) {
			return Tag._destroy(tag)
		})
		.then(function () {
			StateOne.fetch(state)
			.then(d.resolve, d.reject)
		})
		.catch(d.reject)

		return d.promise
	}

	StateOne.removeMedia = function (state, media) {
		var d = $q.defer()

		StateOne._find(state)
		.then(function (rstate) {
			if((i = rstate.ssp_videos.indexOf(media.id)) != -1) rstate.ssp_videos.splice(i, 1)
			else if((i = rstate.ssp_imagenes.indexOf(media.id)) != -1) rstate.ssp_imagenes.splice(i, 1)
			else if((i = rstate.ssp_audios.indexOf(media.id)) != -1) rstate.ssp_audios.splice(i, 1)
			else if((i = rstate.ssp_documentos.indexOf(media.id)) != -1) rstate.ssp_documentos.splice(i, 1)
			else console.error("StateOne::delete no ha sido capaz de encontrar la llave.")
			return StateOne._update(rstate)
		})
		.then(function () {
			return Media._destroy(media)
		})
		.catch(d.reject)

		return d.promise
	}

	// Se expone el servicio
	return StateOne
}])
