angular.module('app.services.media', [])

.factory('Media', ['ResourceFactory', '$q', 'Session', 'Comment', function (ResourceFactory, $q, Session, Comment) {
	
	// Recurso local
	var Media = ResourceFactory('Media', 'media') // Nombre del recurso, Nombre del recurso en API (URL)	

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

	Media.uploadMedia = function (newmedia) {
		
	}

	// Se expone el servicio
	return Media
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
