angular.module('app.controllers.projects.statetwo', [])

.controller('StateTwoController', ['$scope', '$state', 'EM', function ($scope, $state, EM) {
	console.log("StateTwoController running")

	$scope.pictures = []

	function setPictures(pictures) {
		if(angular.toJson(pictures) != angular.toJson($scope.pictures))
			$scope.pictures = pictures
	}

	function updateState() {
		console.log("StateTwoController::updateState running")
		EM('RichPicture').fetch($scope.project.state_two.ssp_richPictures)
		.then(setPictures, null, setPictures)
	}

	if($scope.project.id)
		updateState()

	$scope.$on('setProject', updateState)
}])

.controller('statetwo#index', ['$scope', '$state', function ($scope, $state) {
	console.log("statetwo#index running")
}])

.controller('statetwo#show', ['$scope', '$state', '$stateParams', 'EM', function ($scope, $state, $stateParams, EM) {
	console.log("statetwo#show running")

	$scope.picture = {}	
	$scope.comentary = {}
	$scope.edited = {}	

	window.scope = $scope

	function setPicture(picture) {
		if(angular.toJson(picture) != angular.toJson($scope.picture))
			$scope.picture = picture
	}

	function updatePicture() {
		return EM('RichPicture').fetch($stateParams.picture_id)
		.then(setPicture, null, setPicture)
	}

	updatePicture()

	$scope.addComment = function () {
		$.loading.show("loading")

		$scope.comentary.picture_id = $scope.picture.id
		$scope.comentary.autor_comentary = $scope.current_user.id
		EM('Comment')._create($scope.comentary)
		.then(function (comment) {
			return updatePicture()
		})
		.then(function () {
			if(project = $scope.$parent.$parent.project) {
				EM('Comment').notify({
					id_ssp: project.id,
					url: "/verRichPicture/" + project.id + "/" + $scope.picture.id + "/",
					title: 'Ha comentado un Rich Picture',
					obj_id: $scope.picture.id,
					class_name: "RichPicture"
				})
			}
		})
		.then(function () {
			$('#commentModal').modal('hide')
			$scope.comentary = {}
			$.loading.show("success", 1800)
		})
		.catch(function (err) {
			console.error(err)
			$.loading.error("No ha sido posible guardar el comentario.")
		})
	}
	$scope.editPicture = function () {
		$scope.edited = $scope.picture
	}
	$scope.updatePicture = function () {
		$.loading.show("loading")

		EM('RichPicture')._update($scope.edited)
		.then(function () {
			return updatePicture()
		})
		.then(function () {
			$scope.edited = {}
			$('#pictureModal').modal('hide')
			$.loading.show("success", 1800)
		})
		.catch(function (err) {
			console.error(err)
			$.loading.error("No ha sido posible actualizar el RichPicture")
		})
	}
	$scope.delete = function (picture_id) {
		if(confirm("Estas seguro que quieres eliminar este Rich Picture?")) {
			$.loading.show("loading")

			EM('RichPicture').delete_rp({ id: $scope.picture.id, statetwo_id: $scope.$parent.$parent.project.state_two.id })
			.then(function () {
				return EM('Project').fetch($scope.$parent.$parent.project.id)
			})
			.then(function (project) {
				$scope.$emit('changeProject', project)
			})
			.then(function () {
				$scope.$emit('setProject')
				$.loading.show("success", 1500)
				$state.go("app.project.statetwo.index")
			})
			.catch(function (err) {
				console.error("No ha sido posible eliminar el RichPicture")
			})
		}
	}
	$scope.addAnalisys = function (analisys) {
		$.loading.show("loading")

		$scope.picture.analisis_rp = analisys.id
		EM('RichPicture')._update($scope.picture)
		.then(function (pic) {
			setPicture(pic)
			$('#analisysModal').modal('hide')
			$.loading.show("success", 1500)
		})
		.catch(function (err) {
			console.error(err)
			$.loading.error("No ha sido posible actualizar el RichPicture")
		})
	}
	$scope.rmAnalisys = function () {
		if(confirm("Estas seguro que quieres desvincular este análisis de este RichPicture?")) {
			$.loading.show("loading")

			$scope.picture.analisis_rp = null
			EM('RichPicture')._update($scope.picture)
			.then(function () {
				$.loading.show("success", 1500)
			})
			.catch(function (err) {
				console.error(err)
				$.loading.error("No ha sido posible actualizar el RichPicture")
			})
		}
	}
}])