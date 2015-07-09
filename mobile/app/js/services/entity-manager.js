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
	'RichPicture',
	'Document',
	'Analisys',
	function ($q, Session, User, Profile, Project, StateOne, Media, Comment, Tag, File, Message, Catwoe, StateThree, Has, RichPicture, Document, Analisys) {

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
		Has: Has,
		RichPicture: RichPicture,
		Document: Document,
		Analisys: Analisys
	}

	return function (entity) {
		return entities[entity]
	}
	
}])