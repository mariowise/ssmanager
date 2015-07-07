angular.module('app.controllers.projects.statethree', [])

.controller('StateThreeController', ['$scope', '$state', '$stateParams', 'EM', function ($scope, $state, $stateParams, EM) {
	console.log("StateThreeController running")	

	$scope.state = {}

	function setState(state) {
		if(angular.toJson(state) != angular.toJson($scope.state))
			$scope.state = state
	}

	$scope.$on('setProject', function () { setState($scope.project.state_three) })
	$scope.$on('setState', function (evnt, state) { setState(state) })

	if($scope.project.state_three) {
		EM('Project').fetchStateThree($scope.project)
		.then(setState, null, setState)
	}
}])

.controller('statethree#index', ['$scope', '$state', 'EM', function ($scope, $state, EM) {
	console.log("statethree#index")

	$scope.catwoe = {}

	$scope.addCatwoe = function () {
		$.loading.show("loading")

		EM('StateThree').addCatwoe($scope.project, $scope.catwoe)
		.then(function (state) {
			$.loading.show("success", 1800)
			$scope.$emit('setState', state)
		}, function (err) {
			console.error(err)
			$.loading.error("No ha sido posible crear el CATWOE")
		})
	}	
}])

.controller('statethree#show', ['$scope', '$state', '$stateParams', 'EM', function ($scope, $state, $stateParams, EM) {
	console.log("statethree#show")

	$scope.catwoe = {}
	$scope.comentary = {}
	$scope.has = {}

	function setCatwoe(catwoe) {
		if(angular.toJson(catwoe) != angular.toJson($scope.catwoe))
			$scope.catwoe = catwoe
	}

	function updateCatwoe() {
		return EM('Catwoe').find($stateParams.catwoe_id)
		.then(setCatwoe, null, setCatwoe)
	}
	updateCatwoe()
	

	$scope.addComment = function () {
		$.loading.show("loading")

		EM('Catwoe').addComment($scope.catwoe, $scope.comentary.content_comentary)
		.then(function (catwoe) {
			setCatwoe(catwoe)
			$scope.comentary = {}
			$.loading.show("success", 1800)
		}, function (err) {
			console.error(err)
			$.loading.error("No ha sido posible registrar el comentario.")
		})
	}
	$scope.addHAS = function () {
		$.loading.show("loading")

		EM('Catwoe').addHAS($scope.catwoe, $scope.has)
		.then(function (catwoe) {
			setCatwoe(catwoe)
			$scope.has = {}
			$.loading.show("success", 1800)
		}, function (err) {
			console.error(err)
			$.loading.error("No ha sido posible registrar el HAS")
		})
	}
	$scope.editHAS = function (root) {
		$scope.has = root
		$('#hasModal').modal('show')
	}
	$scope.removeHAS = function (root) {
		if(confirm("Estas seguro que quieres eliminar este HAS?")) {
			$.loading.show("loading")

			EM('Catwoe').removeHAS($scope.catwoe, $scope.has)
			.then(function (catwoe) {
				$('#hasModal').modal('hide')
				setCatwoe(catwoe)
				$scope.has = {}
				$.loading.show("success", 1800)
			}, function (err) {
				console.error(err)
				$.loading.error("No ha sido posible eliminar el HAS")
			})
		}
	}
	$scope.updateHAS = function () {
		$.loading.show("loading")

		EM('Has')._update($scope.has)
		.then(function (has) {
			return updateCatwoe()
		})
		.then(function () {
			$.loading.show("success", 1800)
			$('#hasModal').modal('hide')
			$scope.has = {}
		})
		.catch(function (err) {
			console.error(err)
			$.loading.error("No ha sido posible actualizar el HAS")
		})
	}
	$scope.clean = function () {
		$scope.has = {}
	}
}])

.controller('statethree#edit', ['$scope', '$state', '$stateParams', 'EM', function ($scope, $state, $stateParams, EM) {
	console.log("statethree#edit")

	$scope.catwoe = {}

	function setCatwoe(catwoe) {
		if(angular.toJson(catwoe) != angular.toJson($scope.catwoe))
			$scope.catwoe = catwoe
	}
	
	EM('Catwoe').find($stateParams.catwoe_id)
	.then(setCatwoe, null, setCatwoe)

	$scope.save = function () {
		$.loading.show("loading")

		EM('Catwoe')._update($scope.catwoe)
		.then(function (catwoe) {
			$state.go("app.project.statethree.show", { catwoe_id: $scope.catwoe.id })
			$.loading.show("success", 1800)
		}, function (err) {
			console.error(err)
			$.loading.error("No ha sido posible guardar los cambios.")
		})
	}
}])