angular.module('app', [
	'ui.router',
	'ngResource',
	'ngCordova',
	'angular-jwt',

	'app.services.resource-factory',
	'app.services.session',

	'app.controllers.application',
	'app.controllers.login',
	'app.controllers.index'

])

.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider

	// Login
	.state('login', {
		abstract: true,
		templateUrl: 'views/layouts/no-header.html',
		controller: 'ApplicationController'
	})
	.state('login.index', {
		url: '/',
		views: {
			'mainView': {
				templateUrl: 'views/login/index.html',
				controller: 'login#index'
			}
		}
	})

	// Application
	.state('app', {
		abstract: true,
		url: '/app',
		templateUrl: 'views/layouts/default.html',
		controller: 'ApplicationController'
	})
	.state('app.index', {
		url: '/index',
		views: {
			'mainView': {
				templateUrl: 'views/index/index.html',
				controller: 'index#index'
			}
		}
	})

	$urlRouterProvider.otherwise('/app/index')

})

.config(function ($httpProvider, $resourceProvider) {

	// Usado para pasar promesas directo a las vistas
    // http://markdalgleish.com/2013/06/using-promises-in-angularjs-views/
    // Ver comentarios
    // http://plnkr.co/edit/ft97XVaCepVFEECTAenX?p=preview
    // $parseProvider.unwrapPromises(true);

    // Permite trabajar con CORS desde el backend
    $httpProvider.defaults.withCredentials = true
    
    // Permite que el backend trabaje con un / al final de cada url
    $resourceProvider.defaults.stripTrailingSlashes = false
})

// .config(function Config($httpProvider, jwtInterceptorProvider) {
	// jwtInterceptorProvider.tokenGetter = ['$q', '$http', '$state', 'jwtHelper', 'Session', function($q, $http, $state, jwtHelper, Session) {
	// 	var defer = $q.defer()

	// 	Session.get("current_user")
	// 	.then(function (current_user) {
	// 		if(current_user != undefined) {
	// 			if(jwtHelper.isTokenExpired(current_user.token)) {
	// 				console.log("El token ha expirado")

	// 			} else defer.resolve(current_user.token)
	// 		} else defer.resolve(undefined)
	// 	})

	// 	return defer.promise
	// }]

	// $httpProvider.interceptors.push('jwtInterceptor')
// })

.run(function (Session) {
	// Testing ground
	window.Session = Session
})
