angular.module('app.services.file', [])

.factory('File', ['$q', '$cordovaCamera', '$cordovaFile', '$cordovaFileTransfer', 'Session', 'ResourceFactory', function ($q, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, Session, ResourceFactory) {
	
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

	/*
	 * A partir de una URL si no existe cordova resuelve la misma URL, en caso contrario, 
	 * revisa si es que se encuentra disponible en el dispositivo el archivo. Si se encuentra, retorna su 
	 * URI, en caso contrario, comienza la transferencia para descargarlo, resolviendo con su URI fresca.
	 * Si ocurre algún error con la descarga, rechaza la promsea
	 */
	File.download = function (fileUrl) {
		var d = $q.defer()

		if(typeof cordova != "undefined") {
			var fileName = fileUrl.substring(fileUrl.lastIndexOf("/")+1, fileUrl.length)
			var fileUri = cordova.file.documentsDirectory + fileName
			var options = {}

			$cordovaFile.checkFile(cordova.file.documentsDirectory, fileName)
			.then(function () {
				d.resolve(fileUri)
			})
			.catch(function () {
				$cordovaFileTransfer.download(fileUrl, fileUri, options, true)
				.then(function () {
					d.resolve(fileUri)
				}, d.reject)
			})
		} else d.resolve(fileUrl)

		return d.promise
	}

	File.loadImage = function (fileUrl) {
		var d = $q.defer()

		File.get(fileUrl)
		.then(function (file) {
			if(file) {
				d.resolve(file)
			} else {

			}
		})

		return d.promise
	}

	// Se expone el servicio
	return File
}])