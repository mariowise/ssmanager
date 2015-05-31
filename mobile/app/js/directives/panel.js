angular.module('app.directives.panel', [])

.directive('panelToggle', function () {
	return {
		restrict: "A"
		, link: function (scope, element, attrs) {
			element.bind("click", function () {
				var panel = $(element).closest(".panel")
				var body = $(panel).find(".panel-body")
				var icon = $(element).children(".fa")

				console.log( $(body).css("display") )

				$(icon).removeClass("fa-chevron-down")
				$(icon).removeClass("fa-chevron-up")

				if($(body).css("display") == "none")
					$(icon).addClass("fa-chevron-up")
				else
					$(icon).addClass("fa-chevron-down")

				$(body).toggle(800)
			})
		}
	}
})

// <div class="panel panel-default">
// 	<div class="panel-heading">
// 		<div class="panel-title"></div>
// 		<div class="panel-toolbar">
// 			<button class="btn btn-link" panel-toggle><i class="fa fa-chevron-up"></i></button>
// 		</div>
// 	</div>
// 	<div class="panel-body">
// 	</div>
// </div>