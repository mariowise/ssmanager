angular.module('app.controllers.projects.projects', [])

.controller('ProjectController', ['$q', '$scope', '$state', '$stateParams', 'Project', 'User', function ($q, $scope, $state, $stateParams, Project, User) {
	console.log("ProjectController running")

	$scope.project = {}

	// Obtener sin consultar internet
	Project.find($stateParams.project_id)
	.then(function (project) {
		$scope.project = project
	})
	.catch(function (err) {
		$.loading.error("No ha sido posible cargar el proyecto", function () {
			$state.go("app.projects")
		})
	})
	.finally(function () {
		$scope.$broadcast('ProjectControllerLoaded')
	})
}])

.controller('projects#index', ['$scope', 'Project', function ($scope, Project) {
	console.log("projects#index running")

	$scope.projects = []

	// Sincronizar y luego mostrar	
	Project.sync()
	.then(function (projects) {
		$scope.projects = projects
	})
}])

.controller('projects#show', ['$scope', '$stateParams', 'Project', 'User', function ($scope, $stateParams, Project, User) {
	console.log("projects#show running")

	
}])



