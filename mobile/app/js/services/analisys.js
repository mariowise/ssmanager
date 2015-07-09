angular.module('app.services.analisys', [])

.factory('Analisys', ['Resource', '$q', function (Resource, $q) {

	// Recurso local
	var Analisys = Resource('Analisys', 'analisys', {}), res = {}

	Analisys.fetchOne = Analisys.find

	return angular.extend({}, Analisys, res)
}])