/*--
 *-- RichPicture (Resource)
 *-- ------
 *--
*/
angular.module('app.services.richpicture', [])

.factory('RichPicture', ['Resource', '$q', 'Document', 'Analisys', function (Resource, $q, Document, Analisys) {

	// Recurso local
	var RichPicture = Resource('RichPicture', 'richpictures', {
		delete_rp: {
			method: "POST",
			url: CONFIG.api('richpictures') + "/:id/delete/",
			responseType: 'json'
		}
	}), res = {}

	/*--
	 *-- #### fetchOne(key)
	 *--
	 *-- * param `key`: Object o Number
	 *-- * return `promise`
	 *--
	 *-- Obtiene un rich-picture y luego descarga los documentos que tiene adjunto.
	 *--
	 */
	RichPicture.fetchOne = function (key) {
		var d = $q.defer(), self = this

		self.find(key)
		.then(function (pic) {
			return $q.all([
				pic, 
				Document.fetch(pic.documentos_rp),
				(pic.analisis_rp != null) ? Analisys.fetch(pic.analisis_rp) : null
			])
		}, null, function (lpic) {
			if(lpic.documents) 
				d.notify(lpic)
		})
		.then(function (all) {
			var pic = all[0]
			pic.documents = all[1]
			pic.analisys = all[2]
			return self.set(pic.id, pic)
		})
		.then(d.resolve)
		.catch(d.reject)

		return d.promise
	}

	return angular.extend({}, RichPicture, res)
}])