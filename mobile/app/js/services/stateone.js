angular.module('app.services.stateone', [])

.factory('StateOne', ['Resource', '$q', 'Session', 'Media', 'File', 'Tag', function (Resource, $q, Session, Media, File, Tag) {
	
	// Recurso local
	var StateOne = Resource('StateOne', 'state_one', {
		delete_tag: {
			method: "POST",
			url: CONFIG.api('state_one') + "/:id/delete_tag/",
			responseType: 'json'
		}
		, delete_media: {
			method: "POST",
			url: CONFIG.api('state_one') + "/:id/delete_media/",
			responseType: 'json'
		}
	})

	StateOne.fetchOne = function (key) {
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

	StateOne.addMediaOffline = function (state, media) {
		var d = $q.defer()

		StateOne.get(state.id)
		.then(function (state) {
			state.medias.unshift(media)
			if(media.type_media == "1")
				state.ssp_videos.push(media.id)
			else if(media.type_media == "2")
				state.ssp_imagenes.push(media.id)
			else if(media.type_media == "3")
				state.ssp_audios.push(media.id)
			return StateOne.set(state.id, state)
		})
		.then(d.resolve)
		.catch(d.reject)

		return d.promise
	}

	// Se expone el servicio
	return StateOne
}])
