const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

// Home auth elements
const homeLoginBtn = document.getElementById("homeLoginBtn");
const homeUserMenu = document.getElementById("homeUserMenu");
const homeUserName = document.getElementById("homeUserName");
const homeLogoutBtn = document.getElementById("homeLogoutBtn");

// Home tabs
const homeTabButtons = document.querySelectorAll(".home-tab-btn");
const pagePanels = document.querySelectorAll(".page-panel");

const API_URL = "http://localhost:5050/api";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (menuBtn && navbar) {
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

// Home tab switching
const switchHomeTab = (selectedTab) => {
  homeTabButtons.forEach((button) => {
    if (button.dataset.tab === selectedTab) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  pagePanels.forEach((panel) => {
    if (panel.id === `tab-${selectedTab}`) {
      panel.classList.add("active");
    } else {
      panel.classList.remove("active");
    }
  });

  if (navbar) {
    navbar.classList.remove("show");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

homeTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedTab = button.dataset.tab;
    switchHomeTab(selectedTab);
  });
});

// University search
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

setupUniversitySearch();