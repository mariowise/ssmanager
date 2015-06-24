angular.module('app.services.comment', [])

.factory('Comment', ['Resource', '$q', function (Resource, $q) {
	
	// Recurso local
	var Comment = Resource('Comment', 'comments') // Nombre del recurso, Nombre del recurso en API (URL)	

	Comment.fetchOne = function (key) {
		if(CONFIG.debug) console.log("Comment::fetchOne")
		var d = $q.defer()

		Comment.find(key)
		.then(function (comment) {
			return $q.all([
				comment, 
				User.fetch(comment.autor_comentary)
			])
		}, d.reject, function (ncomment) {
			if(ncomment.user)
				d.notify(ncomment)
		})
		.then(function (res) {
			var comment = res[0]
			comment.user = res[1]
			Comment.set(comment.id, comment)
			.then(d.resolve, d.reject)
		}, d.reject)

		return d.promise
	}

	// Se expone el servicio
	return Comment
}])
