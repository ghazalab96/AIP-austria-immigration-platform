const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");
const mainContent = document.getElementById("main-content");
const navLinks = document.querySelectorAll(".nav-link");

// Home auth elements
const homeLoginBtn = document.getElementById("homeLoginBtn");
const homeUserMenu = document.getElementById("homeUserMenu");
const homeUserName = document.getElementById("homeUserName");
const homeLogoutBtn = document.getElementById("homeLogoutBtn");

const API_URL = "http://localhost:5050/api";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("show");
  });
}

// Show user info in home header if logged in
const loadHomeUserProfile = async () => {
  if (!token || !user) return;

  if (homeLoginBtn) {
    homeLoginBtn.classList.add("hidden");
  }

  if (homeUserMenu) {
    homeUserMenu.classList.remove("hidden");
  }

  if (homeUserName) {
    homeUserName.textContent = user.email;
  }

  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    const profile = await response.json();

    if (!response.ok || !profile) {
      return;
    }

    if (homeUserName && profile.fullName) {
      homeUserName.textContent = profile.fullName;
    }
  } catch (error) {
    console.log("Could not load profile on home page");
  }
};

loadHomeUserProfile();

// Logout from home page
if (homeLogoutBtn) {
  homeLogoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  });
}

const pages = {
  home: `
    <section class="hero">
      <div class="hero-overlay">
        <div class="hero-content hero-content-center">
          <h2>Your Path to Studying Abroad Starts Here</h2>
          <div class="accent-line"></div>
          <p>
            Search Austrian universities and start preparing your student visa journey.
          </p>

          <form id="universitySearchForm" class="university-search-form">
            <input 
              type="text" 
              id="universitySearchInput" 
              placeholder="Search university name in Austria..."
            />

            <button type="submit">
              Search
            </button>
          </form>

          <div id="universityResults" class="university-results"></div>
        </div>
      </div>
    </section>

    <section class="services">
      <div class="service-card">
        <div class="icon-circle blue">📄</div>
        <h3>Student Guidance</h3>
        <p>Get step-by-step support for your study journey in Austria.</p>
        <span class="card-line blue-line"></span>
      </div>

      <div class="service-card">
        <div class="icon-circle green">🌐</div>
        <h3>Student Visa Checklist</h3>
        <p>Track your required documents and preparation steps easily.</p>
        <span class="card-line green-line"></span>
      </div>

      <div class="service-card">
        <div class="icon-circle yellow">💻</div>
        <h3>Online Session</h3>
        <p>Request an online consultation for student visa preparation.</p>
        <span class="card-line yellow-line"></span>
      </div>
    </section>
  `,

  universities: `
    <section class="content-page">
      <div class="section-title">
        <h2>Universities</h2>
        <p>Explore study opportunities in Austria.</p>
      </div>

      <div class="university-grid">
        <div class="university-card">
          <h3>University of Vienna</h3>
          <p>One of the largest and oldest universities in Europe.</p>
        </div>

        <div class="university-card">
          <h3>TU Wien</h3>
          <p>Technical university focused on engineering, technology and research.</p>
        </div>

        <div class="university-card">
          <h3>FH Technikum Wien</h3>
          <p>Applied sciences university with career-focused programs.</p>
        </div>
      </div>
    </section>
  `,

  services: `
    <section class="content-page">
      <div class="section-title">
        <h2>Our Services</h2>
        <p>Everything you need for your student visa preparation journey.</p>
      </div>

      <div class="university-grid">
        <div class="university-card">
          <h3>Profile Preparation</h3>
          <p>Create your student profile and organize your study information.</p>
        </div>

        <div class="university-card">
          <h3>Visa Checklist</h3>
          <p>Check which student visa requirements are ready and which are missing.</p>
        </div>

        <div class="university-card">
          <h3>Online Session Request</h3>
          <p>Request a consultation session for guidance and document review.</p>
        </div>
      </div>
    </section>
  `,

  faq: `
    <section class="content-page">
      <div class="section-title">
        <h2>FAQ</h2>
        <p>Common questions about student visa preparation.</p>
      </div>

      <div class="faq-list">
        <div class="faq-item">
          <h3>Do I need an account?</h3>
          <p>Yes, you need an account to save your profile and checklist.</p>
        </div>

        <div class="faq-item">
          <h3>Can I track my checklist?</h3>
          <p>Yes, your dashboard shows your student visa preparation progress.</p>
        </div>

        <div class="faq-item">
          <h3>Can I request an online session?</h3>
          <p>Yes, after preparing your profile and checklist, you can request an online session.</p>
        </div>
      </div>
    </section>
  `,

  contact: `
    <section class="content-page">
      <div class="section-title">
        <h2>Contact Us</h2>
        <p>Need help? We are here to support your journey.</p>
      </div>

      <div class="contact-box">
        <p><strong>Email:</strong> support@aip.at</p>
        <p><strong>Location:</strong> Vienna, Austria</p>
        <p><strong>Working Hours:</strong> Monday to Friday, 09:00 - 17:00</p>
      </div>
    </section>
  `
};

const setupUniversitySearch = () => {
  const universitySearchInput = document.getElementById("universitySearchInput");
  const universityResults = document.getElementById("universityResults");

  if (!universitySearchInput || !universityResults) {
    return;
  }

  let searchTimeout;

  const searchUniversities = async () => {
    const searchValue = universitySearchInput.value.trim();

    if (searchValue === "") {
      universityResults.innerHTML = "";
      return;
    }

    universityResults.innerHTML = `
      <div class="university-result-card">
        <p>Searching universities...</p>
      </div>
    `;

    try {
      const response = await fetch(
        `${API_URL}/universities?name=${encodeURIComponent(searchValue)}`
      );

      const universities = await response.json();

      if (!response.ok) {
        universityResults.innerHTML = `
          <div class="university-result-card">
            <p>${universities.message || "Something went wrong."}</p>
          </div>
        `;
        return;
      }

      if (universities.length === 0) {
        universityResults.innerHTML = `
          <div class="university-result-card">
            <p>No Austrian university found with this name.</p>
          </div>
        `;
        return;
      }

      universityResults.innerHTML = universities
        .slice(0, 5)
        .map((university) => {
          if (university.website) {
            return `
              <a 
                href="${university.website}" 
                target="_blank" 
                class="university-result-card university-result-link"
              >
                <h3>${university.name}</h3>
                <p>${university.domain || "No domain available"}</p>
              </a>
            `;
          }

          return `
            <div class="university-result-card">
              <h3>${university.name}</h3>
              <p>No website available</p>
            </div>
          `;
        })
        .join("");
    } catch (error) {
      universityResults.innerHTML = `
        <div class="university-result-card">
          <p>Could not connect to the server.</p>
        </div>
      `;
    }
  };

  universitySearchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      searchUniversities();
    }, 400);
  });
};


navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const page = link.dataset.page;

    mainContent.innerHTML = pages[page];

    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");

    navbar.classList.remove("show");

    if (page === "home") {
      setupUniversitySearch();
    }
  });
});

setupUniversitySearch();