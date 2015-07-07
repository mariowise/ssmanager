angular.module('app.services.has', [])

.factory('Has', ['Resource', '$q', function (Resource, $q) {

	// Recurso local
	var Has = Resource('Has', 'root_definition', {
		remove: {
			method: 'POST',
			url: CONFIG.api("root_definition") + "/:id/remove/"
		}
	}), res = {}

	return angular.extend({}, Has, res)
}])