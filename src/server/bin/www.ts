#!/usr/bin/env node

/**
 * Module dependencies.
 */

import debug from 'debug';
import {Server, createServer} from 'http';
import {AddressInfo} from "node:net";
import app from "../app.js";

/**
 * Get port from environment and store in Express.
 */

debug('mlb-picks-2.0:server')

const port: string | number | boolean = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server: Server = createServer(app);

/**
 * Register Scheduler Jobs
 */

// const job: Job = schedule.scheduleJob('0 */6 * * *', async () => await dailyUpdate())

/**
 * Gracefully shutdown server
 */

process.on('SIGINT', () => {
  debug('SIGINT signal received: closing HTTP server');
  server.close(() => {
    debug('HTTP server closed');
  });
  process.exit(0);
})

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);




/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(value: string): number | string | boolean {
  const port = parseInt(value, 10);

  if (isNaN(port)) {
    // named pipe
    return value;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr: string | AddressInfo | null = server.address();
  const bind: string = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr?.port;
  debug('Listening on ' + bind);
  console.log('##########################################################');
  console.log('#####               STARTING SERVER                  #####');
  console.log('##########################################################\n');
  console.log(`Server listening at http://localhost:${port}`);
}
