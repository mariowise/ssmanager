angular.module('app.controllers.projects.projects', [])

.controller('ProjectController', ['$scope', '$state', '$stateParams', 'Project', function ($scope, $state, $stateParams, Project) {
	console.log("ProjectController running")
	$scope.project = {}

	function setProject(project) {
		if(angular.toJson($scope.project) != angular.toJson(project)) {
			$scope.project = project
			$scope.$broadcast('setProject')
		}
	}

	Project.fetch($stateParams.project_id)
	.then(setProject, null, setProject)
	.catch(function (err) {
		console.log(err)
	})
}])

.controller('projects#index', ['$scope', 'Project', function ($scope, Project) {
	console.log("projects#index running")
	$scope.projects = []

	// Sincronizar y luego mostrar	
	Project.pull()
	.then(function (projects) {
		$scope.projects = projects
	})
}])

.controller('projects#show', ['$scope', '$stateParams', 'Project', 'User', function ($scope, $stateParams, Project, User) {
	console.log("projects#show running")

	
}])



