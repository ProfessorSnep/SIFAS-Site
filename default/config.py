

class Config(object):
    API_ENDPOINT = 'https://sifas.snep.pw/api'
    CONTENT_ENDPOINT = 'https://sifas-content.snep.pw'


class DevelopmentConfig(Config):
    API_ENDPOINT = 'http://localhost:5001/api'
    CONTENT_ENDPOINT = 'http://localhost:8080'
    TEMPLATES_AUTO_RELOAD = True


class ProductionConfig(Config):
    pass
