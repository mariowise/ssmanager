angular.module('app.services.tag', [])

.factory('Tag', ['ResourceFactory', '$q', function (ResourceFactory, $q) {
	
	// Recurso local
	var Tag = ResourceFactory('Tag', 'tags') // Nombre del recurso, Nombre del recurso en API (URL)	

	return Tag
}])