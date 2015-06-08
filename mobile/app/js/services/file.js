angular.module('app.services.file', [])

.factory('File', ['$q', '$cordovaCamera', '$cordovaFileTransfer', 'Session', 'ResourceFactory', function ($q, $cordovaCamera, $cordovaFileTransfer, Session, ResourceFactory) {
	
	// Recurso local
	var File = ResourceFactory('File', 'files') // Nombre del recurso, Nombre del recurso en API (URL)

	File.takePhoto = function () {
		var options = {
			quality: 100,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 800,
			targetHeight: 800,
			saveToPhotoAlbum: false
		}
		return $cordovaCamera.getPicture(options)
	}

	File.upload = function (fileUri) {
		var d = $q.defer()

		Session.current_user()
		.then(function (current_user) {
			var options = {
				fileKey: "datafile",
				fileName: guid(),
				params: { owner: current_user.id },
				headers: { "Authorization": "JWT " + current_user.token }
			}				
			return $cordovaFileTransfer.upload(CONFIG.api("files/"), fileUri, options, true)			
		})
		.then(d.resolve, d.reject)

		return d.promise
	}

	// Se expone el servicio
	return File
}])