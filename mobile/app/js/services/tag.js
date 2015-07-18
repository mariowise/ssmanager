/*--
 *-- Tag (Resource)
 *-- ------
 *--
*/
angular.module('app.services.tag', [])

.factory('Tag', ['Resource', '$q', function (Resource, $q) {
	
	// Recurso local
	var Tag = Resource('Tag', 'tags') // Nombre del recurso, Nombre del recurso en API (URL)	
	  , response

	return angular.extend({}, Tag, response)
}])