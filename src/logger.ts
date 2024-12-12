import pino from 'pino/pino';
import process from 'node:process';

export default pino({
  level: process.env.LOG_LEVEL || 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
});
