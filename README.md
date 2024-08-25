# Projeto de Encurtador de URLs

## Declarações

Projeto feito para vaga backend Teddy Open Finance.
Adicionei o `.env` apenas para facilitar, mas sei que em uma situação normal não é algo que se faz. Sendo um projeto de entrevista, creio que seja melhor deixar.
Projeto testado em 2 computadores Windows e 2 em Ubuntu (20.04 e 24).

## Requisitos

Docker 27.1.2 (Ubuntu)

### Opcional
NodeJS (versão maior que 18. Caso menor, algumas dependências serão incompatível.)


## Frameworks, Ferramentas e Metodologias

- `NestJS`
- `passport-local`: Middleware de autenticação para `Node.js` que utiliza um nome de usuário e senha.
- `passport-jwt`: Middleware de autenticação para `Node.js` que utiliza `JSON Web Tokens (JWT)` para autenticação baseada em token.
- `eslint`: Ferramenta de linting para `JavaScript` e `TypeScript` que ajuda a encontrar e corrigir problemas no código.
- `prettier`: Ferramenta de formatação de código que garante um estilo consistente em todo o projeto.
- `typescript`: Superset de `JavaScript` que adiciona tipagem estática opcional ao código, ajudando a evitar erros e melhorar a manutenção.
- Microserviço: Arquitetura de software que estrutura uma aplicação como uma coleção de serviços pequenos e independentes, cada um executando um processo único e comunicando-se através de `APIs` bem definidas.
- `API Gateway`: Ponto de entrada único para um conjunto de microserviços, responsável por roteamento de requisições, composição de respostas e outras funcionalidades como autenticação e autorização.
- Código tolerante a falhas: Práticas de desenvolvimento que garantem que o sistema continue funcionando corretamente mesmo quando ocorrem falhas em alguns de seus componentes.
- Controle de acesso baseado no token do usuário e gerenciamento de estado: Mecanismo de segurança que utiliza tokens para verificar a identidade do usuário e gerenciar o estado da sessão, garantindo que apenas usuários autenticados possam acessar recursos protegidos.
- `MySQL` no `TypeORM` com tabelas relacionais.
- `UseGuards` para correta utilização de bearer sem precisar fazer toda a lógica de autenticação a cada request.
- `bcryptjs` para criptografar senhas.
- Github Actions: Criado eslint para a cada commit verificar se existe alguma coisa que faltou. Utilizei o Husky mas rodando no container ficava com problemas.

## Iniciar o Projeto

- Caso `Ubuntu`, rode o `start.sh`, se for `Windows`, rode o `start.bat`.

- Por questões de desenvolvimento, você pode iniciar `./start.sh iniciar-npm` que além de iniciar o composer do banco de dados, iniciará o projeto `Nest` e o `Swagger`. Deixei o console do `docker` attached para ser mais fácil de encerrar o container (simplesmente encerrar o terminal). Aguarde alguns segundos após o container ser inicializado (a depender de sua máquina/internet, levará alguns segundos até o projeto rodar o `npm install`)

- Caso você não utilize o argumento na inicialização, o `docker` inicializará somente com o banco de dados, tendo você que manualmente instalar e iniciar o projeto. Caso inicie o container `Nest`, fiz as configurações de integração que irão apontar o container para o network do `DB`, e caso inicie sem o `Nest`, iniciará de fora apontando para o container.

## Autenticação e Autorização

- Ao criar um link encurtado, é verificado se o usuário está autenticado. Se for, atribui o usuário ao link.
- Se estiver autenticado, consegue deletar, listar e alterar.
- No arquivo `src/url/url.service.ts` tem a propriedade `SHOW_DELETED_URLS=false`, que é definida na `.env`. Se estiver como `true`, ao listar será exibido também os deletados. Se estiver como `false`, não trará na listagem. Essa propriedade foi adicionada apenas caso queira verificar se a lógica está correta, sendo dispensado o uso para a correta utilização.

## Cache

- Não precisa de `REDIS` pois o `TypeORM` tem cache, simples mas o suficiente para o projeto.
- Caso algum endpoint de `post`, `put` ou `delete` seja disparado, os outros invalidam o cache (evitar trazer dado desatualizado).

## Throttle

- Adicionado throttle no request. Você está liberado em fazer 10 requests a cada 10 segundos. Caso seja feito mais que isso, receberá mensagem de erro e ficará impedido de fazer qualquer request por 10 segundos.

## Validação de Requisições

- Adicionado validação caso tente redirecionar a um link. Se não for navegador (dos mais populares), é retornado uma mensagem para fazer o request pelo navegador para ser redirecionado (adicionado isso apenas para fazer graça. Poderia simplesmente retornar a URL para a pessoa colar no navegador).

## Swagger

Para iniciar, faça o cadastro de um usuário pela API `users/register`, depois faça o login no `auth/login` com o email e senha recém cadastrados. Vá ao topo da página, clique no botão `Authorize` e cole o token criado para poder utilizar as funcionalidades de autenticação.<br><br>
Poderia ter feito a lógica de: ao cadastrar, fazer automaticamente o login.
Optei por não fazer assim para deixar separado e ficar simples o entendimento, mas essa mudança é extremamente fácil, sendo necessário apenas chamar o endpoint de login passando o `email` e a `senha` no request, sem segredo algum.

Swagger URL: http://localhost:3000/api

## Melhorias

- Adicionar DTO. Não adicionei para justamente retornar o response completo para melhor validação.
- Adicionar logs.
- Popular o banco inicialmente (já fiz utilando o próprio docker compose. Crio um arquivo com as querys, o container é executado, meu arquivo de query é passado para o container e executado, populando o banco)