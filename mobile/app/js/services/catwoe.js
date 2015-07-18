/*--
 *-- Catwoe (Resource)
 *-- ------
 *--
*/
angular.module('app.services.catwoe', [])

.factory('Catwoe', ['Resource', '$q', 'Session', 'Comment', 'Has', function (Resource, $q, Session, Comment, Has) {

	// Recurso local
	var Catwoe = Resource('Catwoe', 'root_definition_catwoe', {}), res = {}

	/*
	 *-- #### fetchOne(Resource::find)
	 *--
	 */
	Catwoe.fetchOne = Catwoe.find	

	return angular.extend({}, Catwoe, res)
}])