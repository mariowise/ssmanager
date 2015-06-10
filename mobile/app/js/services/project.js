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

	/*
	 * Construye el objeto projecto con su objeto manager
	 * Si el proyecto o el manager no pueden ser obtenidos, entonces rechaza
	 */
	response.find = function (key) {
		var d = $q.defer()

		Project.find(key)
		.then(function (project) {
			User.find(project.manager)
			.then(function (manager) {
				project.manager = manager
				d.resolve(project)
			}, d.reject)
		}, d.reject)

		return d.promise
	}

	// Se expone el servicio
	return angular.extend({}, Project, response)
}])