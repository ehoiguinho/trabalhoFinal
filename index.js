import express from "express";
import path from "path";
import cookieParser from 'cookie-parser';
import session from 'express-session';

const PORTA = 3000;
const HOST = "0.0.0.0";

const app = express();
app.use(cookieParser());

var lista_usuarios = [];
var mensagens = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "src")));

function reconhecerUsuario(requisicao, resposta, next) {
    if (requisicao.session.usuarioAutenticado) {
      next();
    }
    else {
      resposta.redirect("/login.html");
    }
}

app.use(session({
    secret: "cheetos",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 30
    }
}))

app.post('/login', (requisicao, resposta) => {
    const usuario = requisicao.body.nome;
    const senha = requisicao.body.senha;
    if(usuario==='igor' && senha==='123') {
        requisicao.session.usuarioAutenticado = true;
        resposta.redirect('/');
    } else {
        let erroLogin= (`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Falhou na autenticação!</title>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f8f9fa;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                }
        
                h3 {
                    color: #dc3545;
                }
        
                a {
                    color: #007bff;
                    text-decoration: none;
                }
        
                a:hover {
                    text-decoration: underline;
                }
        
                .container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
            </style>
              </head>
                <body>
                    <h3>Nome de usuário ou senha invalidos!</h3>
                    <a href="/login.html">Voltar para página de login</a>
                </body>
            </html>
           
        `);
        resposta.end(erroLogin);
    }
});

app.post(`/cadastrar`, (requisicao, resposta) => {
  let passou = 10;
    if (requisicao.body.nome.length < 3) {
        passou = 0;
        var conteudo = `
        <!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Usuário</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 80vh;
        }

        .container {
            max-width: 700px;
            width: 150%;
        }

        h1 {
            color: #333;
        }

        form {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
        }

        input {
            width: 100%;
            padding: 10px;
            margin-bottom: 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }

        input[type="submit"] {
            background-color: #4caf50;
            color: #fff;
            cursor: pointer;
        }

        input[type="submit"]:hover {
            background-color: #45a049;

        }
        
        p{
            color: red;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>Cadastro de Usuário</h1>

    <form action="/cadastrar" method="post">
        <label for="nome">Nome:</label>
        <input type="text" id="nome" name="nome"placeholder="Nome de usuário">
                    <p>Necessita de 3 caracteres válidos ou mais!</p>`
    }else{
        var conteudo = `<!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Usuário</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 80vh;
                }
        
                .container {
                    max-width: 700px;
                    width: 150%;
                }
        
                h1 {
                    color: #333;
                }
        
                form {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
        
                label {
                    display: block;
                    margin-bottom: 8px;
                    color: #333;
                }
        
                input {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 16px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
        
                input[type="submit"] {
                    background-color: #4caf50;
                    color: #fff;
                    cursor: pointer;
                }
        
                input[type="submit"]:hover {
                    background-color: #45a049;
                }
            </style>
        </head>
        <body>
        
        <div class="container">
            <h1>Cadastro de Usuário</h1>
        
            <form action="/cadastrar" method="post">
                <label for="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" value ="${requisicao.body.nome}">`
    }
    if(requisicao.body.email.length<10){
        passou = 0;
        conteudo +=`
        <label for="email">E-mail:</label>
        <input type="email" id="email" name="email" value ="${requisicao.body.email}">
        <p>Caracteres inválidos!</p>`
    }else{
      conteudo +=`
      <label for="email">E-mail:</label>
      <input type="email" id="email" name="email" value ="${requisicao.body.email}">`
    }
    if(requisicao.body.idade && requisicao.body.idade>=0){
    conteudo +=`<label for="idade">Idade:</label>
    <input type="number" id="idade" name="idade" value ="${requisicao.body.idade}">

    <button type="submit">Cadastrar</button>
    </form>
    <ul><!-- ListaCadastrados --></ul>
    </div>

  </div>
  </body>
  </html>`
  }else{
    passou = 0;
    conteudo +=`<label for="idade">Idade:</label>
    <input type="number" id="idade" name="idade" value ="${requisicao.body.idade}">
    <p>Este campo está invalido.</p>
    <button type="submit">Cadastrar</button>
</form>
<ul><!-- ListaCadastrados --></ul>
</div>

</div>
</body>
</html>`;
  }if(passou==10){
    
    const user = {
        nome: requisicao.body.nome,
        email: requisicao.body.email,
        idade: requisicao.body.idade
    };

    lista_usuarios.push(user);
    console.log(lista_usuarios);

    resposta.redirect(`/lista`);
  }else{
    resposta.end(conteudo);
  }
});

app.get(`/lista`, reconhecerUsuario,(requisicao, resposta) => {
    let conteudo = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lista de Usuários</title>
            <style>
            </style>
        </head>
        <body>
            <h1>Usuarios cadastrados</h1>
            <table style="width:100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Nome</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Email</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Idade</th>
                    </tr>
                </thead>
                <tbody>`;

    for (const usuario of lista_usuarios) {
        conteudo += `
            <tr style="border: 1px solid #ddd;">
                <td style="padding: 12px;">${usuario.nome}</td>
                <td style="padding: 12px;">${usuario.email}</td>
                <td style="padding: 12px;">${usuario.idade}</td>
            </tr>`;
    }

    conteudo += `
                </tbody>
            </table>
            <div style="margin-top: 20px;">
                <a href="/" style="text-decoration: none; padding: 10px 20px; background-color: #4CAF50; color: white; border-radius: 5px; margin-right: 10px;">Voltar ao Menu</a>
                <a href="/cadastro.html" style="text-decoration: none; padding: 10px 20px; background-color: #008CBA; color: white; border-radius: 5px;">Continuar Cadastrando</a>
            </div>
        </body>
        </html>`;

    resposta.header("Content-Type", "text/html");
    resposta.end(conteudo);
});


app.get(`/`, reconhecerUsuario, (requisicao, resposta) => {
  const ultimaVisita = requisicao.cookies.ultimaVisita || "Não foi visitado anteriormente";
    const data = new Date();
    resposta.cookie("ultimaVisita", data.toLocaleString(), {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true
    })
    resposta.send(` <style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f0f0f0;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    h1 {
        text-align: center;
        color: #333;
    }

    a {
        color: #007bff;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    .instructions {
        text-align: center;
        margin-top: 20px;
        color: #555;
    }

    .button-container {
        text-align: center;
        margin-top: 20px;
    }

    button {
        background-color: #007bff;
        color: white;
        padding: 10px 20px;
        font-size: 16px;
        border: none;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }
    </style>
    <h1><a href="/cadastro.html">Cadastrar usuário</a></h1><br><h1><a href="/chat">Chat</a></h1><br><h2>Ultima visita foi em ${ultimaVisita}</h2>`);
   
});

app.use(session({
  secret: "secreta",
  resave: true,
  saveUninitialized: true,
  cookie: {
      maxAge: 1000 * 60 * 15
  }
}));

app.listen(PORTA, HOST, () => {
    console.log(`Rodando em ${HOST}:${PORTA}`);
});

app.get('/chat', reconhecerUsuario, (requisicao, resposta) => {
    const data = new Date();
    let conteudo = `<!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Chat</title>
      <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80vh;
        flex-direction: column;
      }
  
      .containerPrincipal {
        max-height: 400px; 
        overflow-y: auto; 
    
        /* Estilizando a barra de rolagem */
        scrollbar-width: thin;
        scrollbar-color: #888 #f4f4f4;
      }
    
      .containerPrincipal::-webkit-scrollbar {
        width: 12px;
      }
    
      .containerPrincipal::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 6px;
        border: 3px solid #f4f4f4; 
      }

      .container {
        max-width: 700px;
        width: 100%;
      }
  
      h1 {
        color: #333;
      }
  
      label {
        display: block;
        margin-bottom: 8px;
        color: #333;
      }
  
      select, input, button {
        width: 100%;
        padding: 10px;
        margin-bottom: 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
      }
  
      button {
        background-color: #4caf50;
        color: #fff;
        cursor: pointer;
      }
  
      button:hover {
        background-color: #45a049;
      }
      </style>
    </head>
    <body>

      <h1>Bate-papo</h1>
      <div class="containerPrincipal">`;

    for (const mensagem of mensagens) {
        conteudo += `
        <div class="containerMsg">
            <p>${mensagem.usuario}</p>
            <p class="data">${mensagem.data}</p>
            <p class="mensagem">${mensagem.caracteres}</p>
        </div>
        <hr class="hr">`;
    }

    conteudo += `
      <div class="container">
      </div>
      </div>
      <form action="/mensagem" method="POST">
      <label for="usuario">Selecione o usuário:</label>
      <select id="usuario" name="usuario">
          <option value="" disabled selected>Selecione um usuário</option>`;
      for(let usuario of lista_usuarios){
      conteudo+=`
        <option value="${usuario.nome}">${usuario.nome}</option>`;
      }
      conteudo+=`
      </select>
  
      <label for="mensagem">Digite sua mensagem:</label>
      <input type="text" id="msg" name="msg" placeholder="Digite aqui...">
  
      <button type="submit">Enviar</button>
      </form>      
      <a href="/">Voltar ao menu</a><br>
    </body>
    <script>
    // Função para rolar o scroll para o final
    function rolarParaBaixo() {
      var container = document.querySelector('.containerPrincipal');
      container.scrollTop = container.scrollHeight;
    }
  
    // Chame a função após adicionar as mensagens
    rolarParaBaixo();
  </script>
    </html>`;

    resposta.send(conteudo);
});

app.post('/mensagem', reconhecerUsuario, (requisicao, resposta) => {
    const usuario = requisicao.body.usuario; 
    const msg = requisicao.body.msg; 

    if (usuario && msg) {
        const data = new Date().toLocaleString();

        const novamsg = {
            usuario: usuario, 
            caracteres: msg,
            data: data,
        };

        mensagens.push(novamsg);
        console.log(mensagens)

        resposta.redirect('/chat');
    } else {
        resposta.status(400).send(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Erro</title>
            </head>
            <body>
                <h1 style="color: red; text-align: center; font-family: Verdana">Mensagem inválida</h1>
                </br>
                <div style="text-align: center">
                    <a style="font-family: Verdana; text-decoration: none; color: royalblue" href="/mensagem">Voltar</a>
                </div>
            </body>
            </html>
        `);
    }
});