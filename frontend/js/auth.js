const API_URL = "http://localhost:5050/api";

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    message.textContent = "";
    message.className = "message";

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        message.textContent = data.message || "Login failed";
        message.classList.add("error");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      message.textContent = "Login successful!";
      message.classList.add("success");

      setTimeout(() => {
        window.location.href = "/pages/dashboard.html";
      }, 800);

    } catch (error) {
      message.textContent = "Cannot connect to server";
      message.classList.add("error");
    }
  });
}


const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    registerMessage.textContent = "";
    registerMessage.className = "message";

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        registerMessage.textContent = data.message || "Registration failed";
        registerMessage.classList.add("error");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      registerMessage.textContent = "Account created successfully! Redirecting to dashboard...";
      registerMessage.classList.add("success");
 
      setTimeout(() => {
      window.location.href = "/pages/dashboard.html";
      }, 1000);

    } catch (error) {
      registerMessage.textContent = "Cannot connect to server";
      registerMessage.classList.add("error");
    }
  });
}