// SVG Icons for Resources
const icons = {
    math: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>`,

    science: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19.4 15a2 2 0 0 1 .6 1.4V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3.6a2 2 0 0 1 .6-1.4L12 8l6.4 7z"/>
    </svg>`,

    english: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M2 12h20M12 2v20"/>
    </svg>`,

    language: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>`,

    history: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
    </svg>`,

    ict: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <path d="M8 21h8M12 17v4"/>
    </svg>`
};

// Resource Data with SVG Icons
const resources = [
    {
        id: 1,
        title: "Mathematics for JHS",
        subject: "math",
        level: "jhs",
        description: "Comprehensive mathematics materials covering the JHS curriculum with practice problems.",
        format: "PDF",
        language: "English",
        viewLink: "https://www.khanacademy.org/math",
        downloadLink: "https://www.mathsghana.com/downloads/jhs-math-curriculum.pdf",
        icon: icons.math
    },
    {
        id: 2,
        title: "Integrated Science for SHS",
        subject: "science",
        level: "shs",
        description: "Detailed science notes and experiments for SHS students.",
        format: "PDF",
        language: "English",
        viewLink: "https://www.ck12.org/science/",
        downloadLink: "https://www.ghanascience.org.gh/downloads/integrated-science.pdf",
        icon: icons.science
    },
    {
        id: 3,
        title: "Twi Language Basics",
        subject: "ghanaian-languages",
        level: "primary",
        description: "Learn basic Twi with interactive exercises and audio clips.",
        format: "Interactive",
        language: "Twi",
        viewLink: "https://www.learnakan.com",
        downloadLink: "",
        icon: icons.language
    },
    {
        id: 4,
        title: "English Comprehension",
        subject: "english",
        level: "jhs",
        description: "Improve reading comprehension skills with graded passages.",
        format: "PDF",
        language: "English",
        viewLink: "https://www.britishcouncil.org.gh/english",
        downloadLink: "https://www.ghanaenglish.org/downloads/jhs-english.pdf",
        icon: icons.english
    },
    {
        id: 5,
        title: "Computer Basics",
        subject: "ict",
        level: "shs",
        description: "Introduction to computers and digital literacy.",
        format: "Interactive",
        language: "English",
        viewLink: "https://digitalskills.withgoogle.com/",
        downloadLink: "",
        icon: icons.ict
    }
];

// Tutor Data (without images)
const tutors = [
    {
        id: 1,
        name: "Kwame Asante",
        subjects: ["math", "science"],
        location: "Accra",
        bio: "Experienced math and science tutor with 5 years of teaching JHS students.",
        contact: "tel:+233241234567"
    },
    {
        id: 2,
        name: "Ama Serwaa",
        subjects: ["english", "ghanaian-languages"],
        location: "Kumasi",
        bio: "English and Twi language specialist with a passion for literacy.",
        contact: "tel:+233244567890"
    },
    {
        id: 3,
        name: "Yaw Boateng",
        subjects: ["math"],
        location: "Tamale",
        bio: "Math enthusiast who makes complex concepts simple to understand.",
        contact: "tel:+233245678901"
    },
    {
        id: 4,
        name: "Esi Mensah",
        subjects: ["science", "math"],
        location: "Cape Coast",
        bio: "Science teacher with a focus on practical, hands-on learning.",
        contact: "tel:+233247890123"
    }
];

// DOM Elements
const resourceContainer = document.getElementById('resource-container');
const subjectFilter = document.getElementById('subject-filter');
const levelFilter = document.getElementById('level-filter');
const tutorResultsContainer = document.getElementById('tutor-results-container');
const locationSearch = document.getElementById('location-search');
const searchTutorsBtn = document.getElementById('search-tutors');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mainNav = document.querySelector('.main-nav');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    displayResources(resources);
    displayTutors(tutors);
    
    subjectFilter.addEventListener('change', filterResources);
    levelFilter.addEventListener('change', filterResources);
    searchTutorsBtn.addEventListener('click', searchTutors);
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').then(registration => {
                console.log('ServiceWorker registration successful');
            }).catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
});

// Display resources with SVG icons
function displayResources(resourcesToDisplay) {
    resourceContainer.innerHTML = '';
    
    resourcesToDisplay.forEach((resource, index) => {
        const resourceCard = document.createElement('div');
        resourceCard.className = 'resource-card fade-in';
        resourceCard.style.animationDelay = `${index * 0.1}s`;
        resourceCard.dataset.subject = resource.subject;
        
        const downloadButton = resource.downloadLink 
            ? `<a href="${resource.downloadLink}" target="_blank" class="btn secondary">Download</a>`
            : '';
        
        resourceCard.innerHTML = `
            <div class="resource-icon">
                ${resource.icon}
            </div>
            <div class="resource-content">
                <h3 class="resource-title">${resource.title}</h3>
                <div class="resource-meta">
                    <span>${resource.level.toUpperCase()}</span>
                    <span>${resource.format}</span>
                </div>
                <p class="resource-description">${resource.description}</p>
                <div class="resource-actions">
                    <a href="${resource.viewLink}" target="_blank" class="btn primary">View Online</a>
                    ${downloadButton}
                </div>
            </div>
        `;
        
        resourceContainer.appendChild(resourceCard);
    });
}

// Display tutors without images
function displayTutors(tutorsToDisplay) {
    tutorResultsContainer.innerHTML = '';
    
    if (tutorsToDisplay.length === 0) {
        tutorResultsContainer.innerHTML = `
            <div class="no-results">
                <p>No tutors found matching your criteria. Try adjusting your search.</p>
            </div>
        `;
        return;
    }
    
    tutorsToDisplay.forEach((tutor, index) => {
        const tutorCard = document.createElement('div');
        tutorCard.className = 'tutor-card fade-in';
        tutorCard.style.animationDelay = `${index * 0.1}s`;
        
        const subjectTags = tutor.subjects.map(subject => {
            let displaySubject;
            switch(subject) {
                case 'math': displaySubject = 'Mathematics'; break;
                case 'science': displaySubject = 'Science'; break;
                case 'english': displaySubject = 'English'; break;
                case 'ghanaian-languages': displaySubject = 'Ghanaian Languages'; break;
                case 'ict': displaySubject = 'ICT'; break;
                case 'history': displaySubject = 'History'; break;
                default: displaySubject = subject;
            }
            return `<span class="subject-tag">${displaySubject}</span>`;
        }).join('');
        
        tutorCard.innerHTML = `
            <div class="tutor-info">
                <h3>${tutor.name}</h3>
                <div class="tutor-subjects">${subjectTags}</div>
                <p class="tutor-bio">${tutor.bio}</p>
                <div class="tutor-location">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>${tutor.location}</span>
                </div>
                <a href="${tutor.contact}" class="btn primary">Contact Tutor</a>
            </div>
        `;
        
        tutorResultsContainer.appendChild(tutorCard);
    });
}

// Filter functions and other utilities remain the same...
function filterResources() {
    const selectedSubject = subjectFilter.value;
    const selectedLevel = levelFilter.value;
    
    let filteredResources = resources;
    
    if (selectedSubject !== 'all') {
        filteredResources = filteredResources.filter(resource => resource.subject === selectedSubject);
    }
    
    if (selectedLevel !== 'all') {
        filteredResources = filteredResources.filter(resource => resource.level === selectedLevel);
    }
    
    displayResources(filteredResources);
}

function searchTutors() {
    const locationQuery = locationSearch.value.trim().toLowerCase();
    
    if (locationQuery === '') {
        displayTutors(tutors);
        return;
    }
    
    const filteredTutors = tutors.filter(tutor => 
        tutor.location.toLowerCase().includes(locationQuery)
    );
    
    displayTutors(filteredTutors);
}

function toggleMobileMenu() {
    mainNav.classList.toggle('active');
    mobileMenuToggle.textContent = mainNav.classList.contains('active') ? '✕' : '☰';
}

// Offline detection
window.addEventListener('offline', showOfflineStatus);
window.addEventListener('online', showOnlineStatus);

function showOfflineStatus() {
    showNotification("You're currently offline. Some features may not be available.");
}

function showOnlineStatus() {
    showNotification("Your connection has been restored.");
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}