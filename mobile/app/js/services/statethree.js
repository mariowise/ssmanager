/*--
 *-- StateThree (Resource)
 *-- ------
 *--
*/
angular.module('app.services.statethree', [])

.factory('StateThree', ['Resource', '$q', 'Session', 'Project', 'Catwoe', function (Resource, $q, Session, Project, Catwoe) {

	// Recurso local
	var StateThree = Resource('StateThree', 'state_three', {}), res = {}	

	/*--
	 *-- #### addCatwoe(project, catwoe)
	 *--
	 *-- * param `project`: Object
	 *-- * param `catwoe`: Object
	 *-- * return `promise`
	 *--
	 *-- Agrega un Catwoe a un Project. Añade el valor de `created_by` a partir del usuario
	 *-- que esta usando la aplicaición (`Session.current_user()`) y el valor de `state_id` necesario
	 *-- en la API.
	 *--
	 */
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