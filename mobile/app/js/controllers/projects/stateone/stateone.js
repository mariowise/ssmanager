angular.module('app.controllers.projects.stateone', [])

.controller('StateOneController', ['$scope', '$state', 'StateOne', function ($scope, $state, StateOne) {
	console.log("StateOneController running")

	$scope.state = {}

	function setState (state) {
		if(angular.toJson($scope.state) != angular.toJson(state)) {
			$scope.state = state
		}
	}

	$scope.$watch('project', function () {
		if($scope.project.id) {
			StateOne.fetch($scope.project.state_one.id)
			.then(setState, function (err) {
				$.loading.error("No ha sido posible cargar el estado solicitado")
				$state.go("app.project", { project_id: $scope.project.id })
			}, setState)
		}
	})

	$scope.$on('changeState', function (event, newVal) {
		$scope.state = newVal
	})
}])

.controller('stateone#show', ['$scope', '$state', 'StateOne', 'Media', 'File', 'Session', function ($scope, $state, StateOne, Media, File, Session) {
	console.log("stateone#show running")

	$scope.newmedia = {}	

	$scope.takeMedia = function (type) {
		$.loading.show("loading")
		File[type]()
		.then(function (fileUri) {
			console.log(fileUri)
			$.loading.hide("loading")
			$('#myModal').modal('show')
			if(type == "takePhoto")
				$scope.newmedia.type_media = "2" // Para imágenes xD Maldito fardo
			else if(type == "takeAudio")
				$scope.newmedia.type_media = "3" // Oh el conxesumadre este
			else if(type == "takeVideo")
				$scope.newmedia.type_media = "1" // Yaaa para la wea, oh la wea mala
			$scope.newmedia.url_media = fileUri
		}, function () {
			$.loading.error("Ha ocurrido un problema al tomar la foto")
		})
	}

	$scope.uploadMedia = function () {
		Session.current_user()
		.then(function (current_user) {
			$('#myModal').modal('hide')
			$.loading.show("loading")

			local_uri = $scope.newmedia.url_media
			File.upload(local_uri)
			.then(function (file) {
				console.log("Archivo procesado")
				console.log(file)
				file = JSON.parse(file.response)
				return Media.create({
					name_media: $scope.newmedia.name_media,
					description_media: $scope.newmedia.description_media,
					url_media: file.mediaLink,
					uploaded_by: current_user.username,
					type_media: $scope.newmedia.type_media
				})
			}, null, function (notify) {
				$scope.progress = (notify.loaded / notify.total).toFixed(0)
			})
			.then(function (media) {
				media.local_uri = local_uri
				if(media.type_media == "2")
					$scope.state.ssp_imagenes.push(media.id)
				else if(media.type_media == "3")
					$scope.state.ssp_audios.push(media.id)
				else if(media.type_media == "1")
					$scope.state.ssp_videos.push(media.id)
				$scope.state.medias.unshift(media)
				return StateOne.update($scope.state)
			})
			.then(function (media) {
				$.loading.show("success", 1500)
			})
			.catch(function (err) {
				console.log(err)
				$.loading.error("Ha ocurrido un error al subir el contenido")
			})
		})
	}
}])
