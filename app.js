// --- FIREBASE INITIALIZATION ---
// Ensure you have your correct Firebase config here
const firebaseConfig = {
    apiKey:"AIzaSyB9F6rZyDWdhIMzFBnSL7AfcAxU4UmcczA", // Replace with your actual API key
    authDomain: "educonnect-a9c64.firebaseapp.com",
    projectId: "educonnect-a9c64",
    storageBucket: "educonnect-a9c64.appspot.com",
    messagingSenderId: "670330612315",
    appId: "1:670330612315:web:6a3386011d1286484eed7e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// --- DATABASE REFERENCES ---
const resourcesCollection = db.collection('resources');
const tutorsCollection = db.collection('tutors');

// --- DOM ELEMENT SELECTORS ---
// Navigation & Auth
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginLi = document.getElementById('login-li');
const logoutLi = document.getElementById('logout-li');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mainNav = document.querySelector('.main-nav');

// Auth Modal
const authModal = document.getElementById('auth-modal');
const closeModal = document.querySelector('.close-modal');
const authTitle = document.getElementById('auth-title');
const authToggle = document.getElementById('auth-toggle');
const authSubmit = document.getElementById('auth-submit');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');

// Resources
const resourceContainer = document.getElementById('resource-container');
const subjectFilter = document.getElementById('subject-filter');
const levelFilter = document.getElementById('level-filter');
const addResourceBtn = document.getElementById('add-resource-btn');
const resourceModal = document.getElementById('resource-modal');
const closeResourceModal = document.querySelector('.close-resource-modal');
const resourceSubmitBtn = document.getElementById('resource-submit-btn');

// Tutors
const tutorResultsContainer = document.getElementById('tutor-results-container');
const locationSearch = document.getElementById('location-search');
const searchTutorsBtn = document.getElementById('search-tutors');
const addTutorBtn = document.getElementById('add-tutor-btn');
const tutorModal = document.getElementById('tutor-modal');
const closeTutorModal = document.querySelector('.close-tutor-modal');
const tutorSubmitBtn = document.getElementById('tutor-submit-btn');

// Third-Party API
const holidaysContainer = document.getElementById('holidays-container');

// --- GLOBAL STATE ---
let isSignUp = false;

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function() {
    // Setup all event listeners
    setupEventListeners();

    // Initial data fetch from Firestore and APIs
    fetchAndFilterResources();
    fetchAllTutors();
    fetchHolidays();

    // Listen for auth state changes to update the UI
    auth.onAuthStateChanged(handleAuthStateChange);

    // Register the service worker for PWA capabilities
    registerServiceWorker();
});

// --- EVENT LISTENER SETUP ---
function setupEventListeners() {
    // Navigation
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Authentication
    loginBtn.addEventListener('click', () => { authModal.style.display = 'block'; });
    logoutBtn.addEventListener('click', logoutUser);
    closeModal.addEventListener('click', () => { authModal.style.display = 'none'; });
    authToggle.addEventListener('click', toggleAuthMode);
    authSubmit.addEventListener('click', handleAuthSubmit);

    // Resource Filtering & CRUD
    subjectFilter.addEventListener('change', fetchAndFilterResources);
    levelFilter.addEventListener('change', fetchAndFilterResources);
    addResourceBtn.addEventListener('click', openAddResourceModal);
    closeResourceModal.addEventListener('click', () => { resourceModal.style.display = 'none'; });
    resourceContainer.addEventListener('click', handleResourceActions);
    resourceSubmitBtn.addEventListener('click', handleResourceSubmit);

    // Tutor Search & CRUD
    searchTutorsBtn.addEventListener('click', searchTutors);
    addTutorBtn.addEventListener('click', openAddTutorModal);
    closeTutorModal.addEventListener('click', () => { tutorModal.style.display = 'none'; });
    tutorResultsContainer.addEventListener('click', handleTutorActions);
    tutorSubmitBtn.addEventListener('click', handleTutorSubmit);
}

// --- AUTHENTICATION LOGIC ---
function handleAuthStateChange(user) {
    if (user) {
        // User is logged in
        loginLi.style.display = 'none';
        logoutLi.style.display = 'block';
        addResourceBtn.style.display = 'inline-block';
        addTutorBtn.style.display = 'inline-block';
    } else {
        // User is logged out
        loginLi.style.display = 'block';
        logoutLi.style.display = 'none';
        addResourceBtn.style.display = 'none';
        addTutorBtn.style.display = 'none';
    }
    // Refresh data to show/hide admin buttons on cards
    fetchAndFilterResources();
    fetchAllTutors();
}

function toggleAuthMode() {
    isSignUp = !isSignUp;
    authTitle.textContent = isSignUp ? 'Sign Up' : 'Login';
    authSubmit.textContent = isSignUp ? 'Sign Up' : 'Login';
    authToggle.textContent = isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up';
}

function handleAuthSubmit() {
    const email = authEmail.value;
    const password = authPassword.value;

    if (isSignUp) {
        auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                authModal.style.display = 'none';
                showNotification('Signed up successfully!');
            })
            .catch(error => showNotification(error.message, 'error'));
    } else {
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                authModal.style.display = 'none';
                showNotification('Logged in successfully!');
            })
            .catch(error => showNotification(error.message, 'error'));
    }
}

function logoutUser() {
    auth.signOut();
    showNotification('You have been logged out.');
}

// --- DATA FETCHING & DISPLAY ---
function fetchAndFilterResources() {
    let query = resourcesCollection;
    if (subjectFilter.value !== 'all') query = query.where('subject', '==', subjectFilter.value);
    if (levelFilter.value !== 'all') query = query.where('level', '==', levelFilter.value);

    query.get().then(snapshot => {
        const resources = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        displayResources(resources);
    }).catch(error => console.error("Error fetching resources: ", error));
}

function fetchAllTutors() {
    tutorsCollection.get().then(snapshot => {
        const tutors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        displayTutors(tutors);
    }).catch(error => console.error("Error fetching tutors: ", error));
}

function searchTutors() {
    const locationQuery = locationSearch.value.trim().toLowerCase();
    if (!locationQuery) {
        fetchAllTutors();
        return;
    }
    // Client-side filtering as Firestore doesn't support native partial text search easily
    tutorsCollection.get().then(snapshot => {
        const tutors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const filteredTutors = tutors.filter(tutor => tutor.location.toLowerCase().includes(locationQuery));
        displayTutors(filteredTutors);
    });
}

function displayResources(resourcesToDisplay) {
    resourceContainer.innerHTML = '';
    const user = auth.currentUser;

    resourcesToDisplay.forEach(resource => {
        const resourceCard = document.createElement('div');
        resourceCard.className = 'resource-card';
        const adminActions = user ? `
            <div class="admin-actions" style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px; display: flex; gap: 10px;">
                <button class="btn-edit" data-id="${resource.id}">Edit</button>
                <button class="btn-delete" data-id="${resource.id}">Delete</button>
            </div>` : '';

        resourceCard.innerHTML = `
            <div class="resource-content">
                <h3>${resource.title}</h3>
                <p>${resource.description}</p>
                <div class="resource-actions">
                    <a href="${resource.viewLink}" target="_blank" class="btn primary">View</a>
                </div>
                ${adminActions}
            </div>`;
        resourceContainer.appendChild(resourceCard);
    });
}

function displayTutors(tutorsToDisplay) {
    tutorResultsContainer.innerHTML = '';
    const user = auth.currentUser;

    if (tutorsToDisplay.length === 0) {
        tutorResultsContainer.innerHTML = `<p>No tutors found.</p>`;
        return;
    }

    tutorsToDisplay.forEach(tutor => {
        const tutorCard = document.createElement('div');
        tutorCard.className = 'tutor-card';
        const subjectTags = tutor.subjects.map(s => `<span class="subject-tag">${s}</span>`).join('');
        const adminActions = user ? `
            <div class="admin-actions" style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px; display: flex; gap: 10px;">
                <button class="btn-edit-tutor" data-id="${tutor.id}">Edit</button>
                <button class="btn-delete-tutor" data-id="${tutor.id}">Delete</button>
            </div>` : '';

        tutorCard.innerHTML = `
            <div class="tutor-info">
                <h3>${tutor.name}</h3>
                <div class="tutor-subjects">${subjectTags}</div>
                <p class="tutor-bio">${tutor.bio}</p>
                <p class="tutor-location">📍 ${tutor.location}</p>
                ${adminActions}
            </div>`;
        tutorResultsContainer.appendChild(tutorCard);
    });
}

// --- RESOURCE CRUD LOGIC ---
function openAddResourceModal() {
    document.getElementById('resource-modal-title').innerText = 'Add New Resource';
    document.getElementById('resource-id').value = '';
    document.getElementById('resource-title-input').value = '';
    document.getElementById('resource-desc-input').value = '';
    document.getElementById('resource-viewlink-input').value = '';
    resourceModal.style.display = 'block';
}

function handleResourceActions(e) {
    if (e.target.classList.contains('btn-delete')) {
        if (confirm('Are you sure you want to delete this resource?')) {
            deleteResource(e.target.dataset.id);
        }
    }
    if (e.target.classList.contains('btn-edit')) {
        openEditResourceModal(e.target.dataset.id);
    }
}

async function handleResourceSubmit() {
    const resourceId = document.getElementById('resource-id').value;
    const resourceData = {
        title: document.getElementById('resource-title-input').value,
        description: document.getElementById('resource-desc-input').value,
        subject: document.getElementById('resource-subject-input').value,
        level: document.getElementById('resource-level-input').value,
        viewLink: document.getElementById('resource-viewlink-input').value,
    };

    try {
        if (resourceId) {
            await resourcesCollection.doc(resourceId).update(resourceData);
            showNotification('Resource updated successfully!');
        } else {
            await resourcesCollection.add(resourceData);
            showNotification('Resource added successfully!');
        }
        resourceModal.style.display = 'none';
        fetchAndFilterResources();
    } catch (error) {
        showNotification('Error saving resource.', 'error');
    }
}

async function deleteResource(id) {
    try {
        await resourcesCollection.doc(id).delete();
        showNotification('Resource deleted!');
        fetchAndFilterResources();
    } catch (error) {
        showNotification('Error deleting resource.', 'error');
    }
}

async function openEditResourceModal(id) {
    const doc = await resourcesCollection.doc(id).get();
    if (!doc.exists) return;
    const data = doc.data();

    document.getElementById('resource-modal-title').innerText = 'Edit Resource';
    document.getElementById('resource-id').value = id;
    document.getElementById('resource-title-input').value = data.title;
    document.getElementById('resource-desc-input').value = data.description;
    document.getElementById('resource-subject-input').value = data.subject;
    document.getElementById('resource-level-input').value = data.level;
    document.getElementById('resource-viewlink-input').value = data.viewLink;
    resourceModal.style.display = 'block';
}

// --- TUTOR CRUD LOGIC ---
function openAddTutorModal() {
    document.getElementById('tutor-modal-title').innerText = 'Add New Tutor';
    document.getElementById('tutor-id').value = '';
    document.getElementById('tutor-name-input').value = '';
    document.getElementById('tutor-location-input').value = '';
    document.getElementById('tutor-subjects-input').value = '';
    document.getElementById('tutor-bio-input').value = '';
    tutorModal.style.display = 'block';
}

function handleTutorActions(e) {
    if (e.target.classList.contains('btn-delete-tutor')) {
        if (confirm('Are you sure you want to delete this tutor?')) {
            deleteTutor(e.target.dataset.id);
        }
    }
    if (e.target.classList.contains('btn-edit-tutor')) {
        openEditTutorModal(e.target.dataset.id);
    }
}

async function handleTutorSubmit() {
    const tutorId = document.getElementById('tutor-id').value;
    const subjectsArray = document.getElementById('tutor-subjects-input').value.split(',').map(s => s.trim());
    const tutorData = {
        name: document.getElementById('tutor-name-input').value,
        location: document.getElementById('tutor-location-input').value,
        bio: document.getElementById('tutor-bio-input').value,
        subjects: subjectsArray,
    };

    try {
        if (tutorId) {
            await tutorsCollection.doc(tutorId).update(tutorData);
            showNotification('Tutor updated successfully!');
        } else {
            await tutorsCollection.add(tutorData);
            showNotification('Tutor added successfully!');
        }
        tutorModal.style.display = 'none';
        fetchAllTutors();
    } catch (error) {
        showNotification('Error saving tutor.', 'error');
    }
}

async function deleteTutor(id) {
    try {
        await tutorsCollection.doc(id).delete();
        showNotification('Tutor deleted!');
        fetchAllTutors();
    } catch (error) {
        showNotification('Error deleting tutor.', 'error');
    }
}

async function openEditTutorModal(id) {
    const doc = await tutorsCollection.doc(id).get();
    if (!doc.exists) return;
    const data = doc.data();

    document.getElementById('tutor-modal-title').innerText = 'Edit Tutor';
    document.getElementById('tutor-id').value = id;
    document.getElementById('tutor-name-input').value = data.name;
    document.getElementById('tutor-location-input').value = data.location;
    document.getElementById('tutor-bio-input').value = data.bio;
    document.getElementById('tutor-subjects-input').value = data.subjects.join(', ');
    tutorModal.style.display = 'block';
}

// --- THIRD-PARTY API & UTILITIES ---
function fetchHolidays() {
    const apiUrl = `https://date.nager.at/api/v3/NextPublicHolidays/GH`;
    fetch(apiUrl)
        .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok'))
        .then(data => displayHolidays(data))
        .catch(error => console.error('Error fetching holiday data:', error));
}

function displayHolidays(holidays) {
    if (!holidays || holidays.length === 0) {
        holidaysContainer.innerHTML = '<p>No upcoming holidays found.</p>';
        return;
    }
    let holidayHtml = holidays.slice(0, 4).map(holiday => `
        <div style="background:white; padding:20px; border-radius:8px; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <h4 style="color:var(--primary-color);">${holiday.name}</h4>
            <p style="font-size:1.1rem; margin-top:5px;">${new Date(holiday.date).toDateString()}</p>
        </div>`).join('');
    holidaysContainer.innerHTML = `<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:20px;">${holidayHtml}</div>`;
}

function toggleMobileMenu() {
    mainNav.classList.toggle('active');
    mobileMenuToggle.textContent = mainNav.classList.contains('active') ? '✕' : '☰';
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.backgroundColor = type === 'error' ? 'var(--danger-color)' : 'var(--success-color)';
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(() => console.log('ServiceWorker registration successful'))
                .catch(err => console.log('ServiceWorker registration failed: ', err));
        });
    }
}
