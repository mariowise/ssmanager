angular.module('app.services.message', [])

.factory('Message', ['Resource', '$q', function (Resource, $q) {

	// Recurso local
	var Message = Resource('Message', 'messages', {
		mark_message: {
			method: "POST",
			url: CONFIG.api("messages") + "/:id/mark_message/",
			responseType: 'json'
		}
	}), res = {}

	Message.fetchOne = Message.find

	return angular.extend({}, Message, res)
}])