// =========================
// AUTHENTICATION
// =========================

const isLoggedIn =
    localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {

    window.location.href =
        "login.html";

}


// =========================
// CURRENT USER
// =========================

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
// GET PROJECT ID
// =========================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const projectId =
    Number(
        urlParams.get("id")
    );


// =========================
// GET PROJECTS
// =========================

const projects =
    JSON.parse(
        localStorage.getItem(
            "devhubProjects"
        )
    ) || [];


// =========================
// FIND PROJECT
// =========================

const project =
    projects.find(
        function (item) {

            return (
                item.id ===
                projectId
            );

        }
    );


// =========================
// ELEMENTS
// =========================

const projectName =
    document.getElementById(
        "projectName"
    );

const projectDescription =
    document.getElementById(
        "projectDescription"
    );

const projectFullDescription =
    document.getElementById(
        "projectFullDescription"
    );

const projectReadme =
    document.getElementById(
        "projectReadme"
    );

const projectLanguage =
    document.getElementById(
        "projectLanguage"
    );

const projectDate =
    document.getElementById(
        "projectDate"
    );

const projectOwner =
    document.getElementById(
        "projectOwner"
    );

const githubLink =
    document.getElementById(
        "githubLink"
    );

const demoLink =
    document.getElementById(
        "demoLink"
    );

const editProjectButton =
    document.getElementById(
        "editProjectButton"
    );

const deleteProjectButton =
    document.getElementById(
        "deleteProjectButton"
    );


// =========================
// REPOSITORY ELEMENTS
// =========================

const projectStars =
    document.getElementById(
        "projectStars"
    );

const projectForks =
    document.getElementById(
        "projectForks"
    );

const projectLanguageStat =
    document.getElementById(
        "projectLanguageStat"
    );

const projectOwnerStat =
    document.getElementById(
        "projectOwnerStat"
    );

const sidebarLanguage =
    document.getElementById(
        "sidebarLanguage"
    );

const sidebarOwner =
    document.getElementById(
        "sidebarOwner"
    );

const sidebarDate =
    document.getElementById(
        "sidebarDate"
    );


// =========================
// INTERACTION ELEMENTS
// =========================

const starProjectButton =
    document.getElementById(
        "starProjectButton"
    );

const starButtonText =
    document.getElementById(
        "starButtonText"
    );

const starButtonCount =
    document.getElementById(
        "starButtonCount"
    );

const forkProjectButton =
    document.getElementById(
        "forkProjectButton"
    );

const forkButtonCount =
    document.getElementById(
        "forkButtonCount"
    );


// =========================
// CHECK PROJECT ACCESS
// =========================

let canAccessProject =
    false;


if (project) {

    if (project.owner) {

        canAccessProject =
            project.owner ===
            currentUser.username;

    } else {

        canAccessProject =
            true;

    }

}


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


    html =
        html.replace(
            /`([^`]+)`/g,
            "<code>$1</code>"
        );


    html =
        html.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    html =
        html.replace(
            /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
            "<em>$1</em>"
        );


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
// MARKDOWN PARSER
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


            // =========================
            // CODE BLOCK
            // =========================

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


            if (trimmed === "") {

                closeLists();

                closeBlockquote();

                return;

            }


            // =========================
            // HORIZONTAL RULE
            // =========================

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


            // =========================
            // H3
            // =========================

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


            // =========================
            // H2
            // =========================

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


            // =========================
            // H1
            // =========================

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


            // =========================
            // BLOCKQUOTE
            // =========================

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


            // =========================
            // UNORDERED LIST
            // =========================

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


            // =========================
            // ORDERED LIST
            // =========================

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


            // =========================
            // PARAGRAPH
            // =========================

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
// GET USER STAR DATA
// =========================

function getStarredProjects() {

    return JSON.parse(
        localStorage.getItem(
            "devhubStarredProjects"
        )
    ) || {};

}


// =========================
// SAVE USER STAR DATA
// =========================

function saveStarredProjects(
    starredProjects
) {

    localStorage.setItem(
        "devhubStarredProjects",
        JSON.stringify(
            starredProjects
        )
    );

}


// =========================
// IS PROJECT STARRED
// =========================

function isProjectStarred() {

    const starredProjects =
        getStarredProjects();


    const userStars =
        starredProjects[
            currentUser.username
        ] || [];


    return userStars.includes(
        projectId
    );

}


// =========================
// UPDATE STAR BUTTON
// =========================

function updateStarButton() {

    if (!starProjectButton) {

        return;

    }


    const starred =
        isProjectStarred();


    if (starButtonText) {

        starButtonText.textContent =
            starred
                ? "Unstar"
                : "Star";

    }


    starProjectButton.classList.toggle(
        "starred",
        starred
    );

}


// =========================
// UPDATE COUNTS
// =========================

function updateInteractionCounts() {

    if (!project) {

        return;

    }


    const stars =
        Number(
            project.stars || 0
        );


    const forks =
        Number(
            project.forks || 0
        );


    if (projectStars) {

        projectStars.textContent =
            stars;

    }


    if (projectForks) {

        projectForks.textContent =
            forks;

    }


    if (starButtonCount) {

        starButtonCount.textContent =
            stars;

    }


    if (forkButtonCount) {

        forkButtonCount.textContent =
            forks;

    }

}


// =========================
// STAR PROJECT
// =========================

if (starProjectButton) {

    starProjectButton.addEventListener(
        "click",
        function () {

            if (!project) {

                return;

            }


            const starredProjects =
                getStarredProjects();


            if (
                !starredProjects[
                    currentUser.username
                ]
            ) {

                starredProjects[
                    currentUser.username
                ] = [];

            }


            const userStars =
                starredProjects[
                    currentUser.username
                ];


            const alreadyStarred =
                userStars.includes(
                    projectId
                );


            if (alreadyStarred) {

                // =========================
                // UNSTAR
                // =========================

                starredProjects[
                    currentUser.username
                ] =
                    userStars.filter(
                        function (id) {

                            return id !==
                                projectId;

                        }
                    );


                project.stars =
                    Math.max(
                        0,
                        Number(
                            project.stars || 0
                        ) - 1
                    );

            } else {

                // =========================
                // STAR
                // =========================

                userStars.push(
                    projectId
                );


                project.stars =
                    Number(
                        project.stars || 0
                    ) + 1;

            }


            localStorage.setItem(
                "devhubStarredProjects",
                JSON.stringify(
                    starredProjects
                )
            );


            const projectIndex =
                projects.findIndex(
                    function (item) {

                        return (
                            item.id ===
                            projectId
                        );

                    }
                );


            if (projectIndex !== -1) {

                projects[
                    projectIndex
                ] = project;

            }


            localStorage.setItem(
                "devhubProjects",
                JSON.stringify(
                    projects
                )
            );


            updateInteractionCounts();

            updateStarButton();

        }
    );

}


// =========================
// FORK PROJECT
// =========================

if (forkProjectButton) {

    forkProjectButton.addEventListener(
        "click",
        function () {

            if (!project) {

                return;

            }


            const confirmed =
                confirm(
                    `Fork "${project.name}" to your DevHub account?`
                );


            if (!confirmed) {

                return;

            }


            const forkedProject = {

                ...project,

                id:
                    Date.now(),

                name:
                    `${project.name}-fork`,

                owner:
                    currentUser.username,

                stars:
                    0,

                forks:
                    0

            };


            projects.push(
                forkedProject
            );


            project.forks =
                Number(
                    project.forks || 0
                ) + 1;


            const originalProjectIndex =
                projects.findIndex(
                    function (item) {

                        return (
                            item.id ===
                            projectId
                        );

                    }
                );


            if (
                originalProjectIndex !==
                -1
            ) {

                projects[
                    originalProjectIndex
                ] = project;

            }


            localStorage.setItem(
                "devhubProjects",
                JSON.stringify(
                    projects
                )
            );


            updateInteractionCounts();


            alert(
                `Project forked successfully as "${forkedProject.name}".`
            );


            window.location.href =
                `project.html?id=${forkedProject.id}`;

        }
    );

}


// =========================
// PROJECT NOT FOUND
// =========================

if (
    !project ||
    !canAccessProject
) {

    projectName.textContent =
        "Project Not Found";


    projectDescription.textContent =
        "The project you are looking for does not exist.";


    projectFullDescription.textContent =
        "This project may have been deleted, the link may be invalid, or you may not have permission to view it.";


    projectReadme.innerHTML =
        "<p>No README available for this project.</p>";


    projectLanguage.textContent =
        "—";


    projectDate.textContent =
        "—";


    projectOwner.textContent =
        "—";


    if (projectStars) {

        projectStars.textContent =
            "0";

    }


    if (projectForks) {

        projectForks.textContent =
            "0";

    }


    if (projectLanguageStat) {

        projectLanguageStat.textContent =
            "—";

    }


    if (projectOwnerStat) {

        projectOwnerStat.textContent =
            "—";

    }


    if (sidebarLanguage) {

        sidebarLanguage.textContent =
            "—";

    }


    if (sidebarOwner) {

        sidebarOwner.textContent =
            "—";

    }


    if (sidebarDate) {

        sidebarDate.textContent =
            "—";

    }


    if (starButtonCount) {

        starButtonCount.textContent =
            "0";

    }


    if (forkButtonCount) {

        forkButtonCount.textContent =
            "0";

    }


    starProjectButton.style.display =
        "none";


    forkProjectButton.style.display =
        "none";


    githubLink.style.display =
        "none";


    demoLink.style.display =
        "none";


    editProjectButton.style.display =
        "none";


    deleteProjectButton.style.display =
        "none";

}


// =========================
// DISPLAY PROJECT
// =========================

if (
    project &&
    canAccessProject
) {

    projectName.textContent =
        project.name;


    projectDescription.textContent =
        project.description;


    projectFullDescription.textContent =
        project.description;


    if (
        project.readme &&
        project.readme.trim() !== ""
    ) {

        projectReadme.innerHTML =
            renderMarkdown(
                project.readme
            );

    } else {

        projectReadme.innerHTML =
            "<p>No README available for this project.</p>";

    }


    projectLanguage.textContent =
        project.language ||
        "—";


    const owner =
        project.owner ||
        currentUser.username;


    projectOwner.textContent =
        owner;


    let formattedDate =
        "—";


    if (project.id) {

        const createdDate =
            new Date(
                project.id
            );


        formattedDate =
            createdDate.toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );


        projectDate.textContent =
            formattedDate;

    }


    // =========================
    // REPOSITORY STATS
    // =========================

    if (projectLanguageStat) {

        projectLanguageStat.textContent =
            project.language ||
            "—";

    }


    if (projectOwnerStat) {

        projectOwnerStat.textContent =
            owner;

    }


    if (sidebarLanguage) {

        sidebarLanguage.textContent =
            project.language ||
            "—";

    }


    if (sidebarOwner) {

        sidebarOwner.textContent =
            owner;

    }


    if (sidebarDate) {

        sidebarDate.textContent =
            formattedDate;

    }


    // =========================
    // LINKS
    // =========================

    if (
        project.github &&
        project.github.trim() !== ""
    ) {

        githubLink.href =
            project.github;

        githubLink.style.display =
            "flex";

    } else {

        githubLink.style.display =
            "none";

    }


    if (
        project.demo &&
        project.demo.trim() !== ""
    ) {

        demoLink.href =
            project.demo;

        demoLink.style.display =
            "flex";

    } else {

        demoLink.style.display =
            "none";

    }


    // =========================
    // INTERACTION COUNTS
    // =========================

    updateInteractionCounts();

    updateStarButton();

}


// =========================
// EDIT PROJECT
// =========================

if (editProjectButton) {

    editProjectButton.addEventListener(
        "click",
        function () {

            if (
                !project ||
                !canAccessProject
            ) {

                return;

            }


            window.location.href =
                `dashboard.html?edit=${project.id}`;

        }
    );

}


// =========================
// DELETE PROJECT
// =========================

if (deleteProjectButton) {

    deleteProjectButton.addEventListener(
        "click",
        function () {

            if (
                !project ||
                !canAccessProject
            ) {

                return;

            }


            const confirmed =
                confirm(
                    `Are you sure you want to delete "${project.name}"?`
                );


            if (!confirmed) {

                return;

            }


            const updatedProjects =
                projects.filter(
                    function (item) {

                        return (
                            item.id !==
                            projectId
                        );

                    }
                );


            localStorage.setItem(
                "devhubProjects",
                JSON.stringify(
                    updatedProjects
                )
            );


            window.location.href =
                "dashboard.html";

        }
    );

}