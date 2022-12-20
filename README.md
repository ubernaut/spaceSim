# Void

A physics-based space simulation and multiplayer game.

<img src=".github/screenshot-overview.png" width="100%">

## Getting Started

### Docker compose

In this directory, build the site and start a web server:

```console
docker-compose up
```

Then, in a separate shell, start the API server:

```console
cd server
docker-compose up
```

The site should be accessible at http://localhost:9000 in your browser


### Node

This project requires Node.js `18.x` and `npm`.

If you're in Ubuntu:

**Dev**

```console
sudo apt install -y build-essential libgl-dev libxi-dev python
npm install
npm run dev
```

The commands above will serve the site at http://localhost:9000 using webpack dev server.

If you also want to start the API:

```console
docker run -d -p 6379:6379 --name redis redis
cd server
npm install
npm start
```

This will use `nodemon` to start the API server on port `1137` by default.

The API depends on redis for events. If you don't want to use `docker` install and start redis on your machine using your preferred method or set the `REDIS_HOST` environment variable to point to a remote redis instance, e.g.:

```console
REDIS_HOST=redis://remote npm start
```

**Build**

```
npm run build
```
