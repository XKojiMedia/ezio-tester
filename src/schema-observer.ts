import { Request, Response } from 'express';

export const graphqlEventStream = ({ streamPath = '/stream' } = {}) => {
  return (req: Request, res: Response) => {
    const sse = (str = '') => {
      res.write(str);
      res.flushHeaders();
    };
    const cleanup = () => {
      // tslint:disable-next-line
      console.log('Cleaning up...');
      res.end();
    };

    // If current request is for the stream, setup the stream.
    if (req.path === streamPath) {
      if (req.headers.accept !== 'text/event-stream') {
        res.statusCode = 405;
        res.end();
        return;
      }

      // tslint:disable-next-line
      console.log('stream requested.');
      // Making sure these options are set.
      req.socket.setTimeout(0);
      req.socket.setNoDelay(true);
      req.socket.setKeepAlive(true);

      // Set headers for Server-Sent Events.
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      sse('event: open\n\n');

      req.on('close', cleanup);
      req.on('finish', cleanup);
      req.on('error', cleanup);
      return;
    }

    res.setHeader('X-GraphQL-Event-Stream', streamPath);
    if (req.next) {
      return req.next();
    }
  };
};
