const accordionData = [
    {
        title: "01. Frontend Architecture Overview",
        content: "This module handles foundational layout structures using pure HTML5 semantic elements and CSS Grid containers. It ensures high performance, zero external framework dependencies, and a fully modular design pattern that scales effortlessly across modern desktop and mobile browsers."
    },
    {
        title: "02. Event Delegation & State Control",
        content: "By leveraging vanilla JavaScript event listeners, this component tracks user interactions in real time. Clicking any down arrow updates global click counters, toggles active animation classes, and synchronizes state seamlessly with side panels without page reloads."
    },
    {
        title: "03. Dynamic Timestamp Generator",
        content: "Every single interaction triggers a precise local time calculation using the native JavaScript Date object. This timestamp is instantly bound to the DOM element, providing exact auditing and tracking data for every opened section."
    },
    {
        title: "04. Scrollable Container Layout",
        content: "Engineered with custom CSS overflow properties and sleek webkit scrollbars. This layout ensures users can comfortably navigate through multiple expandable items while maintaining a clean, fixed-height viewport aesthetic on the dashboard."
    },
    {
        title: "05. Responsive Grid Systems",
        content: "Built using fluid 3-column CSS Grid templates that automatically adapt to screen size variations. On smaller viewports or mobile devices, columns stack gracefully into a single unified feed without breaking alignment."
    },
    {
        title: "06. Performance & Optimization",
        content: "Optimized for maximum execution speed, utilizing hardware-accelerated CSS transitions for smooth height expansions and rotation effects. Memory consumption is kept exceptionally low through clean DOM node generation."
    },
    {
        title: "07. Advanced Security Protocols",
        content: "Implements strict input sanitization, secure DOM property assignments, and cross-site scripting (XSS) prevention safeguards to ensure your frontend components remain completely safe against potential vulnerabilities."
    },
    {
        title: "08. Automated State Persistence",
        content: "Tracks active components across user sessions, allowing dashboards to remember expanded drawer states, user click metrics, and historical logs automatically using client-side caching utilities."
    },
    {
        title: "09. Accessibility & ARIA Support",
        content: "Fully integrated with WAI-ARIA standards, utilizing dynamic aria-expanded attributes, keyboard navigability support, and high-contrast styling tokens for screen readers and accessibility compliance."
    },
    {
        title: "10. Scalable Deployment Pipelines",
        content: "Structured for seamless integration with modern CI/CD workflows, Git version control systems, and automated build tools to guarantee reliable staging and production deployments."
    }
];

const container = document.getElementById('accordionContainer');
const clickCounterEl = document.getElementById('clickCounter');
const activeCountEl = document.getElementById('activeCount');
const activityFeed = document.getElementById('activityFeed');

const expandAllBtn = document.getElementById('expandAllBtn');
const collapseAllBtn = document.getElementById('collapseAllBtn');
const resetBtn = document.getElementById('resetBtn');

let totalClicks = 0;

// 1. Dynamically render all 10 accordion items
accordionData.forEach((item, index) => {
    const itemEl = document.createElement('div');
    itemEl.classList.add('accordion-item');
    if (index === 0) itemEl.classList.add('active'); // Open first by default

    itemEl.innerHTML = `
        <button class="accordion-header" aria-expanded="${index === 0}">
            <span>${item.title}</span>
            <svg class="arrow-icon" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </button>
        <div class="accordion-body">
            <p>${item.content}</p>
            <span class="timestamp">Expanded at: --:--:--</span>
        </div>
    `;

    container.appendChild(itemEl);
});

const accordionItems = document.querySelectorAll('.accordion-item');

function updateActiveCount() {
    const activeItems = document.querySelectorAll('.accordion-item.active').length;
    activeCountEl.textContent = `${activeItems} / ${accordionItems.length}`;
}

// Helper to set correct dynamic height via JavaScript scrollHeight
function setAccordionHeight(item, isOpen) {
    const body = item.querySelector('.accordion-body');
    if (isOpen) {
        body.style.maxHeight = body.scrollHeight + 30 + 'px';
        body.style.paddingBottom = '18px';
    } else {
        body.style.maxHeight = '0px';
        body.style.paddingBottom = '0px';
    }
}

// Initialize first item's open height on load
const firstBody = accordionItems[0].querySelector('.accordion-body');
firstBody.style.maxHeight = firstBody.scrollHeight + 30 + 'px';
firstBody.style.paddingBottom = '18px';
updateActiveCount();

function logActivity(text) {
    const placeholder = activityFeed.querySelector('.placeholder');
    if (placeholder) placeholder.remove();

    const li = document.createElement('li');
    li.classList.add('feed-item');
    const time = new Date().toLocaleTimeString();
    li.textContent = `${text} [${time}]`;
    
    activityFeed.prepend(li);
}

// 2. Accordion click handlers with dynamic height calculation
accordionItems.forEach((item, index) => {
    const header = item.querySelector('.accordion-header');
    const timestampSpan = item.querySelector('.timestamp');

    header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        if (isOpen) {
            item.classList.remove('active');
            header.setAttribute('aria-expanded', 'false');
            setAccordionHeight(item, false);
            logActivity(`Collapsed module #${index + 1}`);
        } else {
            item.classList.add('active');
            header.setAttribute('aria-expanded', 'true');
            
            const now = new Date();
            timestampSpan.textContent = `Expanded at: ${now.toLocaleTimeString()}`;
            
            setAccordionHeight(item, true);
            
            totalClicks++;
            clickCounterEl.textContent = `Clicks: ${totalClicks}`;
            logActivity(`Expanded module #${index + 1}`);
        }
        updateActiveCount();
    });
});

// 3. Control Actions
expandAllBtn.addEventListener('click', () => {
    accordionItems.forEach(item => {
        item.classList.add('active');
        item.querySelector('.accordion-header').setAttribute('aria-expanded', 'true');
        const timestampSpan = item.querySelector('.timestamp');
        timestampSpan.textContent = `Expanded at: ${new Date().toLocaleTimeString()}`;
        setAccordionHeight(item, true);
    });
    updateActiveCount();
    logActivity('Expanded all modules');
});

collapseAllBtn.addEventListener('click', () => {
    accordionItems.forEach(item => {
        item.classList.remove('active');
        item.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        setAccordionHeight(item, false);
    });
    updateActiveCount();
    logActivity('Collapsed all modules');
});

resetBtn.addEventListener('click', () => {
    totalClicks = 0;
    clickCounterEl.textContent = `Clicks: 0`;
    accordionItems.forEach(item => {
        item.classList.remove('active');
        item.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        setAccordionHeight(item, false);
    });
    updateActiveCount();
    activityFeed.innerHTML = `<li class="feed-item placeholder">No interactions yet...</li>`;
    logActivity('Dashboard state reset');
});