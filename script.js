// Client Lead Management System - JavaScript

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const leadForm = document.getElementById('leadForm');
const editLeadForm = document.getElementById('editLeadForm');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const clearFormBtn = document.getElementById('clearForm');
const cancelEditBtn = document.getElementById('cancelEdit');
const editLeadBtn = document.getElementById('editLeadBtn');
const deleteLeadBtn = document.getElementById('deleteLeadBtn');
const leadModal = document.getElementById('leadModal');
const editModal = document.getElementById('editModal');
const closeBtns = document.querySelectorAll('.close-btn');
const notification = document.getElementById('notification');

// Global variables
let leads = JSON.parse(localStorage.getItem('crmLeads')) || [];
let currentLeadId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderDashboard();
    renderLeads();
    renderAnalytics();
    setupEventListeners();
});

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }

        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
    });
});

// Event Listeners
function setupEventListeners() {
    // Form submissions
    leadForm.addEventListener('submit', handleAddLead);
    editLeadForm.addEventListener('submit', handleEditLead);

    // Search and filter
    searchInput.addEventListener('input', handleSearch);
    statusFilter.addEventListener('change', handleFilter);

    // Modal controls
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Click outside modal to close
    [leadModal, editModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });

    // Button event listeners
    clearFormBtn.addEventListener('click', clearForm);
    cancelEditBtn.addEventListener('click', () => closeModal(editModal));
    editLeadBtn.addEventListener('click', openEditModal);
    deleteLeadBtn.addEventListener('click', handleDeleteLead);
}

// Lead Management Functions
function handleAddLead(e) {
    e.preventDefault();

    const formData = new FormData(leadForm);
    const leadData = {
        id: Date.now().toString(),
        firstName: formData.get('firstName').trim(),
        lastName: formData.get('lastName').trim(),
        email: formData.get('email').trim(),
        phone: formData.get('phone').trim(),
        company: formData.get('company').trim(),
        jobTitle: formData.get('jobTitle').trim(),
        leadSource: formData.get('leadSource'),
        status: 'new',
        notes: formData.get('notes').trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    leads.push(leadData);
    saveLeads();
    renderDashboard();
    renderLeads();
    renderAnalytics();
    leadForm.reset();

    showNotification('Lead added successfully!', 'success');
}

function handleEditLead(e) {
    e.preventDefault();

    const formData = new FormData(editLeadForm);
    const leadIndex = leads.findIndex(lead => lead.id === currentLeadId);

    if (leadIndex !== -1) {
        leads[leadIndex] = {
            ...leads[leadIndex],
            firstName: formData.get('firstName').trim(),
            lastName: formData.get('lastName').trim(),
            email: formData.get('email').trim(),
            phone: formData.get('phone').trim(),
            company: formData.get('company').trim(),
            jobTitle: formData.get('jobTitle').trim(),
            status: formData.get('status'),
            leadSource: formData.get('source'),
            notes: formData.get('notes').trim(),
            updatedAt: new Date().toISOString()
        };

        saveLeads();
        renderDashboard();
        renderLeads();
        renderAnalytics();
        closeModal(editModal);

        showNotification('Lead updated successfully!', 'success');
    }
}

function handleDeleteLead() {
    if (confirm('Are you sure you want to delete this lead?')) {
        leads = leads.filter(lead => lead.id !== currentLeadId);
        saveLeads();
        renderDashboard();
        renderLeads();
        renderAnalytics();
        closeModal(leadModal);

        showNotification('Lead deleted successfully!', 'success');
    }
}

function openLeadModal(leadId) {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    currentLeadId = leadId;

    const leadDetails = document.getElementById('leadDetails');
    leadDetails.innerHTML = `
        <div class="lead-detail-grid">
            <div class="detail-section">
                <h3>Contact Information</h3>
                <div class="detail-item">
                    <strong>Name:</strong> ${lead.firstName} ${lead.lastName}
                </div>
                <div class="detail-item">
                    <strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a>
                </div>
                ${lead.phone ? `<div class="detail-item"><strong>Phone:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></div>` : ''}
                ${lead.company ? `<div class="detail-item"><strong>Company:</strong> ${lead.company}</div>` : ''}
                ${lead.jobTitle ? `<div class="detail-item"><strong>Job Title:</strong> ${lead.jobTitle}</div>` : ''}
            </div>
            <div class="detail-section">
                <h3>Lead Information</h3>
                <div class="detail-item">
                    <strong>Status:</strong> <span class="status-badge status-${lead.status}">${lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</span>
                </div>
                <div class="detail-item">
                    <strong>Source:</strong> ${lead.leadSource.charAt(0).toUpperCase() + lead.leadSource.slice(1).replace('-', ' ')}
                </div>
                <div class="detail-item">
                    <strong>Created:</strong> ${new Date(lead.createdAt).toLocaleDateString()}
                </div>
                <div class="detail-item">
                    <strong>Last Updated:</strong> ${new Date(lead.updatedAt).toLocaleDateString()}
                </div>
            </div>
            ${lead.notes ? `
                <div class="detail-section full-width">
                    <h3>Notes</h3>
                    <p>${lead.notes}</p>
                </div>
            ` : ''}
        </div>
    `;

    leadModal.classList.add('active');
}

function openEditModal() {
    const lead = leads.find(l => l.id === currentLeadId);
    if (!lead) return;

    // Populate edit form
    document.getElementById('editLeadId').value = lead.id;
    document.getElementById('editFirstName').value = lead.firstName;
    document.getElementById('editLastName').value = lead.lastName;
    document.getElementById('editEmail').value = lead.email;
    document.getElementById('editPhone').value = lead.phone || '';
    document.getElementById('editCompany').value = lead.company || '';
    document.getElementById('editJobTitle').value = lead.jobTitle || '';
    document.getElementById('editStatus').value = lead.status;
    document.getElementById('editSource').value = lead.leadSource;
    document.getElementById('editNotes').value = lead.notes || '';

    closeModal(leadModal);
    editModal.classList.add('active');
}

function closeAllModals() {
    leadModal.classList.remove('active');
    editModal.classList.remove('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

// Search and Filter Functions
function handleSearch() {
    renderLeads();
}

function handleFilter() {
    renderLeads();
}

function getFilteredLeads() {
    let filteredLeads = leads;

    // Apply search filter
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filteredLeads = filteredLeads.filter(lead =>
            lead.firstName.toLowerCase().includes(searchTerm) ||
            lead.lastName.toLowerCase().includes(searchTerm) ||
            lead.email.toLowerCase().includes(searchTerm) ||
            lead.company.toLowerCase().includes(searchTerm) ||
            lead.jobTitle.toLowerCase().includes(searchTerm)
        );
    }

    // Apply status filter
    const statusFilterValue = statusFilter.value;
    if (statusFilterValue !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.status === statusFilterValue);
    }

    return filteredLeads;
}

// Rendering Functions
function renderDashboard() {
    // Update statistics
    const totalLeads = leads.length;
    const newLeads = leads.filter(lead => lead.status === 'new').length;
    const contactedLeads = leads.filter(lead => lead.status === 'contacted').length;
    const qualifiedLeads = leads.filter(lead => lead.status === 'qualified').length;

    document.getElementById('totalLeads').textContent = totalLeads;
    document.getElementById('newLeads').textContent = newLeads;
    document.getElementById('contactedLeads').textContent = contactedLeads;
    document.getElementById('qualifiedLeads').textContent = qualifiedLeads;

    // Render recent leads
    const recentLeads = leads.slice(-5).reverse();
    const recentLeadsContainer = document.getElementById('recentLeadsList');

    if (recentLeads.length === 0) {
        recentLeadsContainer.innerHTML = '<p class="empty-state">No leads yet. <a href="#add-lead">Add your first lead</a></p>';
    } else {
        recentLeadsContainer.innerHTML = recentLeads.map(lead => `
            <div class="lead-card" onclick="openLeadModal('${lead.id}')">
                <div class="lead-header">
                    <div>
                        <div class="lead-name">${lead.firstName} ${lead.lastName}</div>
                        <div class="lead-company">${lead.company || 'No company'}</div>
                    </div>
                    <span class="lead-status status-${lead.status}">${lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</span>
                </div>
                <div class="lead-details">
                    <div class="lead-detail">
                        <span class="lead-detail-label">Email</span>
                        <span class="lead-detail-value">${lead.email}</span>
                    </div>
                    <div class="lead-detail">
                        <span class="lead-detail-label">Source</span>
                        <span class="lead-detail-value">${lead.leadSource.charAt(0).toUpperCase() + lead.leadSource.slice(1).replace('-', ' ')}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function renderLeads() {
    const filteredLeads = getFilteredLeads();
    const leadsContainer = document.getElementById('leadsContainer');

    if (filteredLeads.length === 0) {
        if (leads.length === 0) {
            leadsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No leads found</h3>
                    <p>Start by adding your first lead to the system.</p>
                    <a href="#add-lead" class="btn btn-primary">Add Lead</a>
                </div>
            `;
        } else {
            leadsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No leads match your search</h3>
                    <p>Try adjusting your search terms or filters.</p>
                </div>
            `;
        }
    } else {
        leadsContainer.innerHTML = filteredLeads.map(lead => `
            <div class="lead-card" onclick="openLeadModal('${lead.id}')">
                <div class="lead-header">
                    <div>
                        <div class="lead-name">${lead.firstName} ${lead.lastName}</div>
                        <div class="lead-company">${lead.company || 'No company'}</div>
                    </div>
                    <span class="lead-status status-${lead.status}">${lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</span>
                </div>
                <div class="lead-details">
                    <div class="lead-detail">
                        <span class="lead-detail-label">Email</span>
                        <span class="lead-detail-value">${lead.email}</span>
                    </div>
                    <div class="lead-detail">
                        <span class="lead-detail-label">Phone</span>
                        <span class="lead-detail-value">${lead.phone || 'Not provided'}</span>
                    </div>
                    <div class="lead-detail">
                        <span class="lead-detail-label">Source</span>
                        <span class="lead-detail-value">${lead.leadSource.charAt(0).toUpperCase() + lead.leadSource.slice(1).replace('-', ' ')}</span>
                    </div>
                    <div class="lead-detail">
                        <span class="lead-detail-label">Created</span>
                        <span class="lead-detail-value">${new Date(lead.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                ${lead.notes ? `<div class="lead-notes">${lead.notes}</div>` : ''}
            </div>
        `).join('');
    }
}

function renderAnalytics() {
    // Source distribution
    const sourceCounts = {};
    leads.forEach(lead => {
        sourceCounts[lead.leadSource] = (sourceCounts[lead.leadSource] || 0) + 1;
    });

    // Status counts for funnel
    const statusCounts = {
        total: leads.length,
        contacted: leads.filter(lead => ['contacted', 'qualified', 'proposal', 'negotiation', 'closed'].includes(lead.status)).length,
        qualified: leads.filter(lead => ['qualified', 'proposal', 'negotiation', 'closed'].includes(lead.status)).length,
        closed: leads.filter(lead => lead.status === 'closed').length
    };

    // Update funnel chart
    document.getElementById('funnelTotalNum').textContent = statusCounts.total;
    document.getElementById('funnelContactedNum').textContent = statusCounts.contacted;
    document.getElementById('funnelQualifiedNum').textContent = statusCounts.qualified;
    document.getElementById('funnelClosedNum').textContent = statusCounts.closed;

    // Calculate percentages
    const contactedPercent = statusCounts.total > 0 ? (statusCounts.contacted / statusCounts.total) * 100 : 0;
    const qualifiedPercent = statusCounts.total > 0 ? (statusCounts.qualified / statusCounts.total) * 100 : 0;
    const closedPercent = statusCounts.total > 0 ? (statusCounts.closed / statusCounts.total) * 100 : 0;

    document.getElementById('funnelContacted').style.width = `${contactedPercent}%`;
    document.getElementById('funnelQualified').style.width = `${qualifiedPercent}%`;
    document.getElementById('funnelClosed').style.width = `${closedPercent}%`;
}

// Utility Functions
function saveLeads() {
    localStorage.setItem('crmLeads', JSON.stringify(leads));
}

function clearForm() {
    leadForm.reset();
}

function showNotification(message, type = 'info') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Make openLeadModal globally accessible
window.openLeadModal = openLeadModal;

    // Set default active category (coffee)
    document.querySelector('.category-btn[data-category="coffee"]').click();

    // Reservation form handling
    const reservationForm = document.getElementById('reservationForm');
    const successModal = document.getElementById('successModal');
    const closeBtn = successModal.querySelector('.close-btn');

    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(reservationForm);
        const reservationData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            date: formData.get('date'),
            time: formData.get('time'),
            partySize: formData.get('partySize')
        };

        // Validate form
        if (!reservationData.name || !reservationData.email || !reservationData.phone ||
            !reservationData.date || !reservationData.time || !reservationData.partySize) {
            alert('Please fill in all fields.');
            return;
        }

        // Show success modal with reservation details
        const reservationDetails = document.getElementById('reservationDetails');
        reservationDetails.innerHTML = `
            <strong>Name:</strong> ${reservationData.name}<br>
            <strong>Email:</strong> ${reservationData.email}<br>
            <strong>Phone:</strong> ${reservationData.phone}<br>
            <strong>Date:</strong> ${formatDate(reservationData.date)}<br>
            <strong>Time:</strong> ${reservationData.time}<br>
            <strong>Party Size:</strong> ${reservationData.partySize}
        `;

        successModal.classList.add('active');

        // Reset form
        reservationForm.reset();
    });

    // Close modal
    closeBtn.addEventListener('click', function() {
        successModal.classList.remove('active');
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Update active navigation link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe sections for animation
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});

// Utility function to format date
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Add some CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 70px;
        left: 0;
        width: 100%;
        background: white;
        padding: 20px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .nav-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }

    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }

    .nav-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);