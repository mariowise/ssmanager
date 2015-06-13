angular.module('app.controllers.projects.stateone', [])

.controller('stateone#show', ['$scope', '$state', 'StateOne', 'Media', 'File', 'Session', function ($scope, $state, StateOne, Media, File, Session) {
	console.log("stateone#show running")

	$scope.newmedia = {}
	$scope.state = {}

	function setState (state) {
		$scope.state = state
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

	$scope.takePhoto = function () {
		$.loading.show("loading")
		File.takePhoto()
		.then(function (fileUri) {
			$.loading.hide("loading")
			$('#myModal').modal('show')
			$scope.newmedia.type_media = "2" // Para imágenes xD Maldito fardo
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
				file = JSON.parse(file.response)
				return Media.create({
					name_media: $scope.newmedia.name_media,
					description_media: $scope.newmedia.description_media,
					url_media: file.datafile,
					uploaded_by: current_user.username,
					type_media: $scope.newmedia.type_media
				})
			})
			.then(function (media) {
				media.local_uri = local_uri
				$scope.state.ssp_imagenes.push(media.id)
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