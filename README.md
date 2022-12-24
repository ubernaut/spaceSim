# Void

A physics-based space simulation and multiplayer game.

<img src=".github/screenshot-overview.png" width="100%">

## Getting Started

This project currently consists of a website and an API/websocket server. Redis is also used for pub/sub to broadcast socket events to all connected browsers/clients.

### Docker compose

In this directory, you can fire up the system using `docker-compose`:

```console
cp .example.env .env
docker-compose up
```

The site should then be accessible at http://localhost:9000 in your browser.

### Node

If you want to develop new features and take advantage of auto-reloading, this project requires Node.js `18.x` and `npm`.

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

## Static site builds

You can produce a static build of the website using webpack:

```
NODE_ENV=production npm run build
```

Environment variables are read from `.env` by default. See the example file for details on what each variable does.

You can also override variables on the command line as in the build example above.
