angular.module('app.services.profile', [])

.factory('Profile', ['$q', 'Resource', function ($q, Resource) {

	var Profile = Resource('Profile', 'profiles')

	return Profile
}])