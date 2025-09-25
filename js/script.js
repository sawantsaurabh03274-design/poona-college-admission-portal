// ===== Poona College Admission Portal - Main JavaScript =====
// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality when page loads
    initNavigation();
    initApplicationForm();
    initDocumentUpload();
    initCollegeSearch();
    initStatusUpdates();
    initAnimations();
    initFormValidation();
});

// ===== PAGE NAVIGATION =====
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    // Page navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and pages
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding page
            const pageId = this.getAttribute('data-page');
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
                
                // Special page initializations
                if (pageId === 'application') initApplicationForm();
                if (pageId === 'documents') initDocumentUpload();
                if (pageId === 'college-codes') initCollegeSearch();
                if (pageId === 'status') initStatusUpdates();
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navMenu.style.display = 'none';
            }
        });
    });
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const isVisible = navMenu.style.display === 'flex';
            navMenu.style.display = isVisible ? 'none' : 'flex';
            this.textContent = isVisible ? '☰' : '✕';
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            !e.target.closest('nav') && 
            !e.target.closest('.mobile-menu-btn')) {
            navMenu.style.display = 'none';
            if (mobileMenuBtn) mobileMenuBtn.textContent = '☰';
        }
    });
}

// ===== APPLICATION FORM FUNCTIONALITY =====
function initApplicationForm() {
    const steps = document.querySelectorAll('.step');
    const formSteps = document.querySelectorAll('.form-step');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const applicationForm = document.getElementById('application-form');
    let currentStep = 1;
    
    if (!steps.length) return;
    
    function updateFormSteps() {
        // Update step indicators
        steps.forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            step.classList.remove('active', 'completed');
            
            if (stepNum < currentStep) {
                step.classList.add('completed');
            } else if (stepNum === currentStep) {
                step.classList.add('active');
            }
        });
        
        // Update form steps visibility
        formSteps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.getAttribute('data-step')) === currentStep) {
                step.classList.add('active');
            }
        });
        
        // Update buttons
        if (prevBtn) {
            prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-block';
        }
        if (nextBtn) {
            nextBtn.textContent = currentStep === 4 ? 'Submit Application' : 'Next Step';
            nextBtn.innerHTML = currentStep === 4 ? 
                'Submit Application <span class="btn-icon">📨</span>' : 
                'Next Step <span class="btn-icon">→</span>';
        }
        
        // Update progress bar if exists
        updateProgressBar();
    }
    
    function updateProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            const progress = ((currentStep - 1) / 3) * 100;
            progressBar.style.width = progress + '%';
        }
    }
    
    function validateStep(step) {
        const currentFormStep = document.querySelector(`.form-step[data-step="${step}"]`);
        const inputs = currentFormStep.querySelectorAll('input[required], select[required]');
        
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                showError(input, 'This field is required');
            } else {
                clearError(input);
                
                // Additional validation based on input type
                if (input.type === 'email' && !isValidEmail(input.value)) {
                    isValid = false;
                    showError(input, 'Please enter a valid email address');
                }
                
                if (input.type === 'tel' && !isValidPhone(input.value)) {
                    isValid = false;
                    showError(input, 'Please enter a valid phone number');
                }
                
                if (input.type === 'number' && input.hasAttribute('min') && input.hasAttribute('max')) {
                    const value = parseFloat(input.value);
                    const min = parseFloat(input.getAttribute('min'));
                    const max = parseFloat(input.getAttribute('max'));
                    
                    if (value < min || value > max) {
                        isValid = false;
                        showError(input, `Please enter a value between ${min} and ${max}`);
                    }
                }
            }
        });
        
        return isValid;
    }
    
    function showError(input, message) {
        clearError(input);
        input.classList.add('error');
        
        let errorElement = input.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            input.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    function clearError(input) {
        input.classList.remove('error');
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
    
    function updateSummary() {
        const summaryContent = document.getElementById('summary-content');
        if (!summaryContent) return;
        
        const formData = new FormData(applicationForm);
        let summaryHTML = `
            <div class="summary-section">
                <h4>Personal Information</h4>
                <p><strong>Full Name:</strong> ${document.getElementById('full-name')?.value || 'Not provided'}</p>
                <p><strong>Email:</strong> ${document.getElementById('email')?.value || 'Not provided'}</p>
                <p><strong>Phone:</strong> ${document.getElementById('phone')?.value || 'Not provided'}</p>
                <p><strong>Date of Birth:</strong> ${document.getElementById('dob')?.value || 'Not provided'}</p>
            </div>
            
            <div class="summary-section">
                <h4>Academic Information</h4>
                <p><strong>High School:</strong> ${document.getElementById('high-school')?.value || 'Not provided'} 
                (${document.getElementById('high-school-marks')?.value || '0'}%)</p>
                <p><strong>Intermediate:</strong> ${document.getElementById('intermediate')?.value || 'Not provided'} 
                (${document.getElementById('intermediate-marks')?.value || '0'}%)</p>
            </div>
            
            <div class="summary-section">
                <h4>Course Selection</h4>
                <p><strong>Selected Course:</strong> ${document.getElementById('course')?.options[document.getElementById('course')?.selectedIndex]?.text || 'Not selected'}</p>
        `;
        
        const preference = document.getElementById('preference')?.value;
        if (preference) {
            summaryHTML += `<p><strong>Course Preference:</strong> ${preference}</p>`;
        }
        
        summaryHTML += `</div>`;
        summaryContent.innerHTML = summaryHTML;
    }
    
    // Next button click handler
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentStep < 4) {
                if (validateStep(currentStep)) {
                    currentStep++;
                    updateFormSteps();
                    
                    if (currentStep === 4) {
                        updateSummary();
                    }
                } else {
                    showNotification('Please fix the errors before proceeding', 'error');
                }
            } else {
                // Submit form
                if (document.getElementById('terms')?.checked) {
                    submitApplication();
                } else {
                    showNotification('Please agree to the terms and conditions', 'error');
                }
            }
        });
    }
    
    // Previous button click handler
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentStep > 1) {
                currentStep--;
                updateFormSteps();
            }
        });
    }
    
    // Real-time validation
    applicationForm?.addEventListener('input', function(e) {
        if (e.target.hasAttribute('required')) {
            if (e.target.value.trim()) {
                clearError(e.target);
            }
        }
    });
    
    // Initialize form
    updateFormSteps();
}

// ===== DOCUMENT UPLOAD FUNCTIONALITY =====
function initDocumentUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const documentItems = document.querySelectorAll('.document-item');
    
    if (!uploadArea) return;
    
    // Click to upload
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    // File input change
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleFiles(this.files);
        }
    });
    
    function handleFiles(files) {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        Array.from(files).forEach(file => {
            // Validate file type
            if (!validTypes.includes(file.type)) {
                showNotification(`Invalid file type: ${file.name}. Please upload PDF, JPG, or PNG files.`, 'error');
                return;
            }
            
            // Validate file size
            if (file.size > maxSize) {
                showNotification(`File too large: ${file.name}. Maximum size is 5MB.`, 'error');
                return;
            }
            
            // Simulate upload process
            simulateFileUpload(file);
        });
        
        // Reset file input
        fileInput.value = '';
    }
    
    function simulateFileUpload(file) {
        const uploadArea = document.getElementById('upload-area');
        const originalHTML = uploadArea.innerHTML;
        
        // Show uploading state
        uploadArea.innerHTML = `
            <div class="uploading">
                <div class="spinner"></div>
                <p>Uploading ${file.name}...</p>
                <div class="progress">
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
            </div>
        `;
        
        // Simulate upload progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                
                // Upload complete
                setTimeout(() => {
                    uploadArea.innerHTML = originalHTML;
                    updateDocumentStatus(file.name);
                    showNotification(`Successfully uploaded: ${file.name}`, 'success');
                    initDocumentUpload(); // Re-initialize event listeners
                }, 500);
            }
            
            const progressBar = uploadArea.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
        }, 200);
    }
    
    function updateDocumentStatus(filename) {
        // Find matching document item and update status
        documentItems.forEach(item => {
            const docName = item.querySelector('h4').textContent.toLowerCase();
            if (filename.toLowerCase().includes(docName.replace(' ', '')) {
                const statusElement = item.querySelector('.document-status');
                statusElement.textContent = 'Uploaded';
                statusElement.className = 'document-status status-uploaded';
                
                // Add view button
                if (!item.querySelector('.view-btn')) {
                    const viewBtn = document.createElement('button');
                    viewBtn.className = 'btn btn-small view-btn';
                    viewBtn.innerHTML = 'View <span class="btn-icon">👁️</span>';
                    viewBtn.addEventListener('click', () => {
                        showNotification(`Previewing ${filename}`, 'info');
                    });
                    item.appendChild(viewBtn);
                }
            }
        });
    }
}

// ===== COLLEGE SEARCH FUNCTIONALITY =====
function initCollegeSearch() {
    const searchInput = document.getElementById('college-search');
    const collegeCards = document.querySelectorAll('.college-card');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        let hasResults = false;
        
        collegeCards.forEach(card => {
            const collegeName = card.querySelector('h3').textContent.toLowerCase();
            const collegeCode = card.querySelector('.college-code').textContent.toLowerCase();
            const collegeDetails = card.querySelector('.college-details').textContent.toLowerCase();
            
            if (collegeName.includes(searchTerm) || 
                collegeCode.includes(searchTerm) || 
                collegeDetails.includes(searchTerm)) {
                card.style.display = 'block';
                hasResults = true;
                
                // Highlight search term
                highlightText(card, searchTerm);
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show no results message
        showNoResultsMessage(hasResults);
    });
    
    function highlightText(element, searchTerm) {
        if (!searchTerm) return;
        
        const text = element.innerHTML;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        element.innerHTML = text.replace(regex, '<mark>$1</mark>');
    }
    
    function showNoResultsMessage(hasResults) {
        let messageElement = document.getElementById('no-results-message');
        
        if (!hasResults) {
            if (!messageElement) {
                messageElement = document.createElement('div');
                messageElement.id = 'no-results-message';
                messageElement.className = 'no-results';
                messageElement.innerHTML = `
                    <div class="no-results-content">
                        <span class="no-results-icon">🔍</span>
                        <h3>No colleges found</h3>
                        <p>Try adjusting your search terms or browse all colleges</p>
                    </div>
                `;
                document.querySelector('.college-cards').parentNode.appendChild(messageElement);
            }
        } else if (messageElement) {
            messageElement.remove();
        }
    }
    
    // Add click handlers to college card buttons
    collegeCards.forEach(card => {
        const button = card.querySelector('.btn');
        if (button) {
            button.addEventListener('click', function() {
                const collegeName = card.querySelector('h3').textContent;
                showCollegeDetails(collegeName);
            });
        }
    });
}

// ===== APPLICATION STATUS UPDATES =====
function initStatusUpdates() {
    // Simulate real-time status updates
    simulateStatusUpdates();
    
    // Add refresh functionality
    const refreshBtn = document.getElementById('refresh-status');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.classList.add('refreshing');
            setTimeout(() => {
                this.classList.remove('refreshing');
                simulateStatusUpdates();
                showNotification('Status updated', 'success');
            }, 1000);
        });
    }
}

function simulateStatusUpdates() {
    const statusItems = document.querySelectorAll('.timeline-item');
    const statusBadge = document.querySelector('.status-badge');
    
    // Randomly update status (simulation)
    if (Math.random() > 0.7) {
        statusItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('completed');
                
                if (index === statusItems.length - 1) {
                    statusBadge.textContent = 'Approved';
                    statusBadge.className = 'status-badge status-approved';
                    showNotification('Your application has been approved!', 'success');
                }
            }, index * 1000);
        });
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add show class after a delay
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        hideNotification(notification);
    });
    
    // Click to close
    notification.addEventListener('click', (e) => {
        if (e.target === notification) {
            clearTimeout(autoRemove);
            hideNotification(notification);
        }
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .college-card, .announcement-item').forEach(el => {
        observer.observe(el);
    });
    
    // Add loading animation to buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
            const btn = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
            if (btn.getAttribute('type') !== 'submit') {
                btn.classList.add('loading');
                setTimeout(() => btn.classList.remove('loading'), 1000);
            }
        }
    });
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showNotification('Please fix the errors in the form', 'error');
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            if (!field.parentNode.querySelector('.error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                field.parentNode.appendChild(errorMsg);
            }
        } else {
            field.classList.remove('error');
            const errorMsg = field.parentNode.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        }
    });
    
    return isValid;
}

// ===== SUBMIT APPLICATION =====
function submitApplication() {
    const submitBtn = document.getElementById('next-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = 'Submitting... <span class="btn-icon">⏳</span>';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Application submitted successfully! You will receive a confirmation email shortly.', 'success');
        
        // Reset form and show confirmation
        document.getElementById('application-form').reset();
        
        // Show confirmation page
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        document.querySelector('[data-page="status"]').classList.add('active');
        document.getElementById('status').classList.add('active');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Update application status
        simulateStatusUpdates();
        
    }, 2000);
}

// ===== COLLEGE DETAILS MODAL =====
function showCollegeDetails(collegeName) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${collegeName} Details</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Detailed information about ${collegeName} would appear here.</p>
                    <p>This could include campus facilities, faculty details, placement statistics, and more.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary">Apply to ${collegeName}</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.querySelector('.modal-overlay');
    modal.classList.add('show');
    
    // Close modal handlers
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
    
    // Apply button handler
    modal.querySelector('.btn-primary').addEventListener('click', () => {
        showNotification(`Application process started for ${collegeName}`, 'success');
        closeModal(modal);
    });
}

function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

// ===== UTILITY FUNCTIONS =====
function formatPhoneNumber(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Export functions for global access (if needed)
window.PoonaCollegePortal = {
    showNotification,
    submitApplication,
    showCollegeDetails
};

// Add CSS for JavaScript-generated elements
const dynamicStyles = `
    <style>
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        border-left: 4px solid #3498db;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success { border-left-color: #27ae60; }
    .notification-error { border-left-color: #e74c3c; }
    .notification-warning { border-left-color: #f39c12; }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        margin-left: auto;
    }
    
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .modal-overlay.show {
        opacity: 1;
    }
    
    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        transform: scale(0.9);
        transition: transform 0.3s;
    }
    
    .modal-overlay.show .modal-content {
        transform: scale(1);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
    }
    
    .uploading .spinner {
        border: 3px solid #f3f3f3;
        border-top: 3px solid #3498db;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .progress {
        width: 100%;
        height: 6px;
        background: #f0f0f0;
        border-radius: 3px;
        overflow: hidden;
        margin-top: 1rem;
    }
    
    .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #3498db, #2ecc71);
        transition: width 0.3s;
    }
    
    .no-results {
        text-align: center;
        padding: 3rem;
        color: #666;
    }
    
    .no-results-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        display: block;
    }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', dynamicStyles);
