angular.module('app.controllers.messages', [])

.controller('MessageController', ['$scope', '$state', 'EM', function ($scope, $state, EM) {
	console.log("MessageController running")

	
}])

.controller('messages#index', ['$scope', '$state', 'EM', function ($scope, $state, EM) {
	console.log("messages#index running")

	$scope.loading = true

	function setProfile(profile) {
		var user = $scope.current_user
		user.profile = profile
		$scope.$emit('setCurrentUser', user)
		$scope.loading = false
	}

	function fetchMessages() {
		EM('Profile').fetchMessages($scope.current_user.profile)
		.then(setProfile, null, null)
	}

	if($scope.current_user)
		fetchMessages()

	$scope.$on('CurrentUserLoaded', fetchMessages)
}])

.controller('messages#show', ['$scope', '$state', '$stateParams', 'EM', function ($scope, $state, $stateParams, EM) {
	console.log("messages#show running")

	$scope.message = {}
	$scope.reply = {}

	EM('Message').get($stateParams.message_id)
	.then(function (message) {
		$scope.message = message
		return EM('Message').mark_message({ id: message.id })
	})

	$scope.delete = function () {
		if(confirm("Estas seguro que quieres eliminar este mensaje?")) {
			$.loading.show("loading")

			EM('Message')._destroy($scope.message)
			.then(function () {
				$state.go("app.messages.index")
				$.loading.show("success", 1800)
			}, function (err) {
				console.error(err)
				$.loading.error("No ha sido posible eliminar el mensaje")
			})
		}
	}
	$scope.sendMessage = function () {
		$.loading.show("loading")

		$scope.reply.id = Number(guid())
		$scope.reply.receptores_mensaje = [$scope.message.remitente.id]
		$scope.reply.remitente_mensaje = $scope.current_user.username
		$scope.reply.proyecto_mensaje = $scope.message.proyecto_mensaje

		EM('Message')._create($scope.reply)
		.then(function (msg) {
			$.loading.show("success", 2000)
			$('#reply').modal('hide')
			$scope.reply = {}
		}, function (err) {
			console.error(err)
			$.loading.error("No ha sido posible enviar el mensaje")
		})
	}
}])