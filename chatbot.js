/**
 * Alex - AI Assistant Chatbot Engine
 * Manages conversation flows for both embedded and floating chat widgets.
 */

// Knowledge base containing information about Noman
const ALEX_KNOWLEDGE_BASE = {
    greetings: {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'yo', 'sup'],
        responses: [
            "Hi there! I'm Alex, Noman's virtual assistant. How can I help you explore Noman's portfolio today?",
            "Hello! Welcome to Noman's portfolio. I can tell you about his skills, projects, or how to contact him. What's on your mind?",
            "Hey! Great to meet you. Ask me anything about Noman's work in AI Automation and Full Stack development."
        ]
    },
    skills: {
        keywords: ['skills', 'skill', 'expertise', 'know', 'capable', 'good at', 'competenc', 'expert'],
        responses: [
            "Noman is a passionate <strong>AI Automation Developer</strong> and <strong>Full Stack Developer</strong>. His main skills are:<br><br>" +
            "• <strong>AI Automation:</strong> Building workflows (n8n, Make), AI agents, custom prompt systems, and LLM integration.<br>" +
            "• <strong>Full Stack:</strong> React, JavaScript, HTML5, CSS3, Node.js, Python, and SQL/NoSQL databases.<br>" +
            "• <strong>APIs:</strong> Custom API design and robust system integration.<br>" +
            "• <strong>UI/UX Design:</strong> Creating clean, highly interactive, and responsive web applications."
        ]
    },
    projects: {
        keywords: ['projects', 'project', 'portfolio', 'build', 'create', 'work', 'codebase', 'experience'],
        responses: [
            "Noman has worked on several exciting projects. Here are three key highlights:<br><br>" +
            "1. <strong>Project 1: AI Automation System:</strong> An intelligent setup styled under the Nano Banana concept, built with n8n/Make to automate business processes using LLM agents.<br>" +
            "2. <strong>Project 2: Full Stack Web Application:</strong> A production-ready app featuring React, Node.js, database integration, user dashboard, and API handling.<br>" +
            "3. <strong>Project 3: 3D Portfolio Experience:</strong> An immersive 3D scene built using Three.js and WebGL that lets users navigate through his work in a visually engaging environment."
        ]
    },
    technologies: {
        keywords: ['tech', 'technology', 'stack', 'languages', 'framework', 'database', 'tools', 'python', 'react', 'node', 'n8n', 'three'],
        responses: [
            "Noman uses a modern tech stack to build smart applications:<br><br>" +
            "• <strong>Languages:</strong> JavaScript, TypeScript, Python, HTML5, CSS3, SQL.<br>" +
            "• <strong>Frameworks & Libraries:</strong> React, Node.js, Express, Three.js.<br>" +
            "• <strong>Automation & AI:</strong> n8n, Make, OpenAI API, LangChain, Claude API.<br>" +
            "• <strong>Databases:</strong> MongoDB, PostgreSQL, MySQL."
        ]
    },
    contact: {
        keywords: ['contact', 'email', 'linkedin', 'github', 'reach', 'message', 'social', 'address', 'phone', 'mail'],
        responses: [
            "You can easily connect with Noman through these channels:<br><br>" +
            "• <strong>Email:</strong> <a href='mailto:numanmanzoor500@gmail.com' style='color: #06b6d4; text-decoration: underline;'>numanmanzoor500@gmail.com</a><br>" +
            "• <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/noman-manzoor' target='_blank' style='color: #06b6d4; text-decoration: underline;'>linkedin.com/in/noman-manzoor</a><br>" +
            "• <strong>GitHub:</strong> <a href='https://github.com/NumanManzoor00' target='_blank' style='color: #06b6d4; text-decoration: underline;'>github.com/NumanManzoor00</a><br><br>" +
            "Feel free to drop him an email or fill out the contact form below!"
        ]
    },
    about: {
        keywords: ['about', 'who is', 'background', 'noman', 'profile', 'developer', 'history', 'career'],
        responses: [
            "Noman Manzoor is an AI Automation Developer and Full Stack Developer. He loves turning complex, challenging ideas into beautiful, scalable digital products.<br><br>" +
            "He focuses on creating systems that are not just functional but also smart and visually engaging. He has hands-on experience in prompt engineering, automated workflows, backend services, and front-end architectures."
        ]
    },
    resume: {
        keywords: ['resume', 'cv', 'checker', 'assistant', 'career', 'job', 'hiring', 'pdf', 'upload'],
        responses: [
            "You can analyze how well your own resume aligns with roles like Full Stack Developer or AI Automation Engineer using Noman's <strong>Smart Resume Checker</strong> in the 'AI Career Assistant' section above! You can also click 'Load Noman's Resume' to check his profile directly."
        ]
    },
    thanks: {
        keywords: ['thank', 'thanks', 'cool', 'awesome', 'great', 'perfect', 'bye', 'goodbye'],
        responses: [
            "You're very welcome! If you have any more questions, just let me know.",
            "Happy to help! Let me know if you want to know more about Noman's projects or skills.",
            "Anytime! Enjoy exploring Noman's 3D portfolio experience."
        ]
    }
};

const ALEX_DEFAULT_RESPONSE = "I'm not sure I understand that. Try asking about Noman's <strong>skills</strong>, his <strong>projects</strong>, or his <strong>technologies</strong>! You can also use the quick buttons next to the chatbox.";

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements
    const elements = {
        // Embedded Chat
        embeddedMessages: document.getElementById('chat-messages-embedded'),
        embeddedInput: document.getElementById('chat-input-embedded'),
        embeddedSend: document.getElementById('chat-send-embedded'),
        presetButtons: document.querySelectorAll('.preset-btn'),
        
        // Floating Chat
        widgetToggle: document.getElementById('chat-toggle-bubble'),
        widgetWindow: document.getElementById('floating-chat-window'),
        widgetClose: document.getElementById('chat-close-btn'),
        widgetMessages: document.getElementById('chat-messages-floating'),
        widgetInput: document.getElementById('chat-input-floating'),
        widgetSend: document.getElementById('chat-send-floating'),
        widgetBadge: document.querySelector('.chat-badge')
    };

    // 2. State
    let isWidgetOpen = false;

    // 3. Open/Close Floating Widget
    elements.widgetToggle.addEventListener('click', () => {
        isWidgetOpen = !isWidgetOpen;
        if (isWidgetOpen) {
            elements.widgetWindow.classList.remove('hidden');
            elements.widgetBadge.style.display = 'none'; // Clear badge
            elements.widgetInput.focus();
        } else {
            elements.widgetWindow.classList.add('hidden');
        }
    });

    elements.widgetClose.addEventListener('click', (e) => {
        e.stopPropagation();
        isWidgetOpen = false;
        elements.widgetWindow.classList.add('hidden');
    });

    // 4. Send Events (Embedded)
    elements.embeddedSend.addEventListener('click', () => handleSend(elements.embeddedInput, elements.embeddedMessages));
    elements.embeddedInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend(elements.embeddedInput, elements.embeddedMessages);
    });

    // Send Events (Floating)
    elements.widgetSend.addEventListener('click', () => handleSend(elements.widgetInput, elements.widgetMessages));
    elements.widgetInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend(elements.widgetInput, elements.widgetMessages);
    });

    // Preset buttons clicks
    elements.presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.getAttribute('data-query');
            // Populate and send in embedded view
            elements.embeddedInput.value = query;
            handleSend(elements.embeddedInput, elements.embeddedMessages);
        });
    });

    // 5. Handle Send Logic
    function handleSend(inputElement, messagesContainer) {
        const text = inputElement.value.trim();
        if (!text) return;

        // Append User Bubble
        appendMessage(messagesContainer, text, 'user');
        inputElement.value = '';

        // Trigger bot response after delay
        showTypingIndicator(messagesContainer);
        
        setTimeout(() => {
            removeTypingIndicator(messagesContainer);
            const responseText = processQuery(text);
            appendMessage(messagesContainer, responseText, 'bot');
        }, 1000 + Math.random() * 500); // 1.0 - 1.5s typing delay
    }

    // 6. Process User Query
    function processQuery(input) {
        const query = input.toLowerCase();
        
        // Find best match in knowledge base
        for (const category in ALEX_KNOWLEDGE_BASE) {
            const item = ALEX_KNOWLEDGE_BASE[category];
            const hasKeyword = item.keywords.some(kw => query.includes(kw));
            if (hasKeyword) {
                // Return a random response from that category list
                const idx = Math.floor(Math.random() * item.responses.length);
                return item.responses[idx];
            }
        }
        
        return ALEX_DEFAULT_RESPONSE;
    }

    // 7. Render Bubble
    function appendMessage(container, text, sender) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender === 'user' ? 'user-bubble' : 'bot-bubble'}`;
        
        const p = document.createElement('p');
        p.innerHTML = text;
        
        const span = document.createElement('span');
        span.className = 'chat-time';
        span.textContent = timeStr;
        
        bubble.appendChild(p);
        bubble.appendChild(span);
        
        container.appendChild(bubble);
        container.scrollTop = container.scrollHeight;
    }

    // 8. Typing Indicator Helper
    function showTypingIndicator(container) {
        const typingBubble = document.createElement('div');
        typingBubble.className = 'chat-bubble bot-bubble typing-bubble';
        typingBubble.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingBubble.appendChild(dot);
        }
        
        container.appendChild(typingBubble);
        container.scrollTop = container.scrollHeight;
    }

    function removeTypingIndicator(container) {
        const indicator = container.querySelector('#typing-indicator');
        if (indicator) {
            container.removeChild(indicator);
        }
    }
});
