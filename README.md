# 🚀 Júlio Caliberda | Portfolio

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://portifolio.caliberda.com.br)
[![Testing](https://img.shields.io/badge/tests-property--based-blue.svg)](#-testes)

Este é o repositório do meu portfólio profissional, posicionado como **Tech Product Manager** e **orquestrador de IA**: dirijo IA para construir produtos reais, do primeiro rascunho ao deploy.

🔗 **Acesse agora:** [portifolio.caliberda.com.br](https://portifolio.caliberda.com.br)

Versões anteriores continuam disponíveis, mantidas por transparência mas sem divulgação ativa: `/v1` (a original) e `/v2` (a segunda versão, estilo HUD).

---

## 🛠️ Tecnologias e Ferramentas

### Frontend
- **HTML5 & CSS3**: Estrutura semântica e estilização com variáveis CSS, sem frameworks.
- **Vanilla JavaScript**: Toda a interação (filtros, busca, modal, tema claro/escuro, animações) sem dependências pesadas.
- **Google Fonts (Press Start 2P, Silkscreen)**: Tipografia com pele pixel/voxel.
- **Font Awesome**: Ícones vetoriais.

> A versão anterior (`/v2`) usa uma identidade visual de HUD tecnológico (Space Grotesk, Inter, JetBrains Mono). A primeira versão (`/v1`) usa uma stack diferente: Tailwind CSS (via CDN) e Vanilla JS com galerias e cursor personalizado.

### Qualidade e Testes
- **Node.js Test Runner**: Execução de testes nativa.
- **Fast-check**: Implementação de **Property-based Testing** para garantir que a interface se comporte corretamente em qualquer cenário.
- **JSDOM**: Simulação de ambiente de navegador para testes de integração de componentes HTML/CSS.

### Performance e Deploy
- **Vercel**: Hospedagem e deploy contínuo.
- **Vercel Speed Insights**: Monitoramento de performance real e experiência do usuário.

---

## ✨ Características Principais

- **Design Premium**: Identidade visual pixel/voxel, cantos em bisel e animações micro-interativas.
- **Tema claro/escuro**: Alternância com transição animada (eclipse), padrão escuro.
- **100% Responsivo**: Adaptado para dispositivos móveis, tablets e desktops.
- **SEO Optimized**: Meta tags configuradas para compartilhamento em redes sociais (Open Graph e Twitter Cards).
- **Acessibilidade**: Foco em contraste e semântica.

---

## 📂 Estrutura do Projeto

```text
├── index.html           # Ponto de entrada principal (versão atual, estilo pixel/voxel)
├── css/portcraft.css     # Estilização da versão atual
├── js/portcraft.js       # Lógica da versão atual
├── julio.jpg             # Foto compartilhada entre as versões
├── favicon.svg           # Favicon da versão atual
├── v1/                   # Primeira versão do portfólio, mantida acessível em /v1
│   ├── index.html       # Ponto de entrada da v1 (não divulgada, mas acessível)
│   ├── css/style.css
│   ├── js/               # script.js, gallery.js, scroll-lock.js, tailwind-config.js
│   ├── assets/           # Imagens e recursos estáticos da v1
│   └── tests/            # Suíte de testes de propriedade (fast-check) da v1
├── v2/                   # Segunda versão (estilo HUD), mantida acessível em /v2
│   ├── index.html
│   ├── css/style.css
│   ├── js/script.js
│   ├── julio.jpg
│   └── favicon.svg
├── package.json          # Dependências e scripts de teste (apontam para v1/tests)
└── vercel.json           # Configurações de deploy na Vercel (rewrite de /v1 e /v2)
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
