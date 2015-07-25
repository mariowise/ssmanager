angular.module('app.controllers.projects.analisys', [])

.controller('analisys#index', ['$scope', '$state', 'EM', function ($scope, $state, EM) {
	console.log("analisys#index running")

	$scope.analisys = []

	function setAnalisys(a) {
		if(angular.toJson(a) != angular.toJson($scope.analisys))
			$scope.analisys = a
	}

	function updateAnalisys() {
		EM('Analisys').fetch($scope.state.ssp_analisis)
		.then(setAnalisys, null, setAnalisys)
	}

	if($scope.state.ssp_analisis)
		updateAnalisys()

	$scope.$on("setState", updateAnalisys)
}])

.controller('analisys#show', ['$scope', '$state', '$stateParams', '$cordovaInAppBrowser', 'EM', function ($scope, $state, $stateParams, $cordovaInAppBrowser, EM) {
	console.log("analisys#show running")

	$scope.anal = {}
	$scope.comentary = {}
	$scope.edited = {}

	function setAnal(a) {
		if(angular.toJson(a) != angular.toJson($scope.anal))
			$scope.anal = a
	}

	function updateAnal() {
		return EM('Analisys').fetch($stateParams.analisys_id)
		.then(setAnal, null, setAnal)
	}

	updateAnal()

	$scope.addComment = function () {
		$.loading.show("loading")

		$scope.comentary.autor_comentary = $scope.current_user.id
		$scope.comentary.analisys_id = $scope.anal.id
		EM('Comment')._create($scope.comentary)
		.then(function () {
			return updateAnal()
		})
		.then(function () {
			$('#commentModal').modal('hide')
			$scope.comentary = {}
			$.loading.show("success", 1800)
		}, function (err) {
			console.error(err)
			$.loading.error("No ha sido posible guardar el comentario.")
		})
	}
	$scope.editAnal = function () {
		$scope.edited = $scope.anal
	}
	$scope.updateAnal = function () {
		$.loading.show("loading")

		EM('Analisys')._update($scope.edited)
		.then(function () {
			return updateAnal()
		})
		.then(function () {
			$scope.edited = {}
			$('#editAnalisys').modal('hide')
			$.loading.show("success", 1800)
		})
		.catch(function (err) {
			console.error(err)
			$.loading.error("No ha sido posible actualizar el analisis.")
		})
	}
	$scope.open = function (doc) {
		$cordovaInAppBrowser.open(doc.url_documento, '_blank')
		.then(function(event) {
			console.log(event)
		})
		.catch(function(err) {
			console.error(err)
			$.loading.error("No ha sido posible abrir el analisis.")
		});
	}
	$scope.addTag = function (tag, $event) {
		angular.element($event.target).addClass("active")
		$.loading.show("loading")

		console.log({ id: $scope.anal.id, tag_id: tag.id})
		EM('Analisys').add_tag({ id: $scope.anal.id, tag_id: tag.id})
		.then(function () {
			return updateAnal()
		})
		.then(function () {
			$.loading.show("success", 1800)
		})
		.catch(function (err) {
			console.error(err)
			$.loading.error("No ha sido posible agregar la etiqueta.")
		})
		.finally(function () {
			angular.element($event.target).removeClass("active")
			$('#addTag').modal('hide')
		})
	}
	$scope.rmTag = function (tag) {
		if(confirm("¿Quitar esta etiqueta?")) {
			$.loading.show("loading")

			EM('Analisys').rm_tag({ id: $scope.anal.id, tag_id: tag.id })
			.then(function () {
				return updateAnal()
			})
			.then(function () {
				$.loading.show("success", 1800)
			})
			.catch(function (err) {
				console.error(err)
				$.loading.error("No ha sido posible quitar la etiqueta")
			})
		}
	}
}])