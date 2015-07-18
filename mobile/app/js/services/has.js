/*--
 *-- Has (Resource)
 *-- ------
 *--
*/
angular.module('app.services.has', [])

.factory('Has', ['Resource', '$q', function (Resource, $q) {

	// Recurso local
	var Has = Resource('Has', 'root_definition', {
		/*--
		 *-- #### remove(Object)
		 *--
		 *-- * param `Object`: Diccionario que contiene el `id` del HAS a eliminar y el `catwoe_id`
		 *-- * return `promise`
		 *--
		 *-- Elimina un HAS de un CATWOE
		 *--
		 */
		remove: {
			method: 'POST',
			url: CONFIG.api("root_definition") + "/:id/remove/"
		}
	}), res = {}

	return angular.extend({}, Has, res)
}])