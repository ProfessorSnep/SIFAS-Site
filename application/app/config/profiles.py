

class Config(object):
    CONTENT_ENDPOINT = 'https://content.sifas.guru'
    USE_LOCAL_DATA = False
    JSON_AS_ASCII = False
    TEMPLATES_AUTO_RELOAD = False
    CACHE_RESET_KEY = "JHltOAoadStmf35Ndf4agFo8UKeMW3eaZxv3lBfHdM4"


class DevelopmentConfig(Config):
    CONTENT_ENDPOINT = 'http://localhost:8080'
    USE_LOCAL_DATA = True
    TEMPLATES_AUTO_RELOAD = True


class ProductionConfig(Config):
    pass
