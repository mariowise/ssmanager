angular.module('app.controllers.projects.projects', [])

.controller('ProjectController', ['$scope', '$state', '$stateParams', 'EM', function ($scope, $state, $stateParams, EM) {
	console.log("ProjectController running")
	$scope.project = {}

	function setProject(project) {
		if(angular.toJson($scope.project) != angular.toJson(project)) {
			$scope.project = project
			$scope.$broadcast('setProject')
		}
	}

	EM('Project').fetch($stateParams.project_id)
	.then(setProject, null, setProject)
	.catch(function (err) {
		console.log(err)
	})
}])

.controller('projects#index', ['$scope', 'EM', function ($scope, EM) {
	console.log("projects#index running")
	$scope.projects = []
	$scope.newproject = {}
	$scope.loading = true

	function setProjects(projects) {
		$scope.projects = projects
		$scope.loading = false
	}

	// Sincronizar y luego mostrar	
	EM('Project').pull()
	.then(setProjects)

	$scope.newProject = function () {
		$.loading.show("loading")

		EM('Session').current_user()
		.then(function (current_user) {
			$scope.newproject.manager = current_user.id
			return EM('Project')._create($scope.newproject)
		})
		.then(function (neo) {
			$scope.loading = true
			return EM('Project').pull()
		})
		.then(function (projects) {
			setProjects(projects)
			$('#newProject').modal('hide')
			$.loading.show("success", 1800)
		})
		.catch(function (err) {
			console.error(err) 
			$.loading.error("No ha sido posible crear el proyecto.")
		})
	}
	$scope.clean = function () {
		$scope.newproject = {}
	}
}])

.controller('projects#show', ['$scope', '$stateParams', 'Project', 'User', function ($scope, $stateParams, Project, User) {
	console.log("projects#show running")

	
}])
