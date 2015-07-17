angular.module('app.services.file', [])

.factory('File', ['$q', '$cordovaCamera', '$cordovaFile', '$cordovaFileTransfer', '$cordovaCapture', 'Session', 'Resource', function ($q, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaCapture, Session, Resource) {
	
	// Recurso local
	var File = Resource('File', 'files') // Nombre del recurso, Nombre del recurso en API (URL)

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

	File.takeAudio = function () {
		var d = $q.defer()
		  , options = {
			limit: 1, 
			duration: 60 * 60 // Máximo de segundos
		  } 
		$cordovaCapture.captureAudio(options)
		.then(function (res) {
			if(res && res.length && res.length == 1 && res[0].fullPath)
				d.resolve(res[0].fullPath)
			else
				d.reject("File::takeAudio El objeto no pasa la verificación " + JSON.stringify(res))
		}, d.reject)
		return d.promise
	}

	File.takeVideo = function () {
		var d = $q.defer()
		  , options = {
		  	limit: 1,
		  	duration: 60 * 15
		  }
		$cordovaCapture.captureVideo(options)
		.then(function (res) {
			if(res && res.length && res.length == 1 && res[0].fullPath)
				d.resolve(res[0].fullPath)
			else
				d.reject("File::takeVideo El objeto no pasa la verificación " + JSON.stringify(res))
		}, d.reject)
		return d.promise
	}

	File.selectPhoto = function () {
		var options = {
			quality: 100,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
			allowEdit: true,
			targetWidth: 800,
			targetHeight: 800,
			saveToPhotoAlbum: false
		}
		return $cordovaCamera.getPicture(options)
	}

	/*
	 * Efectúa la operación de subir un fichero a la nube, devuelve la promesa de esta operación
	 */
	File.upload = function (fileUri, url, opt) {
		var ext = fileUri.split(".")
		  , ext = (ext.length > 0) ? ext[ext.length-1].toLowerCase() : ""
		  , fname = guid() + ((ext != "") ? "." + ext : ext)
		  , fileURL = CONFIG.gcs + "&name=" + fname
		  , options = { headers: { "Content-Type": CONFIG.media[ext] } }

		console.log("Subiendo archivo a " + fileURL + "(" + ext + ")")
		console.log([url || fileURL, fileUri, opt || options])
		return $cordovaFileTransfer.upload(url || fileURL, fileUri, opt || options, true)			
	}

	/*
	 * A partir de una URL si no existe cordova resuelve la misma URL, en caso contrario, 
	 * revisa si es que se encuentra disponible en el dispositivo el archivo. Si se encuentra, retorna su 
	 * URI, en caso contrario, comienza la transferencia para descargarlo, resolviendo con su URI fresca.
	 * Si ocurre algún error con la descarga, rechaza la promsea. Es importante notar que para
	 * que este método funcione, es necesario que exista la carpeta `media` el la carpeta de almacenamiento (rw)
	 * del dispositivo; esta configuración se realiza a la hora de iniciar la aplicación (app.js)
	 */
	File.download = function (fileUrl, fname) {
		if(CONFIG.debug) console.log("File::download running for URL: " + fileUrl)
		var d = $q.defer()

		if(typeof cordova != "undefined") {
			var l = fileUrl.split("/")
			  , fileName = (fname != undefined) ? fname : ( (l[l.length-1] != "") ? l[l.length-1] : l[l.length-2] )
			  , basePath = cordova.file.applicationStorageDirectory + ((cordova.platformId == "ios") ? "Documents/" : "")
			  , mediaPath = basePath + "media/"
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