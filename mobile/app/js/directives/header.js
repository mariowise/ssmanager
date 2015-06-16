angular.module('app.directives.header', [])

.directive('headerLeft', function ($state, $compile, $timeout) {
	return {
		restrict: "E"
		, scope: { route: "@" }
		, link: function (scope, element, attrs) {
			// console.log("headerLeft directive running")

			function configure() {
				var left = $('#header .btn.left')[0]
				
				if(attrs["remove"] != undefined) {
					$(left).addClass("no-shadow")
					$(left).removeAttr('ui-sref')
					$(left).html("")
				} else {
					$(left).removeClass("no-shadow")
					$(left).attr('ui-sref', attrs["route"])
					$(left).html('<i class="fa fa-chevron-left"></i>')
				}
				$compile($(left).parent())(scope)
			} ; configure()

			scope.$watch("route", configure) // Para el caso de los parámetros asíncronos
		}
	}
})
