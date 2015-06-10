angular.module('app.controllers.application', [])

.controller('ApplicationController', ['$scope', '$state', '$interval', 'Session', function ($scope, $state, $interval, Session) {
	console.log("ApplicationController running")

	$scope.flash_messages = []
	$scope.error = { message: "" }

	$scope.logout = function () {
		$('#loading').show()

		Session.delete("current_user")
		.then(function (current_user) {
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

	Session.current_user()
	.then(function (user) {
		$scope.current_user = user
		window.current_user = user
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
