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
