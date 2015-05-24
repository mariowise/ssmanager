angular.module('app', [
	'ui.router'
	, 'ngResource'
	, 'ngCordova'
	, 'angular-jwt'

	, 'app.services.resource-factory'
	, 'app.services.session'
	, 'app.services.user'

	, 'app.controllers.application'
	, 'app.controllers.login'
	, 'app.controllers.index'

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

.config(function Config($httpProvider, jwtInterceptorProvider) {
	jwtInterceptorProvider.authPrefix = "JWT " // La wea importante xD
	jwtInterceptorProvider.tokenGetter = function(config, Session, $q, $http, $state) {
		if(config.url.indexOf("http://softsystemanager.appspot.com") === 0) {
			console.log("jwtInterceptor running (" + $state.current.name + ")")
			var d = $q.defer()

			// Se intenta renovar el token por uno nuevo (enviando el válido actual)
			// Con ello si se rechaza queire decir que el token ha expirado
			// En caso de estar expirado, será necesario volver a iniciar sesión
			Session.get("current_user")
			// Se intenta renovar el token mediante un $http.post
			.then(function (current_user) {
				var defer = $q.defer()

				if(current_user == undefined) 
					defer.resolve(current_user)
				else {
					$http.post(CONFIG.api("token-refresh/"), $.param({ token: current_user.token, orig_iat: current_user.orig_iat }), { headers : { 'Content-Type': 'application/x-www-form-urlencoded' } })
					.success(defer.resolve)
					.error(defer.reject)
				}

				return defer.promise
			})
			// Con la respuesta del $http.post se almacena el nuevo token
			// Incluyendo la información del usuario
			.then(function (res) {
				return Session.set_current_user(res)
			}, function (err) { 
				console.error("jwtInterceptor failed: I can't refresh the token.")
				d.reject(err)
			})
			// Se retorna el token
			.then(function (current_user) {
				if(current_user == undefined)
					d.resolve(current_user)
				else 
					d.resolve(current_user.token)
			})

			return d.promise

		} else return "no-token"
	}

	$httpProvider.interceptors.push('jwtInterceptor');
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

    // Interceptor de Request para $http
    // $httpProvider.interceptors.push('tokenInterceptor')
})

.run(function (Session, User, $localForage) {
	// Testing ground
	window.Session = Session
	window.$localForage = $localForage
	window.User = User
})
