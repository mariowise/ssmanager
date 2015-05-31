angular.module('app.directives.footer', [])

.directive('footerPartial', function () {
	return {
		restrict: "E"
		, templateUrl: "views/partials/footer.html"
		, scope: {}
		, controller: function ($scope, $state) {
			if($('#footer .btn-primary').length == 0) {
				var route = $state.current.name.split(".")[1].split("-")[0] // standar standar standar
				  , btn = $('#footer [route="' + route + '"]')

				$(btn).removeClass("btn-default")
				$(btn).addClass("btn-primary")
			}

			$scope.refresh = function (route) {
				var btn = $('#footer [route="' + route + '"]')
				  , btns= $('#footer .btn')

				$(btns).removeClass("btn-default")
				$(btns).removeClass("active")
				$(btns).addClass("btn-default")
				
				$(btns).removeClass("btn-primary")
				$(btn).addClass("btn-primary")
				$(btn).addClass("active")
			}
		}
	}
})