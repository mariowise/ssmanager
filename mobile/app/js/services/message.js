/*--
 *-- Message (Resource)
 *-- ------
 *--
*/
angular.module('app.services.message', [])

.factory('Message', ['Resource', '$q', function (Resource, $q) {

	// Recurso local
	var Message = Resource('Message', 'messages', {
		/*--
		 *-- #### mark_message(Object)
		 *--
		 *-- * param `Object`: Diccionario que contiene el `id` mensaje 
		 *-- * return `promise`
		 *--
		 *-- Marca un mensaje no leído como leído.
		 *--
		 */
		mark_message: {
			method: "POST",
			url: CONFIG.api("messages") + "/:id/mark_message/",
			responseType: 'json'
		},
		/*--
		 *-- #### count()
		 *--
		 *-- * return `promise`
		 *--
		 *-- Obtiene la cantidad de mensaje no leídos que tiene el usuario.
		 *--
		 */
		count: {
			method: "GET",
			url: CONFIG.api("messages") + "/count/"
		}
	}), res = {}

	/*--
	 *-- #### fetchOne(Resource::find)
	 *--
	 */
	Message.fetchOne = Message.find

	return angular.extend({}, Message, res)
}])