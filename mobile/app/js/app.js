angular.module('app', [
	'ui.router'
	, 'ngResource'
	, 'ngCordova'
	, 'angular-jwt'
	, 'angularMoment'

	, 'app.services.resource-factory'
	, 'app.services.session'
	, 'app.services.user'
	, 'app.services.profile'
	, 'app.services.project'
	, 'app.services.stateone'
	, 'app.services.media'
	, 'app.services.comment'
	, 'app.services.file'
	, 'app.services.tag'

	, 'app.controllers.application'
	, 'app.controllers.login'
	, 'app.controllers.index'
	, 'app.controllers.profile'

	, 'app.controllers.projects.projects'
	, 'app.controllers.projects.stateone'
	, 'app.controllers.projects.media'
	, 'app.controllers.projects.tags'

	, 'app.directives.footer'
	, 'app.directives.header'
	, 'app.directives.panel'
	, 'app.directives.media-player'

	, 'sync.resource'

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
			templateUrl: 'views/login/index.html',
			controller: 'login#index'
		})

	// Application
	.state('app', {
		abstract: true,
		url: '/app',
		templateUrl: 'views/layouts/default.html',
		controller: 'ApplicationController'
	})

		// Projects
		.state('app.projects', {
			url: '/projects',
			templateUrl: 'views/projects/index.html',
			controller: 'projects#index'
		})
		.state('app.project', {
			abstract: true,
			url: '/project/:project_id',
			template: '<div ui-view></div>',
			controller: 'ProjectController'
		})
			.state('app.project.show', {
				url: '/',
				templateUrl: 'views/projects/show.html',
				controller: 'projects#show'
			})
			// StateOne
			.state('app.project.stateone', {
				abstract: true,
				url: '/stateone',
				template: '<div ui-view></div>',
				controller: 'StateOneController'
			})	
				.state('app.project.stateone.show', {
					url: '/',
					templateUrl: 'views/projects/stateone/show.html',
					controller: 'stateone#show'
				})
				// Media
				.state('app.project.stateone.media', {
					url: '/media/:media_id',
					templateUrl: 'views/projects/stateone/media/show.html',
					controller: 'media#show'
				})
				// Tags
				.state('app.project.stateone.tags', {
					url: '/tags',
					templateUrl: 'views/projects/stateone/tags/index.html',
					controller: 'tags#index'
				})

	// Profile
	.state('app.profile', {
		url: '/profile',
		template: '<div ui-view></div>',
		controller: 'ProfileController'
	})
	.state('app.profile.show', {
		url: '/',
		templateUrl: 'views/profile/show.html',
		controller: 'profile#show'
	})
	.state('app.profile.edit', {
		url: '/edit',
		templateUrl: 'views/profile/edit.html',
		controller: 'profile#edit'
	})	

	$urlRouterProvider.otherwise('/app/projects')

})

.config(function Config($httpProvider, jwtInterceptorProvider) {
	jwtInterceptorProvider.authPrefix = "JWT " // La wea importante xD
	jwtInterceptorProvider.tokenGetter = function(config, Session, $q, $state) {
		if(config.url.indexOf("http://softsystemanager.appspot.com") === 0) {
			// console.log("jwtInterceptor running (" + $state.current.name + ")")
			var d = $q.defer()

			Session.get("current_user")
			.then(function (current_user) {
				if(current_user == undefined)
					d.resolve(undefined)
				else
					d.resolve(current_user.token)
			}, function (err) { d.resolve(undefined) })

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

.run(function ($q, Session, User, Project, StateOne, Media, Comment, StateOne, File, Resource, Tag, Profile, $localForage, amMoment) {
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
	window._File = File
	window.Tag = Tag
	window.Profile = Profile

	window.dropAll = function () {
		User.drop()
		Project.drop()
		StateOne.drop()
		Media.drop()
		Comment.drop()
		File.drop()
		Tag.drop()
	}

	setInterval(function () {
		Session.refresh_token()
	}, 15 * 1000)

	// testEntity = Resource("Test", "test")
	// async.series([
	// 	function (callback) { testLocal($q, testEntity, callback) },
	// 	function (callback) { testRemote($q, testEntity, callback) },
	// 	function (callback) { testResource($q, testEntity, callback) }
	// ])
})
