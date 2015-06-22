
function testResource($q, Resource, cb) {
	var fns = []
	  , testingObject = { name: "Mario", lastname: "López" }
	  , generatedId

	fns.push(function (callback) {
		Resource._create(testingObject)
		.then(function (ritem) {
			return Resource.findOne(ritem.id)
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