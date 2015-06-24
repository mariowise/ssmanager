
function testResource($q, Resource, cb) {
	var fns = []
	  , testingObject = { name: "Mario", lastname: "López" }
	  , generatedId

	fns.push(function (callback) {
		Resource._create(testingObject)
		.then(function (ritem) {
			return Resource.find(ritem)
		})
		.then(null, function (err) {
			callback("- [findOne] no ha podido realizar la labor esperada.")
		}, function (notify) {
			if(notify.name == testingObject.name)
				callback(null, "- [findOne] Es capaz de notificar con el valor local.")
			else
				callback("- [findOne] ha notificado mal el objeto")
		})
	})

	fns.push(function (callback) {
		$q.all([
			Resource._create({ name: "María Paz", lastname: "Vivanco" }),
			Resource._create({ name: "Jaime", lastname: "Vivanco" }),
			Resource._create({ name: "Alicia", lastname: "Landes" })	
		])
		.then(function (rows) {
			var query = [rows[1], rows[2].id, 12341234]
			generatedId = rows[0].id
			return Resource.find(query)
		})
		.then(function (items) {
			var r1 = items[0].name
			  , r2 = items[1].name
			if(r1 != "Jaime" || r2 != "Alicia") {
				callback("- [find] en su búsqueda por Array no es capaz de entregar las filas indicadas")
				console.log(items)
			}
			else
				callback(null, "- [find] es capaz de buscar por Array de objetos")
		}, null, function (nitems) {
			var r1 = nitems[0]
			  , r2 = nitems[1]
			if(r1.name != "Jaime" || r2.name != "Alicia")
				callback("- [find] en su búsqueda por Array no es capaz de entregar las filas indicadas por notificación")
		})
		.catch(function (err) {
			callback("- [find] no ha sido capaz de completar la búsqueda por Array")
		})
	})

	fns.push(function (callback) {
		Resource.get(generatedId)
		.then(function (item) {
			return $q.all([
				Resource.find(item),
				Resource.find(item.id)
			])
		})
		.then(function (items) {
			if(angular.toJson(items[0]) == angular.toJson(items[1]))
				callback(null, "- [find] es capaz de buscar por id o por objeto.")
			else
				callback("- [find] no ha sido capaz de buscar por id o por objeto de forma apropiada.")
		})
		.catch(function (err) {
			callback("- [find] No ha sido capaz de buscar por objeto y por id")
		})
	})

	fns.push(function (callback) {
		Resource.all()
		.then(function (items) {
			var list = []
			items.forEach(function (item) {
				list.push(Resource._destroy(item))
			})
			return $q.all(list)
		})
		.then(function (res) {
			callback(null)
		}, function (err) {
			callback("- testResource no ha sido capaz de dejar todo limpio")
		})
	})

	async.series(fns, function (err, results) {
		console.log("Sync.Resource")
		results.forEach(function (result) {
			if(result) console.log(result)
		})
		if(!err) {
			console.info("- Sync.Resource esta OK")
		} else {
			console.error(err)
		}
		if(cb) cb()
	})
}