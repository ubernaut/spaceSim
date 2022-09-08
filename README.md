# Void

A physics-based space simulation and multiplayer game.

<img src=".github/screenshot-overview.png" width="100%">

## Getting Started

You'll need Node and npm:

**Dev**

```
sudo apt install build-essential
npm install
npm run dev
```

Then hit http://localhost:9000 in your browser

**Build**

```
npm run build
```

## Build & Release for Heroku

```console
heroku login
heroku container:login
docker build . -t registry.heroku.com/void-client-0/web
docker push registry.heroku.com/void-client-0/web
heroku container:release web --app=void-client-0
```
