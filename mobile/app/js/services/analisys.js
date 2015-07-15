angular.module('app.services.analisys', [])

.factory('Analisys', ['Resource', '$q', function (Resource, $q) {

	// Recurso local
	var Analisys = Resource('Analisys', 'analisys', {
		add_tag: {
			method: "POST",
			url: CONFIG.api("analisys") + "/:id/add_tag/",
			responseType: "json"
		}
		, rm_tag: {
			method: "POST",
			url: CONFIG.api("analisys") + "/:id/rm_tag/",
			responseType: "json"
		}
	}), res = {}

	Analisys.fetchOne = Analisys.find

	return angular.extend({}, Analisys, res)
}])