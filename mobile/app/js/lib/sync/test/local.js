
function testLocal($q, Local, cb) {
	var fns = []
	  , testingObject = { id: 1234, name: "Mario", lastname: "López" }

	fns.push(function (callback) {
		Local.drop()
		.then(function () {
			return Local.set(testingObject.id, testingObject)
		})
		.then(function (item) {
			return $q.all([item, Local.get(item)])
		})
		.then(function (res) {
			var a = JSON.stringify(testingObject)
			  , b = angular.toJson(res[0])
			  , c = angular.toJson(res[1])
			if(a == b && b == c)
				callback(null, "- [get] es capaz de obtener objetos previamente guardados.")
			else
				callback("- [get] al crear los objetos, lo guardado, lo resuleto y lo almacenado no coincide.")
		})
		.catch(function (err) {
			callback("- [get] presenta errores a la hora de efectuar .get y .set")
		})
	})

	fns.push(function (callback) {
		Local.get(testingObject.id)
		.then(function (item) {
			item.name = item.name + " Luis"
			return Local.set(item.id, item)
		})
		.then(function (item) {
			if(item.name == testingObject.name + " Luis")
				callback(null, "- [set] es capaz de editar objetos guardados localmente.")
			else
				callback(" - [set] los objetos almacenados y encontrados no coinciden.")
		})
		.catch(function (err) {
			callback("- [set] presenta errores a la hora de efectuar una actualización.")
		})
	})

	fns.push(function (callback) {
		Local.delete(testingObject.id)
		.then(function () {
			return Local.get(testingObject.id)
		})
		.then(function (item) {
			callback("- [delete] no ha sido capaz de eliminar el objeto, este ha sido encontrado luego.")
		}, function (err) {
			Local.set(testingObject.id, testingObject)
			.then(function () {
				callback(null, "- [delete] es capaz de eliminar objetos y responder un rechazo si se vuelven a buscar")
			}, function () {
				callback("- [delete] presenta errores a la hora de efectuar .set")
			})
		})
		.catch(function (err) {
			callback("- [delete] presenta errores a la hora de efectuar .delete o .get")
		})
	})

	fns.push(function (callback) {
		Local.length()
		.then(function (length) {
			if(length == 1)
				callback(null, "- [length] es capaz de contar los elementos de una tabla.")
			else
				callback("- [length] no ha sido capaz de encontrar el largo de una tabla.")
		})
		.catch(function (err) {
			callback("- [length] presenta errores a la hora de llamar el método.")
		})
	})

	fns.push(function (callback) {
		Local.all()
		.then(function (all) {
			return $q.all([
				all, 
				Local.set(4321, { id: 4321, name: "Sofía", lastname: "López" })
			])
		})
		.then(function (res) {
			var all = res[0]
			if(all.constructor == Array && all.length == 1)
				callback(null, "- [all] es capaz de encontrar todos los elementos de una tabla.")
			else 
				callback("- [all] ha presentado problemas en el largo de la tabla y el tipo de respuesta.")
		})
		.catch(function (err) {
			callback("- [all] presenta errores a la hora de llamar al método.")
		})
	})

	fns.push(function (callback) {
		Local.all({ lastname: "López" })
		.then(function (filtered) {
			if(filtered.length == 2)
				callback(null, "- [all] es capaz de filtrar de forma adecuada las filas de la tabla.")
			else
				callback("- [all] ha presentado problema en la respuesta del filtro.")
		})
		.catch(function (err) {
			callback("- [all] presenta errores a la hora de llamar al método.")
		})
	})

	fns.push(function (callback) {
		Local.drop()
		.then(function () {
			return Local.length()
		})
		.then(function (length) {
			if(length == 0)
				callback(null, "- [drop] es capaz de eliminar todo el contenido de la tabla.")
			else
				callback("- [drop] ha presentado problemas y el largo de la tabla no es 0.")
		})
		.catch(function (err) {
			callback("- [drop] ha presentado problemas en el llamado del método.")
		})
	})

	async.series(fns, function (err, results) {
		console.log("Sync.Local")
		results.forEach(function (result) {
			if(result) console.log(result)
		})
		if(!err) {
			console.info("- Sync.Local esta OK")
		} else {
			console.error(err)
		}
		if(cb) cb()
	})
}

// describe("Sync.Local", function () {
// 	var Local = angular.injector(['sync.local']).get('Local')('Test')
// 	  , testingObject = { id: 1234, name: "Mario", lastname: "López" }

// 	it("#get es capaz de guardar objetos y luego obtenerlos", function (done) {
// 		Local.set(testingObject.id, testingObject)
// 		.then(function (item) {
// 			expect(item).toEqual(testingObject)
// 			return Local.get(item)
// 		})
// 		.then(function (item) {
// 			expect(item).toEqual(testingObject)
// 		})
// 		.finally(done)
// 	})
// 	it("#set es capaz de editar objetos guardados localmente", function (done) {
// 		Local.get(testingObject.id)
// 		.then(function (item) {
// 			item.name = item.name + " Luis"
// 			return Local.set(item.id, item)
// 		})
// 		.then(function (item) {
// 			expect(item.name).toEqual(testingObject.name + " Luis")
// 		})
// 		.finally(done)
// 	})
// 	it("#delete es capaz de eliminar objetos y responder un rechazo si se vuelven a buscar", function (done) {
// 		Local.delete(testingObject.id)
// 		.then(function () {
// 			return Local.get(testingObject.id)
// 		})
// 		.then(function (item) {
// 			expect(0).toEqual(1)
// 		}, function (err) {
// 			expect(0).toEqual(0)
// 			return Local.set(testingObject.id, testingObject)
// 		})
// 		.finally(done)
// 	})
// 	it("#length es capaz de contar los elementos de la tabla de forma apropiada", function (done) {
// 		Local.length()
// 		.then(function (length) {
// 			expect(length).toEqual(1)
// 		})
// 		.finally(done)
// 	})
// 	it("#all es capaz de entregar todos los elementos de la tabla", function (done) {
// 		Local.all()
// 		.then(function (all) {
// 			expect(all.constructor).toEqual(Array)
// 			expect(all.length).toEqual(1)
// 			return Local.set(4321, { id: 4321, name: "Sofía", lastname: "López" })
// 		})
// 		.finally(done)
// 	})
// 	it("#all es capaz de filtrar y buscar dentro de la tabla", function (done) {
// 		Local.all({ lastname: "López" })
// 		.then(function (filtered) {
// 			expect(filtered.length).toEqual(2)
// 		})
// 		.finally(done)
// 	})
// 	it("#drop es capaz de eliminar todos los elementos de la tabla", function (done) {
// 		Local.drop()
// 		.then(function () {
// 			return Local.length()
// 		})
// 		.then(function (length) {
// 			expect(length).toEqual(0)
// 		})
// 		.finally(done)
// 	})
// })

// }
