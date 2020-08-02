

class Config(object):
    USE_LOCAL_DATA = False
    JSON_AS_ASCII = False


class DevelopmentConfig(Config):
    USE_LOCAL_DATA = True


class ProductionConfig(Config):
    pass
