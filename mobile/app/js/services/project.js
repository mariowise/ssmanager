angular.module('app.services.project', [])

.factory('Project', ['ResourceFactory', '$q', 'Session', 'User', function (ResourceFactory, $q, Session, User) {
	
	// Recurso local
	var Project = ResourceFactory('Project', 'projects') // Nombre del recurso, Nombre del recurso en API (URL)
	  , response = {}

	Project.pull = function () {
		var d = $q.defer()

		Session.current_user()
		.then(function (current_user) {
			Project.remote().query({ manager: current_user.id }, function (res) {

				var fns = []
				res.forEach(function (item) {
					fns.push(function (callback) {
						Project.set(item.id, item)
						.then(function (project) {
							callback(null, item)
						})
					})

				})
				async.series(fns, function (err, results) {
					if(!err) {
						// console.log(results)
						d.resolve(results)
					} else d.reject(err)					
				})

			}, d.reject)
		})
		
		return d.promise
	}	

	Project.fetchOne = function (key) {
		console.log("Project::fetchOne")
		var d = $q.defer()
		  , self = this

		self.find(key) // Obtiene el proyecto
		.then(function (project) {
			return $q.all([
				project,
				User.find(project.manager) // Obtiene el manager del proyecto
			])
		}, null, function (nproject) { // Si tenemos data en caché la notifica
			if(nproject.manager && nproject.state_one && nproject.manager.id && nproject.state_one.id)
				d.notify(nproject)
		})
		.then(function (res) { 
			var project = res[0]
			project.manager = res[1]
			return $q.all([
				project,
				StateOne._where({ ssp_stateOne: project.id }) // Descarga el estado 1
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

	/*
	 * Busca el proyecto y su manager localmente, construye un único objeto y lo notifica
	 * luego si en internet logra capturar 
	 */
	response.find = function (key) {
		var d = $q.defer()
		  , p = null

		Project.find(key)
		.then(function (project) {
			User.find(project.manager)
			.then(function (manager) {
				project.manager = manager
				d.resolve(project)
			}, d.reject, function (manager) {
				p.manager = manager
				d.notify(p)
			})
		}, d.reject, function (project) {
			p = project
		})

		return d.promise
	}

	// Se expone el servicio
	return angular.extend({}, Project, response)
}])





