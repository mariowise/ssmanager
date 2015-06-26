angular.module('app.controllers.application', [])

.controller('ApplicationController', ['$scope', '$state', '$interval', 'EM', function ($scope, $state, $interval, EM) {
	console.log("ApplicationController running")

	$scope.flash_messages = []
	$scope.error = { message: "" }

	$scope.logout = function () {
		$('#loading').show()

		EM('Session').delete("current_user")
		.then(function () {
			// Promesas abandonadas (good luck)
			EM('Session').drop()
			EM('Project').drop()
			EM('StateOne').drop()
			EM('Media').drop()
			EM('Comment').drop()
			EM('Tag').drop()
			EM('User').drop()
			
			$.loading.transition()
			$state.go("login.index")
		})
	}

	$scope.internet = function () {
		if(CONFIG.api_address == 'http://softsystemanager.appspot.com') {
			CONFIG.api_address += "a"
			$('#header .dropdown .modo').html('<i class="fa fa-globe"></i> Modo online')
		} else {
			CONFIG.api_address = 'http://softsystemanager.appspot.com'
			$('#header .dropdown .modo').html('<i class="fa fa-globe"></i> Modo offline')
		}
	}

	EM('Session').current_user()
	.then(function (user) {
		$scope.current_user = user
		window.current_user = user
		$scope.$broadcast('CurrentUserLoaded')
	})

	$('#header .nav.navbar-nav li a').click(function (event) {
		$('#header .navbar-toggle').click()
	})

	$('#header .btn.right').click(function () {
		$('#header .dropdown').toggle(200)
	})
	$('#header .dropdown .btn').click(function () {
		$('#header .dropdown').toggle(200)
	})

}])
