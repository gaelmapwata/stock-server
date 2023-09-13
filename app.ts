import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import http from 'http'
import expressFormData from 'express-form-data';
import os from 'os';
import cors from 'cors';
import path from 'path';

/**
 * Create express instance and initialize dotenv
 */

dotenv.config();
const app: Express = express();
const server = http.createServer(app);

/**
 * Middleware
 */

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors({
  origin: '',
}));
app.use((_, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept',
  );
  next();
});

/**
 * Express-form-data
 */

const options = {
  uploadDir: os.tmpdir(),
  autoClean: true,
};
app.use(expressFormData.parse(options));


/**
 * Bind router to app
 */

app.use('/', (req: Request, res: Response) => {
  res.send('HELLO WORD !!');
});


/**
 * Run server
 */

const port = process.env.NODE_SERVER_PORT;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`app listening on port ${port}`);
});
