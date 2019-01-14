const express = require('express')
const compression = require('compression')

const port = process.env.PORT || 9000

const app = express()
app.use(compression())
app.use(express.static('dist'))
app.listen(port, () => console.log(`Listening on port ${port}`))
