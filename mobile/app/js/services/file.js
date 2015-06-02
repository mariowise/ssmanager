angular.module('app.services.file', [])

.factory('File', ['$q', '$cordovaCamera', '$cordovaFileTransfer', 'Session', 'ResourceFactory', function ($q, $cordovaCamera, $cordovaFileTransfer, Session, ResourceFactory) {
	
	// Recurso local
	var File = ResourceFactory('File', 'files') // Nombre del recurso, Nombre del recurso en API (URL)

	File.takePhoto = function () {
		var d = $q.defer()

		Session.current_user()
		.then(function (current_user) {

			var options = {
				quality: 100,
				destinationType: Camera.DestinationType.FILE_URI,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 800,
				targetHeight: 800,
				saveToPhotoAlbum: false
			};

			// Se saca la foto
			$cordovaCamera.getPicture(options)
			// Se sube la foto
			.then(function (fileUri) {
				options = {
					headers: {
						"Authorization": "JWT " + current_user.token
						, "Cookie": document.cookie
					}
				}
				return $cordovaFileTransfer.upload(CONFIG.api("files/"), fileUri, options)
			}, d.reject)

			.then(function (res) {
				console.log(res)
			}, function (err) {
				d.reject(err)
				console.log(err)
			})

		})

		return d.promise
	}

	// Se expone el servicio
	return File
}])