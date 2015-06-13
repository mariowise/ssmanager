angular.module('app.controllers.projects.projects', [])

.controller('ProjectController', ['$scope', '$state', '$stateParams', 'Project', function ($scope, $state, $stateParams, Project) {
	console.log("ProjectController running")

	$scope.project = {}

	function setProject(project) {
		$scope.project = project
	}

	Project.fetch($stateParams.project_id)
	.then(setProject, null, setProject)
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



