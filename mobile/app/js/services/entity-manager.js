angular.module('app.services.entity-manager', [])

.factory('EM', ['$q', 
	'Session', 
	'User', 
	'Profile',
	'Project',
	'StateOne',
	'Media',
	'Comment',
	'Tag',
	'File',
	function ($q, Session, User, Profile, Project, StateOne, Media, Comment, Tag, File) {

	var entities = {
		Session: Session,
		User: User,
		Profile: Profile,
		Project: Project,
		StateOne: StateOne,
		Media: Media,
		Comment: Comment,
		Tag: Tag,
		File: File
	}

	return function (entity) {
		return entities[entity]
	}
	
}])