import json
import os
from typing import Any, Dict

from app import config
from google.cloud import storage

storage_client = storage.Client()
storage_bucket = storage_client.get_bucket("sifas-site.appspot.com")


def request_json(*loc):
    if config.current['USE_LOCAL_DATA']:
        file_path = os.path.join(os.environ['JSON_BUCKET_PATH'], *loc)
        file_path = '%s.json' % (file_path)
        if os.path.isfile(file_path):
            with open(file_path, 'r', encoding='utf-8') as inf:
                return json.load(inf)
        return None
    else:
        file_path = '%s.json' % ('/'.join(loc))
        blob = storage_bucket.get_blob(file_path)
        if blob:
            return json.loads(blob.download_as_string())
        return None


resource_cache: Dict[str, Any] = {}


def get_resource(path, cacheable=True):
    if cacheable and path in resource_cache:
        return resource_cache[path]

    resource = request_json(*path.split('/'))

    if cacheable:
        resource_cache[path] = resource
    return resource


def content_endpoint(path):
    return '%s/%s' % (config.current['CONTENT_ENDPOINT'], path)
