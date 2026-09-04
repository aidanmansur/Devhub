const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const emailError = document.getElementById("loginEmailError");
    const passwordError = document.getElementById("loginPasswordError");
    const loginError = document.getElementById("loginError");

    // Clear previous errors
    emailError.textContent = "";
    passwordError.textContent = "";
    loginError.textContent = "";

    let isValid = true;

    // Email validation
    if (email === "") {
        emailError.textContent = "Email address is required.";
        isValid = false;
    }

    // Password validation
    if (password === "") {
        passwordError.textContent = "Password is required.";
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Get registered user
    const savedUser = localStorage.getItem("devhubUser");

    if (!savedUser) {
        loginError.textContent =
            "No account found. Please create an account first.";
        return;
    }

    const user = JSON.parse(savedUser);

    // Check login information
    if (email !== user.email || password !== user.password) {
        loginError.textContent =
            "Incorrect email or password.";
        return;
    }

    // Login successful
    localStorage.setItem("isLoggedIn", "true");

    // Save current user
    localStorage.setItem("currentUser", JSON.stringify(user));

    // Go to dashboard
    window.location.href = "dashboard.html";
});