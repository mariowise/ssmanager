/*--
 *-- Comment (Resource)
 *-- ------
 *--
*/
angular.module('app.services.comment', [])

.factory('Comment', ['Resource', '$q', 'User', function (Resource, $q, User) {
	
	// Recurso local
	var Comment = Resource('Comment', 'comments', {

		notify: {
			method: "POST",
			url: CONFIG.api("comments") + "/notify/",
			responseType: "json"
		}
	}) // Nombre del recurso, Nombre del recurso en API (URL)	

	/*
	 *-- #### fetchOne(Resource::find)
	 *--
	 */
	Comment.fetchOne = Comment.find

	// Se expone el servicio
	return Comment
}])
