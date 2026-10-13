const accordionData = [
    { 
        title: "01. PixelForge Studios",
        content: "We turn ambitious concepts into playable realities. Balancing cutting-edge engine architecture with meticulous environmental storytelling"
    },
    {
        title: "02. Sprite & Script",
        content: "Welcome to my digital workspace. As an independent game designer and developer, I handle everything from character logic to pixel positioning."
    },
    {
        title: "03. Engine & Element",
        content: " Great games are built on robust frameworks. My work as a developer centers on writing clean, optimized systems."
    },
    {
        title: "04. Lanzo Game Designer, Worldbuilder & Programmer",
        content: " I design, program, and iterate interactive experiences from initial concept to final polish. By bridging the gap between mechanical programming."
    },
    {
        title: "05. Neon Horizon Labs",
        content: "Where mood meets mechanics. We specialize in developing stylized games that emphasize immersive atmosphere, striking visuals."
    },
    {
        title: "06. The Glitch Arcade",
        content: " Bringing the nostalgic charm of classic arcade games into the modern era."
    },
    {
        title: "07. Core Loop Design",
        content: "Every great game starts with a perfect feel. This space is dedicated to the art of prototyping and refining gameplay."
    },
    {
        title: "08. Lanzo Codes Games",
        content: "Tracks active components across user sessions, allowing dashboards to remember expanded drawer states, user click metrics, and historical logs automatically using client-side caching utilities."
    },
    {
        title: "09. Polygon Sandbox |",
        content: "Pushing the boundaries of real-time 3D rendering and gameplay systems. Focused heavily on modern game engines."
    },
    {
        title: "10. Syntax Game Labs",
        content: "Elegant development solutions for modern gaming platforms. Specializing in cross-platform implementation."
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

// 1. Dynamically render accordion items
accordionData.forEach((item, index) => {
    const itemEl = document.createElement('div');
    itemEl.classList.add('accordion-item');
    if (index === 0) itemEl.classList.add('active'); 

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

// Improved height calculation function with a safety buffer
function setAccordionHeight(item, isOpen) {
    const body = item.querySelector('.accordion-body');
    if (isOpen) {
        body.style.maxHeight = (body.scrollHeight + 40) + 'px';
        body.style.paddingBottom = '18px';
    } else {
        body.style.maxHeight = '0px';
        body.style.paddingBottom = '0px';
    }
}

// Initialize first item open height on load
const firstBody = accordionItems[0].querySelector('.accordion-body');
firstBody.style.maxHeight = (firstBody.scrollHeight + 40) + 'px';
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

// 2. Click handlers with slight delay to ensure accurate scrollHeight rendering
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
            
            // Re-calculate slightly after to prevent layout jumps when opening multiple items
            setTimeout(() => setAccordionHeight(item, true), 50);

            totalClicks++;
            clickCounterEl.textContent = `Clicks: ${totalClicks}`;
            logActivity(`Expanded Page #${index + 1}`);
        }
        updateActiveCount();
    });
});

expandAllBtn.addEventListener('click', () => {
    accordionItems.forEach(item => {
        item.classList.add('active');
        item.querySelector('.accordion-header').setAttribute('aria-expanded', 'true');
        const timestampSpan = item.querySelector('.timestamp');
        timestampSpan.textContent = `Expanded at: ${new Date().toLocaleTimeString()}`;
        setAccordionHeight(item, true);
    });
    updateActiveCount();
    logActivity('Expanded all Pages');
});

collapseAllBtn.addEventListener('click', () => {
    accordionItems.forEach(item => {
        item.classList.remove('active');
        item.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        setAccordionHeight(item, false);
    });
    updateActiveCount();
    logActivity('Collapsed all Pages');
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