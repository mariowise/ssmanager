/*--
 *-- Document (Resource)
 *-- ------
 *--
*/
angular.module('app.services.document', [])

.factory('Document', ['Resource', '$q', 'File', function (Resource, $q, File) {

	// Recurso local
	var Document = Resource('Document', 'documents', {}), response = {}

	/*--
	 *-- #### fetchOne(key)
	 *--
	 *-- * param `key`: Object, Array o Number
	 *-- * return `promise`
	 *--
	 *-- Descarga la imagen del documento en función a la URL `https://docs.google.com/feeds/download/drawings/Export?id=[ID_DOCUMENT]`.
	 *-- Para que tenga exito, el documento debe tener **permisos de lectura a quien posea el link**.
	 *-- La imágen queda almacenada en el dispositivo en la carpeta `media`.
	 */
	Document.fetchOne = function (key) {
		var d = $q.defer()
		  , self = this

		self.find(key)
		.then(function (doc) {
			return $q.all([
				doc,
				File.download("https://docs.google.com/feeds/download/drawings/Export?id=" + doc.google_id + "&exportFormat=jpeg", doc.google_id + ".jpg")
			])
		}, null, function (ldoc) {
			if(ldoc.local_uri)
				d.notify(ldoc)
		})
		.then(function (res) {
			var doc = res[0]
			doc.local_uri = res[1]
			return Document.set(doc.id, doc)
		})
		.then(d.resolve)
		.catch(d.reject)

		return d.promise
	}

	return angular.extend({}, Document, response)
}])