angular.module('app.directives.media-player', [])

.directive('audioPlayer', function ($compile) {
	return {
		restrict: "E"
		, scope: {}
		, template: '<button class="btn btn-default wide"></button>'
		, link: function (scope, element, attrs) {
			var btn = element.children("button")
			  , playing = false
			  , media = undefined
			
			btn.html('<i class="fa fa-play"></i> Reproducir')
			btn.click(function () {
				if(!playing) {
					playing = true
					btn.html('<i class="fa fa-stop"></i> Detener')
					media = new Audio(attrs.source)
					media.play()
					media.addEventListener('ended', function () {
						playing = false
						btn.html('<i class="fa fa-play"></i> Reproducir')	
					})
				} else {
					playing = false
					btn.html('<i class="fa fa-play"></i> Reproducir')
					media.pause()
					media.src = ""
					media.removeAttribute("src");
				}
			})
		}
	}
})

.directive('videoPlayer', function ($compile) {
	return {
		restrict: "E"
		, scope: {}
		, template: '<video controls class="wide"></video>'
		, link: function (scope, element, attrs) {
			var btn = element.children("video")			
			btn.attr('src', attrs.source)
		}
	}
})
