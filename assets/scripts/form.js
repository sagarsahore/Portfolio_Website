/**
 * Legacy form handler - DEPRECATED
 * 
 * This file is deprecated and replaced by contact-form.js 
 * which uses Web3Forms instead of Formspree.
 * 
 * Keeping file for reference but functionality is disabled.
 */

console.warn('form.js is deprecated - contact form now handled by contact-form.js with Web3Forms');

// Legacy code disabled
/*
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  const successMsg = document.querySelector('.message.success');
  const errorMsg = document.querySelector('.message.danger');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData
    })
    .then(response => response.text())
    .then(data => {
      if (data.trim() === 'success') {
        successMsg.style.display = 'block';
        errorMsg.style.display = 'none';
        form.reset();
      } else {
        successMsg.style.display = 'none';
        errorMsg.style.display = 'block';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      successMsg.style.display = 'none';
      errorMsg.style.display = 'block';
    });
  });
});
*/
