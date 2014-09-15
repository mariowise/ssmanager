from django.core.files.storage import Storage
from django.core.files.base import File
from django.core.urlresolvers import reverse

from gaeblob_storage.models import BlobPropertyFileModel


class BlobPropertyStorage(Storage):
    def _save(self, name, content):
        path = self.path(name)
        blob = BlobPropertyFileModel(key_name=path)
        blob.content = content.read()
        blob.put()
        return path

    def exists(self, name):
        if BlobPropertyFileModel.get_by_key_name(self.path(name)):
            return True
        else:
            return False

    def _open(self, name, mode='rb'):
        blob = BlobPropertyFileModel.get_by_key_name(self.path(name))
        if blob:
            return BlobPropertyFile(self.path(name), blob)
        else:
            return None

    def delete(self, name):
        BlobPropertyFileModel.get_by_key_name(self.path(name)).delete()

    def path(self, name):
        name = name.strip()
        if name.startswith('./'):
            name = name[2:]
        return name

    def url(self, name):
        return reverse('gaeblob_serve', kwargs={'key': self.path(name)})


class BlobPropertyFile(File):
    def __init__(self, name, blob):
        self.name = name

        # check if blob is just content or the database model class
        if isinstance(blob, BlobPropertyFileModel):
            self.blob = blob
        else:
            self.blob = BlobPropertyFileModel(content=blob)
        
    def read(self):
        return self.blob.content

    def write(self, content):
        self.blob.content = content
        self.blob.put()

    def close(self):
        raise NotImplementedError()
