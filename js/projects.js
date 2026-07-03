const selectors = document.querySelectorAll(".selector")
const container = document.getElementById("projects");
const USERNAME = "drodr211";

selectors.forEach(sel => {
  sel.addEventListener("click", () => {
    selectors.forEach(s => s.classList.remove("active"));
    sel.classList.add("active");
    if(sel.classList.contains("left")){
      document.getElementById("projects").classList.add("active");
      document.getElementById("other").classList.remove("active");
    }
    else {
      document.getElementById("projects").classList.remove("active");
      document.getElementById("other").classList.add("active");
    }
  });
});

/* LOAD LIVE PROJECTS */
fetch("/projects/proj.json")
  .then(response => response.json())
  .then(projects => {
    console.log(projects);
    const cont = document.getElementById("other");
    console.log(cont);

    projects.forEach(project => {
      if(project.name != "") {
        const card = document.createElement("div");
        card.className = "project";
        card.innerHTML = `
          <h2 class="project-name">
            <a href="/projects/${project.href}">
              ${project.name}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 
                0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.586-.586a1.001 1.001 0 0 0 .154-.199 2 2 0 0 1-.861-3.337L9.12 
                3.45a2 2 0 1 1 2.83 2.83l-.793.792a4.018 4.018 0 0 1 .128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
              </svg>
            </a>
          </h2>
          <small> Last modified: ${project.date} </small>
          <p class="project-desc"> ${project.desc}  </p>
          <p class="project-desc"> Language: ${project.lang} </p>
        `;
        cont.appendChild(card);
      }
      
    });
  });

/* LOAD GITHUB PROJECTS  */
async function loadProjects() {
  // Fetch repos
  const repoResponse = await fetch(
    `https://api.github.com/users/${USERNAME}/repos`,
    { headers: { Accept: "application/vnd.github.mercy-preview+json" } }
  );

  const repos = await repoResponse.json();

  repos.sort((a, b) =>
    new Date(b.pushed_at) -
    new Date(a.pushed_at)
  );

  const filtered = repos.filter(repo => repo.topics.includes("techdan"));
  
  for (const repo of filtered) {
    try {
      const updatedDate = new Date(repo.pushed_at).toLocaleDateString("en-US");
      const readmeResponse = await fetch(`https://raw.githubusercontent.com/${USERNAME}/${repo.name}/main/README.md`); // Fetch README
      const readmeText = await readmeResponse.text();

      // First non-empty line
      const firstLine =
        readmeText
          .split("\n")
          .find(line => line.trim() !== "") || "";

      // Create card
      const card = document.createElement("div");

      card.className = "project";
      card.innerHTML = `
        <h2 class="project-name">
          <a href="${repo.html_url}" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69
            -.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07
            -1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 
            2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 
            0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg> 
            ${repo.name} 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 
            2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
            <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.586-.586a1.001 1.001 0 0 0 .154-.199 2 2 0 0 1-.861-3.337L9.12 3.45a2 2 0 1 1 
            2.83 2.83l-.793.792a4.018 4.018 0 0 1 .128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/></svg>
          </a>
        </h2>
        <small> Last modified: ${updatedDate} </small>
        <p class="project-desc">${repo.description}</p>
        <p class="project-desc"> Language: ${repo.language} </p>
      `;

      container.appendChild(card);

    } catch (error) { console.log( `Could not load README for ${repo.name}` ); }
  }
}

loadProjects();