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
	'Message',
	'Catwoe',
	function ($q, Session, User, Profile, Project, StateOne, Media, Comment, Tag, File, Message, Catwoe) {

	var entities = {
		Session: Session,
		User: User,
		Profile: Profile,
		Project: Project,
		StateOne: StateOne,
		Media: Media,
		Comment: Comment,
		Tag: Tag,
		File: File,
		Message: Message,
		Catwoe: Catwoe
	}

	return function (entity) {
		return entities[entity]
	}
	
}])