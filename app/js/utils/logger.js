import bunyan from 'browser-bunyan'
import state from '-/state'

const loggingConfig = state.get([ 'config', 'logging' ])

const logger = bunyan.createLogger({
  name: loggingConfig.name,
  streams: [
    {
      level: loggingConfig.level,
      stream: new bunyan.ConsoleFormattedStream()
    }
  ],
  serializers: bunyan.stdSerializers,
  src: true
})

export default logger
