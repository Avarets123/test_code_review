import mysql from 'mysql2/promise';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { DatabaseService } from './services/database.service';
import { EmailService } from './services/email.service';
import { RepositoryService } from './services/repository.service';
import { UserService } from './services/user.service';
import { PutUsersController } from './controllers/put-users.controller';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || '3306',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'main',
  waitForConnections: true,
  connectionLimit: process.env.MYSQL_CONNECTION_LIMIT || 100,
  queueLimit: 0,
});

const databaseService = new DatabaseService(pool);
const emailService = new EmailService();
const repositoryService = new RepositoryService({
  databaseService,
});

export const userService = new UserService({
  repositoryService,
  emailService,
});

const app = new Koa();

app.use(bodyParser({
  extendTypes: {
    json: ['application/x-javascript'],
  },
}));
app.use(async (ctx, next) => {
  ctx.userService = userService;

  return next();
});
app.use(PutUsersController);
// app.use(PutUsersControllerExample(userService));

const PORT = process.env.PORT || '4000';

export const httpServer = app.listen(PORT);
console.log('App has been started on port: ' + PORT);
httpServer.on('close', async () => {
  await pool.end();
});
