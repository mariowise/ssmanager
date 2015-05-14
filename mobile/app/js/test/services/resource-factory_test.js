'use strict';

describe('A resource', function () {
	var $q, $timeout, $rootScope
	  , originalName 
	  , testingName = "This is a testing name"
	
	beforeEach(inject(function (_$q_, _$timeout_, _$rootScope_) {
		$q = _$q_
		$timeout = _$timeout_
		$rootScope = _$rootScope_
	}))

	it("saved actually updates into cloud", function (done) {

		var defer = $q.defer()

		User.find("5504eb156d61723e84000000")
		.then(function (user) {
			console.log(user)

			// Se le cambia el nombre y se guarda
			originalName = user.name
			user.name = testingName

			var d = $q.defer()
			User.save(user).then(function (user) { 
				d.resolve(user) 
				$rootScope.$apply() // Gira la rueda del hamster
			})
			return d.promise
		})
		.then(function (user) {
			console.log(user)

			// Se consulta por el valor en la nube
			User.find(user._id).then(function (user) { 
				defer.resolve(user) 
				$rootScope.$apply()	// Gira la rueda del hamster			
			})
		})

		defer.promise
		.then(function (user) {
			// Validaciones
			expect(user.name).toEqual(testingName)
			user.name = originalName
			console.log(user)

			User.save(user).then(function (user) { 
				$rootScope.$apply()
			})
		})
		.finally(done)

		// Fuerza a que el ciclo digest resulva todas las promesas
		// http://stackoverflow.com/questions/23131838/testing-angularjs-promises-in-jasmine-2-0
		if($timeout.verifyNoPendingTasks())
			$timeout.flush() 
	})
})
