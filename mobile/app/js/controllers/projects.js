angular.module('app.controllers.projects', [])

.controller('ProjectController', ['$scope', '$stateParams', 'Project', 'User', function ($scope, $stateParams, Project, User) {
	console.log("ProjectController running")

	$scope.project = {}
	$scope.loading = true

	// Obtener sin consultar internet
	Project.get($stateParams.project_id)
	.then(function (project) {
		$scope.project = project
		return User.find(project.manager)
	})
	.then(function (manager) {
		$scope.project.manager = manager
		$scope.loading = false
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



