/**
 * Portfolio script — public site only.
 * SECURITY: Never add API keys, private tokens, or secrets here. Anything sensitive
 * belongs on a server (env vars), not in HTML/JS sent to every visitor’s browser.
 * This file only uses public URLs (LeetCard, ghchart) and local theme preference.
 */
document.addEventListener('DOMContentLoaded', () => {
    const safeLocalStorage = {
        get(key) {
            try {
                return localStorage.getItem(key);
            } catch {
                return null;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, value);
            } catch {
                /* Private mode, quota, or policy — site still works without persistence */
            }
        }
    };

    let lastScrollTop = 0;
    const header = document.querySelector('.main-header');

    window.addEventListener('scroll', () => {
        if (!header) return;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.top = '-100px';
        } else {
            header.style.top = '0';
        }
        lastScrollTop = scrollTop;
    });

    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const closeMenu = document.getElementById('close-menu');

    const toggleMenu = (show) => {
        if (!mobileMenuToggle || !mobileNav || !mobileOverlay) return;
        mobileMenuToggle.classList.toggle('active', show);
        mobileNav.classList.toggle('active', show);
        mobileOverlay.classList.toggle('active', show);
        document.body.style.overflow = show ? 'hidden' : 'auto';
    };

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            const isActive = mobileNav.classList.contains('active');
            toggleMenu(!isActive);
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', () => toggleMenu(false));
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', () => toggleMenu(false));
    }

    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle?.querySelector('i');
    const leetImg = document.getElementById('leetcode-stats-card');
    const ghImg = document.getElementById('github-contrib-chart');

    const attachChartFallback = (img, message) => {
        if (!img || !img.parentElement) return;
        img.addEventListener('error', function onImgError() {
            img.removeEventListener('error', onImgError);
            img.setAttribute('hidden', '');
            const note = document.createElement('p');
            note.className = 'embed-fallback';
            note.textContent = message;
            img.parentElement.appendChild(note);
        });
    };

    attachChartFallback(
        ghImg,
        'Contribution chart did not load (network or content blocker). Please use the GitHub link below—my profile is public.'
    );
    attachChartFallback(
        leetImg,
        'LeetCode stats card did not load. Use the LeetCode link below; no API key is required for you to view my profile.'
    );

    const updateThemeIcon = (theme) => {
        if (!themeIcon) return;
        if (theme === 'light') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    };

    const syncLeetCardTheme = (theme, bustCache) => {
        if (!leetImg || leetImg.hasAttribute('hidden')) return;
        const user = leetImg.dataset.leetcodeUser || 'Ujjwal_Dikshit';
        const t = theme === 'light' ? 'light' : 'dark';
        const bust = bustCache ? `&_=${Date.now()}` : '';
        leetImg.src = `https://leetcard.jacoblin.cool/${encodeURIComponent(user)}?theme=${t}&extension=heatmap${bust}`;
    };

    const syncGithubChart = (theme) => {
        if (!ghImg || ghImg.hasAttribute('hidden')) return;
        const user = ghImg.dataset.githubUser || 'UjjwalDikshit';
        const path =
            theme === 'dark'
                ? `https://ghchart.rshah.org/39d353/${encodeURIComponent(user)}`
                : `https://ghchart.rshah.org/${encodeURIComponent(user)}`;
        ghImg.src = path;
    };

    const applyTheme = (theme, options = {}) => {
        const bust = Boolean(options.bustCache);
        body.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
        syncLeetCardTheme(theme, bust);
        syncGithubChart(theme);
        safeLocalStorage.set('portfolio-theme', theme);
    };

    if (themeToggle && themeIcon) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme, { bustCache: true });
        });
    }

    const savedTheme = safeLocalStorage.get('portfolio-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
        applyTheme(savedTheme);
    } else {
        syncLeetCardTheme(body.getAttribute('data-theme') || 'dark', false);
        syncGithubChart(body.getAttribute('data-theme') || 'dark');
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const chatContainer = document.getElementById('chat-container');
    const userQuery = document.getElementById('user-query');
    const sendQuery = document.getElementById('send-query');

    const portfolioData = {
        greeting:
            "Hi—I’m Ujjwal. Ask me about my coding platform, EasFarm, IIT BHU research, Redis/caching, or how to reach me.",
        skills:
            "I work across MERN, Redis, JWT, microservices, Redux, Tailwind, MongoDB, and MySQL—with strong DSA, OS, OOP, and DBMS fundamentals. Day-to-day I use Git, Postman, Cloudinary, and VS Code.",
        education:
            "I’m pursuing B.Tech IT at NIT Srinagar (2023–2027 expected), CGPA 8.22. My coursework includes DSA, DBMS, OOP, OS, Software Engineering, and Web Technologies.",
        interests:
            "I care about scalable backends, caching, and real-time features, and I stay active on LeetCode, GFG, and Codeforces. On campus I lead as Mess Rep and through TEDx and hackathons.",
        contact:
            "Email me at ujjwaldikshit1@gmail.com or call +91-9622209640. LinkedIn: linkedin.com/in/ujjwal-dikshit · GitHub: github.com/UjjwalDikshit · Based in East Champaran, Bihar.",
        discord: "Fastest path: email or LinkedIn.",
        projects:
            "I built (1) a full-stack coding platform—MERN, Redis, JWT, Judge0, Cloudinary, admin CRUD, ~30% responsiveness gains from caching/API work. (2) EasFarm—agri e-commerce with microservice-style chat, blogging, ~35% query latency improvement, ~30% API gains with Redis.",
        goals:
            "I’m targeting software engineering / intern roles where performance and reliability matter, and I’m open to campus-facing roles that mix building with coordination.",
        dsa: "I’ve solved 1000+ problems across LeetCode, GFG, and Codeforces. My resume lists LeetCode rank 1739—I’ll align the wording with whatever metric you care about before we discuss it.",
        research:
            "Winter 2025 I was a research intern at IIT BHU on genetic algorithms—adaptive search, neural network optimization, and structured technical reporting.",
        leadership:
            "I’m Mess Representative for 500+ students; TEDx research (2024) and web (2025); 3rd place Cursor Hackathon among 125+ teams; I mentor juniors.",
        caseStudies:
            "Scroll to Case studies: I break down my coding platform and EasFarm—problem, why naive designs fail, architecture sketches, trade-offs, and measured impact.",
        systems:
            "I think in constraints: URL shortener (Redis + indexed store), chat (partitioning, presence), rate limiting (Redis counters—real API secrets never go in the browser). I also compare REST vs GraphQL and JWT vs sessions by trade-off, not hype.",
        hireYou:
            "Interview me if you want someone who ships MERN + Redis with numbers behind the claims, owns outcomes outside the IDE, and can whiteboard trade-offs calmly under time pressure.",
        security:
            "This portfolio is static. There are no API keys or private tokens in the page—only public embeds (charts/cards). If I add a contact backend or real AI later, keys stay in server environment variables, not in JS you can View Source.",
        default: "Scroll to Case studies, Systems, or Activity—or email me at ujjwaldikshit1@gmail.com."
    };

    const addMessage = (text, sender) => {
        if (!chatContainer) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        const label = document.createElement('strong');
        label.textContent = sender === 'bot' ? 'Assistant: ' : 'You: ';
        messageDiv.appendChild(label);
        messageDiv.appendChild(document.createTextNode(text));
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    const handleChat = () => {
        if (!userQuery || !chatContainer) return;
        const raw = userQuery.value;
        const query = raw.trim().toLowerCase();
        if (!query) return;

        addMessage(raw.trim(), 'user');
        userQuery.value = '';

        setTimeout(() => {
            let response = portfolioData.default;

            if (
                query === 'hi' ||
                query === 'hello' ||
                query === 'hey' ||
                query.includes('hello ujjwal') ||
                query.includes('hi ujjwal') ||
                query === 'namaste'
            ) {
                response = portfolioData.greeting;
            } else if (query.includes('api') && query.includes('key')) {
                response = portfolioData.security;
            } else if (query.includes('secret') || query.includes('token') || query.includes('password')) {
                response = portfolioData.security;
            } else if (query.includes('skill') || query.includes('tech') || query.includes('language') || query.includes('stack')) {
                response = portfolioData.skills;
            } else if (query.includes('education') || query.includes('college') || query.includes('university') || query.includes('nit')) {
                response = portfolioData.education;
            } else if (query.includes('interest') || query.includes('machine learning') || /\b(ai|ml)\b/.test(query)) {
                response = portfolioData.interests;
            } else if (query.includes('contact') || query.includes('reach') || query.includes('email') || query.includes('phone')) {
                response = portfolioData.contact;
            } else if (query.includes('discord')) {
                response = portfolioData.discord;
            } else if (query.includes('why hire') || query.includes('why should') || query.includes('hire you')) {
                response = portfolioData.hireYou;
            } else if (query.includes('case stud') || query.includes('deep dive') || query.includes('architecture') || query.includes('tradeoff')) {
                response = portfolioData.caseStudies;
            } else if (
                query.includes('system design') ||
                query.includes('url short') ||
                query.includes('rate limit') ||
                query.includes('redis') ||
                query.includes('graphql') ||
                query.includes('jwt vs')
            ) {
                response = portfolioData.systems;
            } else if (
                query.includes('project') ||
                query.includes('build') ||
                query.includes('mern') ||
                query.includes('easfarm') ||
                query.includes('coding platform')
            ) {
                response = portfolioData.projects;
            } else if (query.includes('goal') || query.includes('future') || query.includes('intern')) {
                response = portfolioData.goals;
            } else if (
                query.includes('leetcode') ||
                query.includes('codeforces') ||
                query.includes('dsa') ||
                query.includes('competitive') ||
                query.includes('gfg') ||
                query.includes('geeks')
            ) {
                response = portfolioData.dsa;
            } else if (query.includes('iit') || query.includes('bhu') || query.includes('research') || query.includes('genetic')) {
                response = portfolioData.research;
            } else if (query.includes('lead') || query.includes('mess') || query.includes('tedx') || query.includes('hackathon') || query.includes('mentor')) {
                response = portfolioData.leadership;
            } else if (query.includes('who') || query.includes('about')) {
                response =
                    "I’m Ujjwal Dikshit—B.Tech IT at NIT Srinagar (CGPA 8.22). I build full-stack systems with Redis and JWT, practice DSA across LC/GFG/CF, and I lead on campus through Mess Rep work, TEDx, and hackathons.";
            }

            addMessage(response, 'bot');
        }, 500);
    };

    if (sendQuery && userQuery && chatContainer) {
        sendQuery.addEventListener('click', handleChat);
        userQuery.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChat();
        });
    }

    const clearBtn = document.getElementById('clear-chat');
    const refreshBtn = document.getElementById('refresh-chat');

    const resetChat = () => {
        if (!chatContainer) return;
        chatContainer.innerHTML = `
            <div class="chat-message bot-message">
                <strong>Assistant:</strong> Hi—ask me about my projects, IIT BHU work, or DSA. No API keys are used here; it’s all local text matching.
            </div>
        `;
    };

    if (chatContainer && clearBtn) {
        clearBtn.addEventListener('click', resetChat);
    }

    if (chatContainer && refreshBtn) {
        refreshBtn.addEventListener('click', resetChat);
    }

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }
});
