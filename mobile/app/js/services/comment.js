angular.module('app.services.comment', [])

.factory('Comment', ['ResourceFactory', '$q', function (ResourceFactory, $q) {
	
	// Recurso local
	var Comment = ResourceFactory('Comment', 'comments') // Nombre del recurso, Nombre del recurso en API (URL)	

	/*
	 * Recibe un arreglo de ids a descargar mediante método find
	 * además efectúa un find sobre el usuario autor del comentario
	 * para luego poder mostrar el nombre del usuario que hizo el 
	 * comentario
	 */
	Comment.pull = function (comments) {
		var d = $q.defer()

		if(comments.constructor === Array) {
			var fns = []
			comments.forEach(function (comment_id) {
				fns.push(function (callback) {
					Comment.find(comment_id)
					.then(function (comment) {
						User.find(comment.autor_comentary)
						.then(function (user) {
							comment.user = user
							callback(null, comment)
						})
					})
				})
			})
			async.series(fns, function (err, results) {
				if(!err) {
					d.resolve(results)
				} else d.reject(err)
			})
		} else d.resolve()
		

		return d.promise
	}

	// Se expone el servicio
	return Comment
}])