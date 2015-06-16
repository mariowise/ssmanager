angular.module('app.services.media', [])

.factory('Media', ['ResourceFactory', '$q', 'Session', 'Comment', 'File', 'Tag', function (ResourceFactory, $q, Session, Comment, File, Tag) {
	
	// Recurso local
	var Media = ResourceFactory('Media', 'media') // Nombre del recurso, Nombre del recurso en API (URL)	
	  , response = {}

	/*
 	 * Agrega un comentario a una media
 	 * Consulta además el current_user para registrar el autor del comentario
 	 * retorna el nuevo comentario.
	 */
	Media.addComment = function (media, msg) {
		var d = $q.defer()

		Session.current_user()
		.then(function (current_user) {
			
			Comment.create({
				content_comentary: msg
				, autor_comentary: current_user.id
			})
			.then(function (newComment) {
				media.comments_media.push(newComment.id)
				Media.update(media)
				.then(function (newMedia) {
					newComment.user = current_user
					d.resolve(newComment)
				}, d.reject)
			}, d.reject)

		}, d.reject)

		return d.promise
	}

	/*
	 * Efectúa un find y además descarga el archivo si es que no existe
	 */
	Media.fetchOne = function (key) {
		if(CONFIG.debug) console.log("Media::fetchOne " + key)
		var d = $q.defer()

		Media.find(key)
		.then(function (media) {
			return $q.all([
				media,
				File.download(media.url_media), 
				Comment.fetch(media.comments_media)
			])
		}, d.reject, function (nmedia) {
			if(nmedia.local_uri && nmedia.comments)
				d.notify(nmedia)
		})
		.then(function (res) {
			var media = res[0]
			media.local_uri = res[1]
			media.comments = res[2]
			Media.set(media.id, media)
			.then(d.resolve, d.reject)
		}, d.reject)

		return d.promise
	}

	// Se expone el servicio
	return angular.extend({}, Media, response)
}])

// LOOOOOL
// if media_type == '1':
// 	stateOne.ssp_videos.append(newMedia.id)
// if media_type == '2':
// 	stateOne.ssp_imagenes.append(newMedia.id)
// if media_type == '3':
// 	stateOne.ssp_audios.append(newMedia.id)
// if media_type == '4':
// 	stateOne.ssp_documentos.append(newMedia.id)
