import * as express from 'express';
import router from './routes';

const app = express();

app.use(router);

app.listen(3333, () => 'server running on port 3333');
