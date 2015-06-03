angular.module('app', [
	'ui.router'
	, 'ngResource'
	, 'ngCordova'
	, 'angular-jwt'
	, 'angularMoment'

	, 'app.services.resource-factory'
	, 'app.services.session'
	, 'app.services.user'
	, 'app.services.project'
	, 'app.services.stateone'
	, 'app.services.media'
	, 'app.services.comment'
	, 'app.services.file'

	, 'app.controllers.application'
	, 'app.controllers.login'
	, 'app.controllers.index'
	, 'app.controllers.projects'
	, 'app.controllers.profile'
	, 'app.controllers.stateone'
	, 'app.controllers.media'

	, 'app.directives.footer'
	, 'app.directives.header'
	, 'app.directives.panel'

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

	// Projects
	.state('app.projects', {
		url: '/projects',
		views: {
			'mainView': {
				templateUrl: 'views/projects/index.html',
				controller: 'projects#index'
			}
		}
	})
	.state('app.projects-show', {
		url: '/projects/:id',
		views: {
			'mainView': {
				templateUrl: 'views/projects/show.html',
				controller: 'projects#show'
			}
		}	
	})

	// StateOne
	.state('app.stateone-show', {
		url: '/stateone/:project_id',
		views: {
			'mainView': {
				templateUrl: 'views/stateone/show.html',
				controller: 'stateone#show'
			}
		}	
	})

	// Media
	.state('app.media-show', {
		url: '/media/:project_id/:media_id',
		views: {
			'mainView': {
				templateUrl: 'views/media/show.html',
				controller: 'media#show'
			}
		}	
	})

	// Profile
	.state('app.profile-show', {
		url: '/profile-show',
		views: {
			'mainView': {
				templateUrl: 'views/profile/show.html',
				controller: 'profile#show'
			}
		}
	})
	.state('app.profile-edit', {
		url: '/profile-edit',
		views: {
			'mainView': {
				templateUrl: 'views/profile/edit.html',
				controller: 'profile#edit'
			}
		}
	})	

	$urlRouterProvider.otherwise('/app/projects')

})

.config(function Config($httpProvider, jwtInterceptorProvider) {
	jwtInterceptorProvider.authPrefix = "JWT " // La wea importante xD
	jwtInterceptorProvider.tokenGetter = function(config, Session, $q, $http, $state) {
		if(config.url.indexOf("http://softsystemanager.appspot.com") === 0) {
			// console.log("jwtInterceptor running (" + $state.current.name + ")")
			var d = $q.defer()

			Session.get("current_user")
			.then(function (current_user) {
				if(current_user == undefined)
					d.resolve(undefined)
				else
					d.resolve(current_user.token)
			}, function (err) { d.reject(err) })

			return d.promise

		}
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

.run(function (Session, User, Project, StateOne, Media, Comment, $localForage, amMoment) {
	// Moment.js locale
	amMoment.changeLocale('es')

	// Testing ground
	window.Session = Session
	window.$localForage = $localForage
	window.User = User
	window.Project = Project
	window.StateOne = StateOne
	window.Media = Media
	window.Comment = Comment

	setInterval(function () {
		Session.refresh_token()
	}, 15 * 1000)
})
