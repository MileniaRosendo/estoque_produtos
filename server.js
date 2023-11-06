const express = require('express');
const bodyParser = require('body-parser');
const rotas = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use('/', rotas);

app.listen(3000, () => {
  console.log('Servidor executando na porta 3000');
});
