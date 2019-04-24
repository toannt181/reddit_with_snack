require('module-alias/register')
const path = require('path')
const favicon = require('serve-favicon')
const compress = require('compression')
const helmet = require('helmet')
const cors = require('cors')

const feathers = require('@feathersjs/feathers')
const configuration = require('@feathersjs/configuration')
const express = require('@feathersjs/express')
// const socketio = require('@feathersjs/socketio')
const logger = require('./logger')

const middleware = require('./middleware')
const services = require('./services')
const appHooks = require('./app.hooks')
const objection = require('./objection')
const models = require('./models/configs')
const passport = require('./auth')
// const channels = require('./channels')

const app = express(feathers())

// Load app configuration
app.configure(configuration())
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet())
app.use(cors({
  optionsSuccessStatus: 200,
}))
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(app.get('public'), 'favicon.ico')))
// Host the public folder
app.use('/', express.static(app.get('public')))

// Set up Plugins and providers
app.configure(express.rest())

// app.configure(socketio())
app.configure(objection)
app.configure(models)

app.configure(passport)
// Configure other middleware (see `middleware/index.js`)
app.configure(middleware)
// Set up our services (see `services/index.js`)
app.configure(services)
// Set up event channels (see channels.js)
// app.configure(channels)

app.set('logger', logger)
app.set('log', logger.info)

// Configure a middleware for 404s and the error handler
app.use(express.notFound())
app.use(express.errorHandler({ logger }))

app.hooks(appHooks)

module.exports = app
