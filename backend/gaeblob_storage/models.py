from google.appengine.ext import db


class BlobPropertyFileModel(db.Model):
    content = db.BlobProperty()
