angular.module('app', [
	'ui.router'
	, 'ngResource'
	, 'ngAnimate'
	, 'ngCordova'
	, 'angular-jwt'
	, 'angularMoment'
	, 'selectize'

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
	, 'app.services.message'
	, 'app.services.catwoe'
	, 'app.services.statethree'
	, 'app.services.has'
	, 'app.services.richpicture'
	, 'app.services.document'
	, 'app.services.analisys'
	, 'app.services.entity-manager'

	, 'app.controllers.application'
	, 'app.controllers.login'
	, 'app.controllers.profile'
	, 'app.controllers.messages'

	, 'app.controllers.projects.projects'
	, 'app.controllers.projects.stateone'
	, 'app.controllers.projects.media'
	, 'app.controllers.projects.tags'
	, 'app.controllers.projects.analisys'
	, 'app.controllers.projects.statetwo'
	, 'app.controllers.projects.statethree'
	
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
			.state('app.project.colab', {
				url: '/colab/:colab_username',
				templateUrl: 'views/projects/colab.html',
				controller: 'project#colab'
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
				// Analisys
				.state('app.project.stateone.analisys', {
					url: '/analisys',
					templateUrl: 'views/projects/stateone/analisys/index.html',
					controller: 'analisys#index'
				})
				.state('app.project.stateone.analisys-show', {
					url: '/analisys/:analisys_id',
					templateUrl: 'views/projects/stateone/analisys/show.html',
					controller: 'analisys#show'
				})
			// StateTwo
			.state('app.project.statetwo', {
				abstract: true,
				url: '/statetwo',
				template: '<div ui-view></div>',
				controller: 'StateTwoController'
			})
				.state('app.project.statetwo.index', {
					url: '/',
					templateUrl: 'views/projects/statetwo/index.html',
					controller: 'statetwo#index'
				})
				.state('app.project.statetwo.show', {
					url: '/:picture_id',
					templateUrl: 'views/projects/statetwo/show.html',
					controller: 'statetwo#show'
				})
			// StateThree
			.state('app.project.statethree', {
				abstract: true,
				url: '/statethree',
				template: '<div ui-view></div>',
				controller: 'StateThreeController'
			})
				.state('app.project.statethree.index', {
					url: '/',
					templateUrl: 'views/projects/statethree/index.html',
					controller: 'statethree#index'
				})
				.state('app.project.statethree.show', {
					url: '/:catwoe_id',
					templateUrl: 'views/projects/statethree/show.html',
					controller: 'statethree#show'
				})
				.state('app.project.statethree.edit', {
					url: '/:catwoe_id/edit',
					templateUrl: 'views/projects/statethree/edit.html',
					controller: 'statethree#edit'
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
	.state('app.profile.changepass', {
		url: '/changepass',
		templateUrl: 'views/profile/changepass.html',
		controller: 'profile#changepass'
	})

	// Messages
	.state('app.messages', {
		abstract: true,
		url: '/messages',
		template: '<div ui-view></div>',
		controller: 'MessageController'
	})
	.state('app.messages.index', {
		url: '/',
		templateUrl: 'views/messages/index.html',
		controller: 'messages#index'
	})
	.state('app.messages.show', {
		url: '/:message_id',
		templateUrl: 'views/messages/show.html',
		controller: 'messages#show'
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

.run(function ($q, amMoment, Resource, EM, $cordovaFile, $cordovaLocalNotification) {
	// Moment.js locale
	amMoment.changeLocale('es')

	// Testing ground
	window.EM = EM

	window.dropAll = function () {
		EM('User').drop()
		EM('Project').drop()
		EM('StateOne').drop()
		EM('Media').drop()
		EM('Comment').drop()
		EM('File').drop()
		EM('Tag').drop()
	}

	setInterval(function () {
		EM('Session').refresh_token()
	}, 15 * 1000)

	document.addEventListener("deviceready", function () {
		if(typeof cordova != "undefined") {
			var basePath = cordova.file.applicationStorageDirectory + ((cordova.platformId == "ios") ? "Documents/" : "")
			$cordovaFile.checkDir(basePath, "media")
			.then(null, function (err) {
				console.log("Creando directorio 'media' en " + basePath)
				$cordovaFile.createDir(basePath, "media", true)
				.then(null, function (err) {
					console.error(err)
					alert("ERROR FATAL: No ha sido posible crear la carpeta 'media'.")
				})
			})
		}	
	}, false);

	// testEntity = Resource("Test", "test", { 
	// 	save: {
	// 		method: "POST",
	// 		url: CONFIG.api("test") + "/"
	// 	}
	// })
	// window.Test = testEntity
	// async.series([
	// 	function (callback) { testLocal($q, testEntity, callback) },
	// 	function (callback) { testRemote($q, testEntity, callback) },
	// 	function (callback) { testResource($q, testEntity, callback) }
	// ])

	// setTimeout(function () {
	// 	async.series([
	// 		function (callback) { testRemote2($q, EM('Analisys'), { title: "Analisys", testObject: {
	// 			'name_analisis': "Test analisys", 
	//             'description_analisis': "Test description", 
	//             'links_analisis': [], 
	//             'comments_analisis': [], 
	//             'tags_analisis': [], 
	//             'created_by': "testing"
	// 		} }, callback) },
	// 		function (callback) { testRemote2($q, EM('Comment'), { title: "Comment", testObject: {
	// 			'autor_comentary': '5769720821186560',
	//             'content_comentary': 'Test comment'
	// 		} }, callback) },
	// 		function (callback) { testRemote2($q, EM('Document'), { title: "Document", testObject: {
	// 			'name_documento': 'Test document',
	//             'url_documento': 'https://docs.google.com/drawings/d/1AW65GBwMsHQ05l3UnLQItzy1oGL4Kk97Xm72co5bK7k/edit?usp=drivesdk',
	//             'shared_documento': 'testing',
	//             'google_id': 'some google id'
	// 		} }, callback) },
	// 		function (callback) { testRemote2($q, EM('Media'), { title: "Media", testObject: {
	// 			'name_media': 'Some name for the test',
	//             'description_media': 'Some description',
	//             'url_media': 'https://docs.google.com/drawings/d/1AW65GBwMsHQ05l3UnLQItzy1oGL4Kk97Xm72co5bK7k/edit?usp=drivesdk',
	//             'uploaded_by': 'testing',
	//             'type_media': '1',
	//             'state_one_id': 5161872890265600
	// 		} }, callback) },
	// 		function (callback) { testRemote2($q, EM('Message'), { title: "Message", testObject: {
	// 			'remitente_mensaje': 'testing',
	//             'receptores_mensaje': [],
	//             'asunto_mensaje': 'Some subject',
	//             'contenido_mensaje': 'Some content',
	//             'proyecto_mensaje': '5714902542974976',
	//             'url_asoc_mensaje': ''
	// 		} }, callback) },
	// 		function (callback) { testRemote2($q, EM('Project'), { title: "Project", testObject: {
	// 			'manager': 5146248336113664, 
	//         	'name_ssp': 'Some name',
	//         	'description_ssp': 'Some description',
	//         	'ids_folder_ssp': []
	// 		} }, callback) },
	// 		function (callback) { testRemote2($q, EM('RichPicture'), { title: "RichPicture", testObject: {
	// 			'name_rp': 'Some name',
	//             'description_rp': 'Some description',
	//             'created_by': 'testing'
	// 		} }, callback) },
	// 		function (callback) { testRemote2($q, EM('Catwoe'), { title: "Catwoe", testObject: {
	// 			'name_dr': 'Some name',
	//             'description_dr': 'Some description',
	//             'clientes_dr': 'asdf',
	//             'actores_dr': 'asdf',
	//             'trans_input_dr': 'asdf',
	//             'trans_output_dr': 'asdf',
	//             'cosmo_dr': 'asdf',
	//             'propietario_dr': 'asf',
	//             'entorno_dr': 'asdf',
	//             'created_by': 'testing',
	//             'state_id': 5755424754106368
	// 		} }, callback) },
	// 		function (callback) { testRemote2($q, EM('Tag'), { title: "Tag", testObject: {
	// 			'name_tag': 'Some name',
 //            	'description_tag': 'Some description',
 //            	'state_one_id': 5161872890265600
	// 		} }, callback) }
	// 	])
	// }, 5000)
})

