
function testRemote2($q, Remote, options, cb) {
	var fns = []
	  , testingObject = options.testObject
	  , generatedId

	fns.push(function (callback) {
		console.log(options.title)
		callback(null)
	})

	fns.push(function (callback) {
		Remote._create(testingObject)
	    .then(function (item) {
	        if(item.id) {
	        	generatedId = item.id
	        	callback(null, "- [_create] es capaz de crear un objeto en la nube #" + item.id)
	        } else
	        	callback("- [_create] no ha generdo un objeto con .id")	        
	    }, function (err) {
	        callback("- [_create] no ha podido establecer la conexión con el servidor " + JSON.stringify(err))
	    })
	})

	fns.push(function (callback) {
		Remote._find(generatedId)
		.then(function (item) {
			if(item.id == generatedId) {
				callback(null, "- [_find] es capaz de encontrar un objeto en la nube.")
			} else
				callback("- [_find] el objeto encontrado no coincide con el solicitado.")
		}, function (err) {
			callback("- [_find] no ha sido capaz encontrar el objeto " + JSON.stringify(err).substr(0, 10))
		})
	})

	fns.push(function (callback) {
		Remote._find(generatedId)
		.then(function (item) {
			for(p in item){
				if(typeof item[p] == "string")
					item[p] = item[p] + "...test-change"
			}
			item.name = item.name + " Luis"
			return Remote._update(item)
		})
		.then(function (item) {
			if(item.name = "Mario Luis") {
				callback(null, "- [_update] es capaz de actualizar el objeto en la nube.")
			} else
				callback("- [_update] la actualización no se ha efectuado en la nube.")
		})
		.catch(function (err) {
			callback("- [_update] no ha sido capaz de efectuar la actualización.")
		})
	})

	// fns.push(function (callback) {
	// 	$q.all([
	// 		Remote._create({ name: "María Paz", lastname: "Vivanco" }),
	// 		Remote._create({ name: "Jaime", lastname: "Vivanco" }),
	// 		Remote._create({ name: "Alicia", lastname: "Landes" })	
	// 	])
	// 	.then(function () {
	// 		return Remote._where({ lastname: "Vivanco" })
	// 	})
	// 	.then(function (result) {
	// 		if(result.length == 2)
	// 			callback(null, "- [_where] es capaz de efectuar un filtro en la nube.")
	// 		else
	// 			callback("- [_where] no ha sido capaz de traer elementos filtrados.")
	// 	}, function (err) {
	// 		callback("- [_where] no ha sido capaz de llamar al filtro.")
	// 	})
	// })

	fns.push(function (callback) {
		Remote._destroy(generatedId)
		.then(function () {
			return Remote._find(generatedId)
		}, function () { callback("- [_destroy] no ha sido capaz de efectuar el llamado a eliminad.") })
		.then(function () {
			callback("- [_destroy] no ha sido capaz de eliminar el elemento, y ha sido encontrado.")
		})
		.then(null, function () {
			callback(null, "- [_destroy] es capaz de eliminar el objeto de forma correcta.")
		})
	})

	async.series(fns, function (err, results) {
		results.forEach(function (result) {
			if(result) console.log(result)
		})
		if(!err) {
			console.info(options.title + " OK")
		} else {
			console.error(err)
		}
		if(cb) cb()
	})
}