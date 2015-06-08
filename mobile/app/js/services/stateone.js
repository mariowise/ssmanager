angular.module('app.services.stateone', [])

.factory('StateOne', ['ResourceFactory', '$q', 'Session', 'Project', 'Media', 'File', function (ResourceFactory, $q, Session, Project, Media, File) {
	
	// Recurso local
	var StateOne = ResourceFactory('StateOne', 'state_one') // Nombre del recurso, Nombre del recurso en API (URL)	

	/*
	 * Para cada uno de los projectos descarga los correspondientes stateOne
	 */
	StateOne.pull = function (project_id) {
		var d = $q.defer()

		function findState(project) {
			StateOne.remote().query({ ssp_stateOne: project.id }, function (res) {

				var fns = []
				res.forEach(function (item) {
					fns.push(function (callback) {
						StateOne.set(item.id, item)
						.then(function () {
							callback(null, item)
						})
					})
					// Todos los tipos de media
					medias = [].concat(item.ssp_videos,item.ssp_imagenes,item.ssp_audios,item.ssp_documentos)
					medias.forEach(function (media_id) {
						fns.push(function (callback) {
							Media.find(media_id)
							.then(function (media) {
								callback(null, media)
							})
						})
					})
				})
				async.series(fns, function (err, results) {
					if(!err) {
						d.resolve(results)
					} else d.reject(err)
				})

			}, d.reject)
		}

		if(project_id)
			findState({ id: project_id })
		else {
			Project.all()
			.then(function (projects) {
				projects.forEach(function (project) {
					findState(project)
				})
			})
		}

		return d.promise
	}


	// Se expone el servicio
	return StateOne
}])
