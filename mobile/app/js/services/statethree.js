angular.module('app.services.statethree', [])

.factory('StateThree', ['Resource', '$q', 'Project', function (Resource, $q, Project) {

	// Recurso local
	var StateThree = Resource('StateThree', 'state_three', {}), res = {}	

	return angular.extend({}, StateThree, res)
}])