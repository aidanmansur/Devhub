// =========================
// AUTHENTICATION
// =========================

const isLoggedIn =
    localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {

    window.location.href =
        "login.html";

}


const currentUser =
    JSON.parse(
        localStorage.getItem("currentUser")
    );


if (!currentUser) {

    window.location.href =
        "login.html";

}


// =========================
// USER
// =========================

const welcomeUser =
    document.getElementById(
        "welcomeUser"
    );


if (welcomeUser) {

    welcomeUser.textContent =
        `Welcome, ${currentUser.username}`;

}


// =========================
// LOGOUT
// =========================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "isLoggedIn"
            );

            localStorage.removeItem(
                "currentUser"
            );

            window.location.href =
                "login.html";

        }
    );

}


// =========================
// PROJECTS
// =========================

let projects =
    JSON.parse(
        localStorage.getItem(
            "devhubProjects"
        )
    ) || [];


// =========================
// MIGRATE OLD PROJECTS
// =========================

projects.forEach(
    function (project) {

        if (!project.owner) {

            project.owner =
                currentUser.username;

        }


        if (
            typeof project.readme !==
            "string"
        ) {

            project.readme = "";

        }


        if (
            typeof project.stars !==
            "number"
        ) {

            project.stars =
                Number(
                    project.stars || 0
                );

        }


        if (
            typeof project.forks !==
            "number"
        ) {

            project.forks =
                Number(
                    project.forks || 0
                );

        }

    }
);


localStorage.setItem(
    "devhubProjects",
    JSON.stringify(
        projects
    )
);


// =========================
// ELEMENTS
// =========================

const projectsContainer =
    document.getElementById(
        "projectsContainer"
    );


const emptyState =
    document.getElementById(
        "emptyState"
    );


// =========================
// STATISTICS
// =========================

const totalProjects =
    document.getElementById(
        "totalProjects"
    );


const totalLanguages =
    document.getElementById(
        "totalLanguages"
    );


const totalGithub =
    document.getElementById(
        "totalGithub"
    );


const totalDemos =
    document.getElementById(
        "totalDemos"
    );


// =========================
// SEARCH & FILTER
// =========================

const searchProjects =
    document.getElementById(
        "searchProjects"
    );


const filterLanguage =
    document.getElementById(
        "filterLanguage"
    );


// =========================
// MODAL
// =========================

const projectModal =
    document.getElementById(
        "projectModal"
    );


const projectForm =
    document.getElementById(
        "projectForm"
    );


const addProjectButton =
    document.getElementById(
        "addProjectButton"
    );


const emptyAddProjectButton =
    document.getElementById(
        "emptyAddProjectButton"
    );


const closeModalButton =
    document.getElementById(
        "closeModalButton"
    );


const cancelProjectButton =
    document.getElementById(
        "cancelProjectButton"
    );


const modalTitle =
    document.getElementById(
        "modalTitle"
    );


const modalDescription =
    document.getElementById(
        "modalDescription"
    );


const projectSubmitButton =
    document.getElementById(
        "projectSubmitButton"
    );


// =========================
// README
// =========================

const projectReadme =
    document.getElementById(
        "projectReadme"
    );


const readmePreview =
    document.getElementById(
        "readmePreview"
    );


// =========================
// EDITING STATE
// =========================

let editingProjectId =
    null;


// =========================
// ESCAPE HTML
// =========================

function escapeHtml(text) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =========================
// INLINE MARKDOWN
// =========================

function parseInlineMarkdown(text) {

    let html =
        escapeHtml(text);


    // INLINE CODE

    html =
        html.replace(
            /`([^`]+)`/g,
            "<code>$1</code>"
        );


    // BOLD

    html =
        html.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    // ITALIC

    html =
        html.replace(
            /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
            "<em>$1</em>"
        );


    // LINKS

    html =
        html.replace(
            /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
            function (
                match,
                label,
                url
            ) {

                return `
                    <a
                        href="${url}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ${label}
                    </a>
                `;

            }
        );


    return html;

}


// =========================
// MARKDOWN RENDERER
// =========================

function renderMarkdown(markdown) {

    if (
        !markdown ||
        markdown.trim() === ""
    ) {

        return "";

    }


    const lines =
        markdown
            .replace(
                /\r\n/g,
                "\n"
            )
            .split("\n");


    let html = "";

    let inCodeBlock =
        false;

    let codeContent =
        "";

    let inUnorderedList =
        false;

    let inOrderedList =
        false;

    let inBlockquote =
        false;


    function closeLists() {

        if (inUnorderedList) {

            html +=
                "</ul>";

            inUnorderedList =
                false;

        }


        if (inOrderedList) {

            html +=
                "</ol>";

            inOrderedList =
                false;

        }

    }


    function closeBlockquote() {

        if (inBlockquote) {

            html +=
                "</blockquote>";

            inBlockquote =
                false;

        }

    }


    lines.forEach(
        function (line) {

            const trimmed =
                line.trim();


            // CODE BLOCK

            if (
                trimmed.startsWith(
                    "```"
                )
            ) {

                if (!inCodeBlock) {

                    closeLists();

                    closeBlockquote();

                    inCodeBlock =
                        true;

                    codeContent =
                        "";

                } else {

                    html += `
                        <pre>
                            <code>${escapeHtml(
                                codeContent.trim()
                            )}</code>
                        </pre>
                    `;

                    inCodeBlock =
                        false;

                    codeContent =
                        "";

                }

                return;

            }


            if (inCodeBlock) {

                codeContent +=
                    line + "\n";

                return;

            }


            // EMPTY LINE

            if (trimmed === "") {

                closeLists();

                closeBlockquote();

                return;

            }


            // HORIZONTAL RULE

            if (
                trimmed === "---" ||
                trimmed === "***" ||
                trimmed === "___"
            ) {

                closeLists();

                closeBlockquote();

                html +=
                    "<hr>";

                return;

            }


            // H3

            if (
                trimmed.startsWith(
                    "### "
                )
            ) {

                closeLists();

                closeBlockquote();

                html += `
                    <h4>
                        ${parseInlineMarkdown(
                            trimmed.substring(4)
                        )}
                    </h4>
                `;

                return;

            }


            // H2

            if (
                trimmed.startsWith(
                    "## "
                )
            ) {

                closeLists();

                closeBlockquote();

                html += `
                    <h3>
                        ${parseInlineMarkdown(
                            trimmed.substring(3)
                        )}
                    </h3>
                `;

                return;

            }


            // H1

            if (
                trimmed.startsWith(
                    "# "
                )
            ) {

                closeLists();

                closeBlockquote();

                html += `
                    <h2>
                        ${parseInlineMarkdown(
                            trimmed.substring(2)
                        )}
                    </h2>
                `;

                return;

            }


            // BLOCKQUOTE

            if (
                trimmed.startsWith(
                    "> "
                )
            ) {

                closeLists();


                if (!inBlockquote) {

                    html +=
                        "<blockquote>";

                    inBlockquote =
                        true;

                }


                html += `
                    <p>
                        ${parseInlineMarkdown(
                            trimmed.substring(2)
                        )}
                    </p>
                `;

                return;

            }


            closeBlockquote();


            // UNORDERED LIST

            if (
                /^[-*+] /.test(
                    trimmed
                )
            ) {

                if (inOrderedList) {

                    html +=
                        "</ol>";

                    inOrderedList =
                        false;

                }


                if (!inUnorderedList) {

                    html +=
                        "<ul>";

                    inUnorderedList =
                        true;

                }


                const listItem =
                    trimmed.substring(2);


                html += `
                    <li>
                        ${parseInlineMarkdown(
                            listItem
                        )}
                    </li>
                `;

                return;

            }


            // ORDERED LIST

            if (
                /^\d+\.\s/.test(
                    trimmed
                )
            ) {

                if (inUnorderedList) {

                    html +=
                        "</ul>";

                    inUnorderedList =
                        false;

                }


                if (!inOrderedList) {

                    html +=
                        "<ol>";

                    inOrderedList =
                        true;

                }


                const listItem =
                    trimmed.replace(
                        /^\d+\.\s/,
                        ""
                    );


                html += `
                    <li>
                        ${parseInlineMarkdown(
                            listItem
                        )}
                    </li>
                `;

                return;

            }


            // PARAGRAPH

            closeLists();

            html += `
                <p>
                    ${parseInlineMarkdown(
                        trimmed
                    )}
                </p>
            `;

        }
    );


    closeLists();

    closeBlockquote();


    if (inCodeBlock) {

        html += `
            <pre>
                <code>${escapeHtml(
                    codeContent.trim()
                )}</code>
            </pre>
        `;

    }


    return html;

}


// =========================
// README PREVIEW
// =========================

function updateReadmePreview() {

    if (
        !projectReadme ||
        !readmePreview
    ) {

        return;

    }


    const markdown =
        projectReadme.value.trim();


    if (markdown === "") {

        readmePreview.innerHTML = `
            <p>
                Your README preview will appear here.
            </p>
        `;

        return;

    }


    readmePreview.innerHTML =
        renderMarkdown(
            markdown
        );

}


if (projectReadme) {

    projectReadme.addEventListener(
        "input",
        updateReadmePreview
    );

}


// =========================
// STATISTICS
// =========================

function displayStatistics() {

    const myProjects =
        projects.filter(
            function (project) {

                return (
                    project.owner ===
                    currentUser.username
                );

            }
        );


    totalProjects.textContent =
        myProjects.length;


    const languages =
        new Set();


    myProjects.forEach(
        function (project) {

            if (project.language) {

                languages.add(
                    project.language
                );

            }

        }
    );


    totalLanguages.textContent =
        languages.size;


    const githubProjects =
        myProjects.filter(
            function (project) {

                return (
                    project.github &&
                    project.github.trim() !== ""
                );

            }
        );


    totalGithub.textContent =
        githubProjects.length;


    const demoProjects =
        myProjects.filter(
            function (project) {

                return (
                    project.demo &&
                    project.demo.trim() !== ""
                );

            }
        );


    totalDemos.textContent =
        demoProjects.length;

}


// =========================
// OPEN CREATE MODAL
// =========================

function openModal() {

    editingProjectId =
        null;


    modalTitle.textContent =
        "Create New Project";


    modalDescription.textContent =
        "Add a new project to your DevHub.";


    projectSubmitButton.textContent =
        "Create Project";


    projectForm.reset();


    clearErrors();

    updateReadmePreview();


    projectModal.classList.add(
        "active"
    );

}


// =========================
// CLOSE MODAL
// =========================

function closeModal() {

    projectModal.classList.remove(
        "active"
    );


    projectForm.reset();

    clearErrors();


    editingProjectId =
        null;


    modalTitle.textContent =
        "Create New Project";


    modalDescription.textContent =
        "Add a new project to your DevHub.";


    projectSubmitButton.textContent =
        "Create Project";


    updateReadmePreview();

}


// =========================
// MODAL BUTTONS
// =========================

if (addProjectButton) {

    addProjectButton.addEventListener(
        "click",
        openModal
    );

}


if (emptyAddProjectButton) {

    emptyAddProjectButton.addEventListener(
        "click",
        openModal
    );

}


if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        closeModal
    );

}


if (cancelProjectButton) {

    cancelProjectButton.addEventListener(
        "click",
        closeModal
    );

}


// =========================
// CLOSE OUTSIDE MODAL
// =========================

if (projectModal) {

    projectModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                projectModal
            ) {

                closeModal();

            }

        }
    );

}


// =========================
// FORM SUBMIT
// =========================

projectForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById(
                    "projectName"
                )
                .value
                .trim();


        const description =
            document
                .getElementById(
                    "projectDescription"
                )
                .value
                .trim();


        const language =
            document
                .getElementById(
                    "projectLanguage"
                )
                .value;


        const github =
            document
                .getElementById(
                    "projectGithub"
                )
                .value
                .trim();


        const demo =
            document
                .getElementById(
                    "projectDemo"
                )
                .value
                .trim();


        const readme =
            projectReadme
                ? projectReadme.value.trim()
                : "";


        clearErrors();


        let isValid =
            true;


        // VALIDATION

        if (name === "") {

            document.getElementById(
                "projectNameError"
            ).textContent =
                "Project name is required.";

            isValid =
                false;

        }


        if (description === "") {

            document.getElementById(
                "projectDescriptionError"
            ).textContent =
                "Description is required.";

            isValid =
                false;

        }


        if (language === "") {

            document.getElementById(
                "projectLanguageError"
            ).textContent =
                "Please select a language.";

            isValid =
                false;

        }


        if (!isValid) {

            return;

        }


        // =========================
        // UPDATE PROJECT
        // =========================

        if (
            editingProjectId !==
            null
        ) {

            const project =
                projects.find(
                    function (item) {

                        return (
                            item.id ===
                            editingProjectId
                        );

                    }
                );


            if (!project) {

                return;

            }


            if (
                project.owner !==
                currentUser.username
            ) {

                alert(
                    "You can only edit your own projects."
                );

                closeModal();

                return;

            }


            project.name =
                name;


            project.description =
                description;


            project.language =
                language;


            project.github =
                github;


            project.demo =
                demo;


            project.readme =
                readme;


            saveProjects();

            displayProjects();

            displayStatistics();

            closeModal();

            return;

        }


        // =========================
        // CREATE PROJECT
        // =========================

        const newProject = {

            id:
                Date.now(),

            owner:
                currentUser.username,

            name:
                name,

            description:
                description,

            language:
                language,

            github:
                github,

            demo:
                demo,

            readme:
                readme,

            stars:
                0,

            forks:
                0

        };


        projects.push(
            newProject
        );


        saveProjects();

        displayProjects();

        displayStatistics();

        closeModal();

    }
);


// =========================
// SAVE PROJECTS
// =========================

function saveProjects() {

    localStorage.setItem(
        "devhubProjects",
        JSON.stringify(
            projects
        )
    );

}


// =========================
// CLEAR ERRORS
// =========================

function clearErrors() {

    document.getElementById(
        "projectNameError"
    ).textContent =
        "";


    document.getElementById(
        "projectDescriptionError"
    ).textContent =
        "";


    document.getElementById(
        "projectLanguageError"
    ).textContent =
        "";

}


// =========================
// SEARCH
// =========================

if (searchProjects) {

    searchProjects.addEventListener(
        "input",
        displayProjects
    );

}


// =========================
// FILTER
// =========================

if (filterLanguage) {

    filterLanguage.addEventListener(
        "change",
        displayProjects
    );

}


// =========================
// DISPLAY PROJECTS
// =========================

function displayProjects() {

    projectsContainer.innerHTML =
        "";


    const searchValue =
        searchProjects.value
            .trim()
            .toLowerCase();


    const selectedLanguage =
        filterLanguage.value;


    // =========================
    // CURRENT USER PROJECTS
    // =========================

    const myProjects =
        projects.filter(
            function (project) {

                return (
                    project.owner ===
                    currentUser.username
                );

            }
        );


    // =========================
    // SEARCH & FILTER
    // =========================

    const filteredProjects =
        myProjects.filter(
            function (project) {

                const name =
                    project.name ||
                    "";

                const description =
                    project.description ||
                    "";

                const language =
                    project.language ||
                    "";


                const matchesSearch =
                    name
                        .toLowerCase()
                        .includes(
                            searchValue
                        ) ||

                    description
                        .toLowerCase()
                        .includes(
                            searchValue
                        ) ||

                    language
                        .toLowerCase()
                        .includes(
                            searchValue
                        );


                const matchesLanguage =
                    selectedLanguage ===
                    "all" ||

                    project.language ===
                    selectedLanguage;


                return (
                    matchesSearch &&
                    matchesLanguage
                );

            }
        );


    // =========================
    // NO PROJECTS
    // =========================

    if (
        myProjects.length ===
        0
    ) {

        emptyState.style.display =
            "block";


        emptyState.querySelector(
            "h2"
        ).textContent =
            "No projects yet";


        emptyState.querySelector(
            "p"
        ).textContent =
            "Create your first project to get started.";


        return;

    }


    // =========================
    // NO SEARCH RESULTS
    // =========================

    if (
        filteredProjects.length ===
        0
    ) {

        emptyState.style.display =
            "block";


        emptyState.querySelector(
            "h2"
        ).textContent =
            "No projects found";


        emptyState.querySelector(
            "p"
        ).textContent =
            "Try another search or filter.";


        return;

    }


    emptyState.style.display =
        "none";


    // =========================
    // PROJECT CARDS
    // =========================

    filteredProjects.forEach(
        function (project) {

            const projectCard =
                document.createElement(
                    "article"
                );


            projectCard.className =
                "project-card";


            // =========================
            // DATE
            // =========================

            let projectDate =
                "—";


            if (project.id) {

                projectDate =
                    new Date(
                        project.id
                    ).toLocaleDateString(
                        "en-US",
                        {
                            year:
                                "numeric",

                            month:
                                "short",

                            day:
                                "numeric"
                        }
                    );

            }


            // =========================
            // STATS
            // =========================

            const stars =
                Number(
                    project.stars || 0
                );


            const forks =
                Number(
                    project.forks || 0
                );


            const hasReadme =
                project.readme &&
                project.readme.trim() !== "";


            // =========================
            // LINKS
            // =========================

            const githubButton =
                project.github &&
                project.github.trim() !== ""

                    ? `
                        <a
                            href="${project.github}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="project-action"
                        >
                            GitHub
                        </a>
                    `

                    : "";


            const demoButton =
                project.demo &&
                project.demo.trim() !== ""

                    ? `
                        <a
                            href="${project.demo}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="project-action"
                        >
                            Demo
                        </a>
                    `

                    : "";


            // =========================
            // CARD
            // =========================

            projectCard.innerHTML = `

                <div class="project-card-top">

                    <div class="project-card-icon">
                        &lt;/&gt;
                    </div>


                    <div class="project-card-actions">

                        ${githubButton}

                        ${demoButton}

                    </div>

                </div>


                <div class="project-card-content">

                    <div class="project-card-title-row">

                        <h2>
                            ${escapeHtml(
                                project.name
                            )}
                        </h2>


                        <span class="project-visibility">
                            Public
                        </span>

                    </div>


                    <p>
                        ${escapeHtml(
                            project.description
                        )}
                    </p>


                    <div class="project-card-meta">

                        <span class="project-language">
                            ${escapeHtml(
                                project.language ||
                                "—"
                            )}
                        </span>


                        <span class="project-date">
                            Created ${projectDate}
                        </span>

                    </div>


                    <div class="project-card-stats">

                        <span>
                            ⭐ ${stars}
                        </span>


                        <span>
                            🍴 ${forks}
                        </span>


                        <span
                            class="${
                                hasReadme
                                    ? "has-readme"
                                    : "no-readme"
                            }"
                        >
                            ${
                                hasReadme
                                    ? "README"
                                    : "No README"
                            }
                        </span>

                    </div>

                </div>


                <a
                    href="project.html?id=${project.id}"
                    class="view-project-button"
                >

                    <span>
                        View Project
                    </span>

                    <span>
                        →
                    </span>

                </a>


                <div class="project-card-bottom">

                    <div class="project-owner">

                        <span class="owner-dot"></span>

                        ${escapeHtml(
                            project.owner
                        )}

                    </div>


                    <div class="project-management">

                        <button
                            type="button"
                            class="edit-project"
                            data-id="${project.id}"
                        >
                            Edit
                        </button>


                        <button
                            type="button"
                            class="delete-project"
                            data-id="${project.id}"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            `;


            projectsContainer.appendChild(
                projectCard
            );

        }
    );


    // =========================
    // EDIT BUTTONS
    // =========================

    document
        .querySelectorAll(
            ".edit-project"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const projectId =
                            Number(
                                this.dataset.id
                            );


                        editProject(
                            projectId
                        );

                    }
                );

            }
        );


    // =========================
    // DELETE BUTTONS
    // =========================

    document
        .querySelectorAll(
            ".delete-project"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const projectId =
                            Number(
                                this.dataset.id
                            );


                        deleteProject(
                            projectId
                        );

                    }
                );

            }
        );

}


// =========================
// DELETE PROJECT
// =========================

function deleteProject(
    projectId
) {

    const project =
        projects.find(
            function (item) {

                return (
                    item.id ===
                    projectId
                );

            }
        );


    if (!project) {

        return;

    }


    if (
        project.owner !==
        currentUser.username
    ) {

        alert(
            "You can only delete your own projects."
        );

        return;

    }


    const confirmed =
        confirm(
            `Are you sure you want to delete "${project.name}"?`
        );


    if (!confirmed) {

        return;

    }


    projects =
        projects.filter(
            function (item) {

                return (
                    item.id !==
                    projectId
                );

            }
        );


    saveProjects();

    displayProjects();

    displayStatistics();

}


// =========================
// EDIT PROJECT
// =========================

function editProject(
    projectId
) {

    const project =
        projects.find(
            function (item) {

                return (
                    item.id ===
                    projectId
                );

            }
        );


    if (!project) {

        return;

    }


    if (
        project.owner !==
        currentUser.username
    ) {

        alert(
            "You can only edit your own projects."
        );

        return;

    }


    editingProjectId =
        projectId;


    modalTitle.textContent =
        "Edit Project";


    modalDescription.textContent =
        "Update your project information.";


    projectSubmitButton.textContent =
        "Update Project";


    document.getElementById(
        "projectName"
    ).value =
        project.name;


    document.getElementById(
        "projectDescription"
    ).value =
        project.description;


    document.getElementById(
        "projectLanguage"
    ).value =
        project.language;


    document.getElementById(
        "projectGithub"
    ).value =
        project.github ||
        "";


    document.getElementById(
        "projectDemo"
    ).value =
        project.demo ||
        "";


    if (projectReadme) {

        projectReadme.value =
            project.readme ||
            "";

    }


    clearErrors();

    updateReadmePreview();


    projectModal.classList.add(
        "active"
    );

}


// =========================
// EDIT FROM PROJECT DETAILS
// =========================

function checkEditFromUrl() {

    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const editId =
        urlParams.get(
            "edit"
        );


    if (editId === null) {

        return;

    }


    const projectId =
        Number(
            editId
        );


    if (
        Number.isNaN(
            projectId
        )
    ) {

        return;

    }


    const project =
        projects.find(
            function (item) {

                return (
                    item.id ===
                    projectId
                );

            }
        );


    if (!project) {

        return;

    }


    if (
        project.owner !==
        currentUser.username
    ) {

        alert(
            "You can only edit your own projects."
        );

        return;

    }


    editProject(
        projectId
    );


    window.history.replaceState(
        {},
        document.title,
        "dashboard.html"
    );

}


// =========================
// INITIAL LOAD
// =========================

displayProjects();

displayStatistics();

updateReadmePreview();

checkEditFromUrl();