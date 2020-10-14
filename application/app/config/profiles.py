

class Config(object):
    CONTENT_ENDPOINT = 'https://content.sifas.guru'
    USE_LOCAL_DATA = False
    JSON_AS_ASCII = False


class DevelopmentConfig(Config):
    CONTENT_ENDPOINT = 'http://localhost:8080'
    USE_LOCAL_DATA = True
    TEMPLATES_AUTO_RELOAD = True


class ProductionConfig(Config):
    pass
