angular.module('app.services.richpicture', [])

.factory('RichPicture', ['Resource', '$q', 'Document', function (Resource, $q, Document) {

	// Recurso local
	var RichPicture = Resource('RichPicture', 'richpictures', {}), res = {}

	RichPicture.fetchOne = function (key) {
		var d = $q.defer(), self = this

		self.find(key)
		.then(function (pic) {
			return $q.all([
				pic, 
				Document.fetch(pic.documentos_rp)
			])
		}, null, function (lpic) {
			if(lpic.documents) 
				d.notify(lpic)
		})
		.then(function (all) {
			var pic = all[0]
			pic.documents = all[1]
			return self.set(pic.id, pic)
		})
		.then(d.resolve)
		.catch(d.reject)

		return d.promise
	}

	return angular.extend({}, RichPicture, res)
}])