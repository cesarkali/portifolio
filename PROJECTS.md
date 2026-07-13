# 📦 Dossiê Completo de Projetos — Júlio Caliberda

> Documentação consolidada de **todos** os repositórios da conta [`cesarkali`](https://github.com/cesarkali) — públicos e privados.
> Gerado a partir da API do GitHub (READMEs completos + metadados) em **13/07/2026**.

**Totais:** 25 repositórios · 10 públicos · 15 privados · 0 forks · 0 arquivados
**Legenda:** 🌐 público · 🔒 privado · 🔗 deploy ao vivo

---

## 📑 Sumário

- [💼 SaaS & Aplicações de Negócio](#-saas--aplicações-de-negócio)
  - [Financial Kali (Financial-Pro)](#-financial-kali--financial-pro)
  - [PMTT — Product Manager Time Tracker](#-pmtt--product-manager-time-tracker)
  - [Eatz — Cardápio Digital & Painel (controle-pedidos)](#-eatz--cardápio-digital--painel-de-gestão-controle-pedidos)
  - [Hotel PMS — Módulo de Check-in (Modal-Checkin)](#-hotel-pms--módulo-de-check-in-modal-checkin)
  - [Kali-Dash](#-kali-dash)
- [🍔 Ecossistema Eatz — Tablets & Totens](#-ecossistema-eatz--tablets--totens)
  - [Eatz-Tablet (Kotlin / Compose)](#-eatz-tablet--kotlin--jetpack-compose)
  - [eatz_tablet_flutter (Flutter)](#-eatz_tablet_flutter--flutter)
- [🛠️ Ferramentas & Produtividade com IA](#️-ferramentas--produtividade-com-ia)
  - [FlowVoice (Flow-Voice)](#-flowvoice-flow-voice)
  - [Semantic Tab Grouper](#-semantic-tab-grouper)
  - [CNPJ API (ccnpj)](#-cnpj-api-ccnpj)
- [🎮 Jogos](#-jogos)
  - [AFÓTICA](#-afótica-afotica)
  - [Kessler Cascade](#-kessler-cascade)
  - [Neon Strike](#-neon-strike-neonstrike)
- [🌐 Sites, Landing Pages & Showcases](#-sites-landing-pages--showcases)
  - [CS2 Mix Balancer (cs2mix)](#-cs2-mix-balancer-cs2mix)
  - [Minecraft Modpack HotDorgs (minecraft)](#-minecraft-modpack-hotdorgs-minecraft)
  - [karolzk · titon · TesteOtelia · Bitz-Loader](#-outros-sites--landing-pages)
- [👤 Portfólio & Perfil](#-portfólio--perfil)
- [🧪 Experimentos & Bases](#-experimentos--bases)
- [📊 Tabela geral (25 repositórios)](#-tabela-geral-25-repositórios)

---

# 💼 SaaS & Aplicações de Negócio

## 💎 Financial Kali · `Financial-Pro`
🔒 privado · 🔗 [kali.caliberda.com.br](https://kali.caliberda.com.br) · **172 commits · 10 releases** · criado em 03/04/2026

Ecossistema de gestão financeira pessoal de alta performance, com estética "Obsidian Dark" para oferecer visibilidade total e privacidade absoluta sobre o patrimônio. **Código aberto e gratuito** (LGPD; dados processados localmente, nunca usados para treino de IA). Multiplataforma: **Web (React 19 + Vite)** e **Android nativo (React Native + Expo SDK 54)**, ambos sobre Firebase.

**Funcionalidades de destaque (v4.1.0):**
- **Multi-empresa**: bases isoladas (Pessoal, Empresa, Projetos), replicação de categorias entre bases, logos customizados por empresa e seleção mandatória de contexto no login.
- **Finn IA**: assistente financeiro com **voz** (Groq Whisper-large-v3), **visão** (filtro de foco financeiro), rotação resiliente de API Keys (Groq/Gemini) e histórico isolado por sessão.
- **Gestão de lançamentos**: histórico segregado (A Pagar / A Receber / Pago), baixa unificada em lote, parcelamento inteligente (edita parcela ou série) e filtros avançados.
- **BI financeiro**: dashboards de Fluxo de Caixa, Evolução de Patrimônio, tendência por categoria, 6 KPIs com variação mês a mês.
- **Privacidade**: Modo Stealth (oculta valores), Google Identity Sync, cleanup recursivo na exclusão de conta, zero chaves hardcoded.
- **UI**: Glassmorphism, fundo animado "Constellation Canvas" (rede neural reativa no login), animações stagger em cascata.

**Stack:** React 19 · Vite 8 · Tailwind · Firebase (Firestore + Auth) · Groq (Llama 3.3 70B + Whisper v3) · Google Gemini 1.5 Flash | Android: React Native 0.81.5 · Expo SDK 54 · NativeWind v4 · EAS Build (`com.cesarkali.financialpro`)
**CI/CD:** push em `main` → GitHub Actions → build → injeção de changelog no Firestore → deploy Vercel.

> 🌐 **Vitrine pública:** `Financial-Kali-Showcase` (repo público espelho, deploy no mesmo domínio).

---

## ⏱️ PMTT — Product Manager Time Tracker
🌐 público · 🔗 [pmtt.caliberda.com.br](https://pmtt.caliberda.com.br) · **21 commits** · criado em 02/07/2026

Sistema de gestão de tempo pensado para product managers e funções que absorvem muito "trabalho invisível". Registra com precisão onde o tempo é gasto por categoria e transforma isso em evidência concreta (dashboard + exportação) para justificar prioridades e carga de trabalho. Tem também **extensão do Chrome** publicada na Chrome Web Store.

**Funcionalidades de destaque:**
- **Cronômetro em tempo real** vinculado a categoria, tempo calculado pelo servidor (sobrevive a refresh), troca de categoria salva o registro anterior atomicamente, atalhos 1–9, ajuste retroativo do início e pausar/retomar (tempo pausado descontado).
- **Página "Hoje"**: linha do dia com blocos coloridos por categoria e lacunas clicáveis que pré-preenchem o lançamento manual.
- **Lembrete "cadê o cronômetro?"** dentro do expediente configurado, com toast + notificação do navegador.
- **Categorias 100% customizáveis**: CRUD, ícone/cor (paleta testada para daltonismo), área de negócio, atalho de teclado, ordenação drag-and-drop; 13 categorias padrão no primeiro login.
- **Tasks vinculadas** (Jira / Movidesk / Link) com pontuação de complexidade (Fibonacci) e marcação automática de "task criada".
- **Dashboard com evidências**: KPIs com comparação vs. período anterior, composição por área, mapa de calor semana × hora, ritmo de trabalho, exportação em PDF com resumo executivo em narrativa automática.
- 11 temas, densidade/raio configuráveis, seletores de data/hora 100% customizados, tour guiado, changelog na sidebar, página de Atividade com restauração de registros excluídos.

**Stack:** Next.js (App Router, TS) · Firebase (Auth + Firestore, autorização via Security Rules por `uid`) · Tailwind · shadcn/ui (`@base-ui/react`) · Recharts · react-hook-form · zod · date-fns · Vercel.

---

## 🍽️ Eatz — Cardápio Digital & Painel de Gestão · `controle-pedidos`
🔒 privado · **1 commit** (repo recente, 24/06/2026) · maior codebase (~21 MB)

Sistema completo para restaurantes: **dois frontends Next.js** integrados à **API Eatz** (NestJS + PostgreSQL, repositório separado, porta 3331).

| Projeto | Diretório | Porta | Descrição |
|---|---|---|---|
| Cardápio Digital (cliente) | `/` | 3000 | Cardápio, carrinho, pedido |
| Painel de Gestão (admin) | `cardapio-digital-gestao/` | 3001 | Pedidos, delivery, produtos |

**Cardápio (cliente):** listagem com filtro/busca em tempo real, grid responsivo, skeleton loaders, badges (`promoção`/`mais-vendido`/`novo`), modal com adicionais/modificadores, carrinho lateral + flutuante mobile, dark/light persistido, checkout e acompanhamento de status. Acesso multi-tenant via `?empresa_token=TOKEN`.

**Painel de Gestão:** login JWT (jose), middleware protegendo `/gestao/*` via cookie `eatz_token`, troca de empresa ativa. Módulos: dashboard (polling 30s), pedidos (kanban), delivery em tempo real, mesas, produtos, categorias, modificadores, KDS, caixa, relatórios, configurações.

**Stack:** Cardápio → Next.js 16 · React 19 · TS 5.7 · Tailwind 4 · shadcn/ui · Sonner · Vercel Analytics | Gestão → Next.js 15.3 · jose (JWT). Documenta mapeamento completo de entidades/status e roadmap (WebSocket, KDS, impressão).

---

## 🏨 Hotel PMS — Módulo de Check-in · `Modal-Checkin`
🔒 privado · 🔗 [modal.caliberda.com.br](https://modal.caliberda.com.br) · **76 commits** · criado em 26/03/2026

Módulo de check-in de um sistema Hotel PMS, com foco em UX premium e responsividade total. Modal full-screen no mobile e centralizado no desktop, com navegação por seções via **ScrollSpy** e highlight ciano na seção ativa.

**10 seções do modal:** Hospedagem · Faturamento · Acompanhantes · Tarifas · Recebimentos · Refeições · Veículos · Extras · Pulseiras · Anexos.
**FNRH Digital** completo (titular + acompanhantes) com CEP automático via ViaCEP; financeiro com estados Troco / Em Aberto / Quitado; autocompletar com navegação por teclado; design system HSL documentado (primário, accent, success, warning…).

**Stack:** React 18 + Vite · TypeScript · Tailwind 3.4 · shadcn/Radix · TanStack Query · React Hook Form + Zod · React Router. Deploy automático via GitHub Actions → GitHub Pages.

---

## 📊 Kali-Dash
🔒 privado · **1 commit** · criado em 10/05/2026 · sem README publicado

Dashboard (HTML). Ainda sem documentação — conteúdo a detalhar. **Candidato a receber um README dedicado.**

---

# 🍔 Ecossistema Eatz — Tablets & Totens

Dois apps de autoatendimento para restaurantes, além do sistema web `controle-pedidos` acima. Mesma marca (vermelho Eatz `#E31E24`, Bitz Softwares), duas implementações mobile diferentes.

## 📱 Eatz-Tablet — Kotlin / Jetpack Compose
🔒 privado · 🔗 [cardapio.caliberda.com.br](https://cardapio.caliberda.com.br) · **23 commits** · criado em 25/04/2026 · README mais completo do acervo (15 KB)

Cardápio digital self-service para **tablets Android nativos** (Jetpack Compose), landscape. Configurável por painel admin embutido (acesso por PIN) em runtime, sem novo build.

**Funcionalidades:** Home com carrossel de promoções; cardápio com scroll contínuo e sidebar animada com auto-scroll; carrinho (side sheet); extrato com taxa de serviço configurável; status do pedido em tempo real; chamar garçom (POST API); screensaver por inatividade; modo quiosque (segurar logo 5s + PIN); wizard de setup; leitura de QR Code (ZXing); tema claro/escuro (DataStore); dados mockados (13 categorias, ~90 produtos).

**Arquitetura:** MVVM limpo (UI Compose → ViewModels StateFlow → Repositories → Remote/DataStore). Koin (DI), Retrofit, Coil (com OkHttp `followRedirects` para CDNs). **Padrão Proxy** no repositório: `ProxyMenuRepository` decide Mock vs. Remote em runtime pelo DataStore. Requer Android Studio Hedgehog+, JDK 17, SDK API 35.

## 🤖 eatz_tablet_flutter — Flutter
🔒 privado · **8 commits** · criado em 25/05/2026

Reimplementação do totem de autoatendimento em **Flutter** (Dart), para tablets/totens 7–10" (1280×800, landscape, Android 5.0+/iOS 12+).

**Funcionalidades:** wizard com vínculo por QR Code (`mobile_scanner`) ou IDs manuais; modo mock offline; cardápio com abas laterais e cache de imagens (`cached_network_image`); customização avançada de produtos com cálculo dinâmico; status tracker; identificação NFC-e; modo imersivo (kiosk lock nativo); painel admin por PIN; screensaver.

**Arquitetura:** feature-oriented (`core` / `data` / `logic` / `presentation`). Riverpod v2 (estado), Dio (HTTP), SharedPreferences (persistência), `build_runner` (codegen). Configuração de fábrica via `--dart-define`. Também compila para Web (WASM).

---

# 🛠️ Ferramentas & Produtividade com IA

## 🎙️ FlowVoice · `Flow-Voice`
🌐 público · 🔗 [flowvoice.caliberda.com.br](https://flowvoice.caliberda.com.br) · **36 commits · 15 releases** (mais ativo em releases) · v1.9.2 · criado em 07/06/2026

Utilitário de produtividade para **Windows e Ubuntu** que roda na bandeja e permite ditar texto por voz em qualquer campo do sistema. O áudio é capturado, transcrito por IA e opcionalmente polido/corrigido antes de ser colado no cursor. Extremamente leve (~30 MB RAM, <1% CPU ocioso).

**Funcionalidades:** atalho global (`Ctrl+Shift+Space`); 3 modos de polimento (Profissional / Casual / Direto); **tradução por voz** (`Ctrl+Shift+Y`) para EN/ES/FR/DE/IT; **pesquisa web por voz** (`Ctrl+Shift+U`) via Tavily + chat interativo; **failover pool** de provedores (Gemini, OpenAI, Groq, GitHub Models); **transcrição 100% offline** via Whisper local (GPU/CPU); i18n (PT/EN/ES ao vivo); wizard de 4 etapas; proteção de chaves por senha; auto-update horário.

**Stack:** Python 3.10+ · PySide6 (UI) · sounddevice · pynput · Whisper local. Empacotamento: PyInstaller + **Inno Setup** (Windows `.exe`) e `.deb` (Ubuntu). Site estático próprio na Vercel.
**Módulos:** `main.py` (UI/hotkeys/cola), `ai_processor.py` (IA), `config.py`, `recorder.py`, `hotkey.py`, `paster.py`, `i18n.py`, `updater.py`.

## 🗂️ Semantic Tab Grouper
🌐 público · 🔗 [stg.caliberda.com.br](https://stg.caliberda.com.br) · **9 commits** · criado em 12/07/2026

Extensão de navegador (Manifest V3) que agrupa abas automaticamente pelo **assunto** do conteúdo — não só pelo domínio — com um modelo de IA rodando **inteiramente no navegador**, sem backend e sem enviar dados de navegação.

**Como funciona:** Readability.js extrai o conteúdo principal → embedding de 384 dims (`Xenova/all-MiniLM-L6-v2` via WASM em offscreen document) → similaridade de cosseno entre abas → sugestão de grupo. Modos `semantic` / `domain` / `hybrid`. Privacidade total (processamento local, sem telemetria; modelo ~25 MB baixado uma vez). Compatível com Chromium 109+ (Chrome, Edge, Brave, Opera, Vivaldi).

**Stack:** Vite + `@crxjs/vite-plugin` · `@xenova/transformers` · `@mozilla/readability`.

## 🏢 CNPJ API · `ccnpj`
🌐 público · 🔗 [ccnpj.caliberda.com.br](https://ccnpj.caliberda.com.br) · **7 commits** · criado em 02/06/2026

API REST para consulta de dados cadastrais de empresas brasileiras a partir do **CNPJ**, agregando múltiplas fontes (Minha Receita, ReceitaWS). Endpoint `GET /api/v1/{cnpj}` (normaliza pontuação), retorna razão social, QSA, CNAEs, regime tributário, endereço, situação cadastral etc. em JSON.

**Stack:** FastAPI · Requests · deploy serverless na Vercel. Roda localmente com `uvicorn api:app --reload`.

---

# 🎮 Jogos

Três jogos web autorais, todos **100% procedurais, sem assets externos, sem dependências** — física, gráficos (WebGL2/Canvas) e áudio (Web Audio API) gerados em tempo real por código.

## 🌑 AFÓTICA · `Afotica`
🌐 público · 🔗 [afotica.caliberda.com.br](https://afotica.caliberda.com.br) · criado em 05/07/2026

> *"Onde a luz não chega, o som enxerga."*

Você é uma criatura bioluminescente descendo uma caverna abissal onde o mundo só existe quando um som o atravessa. Cada eco desenha as paredes… e anuncia sua posição para predadores que caçam de ouvido. Triângulo de tensão: **som é visão · som é perigo · silêncio é fome**.

**Proeza técnica:** resolve a **equação de onda de verdade na GPU** (`u' = 2u − u_prev + c²∇²u` em fragment shader WebGL2, grid 512×512 ping-pong RGBA16F, 360 passos/s, contorno de Neumann para reflexão nas paredes). Audição analítica sincronizada com a imagem (predadores ouvem no mesmo instante em que a onda chega). Memória de eco, cavernas procedurais (fBm → autômato celular → BFS → SDF), áudio 100% sintetizado (14 raios geométricos por ping), criaturas sem sprites (fitas luminosas), pipeline HDR com bloom + ACES. ~3.500 linhas de JS clássico que rodam até via `file://`. Suíte de testes headless (Puppeteer, 30 checks + screenshots).

## 🌀 Kessler Cascade
🌐 público · 🔗 [kessler.caliberda.com.br](https://kessler.caliberda.com.br) · **3 commits** · criado em 05/07/2026

> *"Você não tem armas — a gravidade é a sua arma."*

Arena shooter roguelike: você é uma singularidade que **captura** inimigos, asteroides e projéteis, mantém tudo em órbita e **arremessa** de volta (dano ∝ massa × velocidade). 6 tipos de inimigo, boss "Couraçado" a cada 5 ondas, 16 upgrades em 3 raridades, combo e recorde local. Todo em português.

**Proeza técnica:** renderizador WebGL2 próprio (batch único de sprites por SDF, milhares em 1 draw call; blend premultiplicado unificado; HDR + bloom; **lente gravitacional em shader** distorcendo a imagem em até 8 poços simultâneos). 0,33 ms/frame com boss + 17 inimigos + 6.000 partículas. Áudio procedural com trilha generativa de intensidade dinâmica. Spatial hash O(n), aim assist gravitacional, loop determinístico para testes. 13 scripts clássicos sem bundler.

## 👾 Neon Strike · `neonstrike`
🔒 privado · 🔗 [neonstrike.caliberda.com.br](https://neonstrike.caliberda.com.br) · **5 commits** · criado em 12/05/2026

Jogo arcade de sobrevivência cibernética (estética cyberpunk/retro-futurista) da Caliberda. Evolução da nave (level up), dificuldade progressiva e **ranking global em tempo real** (Firebase Realtime Database).

**Stack:** HTML5 Canvas API (render), Vanilla JS ES6+ (engine/física), Tailwind via CDN (UI), **Web Audio API** (BGM e SFX sintetizados, sem arquivos de áudio), Firebase RTDB (leaderboard). App single-file (`index.html`).

---

# 🌐 Sites, Landing Pages & Showcases

## 🔫 CS2 Mix Balancer · `cs2mix`
🔒 privado · 🔗 [www.caliberda.com.br/cs2mix](https://www.caliberda.com.br/cs2mix) · **38 commits** · criado em 09/05/2026

Organizador de partidas (Mix/Scrim) de Counter-Strike 2 com **balanceamento matemático** (menor diferença de rating médio entre times, via Rating do Leetify) e **modo IA** (Google Gemini 2.5 Flash): Coach IA prevê probabilidade de vitória e dá dicas táticas. Multiplayer em tempo real via Firebase (Firestore + Auth anônimo), painel admin embutido, formatação pronta para Discord. Single-file (`index.html`). Patrocínio: Hotdorgs.

**Stack:** HTML5 · JS ES6+ · Tailwind (CDN) · Firebase · Gemini 2.5 Flash (REST) · FontAwesome.

## ⛏️ Minecraft Modpack HotDorgs · `minecraft`
🔒 privado · 🔗 [minecraft.caliberda.com.br](https://minecraft.caliberda.com.br/) · **17 commits** · criado em 10/05/2026

Landing page para download/instalação do modpack de Minecraft do HotDorgs. Terreno voxel procedural animado em canvas (Distant Horizons), tutoriais separados (Original/Pirata), download via CurseForge, vídeo integrado, informações de servidor e links de comunidade.

**Stack:** HTML5 · CSS3 (animações) · Vanilla JS · **Lenis** (smooth scroll) · fontes Press Start 2P/Silkscreen/Inter · Vercel.

## 🧩 Outros sites & landing pages

| Repo | Visib. | Deploy | Estado |
|---|:---:|---|---|
| **karolzk** | 🔒 | [karolzk.com.br](https://karolzk.com.br) | Creator Hub B2C (linktree avançado + streaming) para Karol ZK. **13 commits.** Sem README. |
| **titon** | 🔒 | [isatiton.com.br](https://isatiton.com.br) | Creator Hub B2C para Isa Titon. **28 commits.** Sem README. |
| **TesteOtelia** | 🔒 | [script.caliberda.com.br](https://script.caliberda.com.br) | Página de teste. **4 commits.** Sem README. |
| **Bitz-Loader** | 🌐 | — | Componente/loader visual (CSS). **1 commit.** Sem README. |

> `karolzk` e `titon` são citados no perfil como **Creator Hubs B2C** (plataformas linktree avançadas com streaming integrado). Documentação própria pendente.

---

# 👤 Portfólio & Perfil

## 🚀 portifolio
🌐 público · 🔗 [portifolio.caliberda.com.br](https://portifolio.caliberda.com.br) · **51 commits** · criado em 17/02/2026 (repo mais antigo)

Portfólio profissional posicionando Júlio como **IA Developer, Product Manager e Especialista em Automação**. Design premium (glassmorphism, mesh gradients, cursor dinâmico, efeito noise), 100% responsivo, SEO/Open Graph, modo de impressão para currículo em PDF.

**Diferencial técnico:** **Property-based Testing** com fast-check + JSDOM + Node Test Runner (testes por seção: hero, projects, skills, about). Vercel + Speed Insights.
**Stack:** HTML5/CSS3 · Tailwind · Vanilla JS.

## 🏠 caliberda-home
🔒 privado · 🔗 [www.caliberda.com.br](https://www.caliberda.com.br) · **46 commits** · criado em 09/05/2026 · *(projeto deste workspace)*

Hub/homepage central do ecossistema Caliberda (`index.html` ~2.100 linhas). Sem README publicado ainda.

## 🩸 cesarkali (Profile README)
🌐 público · **10 commits** · criado em 19/05/2026

README de perfil do GitHub. Posiciona Júlio como **Tech Product Manager | AI-Augmented Architect** ("não sou um dev tradicional; atuo como Tech PM e Arquiteto guiado por IA"). Foco em orquestração de IA, Product Ops, automações (n8n) e UI/UX premium. Traz o "Ecossistema de Produtos" (Financial Kali, Modal Check-in, CNPJ API, FlowVoice, Creator Hubs, CS2 Optimizer, Minecraft, Neon Strike), stack (JS/TS/React/Next/Tailwind/Node/n8n/Figma/AWS/Docker/Linux/Git) e stats do GitHub.

## 💎 Financial-Kali-Showcase
🌐 público · 🔗 [kali.caliberda.com.br](https://kali.caliberda.com.br) · **2 commits** · criado em 19/05/2026

Vitrine pública do Financial Kali (espelho de apresentação do `Financial-Pro`). Mesmo domínio de deploy.

---

# 🧪 Experimentos & Bases

| Repo | Visib. | Stack | Estado |
|---|:---:|---|---|
| **iaorhuman** | 🔒 | TypeScript 99% (React + Vite) | Base recém-criada (1 commit, 12/07/2026); README ainda é o template padrão do Vite. |
| **nstrike** | 🔒 | TypeScript 99% | Projeto TS (1 commit, 17/05/2026). Sem README — possível base/reescrita do Neon Strike. |

---

# 📊 Tabela geral (25 repositórios)

| Projeto | Visib. | Stack principal | Commits | Rel. | Deploy | Criado |
|---|:---:|---|:---:|:---:|:---:|:---:|
| Financial-Pro | 🔒 | React/RN + Firebase | 172 | 10 | [🔗](https://www.caliberda.com.br/kali) | 2026-04-03 |
| Modal-Checkin | 🔒 | React + Vite/TS | 76 | 0 | [🔗](https://modal.caliberda.com.br/) | 2026-03-26 |
| portifolio | 🌐 | HTML/Tailwind | 51 | 0 | [🔗](https://portifolio.caliberda.com.br) | 2026-02-17 |
| caliberda-home | 🔒 | HTML | 46 | 0 | [🔗](https://www.caliberda.com.br) | 2026-05-09 |
| cs2mix | 🔒 | HTML/JS + Firebase | 38 | 0 | [🔗](https://www.caliberda.com.br/cs2mix) | 2026-05-09 |
| Flow-Voice | 🌐 | Python/PySide6 | 36 | 15 | [🔗](https://flowvoice.caliberda.com.br) | 2026-06-07 |
| titon | 🔒 | JavaScript | 28 | 0 | [🔗](https://isatiton.com.br) | 2026-05-16 |
| Eatz-Tablet | 🔒 | Kotlin/Compose + Dart | 23 | 0 | [🔗](https://eatz-tablet.vercel.app) | 2026-04-25 |
| Product-Manager-Timer-Tracker | 🌐 | Next.js/TS + Firebase | 21 | 0 | [🔗](https://pmtt.caliberda.com.br) | 2026-07-02 |
| minecraft | 🔒 | HTML/CSS/JS | 17 | 0 | [🔗](https://minecraft.caliberda.com.br) | 2026-05-10 |
| karolzk | 🔒 | JavaScript | 13 | 0 | [🔗](https://karolzk.com.br) | 2026-05-16 |
| cesarkali | 🌐 | Markdown | 10 | 0 | — | 2026-05-19 |
| Semantic-Tab-Grouper | 🌐 | Vite/JS + IA local | 9 | 0 | [🔗](https://stg.caliberda.com.br) | 2026-07-12 |
| eatz_tablet_flutter | 🔒 | Dart/Flutter | 8 | 0 | — | 2026-05-25 |
| ccnpj | 🌐 | FastAPI/Python | 7 | 0 | [🔗](https://ccnpj.caliberda.com.br) | 2026-06-02 |
| neonstrike | 🔒 | HTML5 Canvas/JS | 5 | 0 | [🔗](https://neonstrike.caliberda.com.br) | 2026-05-12 |
| TesteOtelia | 🔒 | HTML | 4 | 0 | [🔗](https://teste-otelia.vercel.app) | 2026-05-28 |
| Kessler-Cascade | 🌐 | WebGL2/JS | 3 | 0 | [🔗](https://kessler.caliberda.com.br) | 2026-07-05 |
| Financial-Kali-Showcase | 🌐 | JavaScript | 2 | 0 | [🔗](https://www.caliberda.com.br/kali) | 2026-05-19 |
| controle-pedidos | 🔒 | Next.js/TS (x2) | 1 | 0 | [🔗](https://cardapio.caliberda.com.br) | 2026-06-24 |
| Afotica | 🌐 | WebGL2/JS | 1 | 0 | [🔗](https://afotica.caliberda.com.br) | 2026-07-05 |
| iaorhuman | 🔒 | TypeScript/Vite | 1 | 0 | — | 2026-07-12 |
| nstrike | 🔒 | TypeScript | 1 | 0 | — | 2026-05-17 |
| Kali-Dash | 🔒 | HTML | 1 | 0 | — | 2026-05-10 |
| Bitz-Loader | 🌐 | CSS | 1 | 0 | — | 2026-04-02 |

**Repos sem README publicado (7):** `caliberda-home`, `karolzk`, `titon`, `TesteOtelia`, `Kali-Dash`, `nstrike`, `Bitz-Loader`. `iaorhuman` está com o README padrão do Vite.

---

_Documento gerado automaticamente via GitHub CLI (`gh`), consolidando os READMEs completos e metadados (commits, releases, datas) de todos os 25 repositórios. Regenerável com o token autenticado (escopo `repo`)._
