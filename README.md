frontEnd Mercadon
Este projeto é a entrega de um Desafio Técnico Frontend proposto para o processo seletivo da Instabuy. Ele consiste em uma interface (frontend) simplificado de uma loja, desenvolvido em React com a ferramenta de build Vite. O objetivo principal é demonstrar proficiência na arquitetura React e consumo de APIs, utilizando dados das APIs públicas da Instabuy para exibir banners, uma grade de produtos na Home e uma tela de Detalhes do Produto totalmente funcional e navegável.

Tecnologias Utilizadas
Tecnologia                              Descrição
React                                   Biblioteca JavaScript para construção da interface de usuário.
Vite                                    Ferramenta de build rápida para desenvolvimento e produção.
React Router DOM                        Gerenciamento de rotas e navegação entre páginas (Home e Detalhes).
CSS Modular                             Estilização global (global.css) para o design da loja.
Fetch API                               Comunicação com a API pública da Instabuy.

Configuração e Instalação
Siga os passos abaixo para clonar o repositório e rodar o projeto em sua máquina local.

Pré-requisitos
Você precisa ter o Node.js e o npm (ou Yarn/pnpm) instalados em seu ambiente.

1. Clonar o Repositório

# Caso esteja usando Git:
git clone https://docs.github.com/pt/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github
cd [NOME DA PASTA DO PROJETO]
2. Instalar Dependências
Instale todas as bibliotecas necessárias, incluindo o react-router-dom:

npm install
# Garante a instalação do roteador
npm install react-router-dom
3. Estrutura de Pastas
O projeto utiliza a seguinte estrutura para organização de componentes, rotas e estilos:

Plaintext

src/
├── components/           # (Se tiver Header, Footer, etc.)
├── services/             # Lógica da API (api.js)
├── styles/               # Estilos globais (global.css)
├── pages/                # Componentes de páginas (Home.jsx, ProductDetails.jsx)
└── App.jsx               # Configuração principal e Rotas

▶️ Como Executar o Projeto
Use o script de desenvolvimento do Vite para iniciar o servidor local.

Iniciar o Servidor:

Bash

npm run dev
Acessar: O projeto estará acessível no seu navegador no endereço que o terminal indicar


