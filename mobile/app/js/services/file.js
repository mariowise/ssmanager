angular.module('app.services.file', [])

.factory('File', ['$q', '$cordovaCamera', '$cordovaFileTransfer', '$http', 'Session', 'ResourceFactory', function ($q, $cordovaCamera, $cordovaFileTransfer, $http, Session, ResourceFactory) {
	
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

			$.loading.show("loading")

			$cordovaCamera.getPicture(options)
			.then(function (fileUri) {
				
				var fd = new FormData()
				fd.append("owner", current_user.id)
				fd.append("datafile", fileUri)
				$http.post(CONFIG.api("files/"), fd, {
					transformRequest: angular.identity
            		, headers: {'Content-Type': undefined}
				})
				.success(function (res) {
					console.log(res)
					d.resolve(res)
				})
				.error(function (err) {
					console.log(err)
					d.reject(err)
				})

			}, d.reject)

		})

		return d.promise
	}

	// Se expone el servicio
	return File
}])