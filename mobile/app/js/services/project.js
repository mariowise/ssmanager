/*--
 *-- Project (Resource)
 *-- ------
 *--
*/
angular.module('app.services.project', [])

.factory('Project', ['Resource', '$q', 'Session', 'User', 'StateOne', function (Resource, $q, Session, User, StateOne) {
	
	// Recurso local
	var Project = Resource('Project', 'projects', {
		/*--
		 *-- #### invite_contrib(Object)
		 *--
		 *-- * param `Object`: Diccionario que contiene el `id` del proyecto y el `user_id` del usuario que esta siendo invitado.
		 *-- * return `promise`
		 *--
		 *-- Envía una invitación a un usuario para incluirlo como colaborador de un proyecto.
		 *--
		 */
		invite_contrib: {
			method: 'POST',
			url: CONFIG.api("projects") + "/:id/invite_contrib/",
			responseType: 'json'
		}
		/*--
		 *-- #### rm_contrib(Object)
		 *--
		 *-- * param `Object`: Diccionario que contiene el `id` del proyecto y el `user_id` del usuario que esta siendo desvinculado.
		 *-- * return `promise`
		 *--
		 *-- Permite desvincular a un usuario de un proyecto.
		 *--
		 */
		, rm_contrib: {
			method: 'POST',
			url: CONFIG.api("projects") + "/:id/rm_contrib/",
			responseType: 'json'
		}
		/*--
		 *-- #### state_three(Object)
		 *--
		 *-- * param `Object`: Diccionario que contiene el `id` del proyecto
		 *-- * return `promise`
		 *--
		 *-- Obtiene el Estadio 3 de un proyecto.
		 *--
		 */
		, state_three: {
			method: 'GET',
			url: CONFIG.api("projects") + "/:id/state_three/",
			responseType: 'json'
		}
	}) // Nombre del recurso, Nombre del recurso en API (URL)
	  , response = {}

	/*--
	 *-- #### pull(Object)
	 *--
	 *-- * return `promise`
	 *--
	 *-- Descarga todos los proyectos en donde el usuario colabora y además todos 
	 *-- aquellos en donde es manager
	 *--
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

	/*--
	 *-- #### fetchOne(key)
	 *--
	 *-- * param `key`: Object o Number 
	 *-- * return `promise`
	 *--
	 *-- Descarga un proyecto, luego los datos de su administrador, luego descarga todo el Estadio 1
	 *-- y finalmente deja todo en un objeto enbebido dentro de ambos repositorios replicados.
	 *--
	 */
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
			if(nproject._manager && 
				nproject.state_one && 
				nproject._manager.id && 
				nproject.state_one.id)
				
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

	/*
	 *-- #### fetchStateThree(key)
	 *--
	 *-- * param `key`: Object, String or Number
	 *-- * return `promise`
	 *--
	 *-- Actualiza el valor de la columna `state_three` de la tupla Project en local
	 *-- si no logra actualizarla, resuelve con el valor previo almacenado en local. Si
	 *--
	 */
	Project.fetchStateThree = function (key) {
		var d = $q.defer(), self = this
		  , key = key[CONFIG.pk] || key.id || key

		self.get(key)
		.then(function (lproject) {
			
			if(lproject.state_three)
				d.notify(lproject.state_three)

			self.state_three({ id: key })
			.then(function (state) {
				lproject.state_three = state
				self.set(key, lproject)
				.then(function (lproject) {
					d.resolve(lproject.state_three)
				}, d.reject)
			}, function (err) {
				console.error(err)
				d.resolve(lproject.state_three)
			})
		}, d.reject)

		return d.promise
	}

	// Se expone el servicio
	return angular.extend({}, Project, response)
}])






