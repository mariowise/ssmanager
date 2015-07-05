angular.module('app.services.profile', [])

.factory('Profile', ['$q', 'Resource', 'Message', function ($q, Resource, Message) {

	var Profile = Resource('Profile', 'profiles')

	Profile.fetchOne = Profile.find

	Profile.fetchMessages = function (key) {
		var d = $q.defer()
		  , self = this
		  , key = key[CONFIG.pk] || key.id || key

		self.fetch(key)
		.then(function (profile) {
			return $q.all([
				profile,
				Message.fetch(profile.mensajes_user_leidos),
				Message.fetch(profile.mensajes_user_noleidos)
			])
		}, null, function (nprofile) {
			if(nprofile.reads && nprofile.noreads)
				d.notify(nprofile)
		})
		.then(function (res) {
			var profile = res[0]
			profile.reads = res[1]
			profile.noreads = res[2]
			return self.set(profile.id, profile)
		})
		.then(d.resolve)
		.catch(function (err) {
			console.error(err)
			d.reject(err)
		})

		return d.promise
	}

	return Profile
}])