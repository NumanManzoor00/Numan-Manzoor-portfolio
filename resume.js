/**
 * Smart Resume Checker & AI Career Assistant Logic
 */

// Preloaded Noman's resume text
const NOMAN_RESUME_TEXT = `NOMAN MANZOOR
AI Automation Developer & Full Stack Developer
Email: numanmanzoor500@gmail.com
LinkedIn: www.linkedin.com/in/noman-manzoor
GitHub: https://github.com/NumanManzoor00

SUMMARY
Passionate AI Automation Developer and Full Stack Developer focused on building intelligent systems and modern web applications that solve real-world problems.

EXPERIENCE & PROJECTS
1. AI Automation System:
Designed and built custom workflows in n8n and Make to automate business operations, utilizing LangChain and LLM prompt engineering.
2. Full Stack Web Application:
Developed a robust responsive web dashboard using React, Node.js, Express, MongoDB, and integrated third-party REST APIs and secure authentication.
3. 3D Portfolio Experience:
Built an interactive 3D WebGL web application using Three.js and custom CSS animations, creating a state-of-the-art interactive world.

TECHNICAL SKILLS
- AI Automation: Workflows (n8n, Make), AI Agents, Prompt Systems, LLMs (OpenAI GPT, Anthropic Claude)
- Full Stack: HTML5, CSS3, React, Node.js, Python, JavaScript
- Databases: SQL, NoSQL (MongoDB, PostgreSQL)
- System Design: API Development, RESTful integrations, UI/UX prototyping`;

// Parsing keywords
const KEYWORDS = {
    frontend: ['react', 'html', 'css', 'frontend', 'ui', 'ux', 'javascript', 'design', 'three.js', 'three', 'webgl', 'styling', 'canvas', 'tailwind'],
    backend: ['node', 'python', 'sql', 'nosql', 'postgres', 'mysql', 'mongo', 'database', 'api', 'rest', 'backend', 'express', 'django', 'flask', 'server'],
    ai: ['ai', 'automation', 'agent', 'prompt', 'workflow', 'n8n', 'make', 'llm', 'openai', 'langchain', 'copilot', 'gpt', 'claude', 'chatgpt', 'workflows']
};

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('resume-upload');
    const textarea = document.getElementById('resume-text');
    const btnLoadNoman = document.getElementById('btn-load-noman');
    const btnAnalyze = document.getElementById('btn-analyze');
    const dashboard = document.getElementById('analysis-dashboard');
    const scanner = document.getElementById('scanner-line');

    // 1. Drag & Drop Handlers
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
            alert('Please upload a plain text file (.txt).');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            textarea.value = e.target.result;
        };
        reader.readAsText(file);
    }

    // 2. Load Noman's Resume
    btnLoadNoman.addEventListener('click', () => {
        textarea.value = NOMAN_RESUME_TEXT;
        // Scroll to textarea
        textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // 3. Analyze Resume
    btnAnalyze.addEventListener('click', () => {
        const text = textarea.value.trim();
        if (!text) {
            alert('Please paste or upload a resume to run the analysis!');
            return;
        }

        // Show scanner animation
        scanner.style.display = 'block';
        dashboard.classList.remove('hidden');
        dashboard.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Simulate AI analysis delay
        setTimeout(() => {
            scanner.style.display = 'none';
            runAnalysis(text);
        }, 2000); // 2s scanning animation
    });

    // 4. Analysis Logic
    function runAnalysis(text) {
        const lowerText = text.toLowerCase();
        
        // Count keyword occurrences
        const counts = { frontend: 0, backend: 0, ai: 0 };
        const foundKeywords = [];

        // Frontend check
        KEYWORDS.frontend.forEach(kw => {
            if (lowerText.includes(kw)) {
                counts.frontend++;
                foundKeywords.push(kw);
            }
        });

        // Backend check
        KEYWORDS.backend.forEach(kw => {
            if (lowerText.includes(kw)) {
                counts.backend++;
                foundKeywords.push(kw);
            }
        });

        // AI check
        KEYWORDS.ai.forEach(kw => {
            if (lowerText.includes(kw)) {
                counts.ai++;
                foundKeywords.push(kw);
            }
        });

        // Calculate Scores (Base 35% if anything is written, increment up to 100%)
        const calculateScore = (count, maxKeywords) => {
            if (count === 0) return Math.floor(10 + Math.random() * 15); // Random low score
            const calculated = Math.floor(35 + (count / maxKeywords) * 65);
            return Math.min(calculated, 100);
        };

        const frontendScore = calculateScore(counts.frontend, KEYWORDS.frontend.length - 3);
        const backendScore = calculateScore(counts.backend, KEYWORDS.backend.length - 3);
        const aiScore = calculateScore(counts.ai, KEYWORDS.ai.length - 2);

        // Role Compatibility percentages
        const aiEngineerFit = Math.min(Math.floor(aiScore * 0.75 + backendScore * 0.2 + frontendScore * 0.05), 100);
        const fullstackFit = Math.min(Math.floor(frontendScore * 0.45 + backendScore * 0.45 + aiScore * 0.1), 100);

        // Update SVG circular progress rings
        updateCircularProgress('fit-ai-engineer', aiEngineerFit);
        updateCircularProgress('fit-fullstack', fullstackFit);

        // Update horizontal progress bars
        animateBar('bar-frontend', 'score-frontend', frontendScore);
        animateBar('bar-backend', 'score-backend', backendScore);
        animateBar('bar-ai', 'score-ai', aiScore);

        // Render Keywords tags
        const tagsContainer = document.getElementById('resume-keywords');
        tagsContainer.innerHTML = '';
        
        // Take unique keywords
        const uniqueKeywords = [...new Set(foundKeywords)].slice(0, 15);
        if (uniqueKeywords.length === 0) {
            tagsContainer.innerHTML = '<span class="tag">No relevant technical keywords found</span>';
        } else {
            uniqueKeywords.forEach(kw => {
                const span = document.createElement('span');
                span.className = 'tag';
                span.textContent = kw.toUpperCase();
                tagsContainer.appendChild(span);
            });
        }

        // Build suggestions list
        const suggestionList = document.getElementById('suggestion-list');
        suggestionList.innerHTML = '';

        const suggestions = [];
        if (aiEngineerFit > 75) {
            suggestions.push("<strong>Strong AI Engineer Fit:</strong> Excellent knowledge base in workflow tools (n8n/Make). Focus on implementing multi-agent paradigms next.");
        } else {
            suggestions.push("<strong>AI Skill Opportunity:</strong> Broaden expertise in LLM orchestrators (LangChain) and prompt workflows to raise AI automation compatibility.");
        }

        if (fullstackFit > 75) {
            suggestions.push("<strong>Robust Full Stack Fit:</strong> Highly compatible skill profile. Consider learning React SSR (Next.js) and Docker-based containerization for deployment.");
        } else {
            suggestions.push("<strong>Full Stack Advice:</strong> Add more backend Node/Python systems and database projects to balance frontend competencies.");
        }

        if (counts.backend === 0 || counts.frontend === 0) {
            suggestions.push("<strong>Architecture Recommendation:</strong> Integrate APIs and databases within client applications to strengthen design portfolios.");
        } else {
            suggestions.push("<strong>Optimized Workflow:</strong> Standardize API design (GraphQL/REST) and deploy monitoring systems to improve system scalability.");
        }

        suggestions.forEach(sug => {
            const li = document.createElement('li');
            li.innerHTML = sug;
            suggestionList.appendChild(li);
        });
    }

    // Circular SVG progress ring handler
    function updateCircularProgress(elementId, targetPercent) {
        const wrapper = document.getElementById(elementId);
        const circle = wrapper.querySelector('.progress-ring__circle');
        const textVal = wrapper.querySelector('.progress-value');
        
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        
        // Counter animation
        let currentPercent = 0;
        const interval = setInterval(() => {
            if (currentPercent >= targetPercent) {
                clearInterval(interval);
            } else {
                currentPercent++;
                textVal.textContent = `${currentPercent}%`;
                const offset = circumference - (currentPercent / 100) * circumference;
                circle.style.strokeDashoffset = offset;
            }
        }, 12);
    }

    // Horizontal bar animator
    function animateBar(barId, labelId, targetVal) {
        const bar = document.getElementById(barId);
        const label = document.getElementById(labelId);
        
        let currentPercent = 0;
        bar.style.width = '0%';
        
        const interval = setInterval(() => {
            if (currentPercent >= targetVal) {
                clearInterval(interval);
            } else {
                currentPercent++;
                label.textContent = `${currentPercent}%`;
                bar.style.width = `${currentPercent}%`;
            }
        }, 12);
    }
});
