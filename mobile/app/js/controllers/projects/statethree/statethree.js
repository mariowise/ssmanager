angular.module('app.controllers.projects.statethree', [])

.controller('StateThreeController', ['$scope', '$state', '$stateParams', 'EM', function ($scope, $state, $stateParams, EM) {
	console.log("StateThreeController running")	

	$scope.state = {}

	function setState(state) {
		if(angular.toJson(state) != angular.toJson($scope.state))
			$scope.state = state
	}

	$scope.$on('setProject', function () { setState($scope.project.state_three) })

	if($scope.project.state_three) {
		EM('Project').fetchStateThree($scope.project)
		.then(setState, null, setState)
	}
}])

.controller('statethree#index', ['$scope', '$state', function ($scope, $state) {
	console.log("statethree#index")
	
}])

.controller('statethree#show', ['$scope', '$state', '$stateParams', 'EM', function ($scope, $state, $stateParams, EM) {
	console.log("statethree#show")

	$scope.catwoe = {}

	function setCatwoe(catwoe) {
		if(angular.toJson(catwoe) != angular.toJson($scope.catwoe))
			$scope.catwoe = catwoe
	}
	
	EM('Catwoe').find($stateParams.catwoe_id)
	.then(setCatwoe, null, setCatwoe)
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