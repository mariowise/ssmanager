
function notice_hide(elem) {
	$(elem).animate({ height: "0px", "padding-top": "0px", "padding-bottom": "0px" }, 800, function () {
		$(elem).remove()
		handle_ghost()
	})
}

function handle_ghost() {
	var x = 50
	var y = $('#notice-bar').height()
	$('#header-ghost').height(x + y)
}

$.notice = {

	raise: function (message, type, timeout, next) {
		this.clean()
		type = type || "success"
		elem = $('<div class="notice notice-' + type + '"><i class="notice-close fa fa-times-circle"></i>'+ message +'</div>')
		$('#notice-bar').append(elem)				
		handle_ghost()
		if(timeout) {
			setTimeout(function () { notice_hide(elem) }, timeout)
		}
		if(next) next()
	}

	, put: function (message, type, timeout, next) {
		this.clean()
		type = type || "success"
		elem = $('<div class="notice notice-' + type + '">'+ message +'</div>')
		$('#notice-bar').append(elem)
		handle_ghost()				
		if(timeout) {
			setTimeout(function () { notice_hide(elem) }, timeout)
		}
		if(next) next()
	}

	, clean: function () {
		$('#notice-bar').children().each(function (index, elem) {
			notice_hide(elem)
		})
	}
}

$(document).ready(function () {
	$(document).on("click", "body #notice-bar .notice .notice-close", function () {	
		notice_hide($(this).parent())
	})
})