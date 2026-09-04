const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Inputs
    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const terms = document.getElementById("terms").checked;

    // Error elements
    const nameError = document.getElementById("nameError");
    const usernameError = document.getElementById("usernameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const termsError = document.getElementById("termsError");
    const successMessage = document.getElementById("successMessage");

    // Clear previous errors
    nameError.textContent = "";
    usernameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";
    termsError.textContent = "";
    successMessage.style.display = "none";

    let isValid = true;

    // Name validation
    if (name === "") {
        nameError.textContent = "Full name is required.";
        isValid = false;
    }

    // Username validation
    if (username === "") {
        usernameError.textContent = "Username is required.";
        isValid = false;
    } else if (username.length < 3) {
        usernameError.textContent = "Username must be at least 3 characters.";
        isValid = false;
    }

    // Email validation
    if (email === "") {
        emailError.textContent = "Email address is required.";
        isValid = false;
    } else if (!isValidEmail(email)) {
        emailError.textContent = "Please enter a valid email address.";
        isValid = false;
    }

    // Password validation
    if (password === "") {
        passwordError.textContent = "Password is required.";
        isValid = false;
    } else if (password.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters.";
        isValid = false;
    }

    // Confirm password validation
    if (confirmPassword === "") {
        confirmPasswordError.textContent = "Please confirm your password.";
        isValid = false;
    } else if (password !== confirmPassword) {
        confirmPasswordError.textContent = "Passwords do not match.";
        isValid = false;
    }

    // Terms validation
    if (!terms) {
        termsError.textContent = "You must agree to the Terms of Service.";
        isValid = false;
    }

    // Stop if validation fails
    if (!isValid) {
        return;
    }

    // Create user object
    const user = {
        name: name,
        username: username,
        email: email,
        password: password
    };

    // Save user in LocalStorage
    localStorage.setItem("devhubUser", JSON.stringify(user));

    // Show success message
    successMessage.style.display = "block";

    // Clear form
    registerForm.reset();

    // Go to login page after 1.5 seconds
    setTimeout(function () {
        window.location.href = "login.html";
    }, 1500);
});


// Email validation function
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}