/* ═══════════════════════════════════════════════════════════════════
   JÚLIO CALIBERDA — Portfólio "PORTCRAFT"
   Mesmos dados e lógica do portfólio principal; loader, fundo e barra
   de progresso reconstruídos com a pele pixel/voxel em vermelho.
   ═══════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ═══════════════ CATEGORIAS ═══════════════ */
    const CATEGORIES = {
        saas: { label: 'SaaS & Negócios', icon: 'fa-solid fa-briefcase' },
        tools: { label: 'Ferramentas & Automação', icon: 'fa-solid fa-toolbox' },
        games: { label: 'Jogos', icon: 'fa-solid fa-gamepad' },
        sites: { label: 'Sites & Landing Pages', icon: 'fa-solid fa-globe' },
        labs: { label: 'Experimentos', icon: 'fa-solid fa-flask' },
    };

    /* ═══════════════ DADOS DOS PROJETOS ═══════════════ */
    const PROJECTS = [
        {
            id: 'financial-pro', name: 'Financial Kali', sub: 'Financial-Pro', category: 'saas',
            icon: 'fa-solid fa-sack-dollar', visibility: 'private', repoSlug: 'Financial-Kali-Showcase',
            deploy: 'https://kali.caliberda.com.br',
            desc: 'Ecossistema de gestão financeira pessoal "Obsidian Dark", com IA de voz e visão (Finn IA), multi-empresa e apps Web + Android nativos sobre Firebase.',
            tags: ['React 19', 'Firebase', 'React Native', 'Groq + Gemini'],
            highlights: [
                'Finn IA: assistente com voz (Groq Whisper-large-v3) e visão, com rotação resiliente de API Keys.',
                'Multi-empresa: bases isoladas (Pessoal, Empresa, Projetos) com replicação de categorias.',
                'BI financeiro: fluxo de caixa, evolução de patrimônio e 6 KPIs com variação mês a mês.',
                'Modo Stealth, Google Identity Sync e zero chaves hardcoded para privacidade em primeiro lugar.',
                'Código do produto é privado; existe um repositório showcase público, com README de apresentação, para mostrar o projeto sem expor a base proprietária.',
            ],
            stackFull: 'React 19 · Vite 8 · Tailwind · Firebase (Firestore + Auth) · Groq (Llama 3.3 70B + Whisper v3) · Gemini 1.5 Flash · React Native 0.81.5 · Expo SDK 54 · NativeWind v4 · EAS Build',
            created: '2026-04-03',
        },
        {
            id: 'pmtt', name: 'Product Manager Time Tracker', sub: 'PMTT', category: 'saas',
            icon: 'fa-solid fa-stopwatch', visibility: 'public', repoSlug: 'Product-Manager-Timer-Tracker',
            deploy: 'https://pmtt.caliberda.com.br',
            desc: 'Gestão de tempo para PMs: cronômetro em tempo real por categoria, dashboards com evidências e exportação em PDF para justificar prioridades.',
            tags: ['Next.js', 'Firebase', 'Recharts', 'Chrome Extension'],
            highlights: [
                'Cronômetro calculado pelo servidor (sobrevive a refresh), com atalhos de teclado e pausa com desconto de tempo.',
                'Página "Hoje" com blocos coloridos por categoria e lacunas clicáveis.',
                'Dashboard com heatmap semana × hora, KPIs comparativos e exportação em PDF com resumo executivo.',
                'Categorias totalmente customizáveis, com ícone, cor e atalho de teclado; extensão Chrome publicada.',
            ],
            stackFull: 'Next.js (App Router, TS) · Firebase (Auth + Firestore) · Tailwind · shadcn/ui · Recharts · react-hook-form · zod · date-fns · Vercel',
            created: '2026-07-02',
        },
        {
            id: 'controle-pedidos', name: 'Cardápio Digital', sub: 'Painel de Gestão & Totem de Autoatendimento', category: 'saas',
            icon: 'fa-solid fa-utensils', visibility: 'private', repoSlug: null,
            deploy: 'https://cardapio.caliberda.com.br',
            desc: 'Sistema completo para restaurantes: cardápio digital multi-tenant, painel de gestão e um totem de autoatendimento em tablet, todos integrados a uma API própria.',
            tags: ['Next.js 16', 'React 19', 'NestJS', 'Flutter'],
            highlights: [
                'Cardápio com busca em tempo real, badges de promoção, carrinho lateral, checkout e status do pedido.',
                'Painel de gestão com login, kanban de pedidos, delivery em tempo real, KDS, caixa e relatórios.',
                'Totem de autoatendimento em Flutter para tablets, com vínculo por QR Code e customização avançada de produtos.',
                'Acesso multi-tenant via token de empresa, com troca de empresa ativa direto no painel.',
                'O maior projeto do acervo, com roadmap de WebSocket e impressão de comandas.',
            ],
            stackFull: 'Next.js 16 · React 19 · TS 5.7 · Tailwind 4 · shadcn/ui · Sonner · jose (JWT) · NestJS + PostgreSQL (API) · Flutter (Dart) · Riverpod',
            created: '2026-06-24',
        },
        {
            id: 'modal-checkin', name: 'Hotel PMS', sub: 'Módulo de Check-in', category: 'saas',
            icon: 'fa-solid fa-door-open', visibility: 'private', repoSlug: null,
            deploy: 'https://modal.caliberda.com.br',
            desc: 'Módulo de check-in de um PMS hoteleiro com UX premium: modal full-screen no mobile, seções navegáveis por ScrollSpy e FNRH digital completo.',
            tags: ['React 18', 'Vite', 'TanStack Query', 'Zod'],
            highlights: [
                'Dez seções: hospedagem, faturamento, acompanhantes, tarifas, recebimentos, refeições, veículos, extras, pulseiras e anexos.',
                'FNRH Digital completo com CEP automático via ViaCEP e autocompletar por teclado.',
                'Financeiro com estados de troco, em aberto e quitado, com design system documentado.',
                'Deploy automático via GitHub Actions direto para GitHub Pages.',
            ],
            stackFull: 'React 18 + Vite · TypeScript · Tailwind 3.4 · shadcn/Radix · TanStack Query · React Hook Form + Zod · React Router',
            created: '2026-03-26',
        },
        {
            id: 'flowvoice', name: 'FlowVoice', sub: 'Flow-Voice', category: 'tools',
            icon: 'fa-solid fa-microphone-lines', visibility: 'public', repoSlug: 'Flow-Voice',
            deploy: 'https://flowvoice.caliberda.com.br',
            desc: 'Utilitário de bandeja para Windows e Ubuntu que dita texto por voz em qualquer campo do sistema, com polimento, tradução e busca por voz.',
            tags: ['Python', 'PySide6', 'Whisper local', 'PyInstaller'],
            highlights: [
                'Atalho global de ditado, com modos de polimento de texto e tradução por voz para vários idiomas.',
                'Pesquisa web por voz com chat interativo e failover automático entre provedores de IA.',
                'Transcrição totalmente offline via Whisper local, funcionando mesmo sem internet.',
                'Empacotado como instalador nativo para Windows e pacote .deb para Ubuntu.',
            ],
            stackFull: 'Python 3.10+ · PySide6 · sounddevice · pynput · Whisper local · PyInstaller · Inno Setup',
            created: '2026-06-07',
        },
        {
            id: 'semantic-tab-grouper', name: 'Semantic Tab Grouper', sub: null, category: 'tools',
            icon: 'fa-solid fa-layer-group', visibility: 'public', repoSlug: 'Semantic-Tab-Grouper',
            deploy: 'https://stg.caliberda.com.br',
            desc: 'Extensão de navegador que agrupa abas pelo assunto do conteúdo, não só pelo domínio, com um modelo rodando inteiramente no navegador, sem backend.',
            tags: ['Vite', 'Transformers.js', 'WASM', 'Manifest V3'],
            highlights: [
                'Extrai o conteúdo principal da página e gera um embedding para comparar o assunto entre abas.',
                'Modos de agrupamento semantic, domain e hybrid, conforme a preferência do usuário.',
                'Privacidade total: processamento local, zero telemetria, sem enviar dados de navegação.',
                'Compatível com os principais navegadores baseados em Chromium.',
            ],
            stackFull: 'Vite + @crxjs/vite-plugin · @xenova/transformers · @mozilla/readability',
            created: '2026-07-12',
        },
        {
            id: 'ccnpj', name: 'CNPJ API', sub: 'ccnpj', category: 'tools',
            icon: 'fa-solid fa-building-columns', visibility: 'public', repoSlug: 'ccnpj',
            deploy: 'https://ccnpj.caliberda.com.br',
            desc: 'API REST para consulta de dados cadastrais de empresas brasileiras via CNPJ, agregando múltiplas fontes em um único endpoint JSON.',
            tags: ['FastAPI', 'Python', 'Vercel Serverless'],
            highlights: [
                'Endpoint único que normaliza a pontuação do CNPJ automaticamente.',
                'Agrega múltiplas fontes públicas: razão social, QSA, CNAEs, regime tributário e situação cadastral.',
                'Deploy serverless, simples de rodar tanto na nuvem quanto localmente.',
            ],
            stackFull: 'FastAPI · Requests · Vercel Serverless',
            created: '2026-06-02',
        },
        {
            id: 'afotica', name: 'AFÓTICA', sub: 'Afotica', category: 'games',
            icon: 'fa-solid fa-water', visibility: 'public', repoSlug: 'Afotica',
            deploy: 'https://afotica.caliberda.com.br',
            desc: '"Onde a luz não chega, o som enxerga." Você desce uma caverna abissal onde o mundo só existe quando um som o atravessa, e cada eco te denuncia aos predadores.',
            tags: ['WebGL2', 'GLSL', 'Web Audio API', 'Puppeteer'],
            highlights: [
                'Resolve a equação de onda de verdade na GPU, simulando a propagação do som em tempo real.',
                'Predadores ouvem no mesmo instante em que a onda chega, com audição sincronizada à imagem.',
                'Cavernas geradas de forma procedural, com áudio inteiramente sintetizado.',
                'Roda até em arquivo local, sem servidor, com uma suíte própria de testes automatizados.',
            ],
            stackFull: 'WebGL2 (GLSL) · Canvas2D · Web Audio API · JavaScript vanilla · Puppeteer (testes)',
            created: '2026-07-05',
        },
        {
            id: 'kessler-cascade', name: 'Kessler Cascade', sub: null, category: 'games',
            icon: 'fa-solid fa-meteor', visibility: 'public', repoSlug: 'Kessler-Cascade',
            deploy: 'https://kessler.caliberda.com.br',
            desc: '"Você não tem armas, a gravidade é a sua arma." Arena shooter roguelike onde você captura inimigos e asteroides em órbita e os arremessa de volta.',
            tags: ['WebGL2', 'Shaders', 'Procedural Audio'],
            highlights: [
                'Renderizador próprio, capaz de milhares de sprites em uma única chamada de desenho.',
                'Lente gravitacional simulada em shader, distorcendo a imagem ao redor de cada poço de gravidade.',
                'Dezenas de inimigos e milhares de partículas em tela sem perder fluidez.',
                'Upgrades por raridade, chefe a cada onda e trilha sonora generativa.',
            ],
            stackFull: 'WebGL2 · GLSL Shaders · JavaScript vanilla (sem bundler) · Web Audio API',
            created: '2026-07-05',
        },
        {
            id: 'neonstrike', name: 'Neon Strike', sub: 'neonstrike', category: 'games',
            icon: 'fa-solid fa-gamepad', visibility: 'private', repoSlug: null,
            deploy: 'https://neonstrike.caliberda.com.br',
            desc: 'Arcade de sobrevivência cyberpunk com evolução de nave, dificuldade progressiva e ranking global em tempo real.',
            tags: ['Canvas API', 'Vanilla JS', 'Firebase RTDB'],
            highlights: [
                'Engine e física próprias, renderizadas em Canvas.',
                'Trilha sonora e efeitos sintetizados, sem nenhum arquivo de áudio externo.',
                'Ranking global em tempo real, compartilhado entre todos os jogadores.',
                'Aplicação leve, em um único arquivo, sem dependências externas.',
            ],
            stackFull: 'HTML5 Canvas · Vanilla JS ES6+ · Tailwind (CDN) · Web Audio API · Firebase RTDB',
            created: '2026-05-12',
        },
        {
            id: 'cs2mix', name: 'CS2 Mix Balancer', sub: 'cs2mix', category: 'games',
            icon: 'fa-solid fa-crosshairs', visibility: 'private', repoSlug: null,
            deploy: 'https://www.caliberda.com.br/cs2mix',
            desc: 'Organizador de partidas de CS2 com balanceamento matemático de times e um coach com IA que estima probabilidade de vitória.',
            tags: ['Firebase', 'Gemini 2.5', 'Vanilla JS'],
            highlights: [
                'Balanceamento automático buscando a menor diferença de nível médio entre os times.',
                'Coach com IA que estima a chance de vitória e sugere ajustes táticos em tempo real.',
                'Multiplayer em tempo real, com painel administrativo embutido e formatação pronta para compartilhar.',
            ],
            stackFull: 'HTML5 · JS ES6+ · Tailwind (CDN) · Firebase · Gemini 2.5 Flash (REST) · FontAwesome',
            created: '2026-05-09',
        },
        {
            id: 'minecraft', name: 'Minecraft Modpack', sub: 'HotDorgs', category: 'games',
            icon: 'fa-solid fa-cubes', visibility: 'private', repoSlug: null,
            deploy: 'https://minecraft.caliberda.com.br',
            desc: 'Landing page para um modpack de Minecraft, com terreno voxel procedural animado em canvas, tutoriais e download direto.',
            tags: ['Vanilla JS', 'Lenis', 'CSS3'],
            highlights: [
                'Terreno voxel procedural animado, renderizado direto em canvas.',
                'Tutoriais separados por tipo de instalação, com vídeo integrado.',
                'Rolagem suave e tipografia temática, reforçando a identidade do modpack.',
            ],
            stackFull: 'HTML5 · CSS3 (animações) · Vanilla JS · Lenis · Vercel',
            created: '2026-05-10',
        },
        {
            id: 'karolzk', name: 'karolzk', sub: 'Creator Hub B2C', category: 'sites',
            icon: 'fa-solid fa-share-nodes', visibility: 'private', repoSlug: null,
            deploy: 'https://karolzk.com.br',
            desc: 'Creator Hub B2C para a criadora Karol ZK: um linktree avançado com streaming integrado, parte de uma linha de hubs de criadores.',
            tags: ['JavaScript', 'Streaming'],
            highlights: [
                'Linktree avançado com streaming integrado para a audiência da criadora.',
                'Parte da mesma linha de produto do Titonverso, um modelo de hub reutilizável entre criadores.',
            ],
            stackFull: 'JavaScript · HTML5/CSS3',
            created: '2026-05-16',
        },
        {
            id: 'titon', name: 'Titonverso', sub: 'titon', category: 'sites',
            icon: 'fa-solid fa-tower-broadcast', visibility: 'private', repoSlug: null,
            deploy: 'https://isatiton.com.br',
            desc: 'Creator Hub B2C para a streamer Isa Titon: identidade visual de HUD esports, com painel admin, giveaways, sorteios e ranking de parceiros.',
            tags: ['JavaScript', 'Firebase', 'HUD Design'],
            highlights: [
                'Linguagem visual de HUD esports, com cantos chanfrados e cor de destaque editável via painel admin.',
                'Módulos de giveaway, status ao vivo e integração com as redes sociais da criadora.',
                'Uma das referências de estilo usadas na construção deste próprio portfólio.',
            ],
            stackFull: 'JavaScript vanilla · CSS3 · Firebase',
            created: '2026-05-16',
        },
        {
            id: 'testeotelia', name: 'TesteOtelia', sub: null, category: 'sites',
            icon: 'fa-solid fa-flask', visibility: 'private', repoSlug: null,
            deploy: 'https://script.caliberda.com.br',
            desc: 'Site para testar scripts em HTML rapidamente, antes de levá-los a um produto com nome próprio.',
            tags: ['HTML'],
            highlights: ['Ambiente para testar scripts em HTML, sem compromisso de produção.'],
            stackFull: 'HTML',
            created: '2026-05-28',
        },
        {
            id: 'caliberda-home', name: 'Caliberda Home', sub: 'caliberda-home', category: 'sites',
            icon: 'fa-solid fa-server', visibility: 'private', repoSlug: null,
            deploy: 'https://www.caliberda.com.br',
            desc: 'Hub central do ecossistema Caliberda: o ponto de entrada que conecta todos os outros produtos e domínios em um único endereço.',
            tags: ['HTML5'],
            highlights: [
                'Página única que atua como hub central do ecossistema.',
                'Conecta os subdomínios de todos os outros produtos, como Financial Kali, CS2 Mix e Minecraft.',
            ],
            stackFull: 'HTML5/CSS3 · JavaScript',
            created: '2026-05-09',
        },
        {
            id: 'iaorhuman', name: 'iaorhuman', sub: null, category: 'labs',
            icon: 'fa-solid fa-flask-vial', visibility: 'private', repoSlug: null,
            deploy: null,
            desc: 'Base em React, Vite e TypeScript, ainda em estágio inicial de experimentação.',
            tags: ['React', 'Vite', 'TypeScript'],
            highlights: ['Repositório recém-iniciado, um experimento em andamento.'],
            stackFull: 'TypeScript · React · Vite',
            created: '2026-07-12',
        },
    ];

    /* ═══════════════ HELPERS ═══════════════ */
    const $ = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
    const ACCENTS = {"á":"a","à":"a","â":"a","ã":"a","ä":"a","é":"e","è":"e","ê":"e","ë":"e","í":"i","ì":"i","î":"i","ï":"i","ó":"o","ò":"o","ô":"o","õ":"o","ö":"o","ú":"u","ù":"u","û":"u","ü":"u","ç":"c","ñ":"n"};
    const ACCENT_RE = new RegExp('[' + Object.keys(ACCENTS).join('') + ']', 'g');
    const normalize = (s) => (s || '').toString().toLowerCase().replace(ACCENT_RE, (ch) => ACCENTS[ch] || ch);
    const MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    function fmtDate(iso) {
        const [y, m] = iso.split('-');
        return MONTHS[parseInt(m, 10) - 1] + '/' + y;
    }
    function githubUrl(slug) { return 'https://github.com/cesarkali/' + slug; }

    /* ═══════════════ LOADER (BARRA SEGMENTADA) ═══════════════ */
    function initLoader() {
        const loader = $('#site-loader');
        const segWrap = $('#loader-segments');
        const pctEl = $('#loader-pct');
        const captionEl = $('#loader-caption');
        if (!loader || !segWrap || !pctEl || !captionEl) return;

        const TOTAL_SEGS = 20;
        const segs = [];
        for (let i = 0; i < TOTAL_SEGS; i++) {
            const seg = document.createElement('div');
            seg.className = 'loader-seg';
            segWrap.appendChild(seg);
            segs.push(seg);
        }

        const captions = ['carregando projetos', 'montando blocos', 'ajustando o terreno', 'quase lá'];

        document.body.classList.add('no-scroll');

        function paint(pct) {
            pctEl.textContent = String(Math.round(pct));
            const lit = Math.round((pct / 100) * TOTAL_SEGS);
            segs.forEach((seg, i) => seg.classList.toggle('is-lit', i < lit));
        }

        if (REDUCED_MOTION) {
            paint(100);
            captionEl.textContent = 'pronto';
            loader.classList.add('loaded');
            document.body.classList.remove('no-scroll');
            document.dispatchEvent(new Event('portcraft:loaded'));
            return;
        }

        let pct = 0;
        let capIndex = -1;

        function setCaption() {
            const idx = Math.min(captions.length - 1, Math.floor((pct / 100) * captions.length));
            if (idx !== capIndex) { capIndex = idx; captionEl.textContent = captions[idx]; }
        }

        function tick() {
            pct = Math.min(100, pct + Math.random() * 9 + 3);
            paint(pct);
            setCaption();
            if (pct < 100) setTimeout(tick, 90 + Math.random() * 130);
            else finish();
        }

        let finished = false;
        function finish() {
            if (finished) return;
            finished = true;
            captionEl.textContent = 'pronto';
            setTimeout(() => {
                loader.classList.add('loaded');
                document.body.classList.remove('no-scroll');
                document.dispatchEvent(new Event('portcraft:loaded'));
            }, 260);
        }

        setCaption();
        tick();
        setTimeout(finish, 4200);
    }

    /* ═══════════════ FUNDO — PARTÍCULAS (ORBES DE PIXEL) ═══════════════ */
    function initParticles() {
        const wrap = $('#bg-particles');
        if (!wrap || REDUCED_MOTION) return;
        const colors = ['#ff3b3b', '#ffc24b', '#b56bff'];
        const count = Math.max(14, Math.min(28, Math.floor(window.innerWidth / 75)));

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = 4 + Math.round(Math.random() * 3);
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = (Math.random() * 100) + '%';
            p.style.bottom = (Math.random() * 100) + '%';
            p.style.setProperty('--c', colors[Math.floor(Math.random() * colors.length)]);
            p.style.setProperty('--max-opacity', (0.35 + Math.random() * 0.35).toFixed(2));
            p.style.animationDuration = (12 + Math.random() * 16) + 's';
            p.style.animationDelay = (-Math.random() * 26) + 's';
            wrap.appendChild(p);
        }
    }

    /* ═══════════════ CENÁRIO VOXEL (skyline procedural, não é o jogo) ═══════════════ */
    function initHorizon() {
        const canvas = $('#hz-canvas');
        if (!canvas || REDUCED_MOTION) return;

        function render() {
            const hero = $('.hero');
            if (!hero) return;
            const scale = 3;
            const W = Math.max(320, Math.round(hero.clientWidth * 1.5 / scale));
            const H = Math.max(140, Math.round(hero.clientHeight * 0.68 / scale));
            canvas.width = W;
            canvas.height = H;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, W, H);

            function hash(ix, iz) {
                let h = (ix * 374761393 + iz * 668265263) | 0;
                h = Math.imul(h ^ (h >>> 13), 1274126177);
                return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
            }

            const horizonY = Math.round(H * 0.34);
            const colW = 3;

            for (let x = 0; x < W; x += colW) {
                const col = Math.floor(x / colW);
                const n1 = hash(col, 7);
                const n2 = hash(col, 19);
                const towerH = Math.round((Math.pow(n1, 2.1) * 0.75 + n2 * 0.1) * (H - horizonY) * 0.92);
                const y = horizonY + (H - horizonY) - towerH;
                const lit = hash(col, 31) > 0.72;
                const shade = 0.55 + hash(col, 3) * 0.45;
                const r = Math.round((lit ? 255 : 120) * shade);
                const g = Math.round((lit ? 90 : 30) * shade);
                const b = Math.round((lit ? 60 : 26) * shade);
                ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
                ctx.fillRect(x, y, colW, H - y);
            }

            const haze = ctx.createLinearGradient(0, horizonY - H * 0.3, 0, horizonY + H * 0.1);
            haze.addColorStop(0, 'rgba(255,90,50,0)');
            haze.addColorStop(0.7, 'rgba(255,90,50,0.18)');
            haze.addColorStop(1, 'rgba(255,60,40,0.30)');
            ctx.fillStyle = haze;
            ctx.fillRect(0, horizonY - H * 0.3, W, H * 0.4);
        }

        render();
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(render, 250);
        });
    }

    /* ═══════════════ BARRA DE PROGRESSO DO SCROLL ═══════════════ */
    function initScrollProgress() {
        const bar = $('#scroll-progress');
        if (!bar) return;
        function update() {
            const scroll = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = (height > 0 ? (scroll / height) * 100 : 0) + '%';
        }
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    /* ═══════════════ NAVBAR ═══════════════ */
    function initNavbar() {
        const nav = $('#navbar');
        const burger = $('#nav-burger');
        const drawer = $('#mobile-drawer');
        if (!nav) return;

        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 12);
        }, { passive: true });

        if (burger && drawer) {
            burger.addEventListener('click', () => {
                const open = burger.classList.toggle('open');
                drawer.classList.toggle('open', open);
            });
            $$('a', drawer).forEach((a) => a.addEventListener('click', () => {
                burger.classList.remove('open');
                drawer.classList.remove('open');
            }));
        }

        const sections = $$('main section[id], header + section[id]');
        const navLinks = $$('.nav-link[href^="#"]');
        if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
            const obs = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
                    }
                });
            }, { rootMargin: '-40% 0px -55% 0px' });
            sections.forEach((s) => obs.observe(s));
        }
    }

    /* ═══════════════ REVEAL ON SCROLL ═══════════════ */
    function initReveal() {
        const els = $$('.reveal, .reveal-fade');
        if (!els.length) return;
        if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
            els.forEach((e) => e.classList.add('in-view'));
            return;
        }
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        els.forEach((e) => obs.observe(e));
    }

    /* ═══════════════ CONTADORES ═══════════════ */
    function countUp(el, target, duration) {
        if (REDUCED_MOTION) { el.textContent = target; return; }
        const start = performance.now();
        const from = 0;
        function tick(now) {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(from + (target - from) * eased);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        }
        requestAnimationFrame(tick);
    }

    function initCounters() {
        const els = $$('[data-count]');
        if (!els.length || !('IntersectionObserver' in window)) {
            els.forEach((el) => { el.textContent = el.getAttribute('data-count'); });
            return;
        }
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    countUp(el, parseInt(el.getAttribute('data-count'), 10), 1400);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.4 });
        els.forEach((el) => obs.observe(el));
    }

    /* ═══════════════ TYPED ROLE (HERO) ═══════════════ */
    function initTypedRole() {
        const el = $('#hero-role-text');
        if (!el) return;
        const roles = [
            'Tech Product Manager',
            'Product Manager',
            'Orquestrador de IA',
            'Arquiteto de Automação (n8n)',
            'Ponte entre negócio e engenharia',
        ];
        if (REDUCED_MOTION) { el.textContent = roles[0]; return; }

        let ri = 0, ci = 0, deleting = false;
        function tick() {
            const word = roles[ri];
            if (!deleting) {
                ci++;
                el.textContent = word.slice(0, ci);
                if (ci === word.length) { deleting = true; setTimeout(tick, 1700); return; }
                setTimeout(tick, 55);
            } else {
                ci--;
                el.textContent = word.slice(0, ci);
                if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(tick, 300); return; }
                setTimeout(tick, 28);
            }
        }
        tick();
    }

    /* ═══════════════ PROJETOS: RENDER, FILTRO, BUSCA, MODAL ═══════════════ */
    let activeFilter = 'all';
    let searchQuery = '';

    function pillsHtml(p) {
        const live = p.deploy
            ? '<span class="pill is-live"><span class="pill-dot"></span>ONLINE</span>'
            : '<span class="pill"><span class="pill-dot"></span>OFFLINE</span>';
        const vis = p.visibility === 'public'
            ? '<span class="pill is-public"><span class="pill-dot"></span>PÚBLICO</span>'
            : '<span class="pill is-private"><span class="pill-dot"></span>PRIVADO</span>';
        return live + vis;
    }

    function cardHtml(p, idx) {
        return `
        <article class="pcard" data-id="${p.id}" tabindex="0" role="button" aria-haspopup="dialog" style="animation-delay:${Math.min(idx * 0.04, 0.4)}s">
            <div class="pcard-top">
                <div class="pcard-icon"><i class="${p.icon}"></i></div>
                <div class="pcard-pills">${pillsHtml(p)}</div>
            </div>
            <h3>${p.name}</h3>
            <div class="pcard-cat">${p.sub || CATEGORIES[p.category].label}</div>
            <p class="pcard-desc">${p.desc}</p>
            <div class="pcard-tags">${p.tags.map((t) => `<span>${t}</span>`).join('')}</div>
            <div class="pcard-foot">
                <span class="pcard-date"><i class="fa-regular fa-calendar"></i>${fmtDate(p.created)}</span>
                <span class="pcard-more">Detalhes <i class="fa-solid fa-arrow-right"></i></span>
            </div>
        </article>`;
    }

    function matchesQuery(p, q) {
        if (!q) return true;
        const hay = normalize([p.name, p.sub, p.desc, p.tags.join(' '), p.stackFull, CATEGORIES[p.category].label].join(' '));
        return hay.includes(q);
    }

    function renderProjects() {
        const grid = $('#projects-grid');
        const metaEl = $('#projects-meta-count');
        if (!grid) return;
        const q = normalize(searchQuery);
        const filtered = PROJECTS.filter((p) => (activeFilter === 'all' || p.category === activeFilter) && matchesQuery(p, q));

        grid.innerHTML = filtered.length
            ? filtered.map((p, i) => cardHtml(p, i)).join('')
            : '<div class="no-results">&gt; nenhum projeto encontrado para esse filtro/busca.</div>';

        if (metaEl) metaEl.innerHTML = `Exibindo <b>${filtered.length}</b> de <b>${PROJECTS.length}</b> repositórios`;

        $$('.pcard', grid).forEach((card) => {
            card.addEventListener('click', () => openModal(card.getAttribute('data-id')));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.getAttribute('data-id')); }
            });
        });
    }

    function renderFilterTabs() {
        const wrap = $('#filter-tabs');
        if (!wrap) return;
        const counts = { all: PROJECTS.length };
        PROJECTS.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });

        const tabs = [{ key: 'all', label: 'Todos' }].concat(
            Object.keys(CATEGORIES).map((k) => ({ key: k, label: CATEGORIES[k].label }))
        );

        wrap.innerHTML = tabs.map((t) => `
            <button class="filter-tab${t.key === activeFilter ? ' active' : ''}" data-filter="${t.key}">
                ${t.label} <span class="count">(${counts[t.key] || 0})</span>
            </button>
        `).join('');

        $$('.filter-tab', wrap).forEach((btn) => {
            btn.addEventListener('click', () => {
                activeFilter = btn.getAttribute('data-filter');
                $$('.filter-tab', wrap).forEach((b) => b.classList.toggle('active', b === btn));
                renderProjects();
            });
        });
    }

    function initSearch() {
        const input = $('#project-search');
        if (!input) return;
        input.addEventListener('input', () => { searchQuery = input.value; renderProjects(); });
    }

    /* ─── Modal ─── */
    function openModal(id) {
        const p = PROJECTS.find((x) => x.id === id);
        const overlay = $('#project-modal');
        const box = $('#modal-box');
        if (!p || !overlay || !box) return;

        const deployBtn = p.deploy
            ? `<a href="${p.deploy}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> Acessar projeto em produção</a>`
            : '';
        const githubBtn = p.repoSlug
            ? `<a href="${githubUrl(p.repoSlug)}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm"><i class="fa-brands fa-github"></i> Ver no GitHub</a>`
            : (p.deploy ? '' : `<span class="btn btn-ghost btn-sm" style="opacity:.55;cursor:not-allowed;"><i class="fa-solid fa-lock"></i> Repositório privado</span>`);

        box.innerHTML = `
            <button class="modal-close" id="modal-close-btn" aria-label="Fechar"><i class="fa-solid fa-xmark"></i></button>
            <div class="modal-head">
                <div class="modal-icon"><i class="${p.icon}"></i></div>
                <div>
                    <h3>${p.name}</h3>
                    <div class="pcard-cat">${p.sub || CATEGORIES[p.category].label}</div>
                </div>
            </div>
            <div class="modal-pills">${pillsHtml(p)}<span class="pill"><span class="pill-dot"></span>${CATEGORIES[p.category].label.toUpperCase()}</span></div>
            <p class="modal-desc">${p.desc}</p>
            <ul class="modal-highlights">${p.highlights.map((h) => `<li><i class="fa-solid fa-angle-right"></i>${h}</li>`).join('')}</ul>
            <div class="modal-stack-label">Stack técnica</div>
            <div class="modal-stack">${p.stackFull.split('·').map((s) => `<span>${s.trim()}</span>`).join('')}</div>
            <div class="modal-foot">
                ${deployBtn}
                ${githubBtn}
                <div class="modal-meta">
                    <span><i class="fa-solid fa-calendar"></i>${fmtDate(p.created)}</span>
                </div>
            </div>
        `;

        overlay.classList.add('open');
        document.body.classList.add('no-scroll');
        $('#modal-close-btn').addEventListener('click', closeModal);
        overlay.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        const overlay = $('#project-modal');
        if (!overlay) return;
        overlay.classList.remove('open');
        document.body.classList.remove('no-scroll');
        overlay.setAttribute('aria-hidden', 'true');
    }

    function initModal() {
        const overlay = $('#project-modal');
        if (!overlay) return;
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    }

    /* ═══════════════ BUILD LOG (TIMELINE) ═══════════════ */
    function initBuildLog() {
        const track = $('#buildlog-track');
        if (!track) return;
        const sorted = PROJECTS.slice().sort((a, b) => a.created.localeCompare(b.created));
        const itemsHtml = sorted.map((p) => `
            <div class="buildlog-item">
                <div class="buildlog-dot"></div>
                <div class="buildlog-date">${fmtDate(p.created)}</div>
                <div class="buildlog-name">${p.name}</div>
                <div class="buildlog-tag">${CATEGORIES[p.category].label}</div>
            </div>
        `).join('');

        if (REDUCED_MOTION) {
            track.innerHTML = itemsHtml;
            return;
        }
        track.innerHTML = itemsHtml + itemsHtml;
        initBuildLogAutoScroll(track);
    }

    /* Scroll automático estilo ticker: contínuo e infinito, nunca pausa. */
    function initBuildLogAutoScroll(track) {
        const SPEED = 26;
        let halfWidth = track.scrollWidth / 2;
        let virtualScroll = track.scrollLeft;
        let lastTs = null;

        if ('ResizeObserver' in window) {
            new ResizeObserver(() => { halfWidth = track.scrollWidth / 2; }).observe(track);
        } else {
            window.addEventListener('resize', () => { halfWidth = track.scrollWidth / 2; });
        }

        function tick(ts) {
            if (lastTs === null) lastTs = ts;
            const dt = (ts - lastTs) / 1000;
            lastTs = ts;

            if (halfWidth > 0) {
                virtualScroll += SPEED * dt;
                if (virtualScroll >= halfWidth) virtualScroll -= halfWidth;
                track.scrollLeft = virtualScroll;
            }
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    /* ═══════════════ ESTATÍSTICAS AGREGADAS ═══════════════ */
    function computeStats() {
        const live = PROJECTS.filter((p) => p.deploy).length;
        const pub = PROJECTS.filter((p) => p.visibility === 'public').length;
        const priv = PROJECTS.length - pub;
        const categories = new Set(PROJECTS.map((p) => p.category)).size;
        return { total: PROJECTS.length, live, pub, priv, categories };
    }

    function injectStats() {
        const stats = computeStats();
        $$('[data-stat]').forEach((el) => {
            const key = el.getAttribute('data-stat');
            if (stats[key] !== undefined) el.setAttribute('data-count', stats[key]);
        });
    }

    /* ═══════════════ COPIAR EMAIL ═══════════════ */
    function initCopy() {
        $$('[data-copy]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const val = btn.getAttribute('data-copy');
                navigator.clipboard?.writeText(val).then(() => {
                    const icon = btn.querySelector('i');
                    const original = icon.className;
                    icon.className = 'fa-solid fa-check';
                    btn.classList.add('copied');
                    setTimeout(() => { icon.className = original; btn.classList.remove('copied'); }, 1500);
                });
            });
        });
    }

    /* ═══════════════ ANO NO FOOTER ═══════════════ */
    function initYear() {
        const el = $('#footer-year');
        if (el) el.textContent = new Date().getFullYear();
    }

    /* ═══════════════ TEMA CLARO/ESCURO + ECLIPSE DE ENTRADA ═══════════════
       A página entra no tema claro (a mostra principal) e, se o visitante
       ainda não escolheu um tema, escurece sozinha pouco depois: um véu se
       expande em círculo a partir do sol, e a cor de cada bloco da página
       vira progressivamente de cima pra baixo — o que está mais perto do
       topo (onde fica o botão) muda primeiro, o resto acompanha logo atrás.
       Cada bloco propaga seu atraso (--wave-delay) pros filhos via CSS, daí
       o texto/ícone dentro de um card muda junto com o fundo dele, não solto. */
    function initTheme() {
        const STORAGE_KEY = 'portcraft-theme';
        const toggles = $$('#theme-toggle, #theme-toggle-mobile');
        if (!toggles.length) return;

        const ECLIPSE_FILL = { dark: '#0b0807', light: '#f3ead8' };
        const ECLIPSE_GLOW = '#ffe9b8';
        const WAVE_MS = 700;

        // Blocos visuais que recebem o atraso; tudo dentro deles herda via --wave-delay
        const THEMED_SELECTOR = [
            '.navbar',
            '.hero-eyebrow-row .tag', '.hero-hello', '.hero-name-line', '.hero-role',
            '.hero-bio', '.hero-ctas .btn', '.hero-social-btn', '.hero-photo-panel',
            '.marquee',
            '.section-head', '.career-item', '.about-body', '.about-facts', '.about-stats',
            '.stack-card', '.pcard',
            '.buildlog',
            '.contact-panel',
            '.footer',
        ].join(', ');

        function paintIcons(theme) {
            toggles.forEach((btn) => {
                const icon = btn.querySelector('i');
                if (icon) icon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
            });
        }

        function currentTheme() {
            return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        }

        function setThemeInstant(theme) {
            if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
            else document.documentElement.removeAttribute('data-theme');
            paintIcons(theme);
        }

        // Atraso proporcional à posição vertical na tela: topo = quase 0, o que
        // já saiu da tela por baixo = atraso máximo (não importa, está invisível)
        function applyWaveDelays() {
            const els = $$(THEMED_SELECTOR);
            const vh = window.innerHeight;
            els.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.width === 0 && rect.height === 0) return;
                const y = rect.top + rect.height / 2;
                const ratio = Math.min(1, Math.max(0, y / vh));
                el.style.setProperty('--wave-delay', Math.round(ratio * WAVE_MS) + 'ms');
            });
            return els;
        }

        function clearWaveDelays(els) {
            els.forEach((el) => el.style.removeProperty('--wave-delay'));
        }

        let transitioning = false;

        function animateThemeChange(nextTheme, originEl, persist) {
            // Ignora cliques durante uma transição em andamento (evita corrida com o auto-eclipse de entrada)
            if (transitioning || currentTheme() === nextTheme) return;

            if (REDUCED_MOTION) {
                setThemeInstant(nextTheme);
                if (persist !== false) { try { localStorage.setItem(STORAGE_KEY, nextTheme); } catch (e) {} }
                return;
            }

            const btn = originEl || toggles[0];
            const rect = btn.getBoundingClientRect();
            const cx = Math.round(rect.left + rect.width / 2);
            const cy = Math.round(rect.top + rect.height / 2);
            const maxR = Math.ceil(Math.hypot(
                Math.max(cx, window.innerWidth - cx),
                Math.max(cy, window.innerHeight - cy)
            ));

            transitioning = true;
            const waveEls = applyWaveDelays();

            const veil = document.createElement('div');
            veil.className = 'theme-eclipse';
            // Lampejo bem pequeno e fixo em pixels: o resto do disco (a maior parte do
            // crescimento) já nasce na cor sólida do tema de destino, em ambas as direções
            veil.style.background = `radial-gradient(circle ${maxR}px at ${cx}px ${cy}px, ${ECLIPSE_GLOW} 0px, ${ECLIPSE_GLOW} 14px, ${ECLIPSE_FILL[nextTheme]} 80px, ${ECLIPSE_FILL[nextTheme]} 100%)`;
            veil.style.clipPath = `circle(0px at ${cx}px ${cy}px)`;
            document.body.appendChild(veil);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    veil.style.clipPath = `circle(${maxR}px at ${cx}px ${cy}px)`;
                    // Troca o tema já no início do crescimento: cada bloco entra em
                    // cena no seu próprio atraso (--wave-delay), de cima pra baixo
                    setThemeInstant(nextTheme);
                    if (persist !== false) { try { localStorage.setItem(STORAGE_KEY, nextTheme); } catch (err) {} }
                });
            });

            veil.addEventListener('transitionend', function onClipDone(e) {
                if (e.propertyName !== 'clip-path') return;
                veil.removeEventListener('transitionend', onClipDone);
                requestAnimationFrame(() => { veil.style.opacity = '0'; });
            });
            veil.addEventListener('transitionend', function onFadeDone(e) {
                if (e.propertyName !== 'opacity') return;
                veil.removeEventListener('transitionend', onFadeDone);
                veil.remove();
            });

            // So libera novos cliques depois que o bloco mais distante ja assentou
            setTimeout(() => {
                clearWaveDelays(waveEls);
                transitioning = false;
            }, WAVE_MS + 550);
        }

        paintIcons(currentTheme());

        toggles.forEach((btn) => {
            btn.addEventListener('click', () => animateThemeChange(currentTheme() === 'light' ? 'dark' : 'light', btn, true));
        });

        let stored = null;
        try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}

        // Sem preferência salva: deixa o visitante ver o tema claro por um instante e escurece sozinho
        if (!stored && !REDUCED_MOTION) {
            document.addEventListener('portcraft:loaded', () => {
                setTimeout(() => {
                    if (currentTheme() === 'light') animateThemeChange('dark', toggles[0], false);
                }, 1400);
            }, { once: true });
        }
    }

    /* ═══════════════ BOOT ═══════════════ */
    document.addEventListener('DOMContentLoaded', () => {
        injectStats();
        renderFilterTabs();
        renderProjects();
        initSearch();
        initModal();
        initBuildLog();
        initNavbar();
        initReveal();
        initCounters();
        initTypedRole();
        initCopy();
        initYear();
        initParticles();
        initHorizon();
        initScrollProgress();
        initLoader();
        initTheme();
    });
})();
