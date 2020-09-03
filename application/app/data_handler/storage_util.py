from google.cloud import storage
import json
import os
from app import config

storage_client = storage.Client()
storage_bucket = storage_client.get_bucket("sifas-site.appspot.com")


def request_json(*loc):
    if config.current['USE_LOCAL_DATA']:
        file_path = os.path.join(os.environ['JSON_BUCKET_PATH'], *loc)
        file_path = '%s.json' % (file_path)
        with open(file_path, 'r', encoding='utf-8') as inf:
            return json.load(inf)
    else:
        file_path = '%s.json' % ('/'.join(loc))
        blob = storage_bucket.get_blob(file_path)
        return json.loads(blob.download_as_string())
