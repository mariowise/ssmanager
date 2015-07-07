angular.module('app.services.catwoe', [])

.factory('Catwoe', ['Resource', '$q', 'Session', 'Comment', 'Has', function (Resource, $q, Session, Comment, Has) {

	// Recurso local
	var Catwoe = Resource('Catwoe', 'root_definition_catwoe', {}), res = {}

	/*
	 *-- #### addComment(catwoe, msg)
	 *--
	 *-- * param `catwoe`: Objecto Media
	 *-- * param `msg`: Objeto Comentary
	 *-- * return `promise`
	 *--
 	 *-- Agrega un comentario a una catwoe
 	 *-- Consulta además el current_user para registrar el autor del comentario
 	 *-- retorna la catwoe actualizada con el comentario dentro.
	 */
	Catwoe.addComment = function (catwoe, msg) {
		var d = $q.defer()

		Session.current_user()
		.then(function (current_user) {
			
			Comment._create({
				content_comentary: msg,
				autor_comentary: current_user.id,
				catwoe_id: catwoe.id
			})
			.then(function (comment) {
				return Catwoe.fetch(catwoe)
			})
			.then(d.resolve)
			.catch(d.reject)
				
		}, d.reject)

		return d.promise
	}

	/*
	 *-- #### addHAS(catwoe, has)
	 *--
	 *-- * param `catwoe`: Object, String or Number
	 *-- * param `has`: Object
	 *-- * return `promise`
	 *--
	 *-- Agrega la nueva defininición HAS al CATWOE, si no puede establecer conexión
	 *-- rechaza. Si lo logra, retorna el CATWOE con la nueva definición incluida.
	 *--
	 */
	 Catwoe.addHAS = function (catwoe, has) {
	 	var d = $q.defer()

	 	Session.current_user()
	 	.then(function (current_user) {

	 		has.created_by = current_user.username
	 		has.catwoe_id = catwoe.id
	 		Has._create(has)
	 		.then(function (has) {
	 			return Catwoe.fetch(catwoe)
	 		})
	 		.then(d.resolve)
	 		.catch(d.reject)

	 	}, d.reject)

	 	return d.promise
	 }

	 /*
	  *-- #### removeHAS(catwoe, has) 
	  *-- 
	  *-- * param `catwoe`: Object, String o Number
	  *-- * param `has`: Object
	  *-- * return `promise`
	  *--
	  *-- Elimina un HAS de un CATWOE. Si no puede, rechaza. Si lo logra, actualiza
	  *-- el CATWOE y lo resuleve.
	  *--
	  */
	 Catwoe.removeHAS = function (catwoe, has) {
	 	var d = $q.defer()

	 	has.catwoe_id = catwoe.id
	 	Has.remove(has)
	 	.then(function () {
	 		return Catwoe.fetch(catwoe)
	 	})
	 	.then(d.resolve)
	 	.catch(d.reject)

	 	return d.promise
	 }

	Catwoe.fetchOne = Catwoe.find	

	return angular.extend({}, Catwoe, res)
}])