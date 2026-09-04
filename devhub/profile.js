// =========================================================
// AUTHENTICATION
// =========================================================

const isLoggedIn =
    localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {
    window.location.href = "login.html";
}


// =========================================================
// CURRENT USER
// =========================================================

let currentUser =
    JSON.parse(
        localStorage.getItem("currentUser")
    );

if (!currentUser) {
    window.location.href = "login.html";
}


// =========================================================
// PROFILE ELEMENTS
// =========================================================

const profileInitial =
    document.getElementById("profileInitial");

const profileUsername =
    document.getElementById("profileUsername");

const profileEmail =
    document.getElementById("profileEmail");

const profileBio =
    document.getElementById("profileBio");

const profileName =
    document.getElementById("profileName");

const profileUsernameInfo =
    document.getElementById(
        "profileUsernameInfo"
    );

const profileEmailInfo =
    document.getElementById(
        "profileEmailInfo"
    );


// =========================================================
// STATISTICS ELEMENTS
// =========================================================

const projectCount =
    document.getElementById(
        "projectCount"
    );

const totalStars =
    document.getElementById(
        "totalStars"
    );

const totalForks =
    document.getElementById(
        "totalForks"
    );

const languageCount =
    document.getElementById(
        "languageCount"
    );

const githubCount =
    document.getElementById(
        "githubCount"
    );


// =========================================================
// ACTIVITY ELEMENTS
// =========================================================

const activityProjects =
    document.getElementById(
        "activityProjects"
    );

const activityStars =
    document.getElementById(
        "activityStars"
    );

const activityForks =
    document.getElementById(
        "activityForks"
    );


// =========================================================
// PROJECT CONTAINERS
// =========================================================

const profileProjectsContainer =
    document.getElementById(
        "profileProjectsContainer"
    );

const profileProjectsEmpty =
    document.getElementById(
        "profileProjectsEmpty"
    );


// =========================================================
// GET MY PROJECTS
// =========================================================

function getMyProjects() {

    const allProjects =
        JSON.parse(
            localStorage.getItem(
                "devhubProjects"
            )
        ) || [];


    return allProjects.filter(
        function (project) {

            return (
                project.owner ===
                currentUser.username
            );

        }
    );
}


// =========================================================
// DISPLAY PROFILE
// =========================================================

function displayProfile() {

    const username =
        currentUser.username || "User";

    const email =
        currentUser.email || "No email";

    const name =
        currentUser.name || "—";

    const bio =
        currentUser.bio ||
        "No bio yet.";


    profileUsername.textContent =
        username;

    profileEmail.textContent =
        email;

    profileBio.textContent =
        bio;

    profileName.textContent =
        name;

    profileUsernameInfo.textContent =
        username;

    profileEmailInfo.textContent =
        email;


    profileInitial.textContent =
        username
            .charAt(0)
            .toUpperCase();
}


// =========================================================
// DISPLAY STATISTICS
// =========================================================

function displayStatistics() {

    const myProjects =
        getMyProjects();


    // -----------------------------------------------------
    // PROJECTS
    // -----------------------------------------------------

    projectCount.textContent =
        myProjects.length;


    // -----------------------------------------------------
    // STARS
    // -----------------------------------------------------

    let stars = 0;


    myProjects.forEach(
        function (project) {

            stars +=
                Number(project.stars) || 0;

        }
    );


    totalStars.textContent =
        stars;


    // -----------------------------------------------------
    // FORKS
    // -----------------------------------------------------

    let forks = 0;


    myProjects.forEach(
        function (project) {

            forks +=
                Number(project.forks) || 0;

        }
    );


    totalForks.textContent =
        forks;


    // -----------------------------------------------------
    // LANGUAGES
    // -----------------------------------------------------

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


    languageCount.textContent =
        languages.size;


    // -----------------------------------------------------
    // GITHUB LINKS
    // -----------------------------------------------------

    const githubProjects =
        myProjects.filter(
            function (project) {

                return (
                    project.github &&
                    project.github.trim() !== ""
                );

            }
        );


    githubCount.textContent =
        githubProjects.length;


    // -----------------------------------------------------
    // ACTIVITY TEXT
    // -----------------------------------------------------

    activityProjects.textContent =
        myProjects.length +
        (
            myProjects.length === 1
                ? " project"
                : " projects"
        );


    activityStars.textContent =
        stars +
        (
            stars === 1
                ? " star"
                : " stars"
        );


    activityForks.textContent =
        forks +
        (
            forks === 1
                ? " fork"
                : " forks"
        );
}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHtml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =========================================================
// FORMAT DATE
// =========================================================

function formatDate(timestamp) {

    if (!timestamp) {
        return "Unknown date";
    }


    const date =
        new Date(timestamp);


    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}


// =========================================================
// DISPLAY MY REPOSITORIES
// =========================================================

function displayRepositories() {

    const myProjects =
        getMyProjects();


    profileProjectsContainer.innerHTML =
        "";


    // -----------------------------------------------------
    // EMPTY STATE
    // -----------------------------------------------------

    if (myProjects.length === 0) {

        profileProjectsEmpty.style.display =
            "flex";

        return;
    }


    profileProjectsEmpty.style.display =
        "none";


    // -----------------------------------------------------
    // CREATE PROJECT CARDS
    // -----------------------------------------------------

    myProjects
        .slice()
        .sort(
            function (a, b) {

                return (
                    Number(b.id || 0) -
                    Number(a.id || 0)
                );

            }
        )
        .forEach(
            function (project) {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "profile-repository-card";


                const stars =
                    Number(project.stars) || 0;

                const forks =
                    Number(project.forks) || 0;


                const description =
                    project.description ||
                    "No description provided.";


                const language =
                    project.language ||
                    "Unknown";


                const readmeStatus =
                    project.readme &&
                    project.readme.trim() !== "";


                card.innerHTML = `

                    <div class="profile-repository-top">

                        <div class="profile-repository-title">

                            <span class="profile-repository-icon">
                                &lt;/&gt;
                            </span>

                            <a
                                href="project.html?id=${project.id}"
                                class="profile-repository-name"
                            >
                                ${escapeHtml(project.name)}
                            </a>

                        </div>

                        <span class="profile-repository-public">
                            Public
                        </span>

                    </div>


                    <p class="profile-repository-description">
                        ${escapeHtml(description)}
                    </p>


                    <div class="profile-repository-meta">

                        <span>
                            ◉ ${escapeHtml(language)}
                        </span>

                        <span>
                            ⭐ ${stars}
                        </span>

                        <span>
                            🍴 ${forks}
                        </span>

                        <span>
                            ${readmeStatus
                                ? "README"
                                : "No README"
                            }
                        </span>

                    </div>


                    <div class="profile-repository-footer">

                        <span>
                            Updated ${formatDate(project.id)}
                        </span>

                        <a
                            href="project.html?id=${project.id}"
                            class="profile-repository-view"
                        >
                            View →
                        </a>

                    </div>

                `;


                profileProjectsContainer.appendChild(
                    card
                );

            }
        );
}


// =========================================================
// LOGOUT
// =========================================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


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


// =========================================================
// MODAL
// =========================================================

const profileModal =
    document.getElementById(
        "profileModal"
    );

const editProfileButton =
    document.getElementById(
        "editProfileButton"
    );

const closeProfileModal =
    document.getElementById(
        "closeProfileModal"
    );

const cancelProfileButton =
    document.getElementById(
        "cancelProfileButton"
    );

const profileForm =
    document.getElementById(
        "profileForm"
    );


// =========================================================
// INPUTS
// =========================================================

const editName =
    document.getElementById(
        "editName"
    );

const editUsername =
    document.getElementById(
        "editUsername"
    );

const editEmail =
    document.getElementById(
        "editEmail"
    );

const editBio =
    document.getElementById(
        "editBio"
    );


// =========================================================
// ERRORS
// =========================================================

const editNameError =
    document.getElementById(
        "editNameError"
    );

const editUsernameError =
    document.getElementById(
        "editUsernameError"
    );

const editEmailError =
    document.getElementById(
        "editEmailError"
    );


// =========================================================
// OPEN MODAL
// =========================================================

editProfileButton.addEventListener(
    "click",
    function () {

        editName.value =
            currentUser.name || "";

        editUsername.value =
            currentUser.username || "";

        editEmail.value =
            currentUser.email || "";

        editBio.value =
            currentUser.bio || "";


        clearErrors();


        profileModal.classList.add(
            "active"
        );

    }
);


// =========================================================
// CLOSE MODAL
// =========================================================

function closeModal() {

    profileModal.classList.remove(
        "active"
    );

    clearErrors();
}


closeProfileModal.addEventListener(
    "click",
    closeModal
);


cancelProfileButton.addEventListener(
    "click",
    closeModal
);


// =========================================================
// CLOSE OUTSIDE
// =========================================================

profileModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            profileModal
        ) {

            closeModal();

        }

    }
);


// =========================================================
// CLEAR ERRORS
// =========================================================

function clearErrors() {

    editNameError.textContent =
        "";

    editUsernameError.textContent =
        "";

    editEmailError.textContent =
        "";
}


// =========================================================
// EMAIL VALIDATION
// =========================================================

function isValidEmail(email) {

    const pattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email);
}


// =========================================================
// SAVE PROFILE
// =========================================================

profileForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const oldUsername =
            currentUser.username;


        const name =
            editName.value.trim();

        const username =
            editUsername.value.trim();

        const email =
            editEmail.value.trim();

        const bio =
            editBio.value.trim();


        clearErrors();


        let isValid = true;


        // -------------------------------------------------
        // NAME
        // -------------------------------------------------

        if (name === "") {

            editNameError.textContent =
                "Full name is required.";

            isValid = false;
        }


        // -------------------------------------------------
        // USERNAME
        // -------------------------------------------------

        if (username === "") {

            editUsernameError.textContent =
                "Username is required.";

            isValid = false;

        } else if (username.length < 3) {

            editUsernameError.textContent =
                "Username must be at least 3 characters.";

            isValid = false;
        }


        // -------------------------------------------------
        // EMAIL
        // -------------------------------------------------

        if (email === "") {

            editEmailError.textContent =
                "Email address is required.";

            isValid = false;

        } else if (!isValidEmail(email)) {

            editEmailError.textContent =
                "Please enter a valid email address.";

            isValid = false;
        }


        if (!isValid) {
            return;
        }


        // =================================================
        // LOAD PROJECTS
        // =================================================

        const projects =
            JSON.parse(
                localStorage.getItem(
                    "devhubProjects"
                )
            ) || [];


        // =================================================
        // UPDATE PROJECT OWNERS
        // =================================================

        projects.forEach(
            function (project) {

                if (
                    project.owner ===
                    oldUsername
                ) {

                    project.owner =
                        username;

                }

            }
        );


        localStorage.setItem(
            "devhubProjects",
            JSON.stringify(projects)
        );


        // =================================================
        // UPDATE CURRENT USER
        // =================================================

        currentUser.name =
            name;

        currentUser.username =
            username;

        currentUser.email =
            email;

        currentUser.bio =
            bio;


        localStorage.setItem(
            "currentUser",
            JSON.stringify(
                currentUser
            )
        );


        // =================================================
        // UPDATE REGISTERED USER
        // =================================================

        const registeredUser =
            JSON.parse(
                localStorage.getItem(
                    "devhubUser"
                )
            );


        if (registeredUser) {

            registeredUser.name =
                name;

            registeredUser.username =
                username;

            registeredUser.email =
                email;

            registeredUser.bio =
                bio;


            localStorage.setItem(
                "devhubUser",
                JSON.stringify(
                    registeredUser
                )
            );

        }


        // =================================================
        // REFRESH EVERYTHING
        // =================================================

        displayProfile();

        displayStatistics();

        displayRepositories();

        closeModal();

    }
);


// =========================================================
// INITIAL LOAD
// =========================================================

displayProfile();

displayStatistics();

displayRepositories();