angular.module('app.services.media', [])

.factory('Media', ['ResourceFactory', '$q', function (ResourceFactory, $q) {
	
	// Recurso local
	var Media = ResourceFactory('Media', 'media') // Nombre del recurso, Nombre del recurso en API (URL)	

	// Se expone el servicio
	return Media
}])