from django.test import TestCase
from django.core.files.base import ContentFile

from gaeblob_storage.backends import BlobPropertyStorage, BlobPropertyFile


class BlobPropertyStorageTest(TestCase):
    urls = 'gaeblob_storage.urls'

    def setUp(self):
        self.storage = BlobPropertyStorage()

        self.content = 'test content'
        self.file = ContentFile(self.content)
        self.name = 'test.txt'
        self.name_1 = 'test_1.txt'

    def tearDown(self):
        pass

    def test_save_file(self):
        path = self.storage.save(self.name, self.file)
        self.assertEqual(self.name, path)

    def test_open_existing_file(self):
        path = self.storage.save(self.name, self.file)
        self.assertEqual(self.name, path)

        f = self.storage.open(path)
        self.assertEqual(self.content, f.read())

    def test_open_invalid_file(self):
        f = self.storage.open('foo bar')
        self.assertEqual(f, None)

    def test_exists_existing_file(self):
        path = self.storage.save(self.name, self.file)
        self.assertTrue(self.storage.exists(path))

    def test_exists_invalid_file(self):
        self.assertFalse(self.storage.exists('foo bar'))

    def test_delete_existing_file(self):
        self.test_exists_existing_file()
        self.storage.delete(self.name)
        self.assertFalse(self.storage.exists(self.name))

    def test_save_same_file(self):
        path_1 = self.storage.save(self.name, self.file)
        path_2 = self.storage.save(self.name, self.file)

        self.assertEqual(path_1, self.name)
        self.assertEqual(path_2, self.name_1)

    def test_invalid_file_name(self):
        path =  self.storage.save(' foo  ', self.file)
        self.assertEqual(path, u'foo')

    def test_serve_view(self):
        path = self.storage.save(self.name, self.file)

        response = self.client.get(self.storage.url(path))

        self.assertEqual(self.content, response.content)

class BlobPropertyFileTest(TestCase):
    def setUp(self):
        self.content = 'test content'
        self.name = 'test.txt'
        
    def test_init(self):
        f = BlobPropertyFile(self.name, self.content)
        self.assertEqual(self.name, f.name)
        self.assertEqual(self.content, f.blob.content)

    def test_read(self):
        f = BlobPropertyFile(self.name, self.content)
        self.assertEqual(self.content, f.read())

    def test_write(self):
        f = BlobPropertyFile(self.name, '')
        self.assertNotEqual(self.content, f.read())

        f.write(self.content)
        self.assertEqual(self.content, f.read())

        
