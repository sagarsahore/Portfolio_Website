// Populate project.html using the slug in the query string.
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('project');
  if (!slug || !PROJECTS[slug]) {
    return; // nothing to render if project not found
  }
  const data = PROJECTS[slug];
  // Set basic text fields
  document.getElementById('project-title').textContent = data.title;
  document.getElementById('project-summary').textContent = data.summary;
  document.getElementById('project-github').href = data.repo;
  document.getElementById('project-image').src = data.image;

  // Role - use bullet list
  const roleContainer = document.getElementById('project-role');
  const roleList = document.createElement('ul');
  data.role.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    roleList.appendChild(li);
  });
  roleContainer.appendChild(roleList);

  // Features
  document.getElementById('project-features-desc').textContent = data.featuresDesc;
  const featList = document.getElementById('project-features');
  data.features.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    featList.appendChild(li);
  });

  // Tech stack
  document.getElementById('project-tech').textContent = data.tech;

  // Challenges table
  const table = document.getElementById('project-challenges');
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Challenge</th><th>Solution</th></tr>';
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  data.challenges.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.challenge}</td><td>${row.solution}</td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
});
