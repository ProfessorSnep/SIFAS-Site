from app import create_application, config

app = create_application()
config.current = app.config

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)
