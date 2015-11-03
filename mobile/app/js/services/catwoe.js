/*--
 *-- Catwoe (Resource)
 *-- ------
 *--
*/
angular.module('app.services.catwoe', [])

.factory('Catwoe', ['Resource', '$q', 'Session', 'Comment', 'Has', 'RichPicture', function (Resource, $q, Session, Comment, Has, RichPicture) {

	// Recurso local
	var Catwoe = Resource('Catwoe', 'root_definition_catwoe', {}), res = {}

	/*
	 *-- #### fetchOne(Resource::find)
	 *--
	 */
	Catwoe.fetchOne = function (key) {
		var d = $q.defer(), self = this

		self.find(key)
		.then(function (cat) {
			return $q.all([
				cat,
				(cat.richPicture_dr != null) ? RichPicture.fetch(cat.richPicture_dr) : null
			])
		}, null, function (lcat) {
			if(lcat.richpicture)
				d.notify(lcat)
		})
		.then(function (all) {
			var cat = all[0]
			cat.richpicture = all[1]
			return self.set(cat.id, cat)
		})
		.then(d.resolve)
		.catch(d.reject)

		return d.promise
	}

	return angular.extend({}, Catwoe, res)
}])