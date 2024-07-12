// const winston = require('winston');
// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//  // defaultMeta: { service: 'user-service' },
//   transports: [
//     //
//     // - Write all logs with importance level of `error` or less to `error.log`
//     // - Write all logs with importance level of `info` or less to `combined.log`
//     //
//     new winston.transports.File({ filename: 'error.log', level: 'error' }),
//     new winston.transports.File({ filename: 'combined.log' }),
//   ],
// });

// logger.info('Hello,winston!');

// function logErr(err) {
   //     logger.error(err.message, {error:(err)});
// }
// module.exports={logErr}

const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

function logErr(err) {
  // Check if err has a stack property (typically only Error objects have this)
  const stackTrace = err.stack || '';
  // Log the error with stack trace included
  logger.error(`${err.message}\n`, { error: stackTrace });
}

module.exports = { logErr };

