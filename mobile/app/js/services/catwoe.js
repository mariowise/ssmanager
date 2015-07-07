angular.module('app.services.catwoe', [])

.factory('Catwoe', ['Resource', '$q', 'Session', 'Comment', 'Has', function (Resource, $q, Session, Comment, Has) {

	// Recurso local
	var Catwoe = Resource('Catwoe', 'root_definition_catwoe', {}), res = {}

	Catwoe.fetchOne = Catwoe.find	

	return angular.extend({}, Catwoe, res)
}])