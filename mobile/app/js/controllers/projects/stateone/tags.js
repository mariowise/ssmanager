angular.module('app.controllers.projects.tags', [])

.controller('tags#index', ['$scope', 'EM', function ($scope, EM) {
	console.log("tags#index running")

	$scope.tag = { name_tag: "", description_tag: "" }

	$scope.addTag = function () {
		$.loading.show("loading")
		$scope.tag.state_one_id = $scope.state.id

		var action = (!$scope.tag.id) ? 
			EM('Tag')._create($scope.tag) :
			EM('Tag')._update($scope.tag)

		action
		.then(function () {
			return EM('StateOne').fetch($scope.state)	
		})
		.then(function (state) {
			$scope.$emit('changeState', state)
			$.loading.show("success", 1500)
		})
		.catch(function (err) {
			console.error(err)
			$.loading.error("No ha sido posible crear la etiqueta.")
		})
	}
	$scope.deleteTag = function (tag) {
		if(confirm("Estas seguro que quieres eliminar esta etiqueta?")) {
			$.loading.show("loading")
			
			console.log("Eliminando etiqueta " + tag.id)

			EM('StateOne').delete_tag({ id: $scope.state.id, tag_id: tag.id })
			.then(function (state) {
				return EM('StateOne').fetch(state)
			})
			.then(function (state) {
				$.loading.show("success", 1500)
				$scope.$emit('changeState', state)
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

