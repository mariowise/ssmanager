angular.module('app.controllers.projects.stateone', [])

.controller('StateOneController', ['$scope', '$state', 'EM', function ($scope, $state, EM) {
	console.log("StateOneController running")

	$scope.state = {}

	$scope.setState = function (state) {
		if(angular.toJson($scope.state) != angular.toJson(state)) {
			$scope.state = state
		}
	}

	$scope.$watch('project', function () {
		if($scope.project.id) {
			EM('StateOne').fetch($scope.project.state_one.id)
			.then($scope.setState, function (err) {
				$.loading.error("No ha sido posible cargar el estado solicitado")
				$state.go("app.project", { project_id: $scope.project.id })
			}, $scope.setState)
		}
	})

	$scope.$on('changeState', function (event, newVal) {
		$scope.state = newVal
	})
}])

.controller('stateone#show', ['$scope', '$state', 'EM', function ($scope, $state, EM) {
	console.log("stateone#show running")

	$scope.newmedia = {}	

	$scope.takeMedia = function (type) {
		$.loading.show("loading")
		EM('File')[type]()
		.then(function (fileUri) {
			console.log(fileUri)
			$.loading.hide("loading")
			$('#myModal').modal('show')
			if(type == "takePhoto")
				$scope.newmedia.type_media = "2"
			else if(type == "takeAudio")
				$scope.newmedia.type_media = "3"
			else if(type == "takeVideo")
				$scope.newmedia.type_media = "1"
			$scope.newmedia.url_media = fileUri
			$scope.newmedia.local_uri = fileUri
		}, function () {
			$.loading.error("Ha ocurrido un problema al tomar la foto")
		})
	}
	$scope.uploadMedia = function () {
		EM('Session').current_user()
		.then(function (current_user) {
			$('#myModal').modal('hide')
			$.loading.show("loading")

			EM('Media').create(angular.extend({}, $scope.newmedia, { state_one_id: $scope.state.id }))
			// local_uri = $scope.newmedia.url_media
			// EM('File').upload(local_uri)
			// .then(function (file) {
			// 	console.log("Archivo procesado")
			// 	console.log(file)
			// 	file = JSON.parse(file.response)
			// 	return EM('Media')._create({
			// 		name_media: $scope.newmedia.name_media,
			// 		description_media: $scope.newmedia.description_media,
			// 		url_media: file.mediaLink,
			// 		uploaded_by: current_user.username,
			// 		type_media: $scope.newmedia.type_media,
			// 		state_one_id: $scope.state.id // New API
			// 	})
			// }, null, function (notify) {
			// 	$scope.progress = (notify.loaded / notify.total).toFixed(0)
			// })
			.then(function (media) {
				return EM('StateOne').fetch($scope.state)
			})
			.then(function (state) {
				$scope.$emit('changeState', state)
				$.loading.show("success", 1500)
			})
			.catch(function (err) {
				console.log(err)
				$.loading.error("Ha ocurrido un error al subir el contenido")
			})
		})
	}
}])
