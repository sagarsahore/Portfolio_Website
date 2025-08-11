/**
 * Web3Forms Contact Form Handler
 * 
 * Provides progressive enhancement for the contact form with:
 * - Client-side validation
 * - Spam protection (honeypot + timestamp)
 * - Graceful success/failure handling
 * - Works without JavaScript (progressive enhancement)
 */
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        const timestampField = document.getElementById('form-timestamp');
        const successMessage = form.querySelector('.message.success');
        const errorMessage = form.querySelector('.message.danger');
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Set initial timestamp
        if (timestampField) {
            timestampField.value = Date.now().toString();
        }
        
        // Enhanced form submission with fetch API
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Hide previous messages
            if (successMessage) successMessage.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'none';
            
            // Disable submit button to prevent double submission
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="vlt-btn__text">Sending...</span><span class="vlt-btn__icon vlt-btn__icon--right"></span>';
            }
            
            try {
                // Basic spam protection - check time since page load
                const timestamp = parseInt(timestampField?.value || '0', 10);
                const timeDiff = Date.now() - timestamp;
                if (timestamp && timeDiff < 2000) {
                    throw new Error('Please take a moment before submitting the form.');
                }
                
                // Check honeypot field
                const honeypot = form.querySelector('input[name="botcheck"]');
                if (honeypot && honeypot.checked) {
                    throw new Error('Spam detected.');
                }
                
                // Prepare form data
                const formData = new FormData(form);
                
                // Submit to Web3Forms
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    // Success
                    if (successMessage) {
                        successMessage.textContent = result.message || 'Thanks! Your message has been sent successfully.';
                        successMessage.style.display = 'block';
                    }
                    
                    // Reset form
                    form.reset();
                    
                    // Reset timestamp
                    if (timestampField) {
                        timestampField.value = Date.now().toString();
                    }
                    
                    // Scroll to success message
                    if (successMessage) {
                        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    
                } else {
                    // Server error or validation error
                    throw new Error(result.message || 'Failed to send message. Please try again.');
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                
                if (errorMessage) {
                    errorMessage.textContent = error.message || 'Sorry, something went wrong. Please try again.';
                    errorMessage.style.display = 'block';
                    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } finally {
                // Re-enable submit button
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<span class="vlt-btn__text">Contact Me</span><span class="vlt-btn__icon vlt-btn__icon--right"></span>';
                }
                
                // Reset timestamp for next submission
                if (timestampField) {
                    timestampField.value = Date.now().toString();
                }
            }
        });
        
        // Additional client-side validation
        const emailField = form.querySelector('input[name="email"]');
        const nameField = form.querySelector('input[name="name"]');
        const messageField = form.querySelector('textarea[name="message"]');
        
        // Email validation
        if (emailField) {
            emailField.addEventListener('blur', function() {
                const email = this.value.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if (email && !emailRegex.test(email)) {
                    this.setAttribute('aria-invalid', 'true');
                    this.style.borderColor = '#ff4444';
                } else {
                    this.setAttribute('aria-invalid', 'false');
                    this.style.borderColor = '';
                }
            });
        }
        
        // Name validation
        if (nameField) {
            nameField.addEventListener('blur', function() {
                const name = this.value.trim();
                
                if (name && name.length < 2) {
                    this.setAttribute('aria-invalid', 'true');
                    this.style.borderColor = '#ff4444';
                } else {
                    this.setAttribute('aria-invalid', 'false');
                    this.style.borderColor = '';
                }
            });
        }
        
        // Message validation
        if (messageField) {
            messageField.addEventListener('blur', function() {
                const message = this.value.trim();
                
                if (message && message.length < 10) {
                    this.setAttribute('aria-invalid', 'true');
                    this.style.borderColor = '#ff4444';
                } else {
                    this.setAttribute('aria-invalid', 'false');
                    this.style.borderColor = '';
                }
            });
        }
        
        console.log('Web3Forms contact form handler loaded');
    });
})();