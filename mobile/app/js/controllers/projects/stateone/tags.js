angular.module('app.controllers.projects.tags', [])

.controller('tags#index', ['$scope', 'Tag', 'StateOne', function ($scope, Tag, StateOne) {
	console.log("tags#index running")

	$scope.tag = { name_tag: "", description_tag: "" }

	$scope.addTag = function () {
		$.loading.show("loading")

		function reject(err) {
			console.error(err)
			$.loading.error("No ha sido posible crear la etiqueta.")
		}

		var action = (!$scope.tag.id) ? 
			StateOne.addTag($scope.state, $scope.tag) :
			StateOne.updateTag($scope.state, $scope.tag)

		action
		.then(function (state) {
			$scope.$emit('changeState', state)
			$.loading.show("success", 1500)
		}, reject)
	}
	$scope.deleteTag = function (tag) {
		if(confirm("Estas seguro que quieres eliminar esta etiqueta?")) {
			$.loading.show("loading")
			
			StateOne.removeTag($scope.state, tag)
			.then(function (state) {
				$scope.$emit('changeState', state)
				$.loading.show("success", 1500)
			})
			.catch(function (err) {
				console.error(err)
				$.loading.error("No ha sido posible eliminar la etiqueta")
			})
		}
	}
	$scope.editTag = function (tag) {	
		$scope.tag = tag
	}
	$scope.clean = function () {
		$scope.tag = { name_tag: "", description_tag: "" }
	}
}])

