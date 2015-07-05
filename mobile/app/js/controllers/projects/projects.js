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

	$scope.$on('changeProject', function (event, newVal) {
		$scope.project = newVal
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

.controller('projects#show', ['$scope', '$state', '$stateParams', 'EM', function ($scope, $state, $stateParams, EM) {
	console.log("projects#show running")

	$scope.targetUser = {}
	$scope.users = []
	$scope.config = {
		valueField: 'id',
		labelField: 'username',
		searchField: ['first_name', 'last_name', 'username'],
		placeholder: 'Buscar por nombre de usuario',
		maxItems: 4
	}
	$scope.contribs = []

	$scope.$on('setProject', function () {
		$scope.contribs = $scope.project.contribs
	})

	function setUsers(users) {
		if(angular.toJson(users) != angular.toJson($scope.users))
			$scope.users = users
	}

	EM('User').all()
	.then(setUsers)

	$scope.allUsers = function () {
		EM('User').allUsers()
		.then(setUsers, function (err) {
			$.loading.error("No ha sido posible descargar la lista de usuarios.")
		}, setUsers)
	}
	$scope.addUser = function (user) {
		if(confirm("Estas seguro que quieres invitar a '" + user.username + "' a participar de este proyecto?")) {
			$.loading.show("loading")
			EM('Project').invite_contrib({ id: $scope.project.id, user_id: user.id })
			.then(function () {
				$('#addUser').modal('hide')
				$scope.targetUser = {}
				$.loading.show("success", 1500)
			}, function (err) {
				console.error(err)
				$.loading.error("No ha sido posible invitar al usuario.")
			})
		}
	}
	$scope.rmContrib = function (username) {
		if(confirm("Estas seguro que quieres desvincular a '" + username + "' del proyecto?")) {
			$.loading.show("loading")
			EM('Project').rm_contrib({ id: $scope.project.id, username: username })
			.then(function () {
				return EM('Project').find($scope.project)
			})
			.then(function (project) {
				$scope.$emit('changeProject', project)
				$.loading.show("success", 1800)
				if($scope.current_user.username == username)
					$state.go("app.projects")
			})
			.catch(function (err) {
				console.error(err)
				$.loading.error("No ha sido posible desvingular al usuario.")
			})
		}
	}
	$scope.sendMessage = function () {
		$.loading.show("loading")

		$scope.message.id = Number(guid())
		$scope.message.remitente_mensaje = $scope.current_user.username
		$scope.message.proyecto_mensaje = $scope.project.id

		EM('Message')._create($scope.message)
		.then(function (msg) {
			$.loading.show("success", 2000)
			$('#newMessage').modal('hide')
			$scope.message = {}
		}, function (err) {
			console.error(err)
			$.loading.error("No ha sido posible enviar el mensaje")
		})
	}
}])

.controller('project#colab', ['$scope', '$stateParams', 'EM', function ($scope, $stateParams, EM) {
	console.log("project#colab running")

	$scope.colab = {}

	EM('User').where({ username: $stateParams.colab_username })
	.then(function (user) {
		if(user.length == 1)
			return EM('User').fetch(user[0]) 
		else
			$.loading.error("No ha sido posible encontrar la información del usuario")			
	})
	.then(function (user) {
		$scope.colab = user
	})
	.catch(function (err) {
		console.error(err)
		$.loading.error("No ha sido posible encontrar la información del usuario")
	})
}])
