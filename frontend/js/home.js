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
  homeUserName.textContent = "👤";
  homeUserName.setAttribute("title", user.email);
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
      homeUserName.textContent = "👤";
      homeUserName.setAttribute("title", profile.fullName);
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

// Hero Find University button
const heroSearchBtn = document.querySelector(".hero-search-btn");

if (heroSearchBtn) {
  heroSearchBtn.addEventListener("click", (event) => {
    event.preventDefault();

    switchHomeTab("home");

    const universitySearchSection = document.getElementById(
      "university-search-section"
    );

    if (universitySearchSection) {
      universitySearchSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
}


//university search

const setupUniversitySearch = () => {
  const universitySearchInput = document.getElementById("universitySearchInput");
  const universityResults = document.getElementById("universityResults");

  if (!universitySearchInput || !universityResults) {
    return;
  }

  let searchTimeout;
  let latestSearchId = 0;

  const clearUniversityResults = () => {
    universityResults.innerHTML = "";
  };

  const searchUniversities = async (searchValue, searchId) => {
    if (searchValue === "") {
      clearUniversityResults();
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

      const currentInputValue = universitySearchInput.value.trim();

      if (currentInputValue === "" || searchId !== latestSearchId) {
        clearUniversityResults();
        return;
      }

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
      const currentInputValue = universitySearchInput.value.trim();

      if (currentInputValue === "" || searchId !== latestSearchId) {
        clearUniversityResults();
        return;
      }

      universityResults.innerHTML = `
        <div class="university-result-card">
          <p>Could not connect to the server.</p>
        </div>
      `;
    }
  };

  universitySearchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);

    const searchValue = universitySearchInput.value.trim();
    latestSearchId++;

    if (searchValue === "") {
      clearUniversityResults();
      return;
    }

    const currentSearchId = latestSearchId;

    searchTimeout = setTimeout(() => {
      searchUniversities(searchValue, currentSearchId);
    }, 400);
  });
};

setupUniversitySearch();

// currency converter API

const currencyAmount = document.getElementById("currencyAmount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertCurrencyBtn = document.getElementById("convertCurrencyBtn");
const currencyResult = document.getElementById("currencyResult");

const convertCurrency = async () => {

  const amount =
    Number(currencyAmount.value);

  if (!amount) {

    currencyResult.textContent =
      "Please enter an amount";

    return;
  }

  const from =
    fromCurrency.value;

  const to =
    toCurrency.value;

  if (from === to) {

    currencyResult.textContent =
      `${amount} ${from} = ${amount} ${to}`;

    return;
  }

  try {

    const response =
      await fetch(
        `https://open.er-api.com/v6/latest/${from}`
      );

    const data =
      await response.json();

    if (data.result !== "success") {

      currencyResult.textContent =
        "Could not load exchange rates.";

      return;
    }

    const rate =
      data.rates[to];

    const convertedAmount =
      amount * rate;

    currencyResult.textContent =
      `${amount} ${from} = ${convertedAmount.toFixed(2)} ${to}`;

  } catch (error) {

    currencyResult.textContent =
      "Could not load exchange rates.";

  }
};

if (convertCurrencyBtn) {

  convertCurrencyBtn.addEventListener(
    "click",
    () => {

      console.log("CLICK");

      convertCurrency();

    }
  );

}

