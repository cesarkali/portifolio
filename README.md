# 🚀 Júlio Caliberda | Portfolio

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://portifolio.caliberda.com.br)
[![Testing](https://img.shields.io/badge/tests-property--based-blue.svg)](#-testes)

Este é o repositório do meu portfólio profissional, posicionado como **Analista de Sistemas** e **orquestrador de IA**: dirijo IA para construir produtos reais, do primeiro rascunho ao deploy.

🔗 **Acesse agora:** [portifolio.caliberda.com.br](https://portifolio.caliberda.com.br)

Versões anteriores continuam disponíveis, mantidas por transparência mas sem divulgação ativa: `/v1` (a original), `/v2` (estilo HUD) e `/v3` (Portcraft, pixel/voxel).

---

## 🛠️ Tecnologias e Ferramentas

### Frontend
- **HTML5 & CSS3**: Estrutura semântica e estilização com variáveis CSS, sem frameworks.
- **Vanilla JavaScript + Canvas 2D**: loader em pontinhos, retrato em meio-tom com física de molas, animação de cada projeto, filtros, busca e tema claro/escuro.
- **Lenis**: rolagem suave.
- **Google Fonts (Archivo, IBM Plex Mono)**: mesmo sistema visual do hub caliberda.com.br.
- **Font Awesome e Simple Icons**: ícones.

> `/v3` usa a pele pixel/voxel (Press Start 2P, Silkscreen), `/v2` uma identidade de HUD tecnológico (Space Grotesk, Inter, JetBrains Mono) e `/v1` Tailwind CSS (via CDN) com galerias e cursor personalizado.

### Qualidade e Testes
- **Node.js Test Runner**: Execução de testes nativa.
- **Fast-check**: Implementação de **Property-based Testing** para garantir que a interface se comporte corretamente em qualquer cenário.
- **JSDOM**: Simulação de ambiente de navegador para testes de integração de componentes HTML/CSS.

### Performance e Deploy
- **Vercel**: Hospedagem e deploy contínuo.
- **Vercel Speed Insights**: Monitoramento de performance real e experiência do usuário.

---

## ✨ Características Principais

- **Mesmo padrão do hub**: papel/tinta + azul ultramar, hairlines e tipografia de largura variável.
- **Loader em pontinhos**: a porcentagem é um painel de pontos que conta de 0 a 100; no fim, os pontos pousam e formam o retrato.
- **Retrato em meio-tom**: a foto vira pontos (máscara do fundo, nitidez e contraste) e, ao rolar, os pontos voam até o menu e viram o mini-retrato e o favicon.
- **Cada projeto no próprio tema**: o palco do índice mostra a animação do projeto com as cores dele.
- **Tema escuro/claro**: escuro por padrão, troca com transição circular (View Transitions).
- **100% Responsivo**: Adaptado para dispositivos móveis, tablets e desktops.
- **SEO Optimized**: Meta tags configuradas para compartilhamento em redes sociais (Open Graph e Twitter Cards).
- **Acessibilidade**: Foco em contraste e semântica.

---

## 📂 Estrutura do Projeto

```text
├── index.html            # Versão atual (padrão "Índice", igual ao hub)
├── style.css             # Estilos da versão atual
├── app.js                # Loader, retrato em pontinhos, índice de projetos, tema
├── projetos.js           # Dados de todos os projetos (texto, stack, links, tema)
├── specimens.js          # Animação em canvas de cada projeto (cópia do hub + extras)
├── julio.jpg             # Foto usada no retrato e no og:image
├── favicon-32.png, favicon-180.png, apple-touch-icon.png
├── v1/                   # Primeira versão (Tailwind), acessível em /v1
│   └── tests/            # Suíte de testes de propriedade (fast-check) da v1
├── v2/                   # Segunda versão (HUD), acessível em /v2
├── v3/                   # Terceira versão (Portcraft, pixel/voxel), acessível em /v3
├── package.json          # Dependências e scripts de teste (apontam para v1/tests)
└── vercel.json           # Rewrites de /v1, /v2 e /v3
```

---

## 🚀 Como Executar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/cesarkali/portifolio.git
   cd portifolio
   ```

2. **Instale as dependências (para desenvolvimento e testes):**
   ```bash
   npm install
   ```

3. **Abra o projeto:**
   Basta abrir o arquivo `index.html` no seu navegador ou usar uma extensão como o *Live Server*.

---

## 🧪 Testes

A suíte de testes de propriedade (fast-check) valida a versão anterior (`/v1`), preservada em `v1/tests`.

Para rodar todos os testes:
```bash
npm run test:all
```

Scripts disponíveis:
- `npm run test:hero`: Testa a seção principal.
- `npm run test:projects`: Valida a integridade da galeria de projetos.
- `npm run test:skills`: Verifica a renderização dos pilares de habilidades.
- `npm run test:about`: Valida a seção "Sobre mim".

---

## 📧 Contato

- **Email:** [julio@caliberda.com.br](mailto:julio@caliberda.com.br)
- **LinkedIn:** [linkedin.com/in/cesarkali](https://linkedin.com/in/cesarkali)
- **GitHub:** [@cesarkali](https://github.com/cesarkali)
- **Instagram:** [@cesar.kali](https://www.instagram.com/cesar.kali/)

---

Desenvolvido com ☕ e ✨ por **Júlio Caliberda**.
