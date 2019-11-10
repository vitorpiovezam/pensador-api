import { Phrase } from './entities/phrase.model';
import { PensadorService } from './services/pensador.service';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser());

app.get('', (req, res) => {
  console.log('');
});

app.get('/:artist', async (req, res) => {
  const author: string = req.params.artist;
  const phrase: Phrase = await new PensadorService().returnRandomPhraseFrom(author);

  res.send(phrase.text);
});

app.listen(port, () => {
  console.log('Listeing on port ' + port);
});

