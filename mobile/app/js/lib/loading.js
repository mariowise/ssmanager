
$.loading = {

	show: function(type, timeout, next) {
		if(type == "success")
			$('#loading').hide()
		
		$('#' + type).show()
		if(timeout) {
			setTimeout(function () {
				$('#' + type).fadeOut(800)
				if (next) next()
			}, timeout)
		}
	},

	hide: function(type) {
		$('#' + type).fadeOut(800)
	},

	transition: function() {
		$('#loading').hide()
		$('#success').show()
		setTimeout(function () { 
			$('#success').fadeOut(800) 
		}, 1000)		
	},

	error: function (msg) {
		$('#loading,#success').hide()
		$('#error .error-message').html(msg)
		$('#error').show()
		setTimeout(function () {
			$('#error').fadeOut(800)
		}, 2500)
	}

}