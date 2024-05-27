const express = require('express');
const app = express();
const port = 3000;

// Aqui se cria paginas.
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
	console.log(`Servidor rodando na http://localhost:${port}`);
});