angular.module('app.controllers.projects', [])

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

	$scope.project = {}
	$scope.manager = {}

	// Obtener sin consultar internet
	Project.get($stateParams.id)
	.then(function (project) {
		$scope.project = project
		return User.find(project.manager)
	})
	.then(function (manager) {
		$scope.manager = manager
	})

}])

.controller('projects#stateone', ['$scope', '$stateParams', 'Project', 'StateOne', function ($scope, $stateParams, Project, StateOne) {
	console.log("projects#stateone running")

	$scope.project = {}
	$scope.medias = []

	// Se busca el proyecto y luego se descarga su estado
	Project.get($stateParams.id)
	.then(function (project) {
		$scope.project = project
		return StateOne.pull(project.id)
	})
	// Se busca el estado recién descargado
	.then(function () {
		return StateOne.where({ ssp_stateOne: $scope.project.id })
	})
	// Se buscan las medias (que ya han sido descargadas)
	.then(function (state) {
		state = state[0]
		var medias = [].concat(state.ssp_videos,state.ssp_imagenes,state.ssp_audios,state.ssp_documentos)
		
		medias.forEach(function (media_id) {
			Media.get(media_id)
			.then(function (media) {
				$scope.medias.push(media)
			})
		})
	})
}])

.controller('projects#stateone-show', ['$scope', '$stateParams', 'Project', 'Media', function ($scope, $stateParams, Project, Media) {
	console.log("projects#stateone-show running")

	$scope.project = {}
	$scope.media = {}

	// Se busca el proyecto y luego se busca la media
	Project.get($stateParams.id)
	.then(function (project) {
		$scope.project = project
		return Media.get($stateParams.media_id)
	})
	.then(function (media) {
		$scope.media = media
	})
}])
