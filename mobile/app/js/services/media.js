/*--
 *-- Media (Resource)
 *-- ------
 *--
*/
angular.module('app.services.media', [])

.factory('Media', ['Resource', '$q', 'Session', 'Comment', 'File', 'Tag', function (Resource, $q, Session, Comment, File, Tag) {
	
	// Recurso local
	var Media = Resource('Media', 'media', {
		/*--
		 *-- #### add_tag(Object)
		 *--
		 *-- * param `Object`: Diccionario que contiene el `id` del media y el `tag_id` de la etiqueta.
		 *-- * return `promise`
		 *--
		 *-- Agrega una etiqueta a un Media.
		 *--
		 */
		add_tag: {
			method: "POST",
			url: CONFIG.api("media") + "/:id/add_tag/",
			responseType: "json"
		}
		/*--
		 *-- #### rm_tag(Object)
		 *--
		 *-- * param `Object`: Diccionario que contiene el `id` del media y el `tag_id` de la etiqueta.
		 *-- * return `promise`
		 *--
		 *-- Elimina una etiqueta de un Media.
		 *--
		 */
		, rm_tag: {
			method: "POST",
			url: CONFIG.api("media") + "/:id/rm_tag/",
			responseType: "json"
		}
	}) // Nombre del recurso, Nombre del recurso en API (URL)	
	  , response = {}

	/*
	 *-- #### addComment(media, msg)
	 *--
	 *-- * param `media`: Objecto Media
	 *-- * param `msg`: Objeto Comentary
	 *-- * return `promise`
	 *--
 	 *-- Agrega un comentario a una media
 	 *-- Consulta además el current_user para registrar el autor del comentario
 	 *-- retorna la media actualizada con el comentario dentro.
	 */
	Media.addComment = function (media, msg) {
		var d = $q.defer()
		  , generatedId 

		Session.current_user()
		.then(function (current_user) {
			
			Comment._create({
				content_comentary: msg,
				autor_comentary: current_user.id,
				media_id: media.id
			})
			.then(function (comment) {
				return Media.fetch(media)
			})
			.then(d.resolve)
			.catch(d.reject)
				
		}, d.reject)

		return d.promise
	}

	/*
	 *-- #### fetchOne
	 *--
	 *-- * param `key`: Object, String o Number
	 *--
	 *-- Efectúa un find y además descarga el archivo si es que no existe
	 *--
	 */
	Media.fetchOne = function (key) {
		// console.log("Media::fetchOne " + key)
		var d = $q.defer()

		Media.find(key)
		.then(function (media) {
			return $q.all([
				media,
				File.download(media.url_media)
			])
		}, d.reject, function (nmedia) {
			if(nmedia.local_uri)
				d.notify(nmedia)
		})
		.then(function (res) {
			var media = res[0]
			media.local_uri = res[1]
			Media.set(media.id, media)
			.then(d.resolve, d.reject)
		}, d.reject)

		return d.promise
	}

	/*--
	 *-- #### pushOne(key)
	 *--
	 *-- * param `key`: Object, String o Number
	 *-- * return `promise`
	 *-- 
	 *-- Si es que la tupla local posee la bandera __syncPending, entonces 
	*/
	Media.syncOne = function (key) {
		var d = $q.defer()
		  , self = this
		  , key = key[CONFIG.pk] || key.id || key

		self.get(key)
		.then(function (litem) {
			if(!litem.__syncPending)
				d.resolve(litem)
			else
				return $q.all([
					litem
					, File.upload(litem.local_uri)
					, Session.current_user()
				])
		})
		.then(function (res) {
			var litem = res[0]
			litem.url_media = JSON.parse(res[1].response).mediaLink
			litem.uploaded_by = res[2].username
			return self._create(litem)
		})
		.then(function (litem) {
			litem.__syncPending = false
			return self.set(litem.id, litem)
		})
		.then(d.resolve)
		.catch(d.reject)

		return d.promise
	}

	/*--
	 *-- #### create(newMedia)
	 *--
	 *-- * param `newMedia`: Object
	 *-- * return `promise`
	 *-- 
	 *-- Sobreescribe el método create de `Resource`. Para este caso incluye además la columna de `uploaded_by`
	 *-- y la fecha `date_media`. Si no tiene internet para lograr la operación, lo almacenad de forma local
	 *-- declarando además la bandera `__syncPending` dentro del objeto.
	 *--
	*/
	Media.create = function (newMedia) {
		var d = $q.defer()
		  , self = this

		Session.current_user()
		.then(function (current_user) {
			newMedia.uploaded_by = current_user.username
			newMedia.date_media = moment(Date.now()).toISOString().split("Z")[0]

			File.upload(newMedia.local_uri)
			.then(function (file) {
				newMedia.url_media = JSON.parse(file.response).mediaLink
				return self._create(newMedia)
			})
			.then(d.resolve)
			.catch(function (err) {
				newMedia.id = Number(guid())
				newMedia.__syncPending = true
				newMedia.comments_media = []
				newMedia.comment = []
				newMedia.tags = []
				newMedia.tags_media = []			
				self.set(newMedia.id, newMedia)
				.then(d.resolve, d.reject)
			})
		})

		return d.promise
	}

	// Se expone el servicio
	return angular.extend({}, Media, response)
}])

// LOOOOOL
// if media_type == '1':
// 	stateOne.ssp_videos.append(newMedia.id)
// if media_type == '2':
// 	stateOne.ssp_imagenes.append(newMedia.id)
// if media_type == '3':
// 	stateOne.ssp_audios.append(newMedia.id)
// if media_type == '4':
// 	stateOne.ssp_documentos.append(newMedia.id)
