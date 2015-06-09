angular.module('app.services.file', [])

.factory('File', ['$q', '$cordovaCamera', '$cordovaFile', '$cordovaFileTransfer', 'Session', 'ResourceFactory', function ($q, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, Session, ResourceFactory) {
	
	// Recurso local
	var File = ResourceFactory('File', 'files') // Nombre del recurso, Nombre del recurso en API (URL)

	/*
	 * Configura y toma una foto, retornando la promesa de cuando termine la captura
	 */
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

	/*
	 * Efectúa la operación de subir un fichero a la nube, devuelve la promesa de esta operación
	 */
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
		if(CONFIG.debug) console.log("File::download running for URL: " + fileUrl)
		var d = $q.defer()

		if(typeof cordova != "undefined") {
			var l = fileUrl.split("/")
			  , fileName = (l[l.length-1] != "") ? l[l.length-1] : l[l.length-2]
			  , mediaPath = cordova.file.documentsDirectory + "media/"
			  , fileUri = mediaPath + fileName

			$cordovaFile.checkFile(mediaPath, fileName)
			.then(function () {
				if(CONFIG.debug) console.log("File::download file found! on " + fileUri)
				d.resolve(fileUri)
			})
			.catch(function () {
				$cordovaFileTransfer.download(fileUrl, fileUri, {}, true)
				.then(function (downloadedUri) {
					if(CONFIG.debug) console.log("File::download file downloaded successfully on " + JSON.stringify(downloadedUri))
					d.resolve(downloadedUri.nativeURL)
				}, d.reject)
			})
		} else d.resolve(fileUrl)

		return d.promise
	}

	

	/*
	 * Vacía la carpeta rPath ubicada dentro del directorio de documentos asignado a la App por
	 * el sistema operativo
	 */
	File.clean = function (rPath) {
		console.log("File::clean starting to clean documentsDirectory")
		var defer = $q.defer()

		if(typeof cordova != "undefined") {
			var basePath = cordova.file.documentsDirectory

			$cordovaFile.removeRecursively(basePath, rPath)
			.then(function (res) {
				console.log("File::clean directory was removed.")
				return 
			}, defer.reject)

		} else defer.reject()

		return defer.promise
	}

	// Se expone el servicio
	return File
}])