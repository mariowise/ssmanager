angular.module('app.services.catwoe', [])

.factory('Catwoe', ['Resource', '$q', function (Resource, $q) {

	// Recurso local
	var Catwoe = Resource('Catwoe', 'root_definition_catwoe', {}), res = {}	

	return angular.extend({}, Catwoe, res)
}])