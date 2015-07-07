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
	'StateThree',
	'Has',
	function ($q, Session, User, Profile, Project, StateOne, Media, Comment, Tag, File, Message, Catwoe, StateThree, Has) {

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
		Catwoe: Catwoe,
		StateThree: StateThree,
		Has: Has
	}

	return function (entity) {
		return entities[entity]
	}
	
}])