

class Config(object):
    USE_LOCAL_DATA = False


class DevelopmentConfig(Config):
    USE_LOCAL_DATA = True


class ProductionConfig(Config):
    pass
