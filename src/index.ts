import * as express from 'express';
import router from './routes';
import SuperUser from './models/superUser';

const app = express();

app.use(router);

app.get('/', async (req, res) => {
  const superUser = await SuperUser.create(
    new SuperUser('mateus', 'mateus_xa@hotmail.com', 'teste')
  );

  res.send({
    message: 'Welcome to API!',
    superUser: superUser.email,
  });
});

app.listen(3333, () => console.log('server running on port 3333'));
