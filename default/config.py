

class Config(object):
    API_ENDPOINT = 'https://sifas.snep.pw/api/'


class DevelopmentConfig(Config):
    API_ENDPOINT = 'http://localhost:5001'


class ProductionConfig(Config):
    pass
