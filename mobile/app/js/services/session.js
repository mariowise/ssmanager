angular.module('app.services.session', [])

.factory('Session', ['ResourceFactory', function (ResourceFactory) {
	
	// Recurso local
	var Session = ResourceFactory('Session', '') // Nombre del recurso, Nombre del recurso en API (URL)

	// Se expone el servicio
	return Session
}])