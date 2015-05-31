angular.module('app.services.project', [])

.factory('Project', ['ResourceFactory', '$q', 'Session', function (ResourceFactory, $q, Session) {
	
	// Recurso local
	var Project = ResourceFactory('Project', 'projects') // Nombre del recurso, Nombre del recurso en API (URL)

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

	// Se expone el servicio
	return Project
}])