const express = require('express');

const app = express();

// aplicação já está criada, precisa agora ouvir uma porta para que o navegador
// da pra escolher qualquer porta acima de 80 (com exceção de algumas que estão reservadas)
// porta: localhost:3333

// observando o endereço /projects
app.get('/', (request, response) => {
  // return precisa sempre retornar o response (que seria a resposta para o usuário)
  return response.json({message: 'Hello World'}); // send permite retornar um texto
});

//ouvir a porta
app.listen(3333);
