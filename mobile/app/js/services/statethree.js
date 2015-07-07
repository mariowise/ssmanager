angular.module('app.services.statethree', [])

.factory('StateThree', ['Resource', '$q', 'Session', 'Project', 'Catwoe', function (Resource, $q, Session, Project, Catwoe) {

	// Recurso local
	var StateThree = Resource('StateThree', 'state_three', {}), res = {}	

	StateThree.addCatwoe = function (project, catwoe) {
		var d = $q.defer()

		Session.current_user()
		.then(function (current_user) {
			catwoe.created_by = current_user.username
			catwoe.state_id = project.state_three.id
			return Catwoe._create(catwoe)
		})
		.then(function () {
			return Project.fetchStateThree(project)
		})
		.then(d.resolve)
		.catch(d.reject)

		return d.promise
	}

	return angular.extend({}, StateThree, res)
}])