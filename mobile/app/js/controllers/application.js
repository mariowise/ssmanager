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

	$('#header .nav.navbar-nav li a').click(function (event) {
		$('#header .navbar-toggle').click()
	})

}])
