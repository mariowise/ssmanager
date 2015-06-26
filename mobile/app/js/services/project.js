angular.module('app.services.project', [])

.factory('Project', ['Resource', '$q', 'Session', 'User', function (Resource, $q, Session, User) {
	
	// Recurso local
	var Project = Resource('Project', 'projects') // Nombre del recurso, Nombre del recurso en API (URL)
	  , response = {}

	/*
	 * Descarga todos los proyectos en donde el usuario colabora y además todos 
	 * aquellos en donde es manager
	 */
	Project.pull = function () {
		var d = $q.defer()

		Session.current_user()
		.then(function (user) {	
			var fns = []
			if(user.profile && user.profile.project_colab_user) {
				user.profile.project_colab_user.forEach(function (project_id) {
					fns.push(Project.find(project_id))
				})
			}
			fns.push(Project.where({ manager: user.id }))
			return $q.all(fns)
		})
		.then(function (res) {
			var results = []
			res.forEach(function (result) {
				if(result.constructor == Array)
					results = results.concat(result)
				else
					results.push(result)
			})
			d.resolve(results)
		})
		.catch(function (err) {
			console.error(err)
			d.reject()
		})

		return d.promise
	}	

	Project.fetchOne = function (key) {
		if(CONFIG.debug) console.log("Project::fetchOne")
		var d = $q.defer()
		  , self = this

		self.find(key) // Obtiene el proyecto
		.then(function (project) {
			return $q.all([
				project,
				User.find(project.manager) // Obtiene el manager del proyecto
			])
		}, null, function (nproject) { // Si tenemos data en caché la notifica
			if(nproject._manager && nproject.state_one && nproject._manager.id && nproject.state_one.id)
				d.notify(nproject)
		})
		.then(function (res) {
			var project = res[0]
			project._manager = res[1]
			return $q.all([
				project,
				StateOne.where({ ssp_stateOne: project.id }) // Descarga el estado 1
			])
		})
		.then(function (res) {
			var project = res[0], state = res[1]
			if(state.constructor == Array && state.length > 0 || project.state_one && project.state_one.id) {
				return $q.all([
					project,
					StateOne.fetch((state.length > 0) ? state[0].id : project.state_one.id)
				])
			} else d.reject()
		})
		.then(function (res) {
			var project = res[0]
			project.state_one = res[1]
			self.set(project.id, project)
			.then(d.resolve, d.reject)
		})
		.catch(d.reject)

		return d.promise
	}

	// Se expone el servicio
	return angular.extend({}, Project, response)
}])






