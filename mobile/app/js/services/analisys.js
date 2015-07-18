/*--
 *-- Analisys (Resource)
 *-- ------
 *--
*/
angular.module('app.services.analisys', [])

.factory('Analisys', ['Resource', '$q', function (Resource, $q) {

	// Recurso local
	var Analisys = Resource('Analisys', 'analisys', {
		/*--
		 *-- #### add_tag(key)
		 *--
		 *-- * param `key`: Object
		 *-- * return `promise`
		 *--
		 *-- Recibe un objeto que debe contener un `id` y un `tag_id` como Number para
		 *-- agregar una etiqueta al análisis
		 */
		add_tag: {
			method: "POST",
			url: CONFIG.api("analisys") + "/:id/add_tag/",
			responseType: "json"
		}
		/*--
		 *-- #### rm_tag(key)
		 *--
		 *-- * param `key`: Object
		 *-- * return `promise`
		 *--
		 *-- Recibe un objeto que debe contener un `id` y un `tag_id` como Number para
		 *-- eliminar una etiqueta del análisis análisis
		 */
		, rm_tag: {
			method: "POST",
			url: CONFIG.api("analisys") + "/:id/rm_tag/",
			responseType: "json"
		}
	}), res = {}

	/*--
	 *-- #### fetchOne(Resource::find)
	 *--
	 */
	Analisys.fetchOne = Analisys.find

	return angular.extend({}, Analisys, res)
}])