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
    .then(async response => {
      try {
        return await response.json();
      } catch (err) {
        const text = await response.text();
        throw new Error(text);
      }
    })
    .then(data => {
      if (data.status === 'success') {
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
