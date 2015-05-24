angular.module('app.services.user', [])

.factory('User', ['ResourceFactory', function (ResourceFactory) {
	
	// Recurso local
	var User = ResourceFactory('User', 'users') // Nombre del recurso, Nombre del recurso en API (URL)

	// Se expone el servicio
	return User
}])