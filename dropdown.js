const loginToggle = document.querySelector("#login-toggle");
const authDropdown = document.querySelector("#auth-dropdown");
const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");
const loginTab = document.querySelector("#login-tab");
const signupTab = document.querySelector("#signup-tab");
const authMessage = document.querySelector("#auth-message");

function setAuthMode(mode) {
    const showLogin = mode === "login" && loginForm && signupForm;
    if (!loginForm || !signupForm || !loginTab || !signupTab) {
        return;
    }

    loginForm.hidden = !showLogin;
    signupForm.hidden = showLogin;
    loginTab.setAttribute("aria-selected", String(showLogin));
    signupTab.setAttribute("aria-selected", String(!showLogin));
    authMessage.textContent = "";
}

loginToggle.addEventListener("click", () => {
    const isOpen = loginToggle.getAttribute("aria-expanded") === "true";
    loginToggle.setAttribute("aria-expanded", String(!isOpen));
    authDropdown.hidden = isOpen;

    if (!isOpen) {
        if (loginForm) {
            setAuthMode("login");
        }
        const firstInput = authDropdown.querySelector("input");
        if (firstInput) {
            firstInput.focus();
        }
    }
});

if (loginTab && signupTab) {
    loginTab.addEventListener("click", () => setAuthMode("login"));
    signupTab.addEventListener("click", () => setAuthMode("signup"));
}

document.addEventListener("click", (event) => {
    if (!authDropdown.hidden && !authDropdown.contains(event.target) && !loginToggle.contains(event.target)) {
        authDropdown.hidden = true;
        loginToggle.setAttribute("aria-expanded", "false");
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !authDropdown.hidden) {
        authDropdown.hidden = true;
        loginToggle.setAttribute("aria-expanded", "false");
        loginToggle.focus();
    }
});