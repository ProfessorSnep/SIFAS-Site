

class Config(object):
    API_ENDPOINT = 'https://api-dot-sifas-site.appspot.com'


class DevelopmentConfig(Config):
    API_ENDPOINT = 'http://localhost:5001'


class ProductionConfig(Config):
    pass
