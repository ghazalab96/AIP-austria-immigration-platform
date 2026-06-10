const API_URL = "http://localhost:5050/api";

const refreshRequestsBtn = document.getElementById("refreshRequestsBtn");
const requestsContainer = document.getElementById("requestsContainer");
const requestsCount = document.getElementById("requestsCount");

const adminLoginScreen = document.getElementById("adminLoginScreen");
const adminPanel = document.getElementById("adminPanel");
const adminLoginKeyInput = document.getElementById("adminLoginKeyInput");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminLoginMessage = document.getElementById("adminLoginMessage");
const adminLogoutBtn = document.getElementById("adminLogoutBtn");

let adminKey = localStorage.getItem("adminKey") || "";

const showAdminPanel = () => {
  if (adminLoginScreen) {
    adminLoginScreen.classList.add("hidden");
  }

  if (adminPanel) {
    adminPanel.classList.remove("hidden");
  }
};

const showAdminLogin = () => {
  if (adminLoginScreen) {
    adminLoginScreen.classList.remove("hidden");
  }

  if (adminPanel) {
    adminPanel.classList.add("hidden");
  }
};

const showAdminLoginMessage = (text, type) => {
  if (!adminLoginMessage) return;

  adminLoginMessage.textContent = text;
  adminLoginMessage.className = `message ${type}`;
};

const logoutAdmin = () => {
  localStorage.removeItem("adminKey");
  adminKey = "";

  if (adminLoginKeyInput) {
    adminLoginKeyInput.value = "";
  }

  if (requestsCount) {
    requestsCount.textContent = "0 requests found";
  }

  renderEmptyState(
    "No data loaded yet",
    "Enter the admin key to load requests."
  );

  showAdminLogin();
  showAdminLoginMessage("Admin logged out successfully.", "success");
};

const getAdminHeaders = () => {
  return {
    "Content-Type": "application/json",
    "x-admin-key": adminKey
  };
};

const formatDateTime = (dateValue) => {
  if (!dateValue) {
    return "Not available";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString();
};

const getStatusClass = (status) => {
  if (status === "confirmed") return "confirmed";
  if (status === "rejected") return "rejected";
  return "pending";
};

const renderEmptyState = (title, text) => {
  if (!requestsContainer) return;

  requestsContainer.innerHTML = `
    <div class="empty-state">
      <h3>${title}</h3>
      <p>${text}</p>
    </div>
  `;
};

const renderRequests = (requests) => {
  if (!requestsContainer || !requestsCount) return;

  requestsCount.textContent = `${requests.length} request${requests.length === 1 ? "" : "s"} found`;

  if (requests.length === 0) {
    renderEmptyState(
      "No session requests yet",
      "Student session requests will appear here."
    );
    return;
  }

  requestsContainer.innerHTML = requests
    .map((request) => {
      const statusClass = getStatusClass(request.status);

      return `
        <article class="request-card ${statusClass}">
          <div class="request-card-header">
            <div>
              <h4>${request.topic}</h4>
              <p>Request ID: ${request.id}</p>
            </div>

            <span class="status-badge ${statusClass}">
              ${request.status}
            </span>
          </div>

          <div class="request-details">
            <div class="request-detail">
              <span>User ID</span>
              <strong>${request.userId}</strong>
            </div>

            <div class="request-detail">
              <span>Preferred Date</span>
              <strong>${request.preferredDate}</strong>
            </div>

            <div class="request-detail">
              <span>Preferred Time</span>
              <strong>${request.preferredTime}</strong>
            </div>

            <div class="request-detail">
              <span>Submitted At</span>
              <strong>${formatDateTime(request.createdAt)}</strong>
            </div>
          </div>

          <div class="request-message">
            <span>Message</span>
            <p>${request.message || "No message provided."}</p>
          </div>

          <div class="request-actions">
            <button
              class="confirm-btn"
              type="button"
              data-id="${request.id}"
              data-status="confirmed"
            >
              Confirm
            </button>

            <button
              class="reject-btn"
              type="button"
              data-id="${request.id}"
              data-status="rejected"
            >
              Reject
            </button>

            <button
              class="danger-btn"
              type="button"
              data-delete-id="${request.id}"
            >
              Delete
            </button>
          </div>
        </article>
      `;
    })
    .join("");
};

const loadSessionRequests = async () => {
  if (!adminKey) {
    showAdminLogin();
    showAdminLoginMessage("Please enter the admin key first.", "error");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/session-request/admin/all`, {
      method: "GET",
      headers: getAdminHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      showAdminLogin();
      showAdminLoginMessage(data.message || "Invalid admin key.", "error");

      localStorage.removeItem("adminKey");
      adminKey = "";

      if (adminLoginKeyInput) {
        adminLoginKeyInput.value = "";
      }

      return;
    }

    showAdminPanel();
    renderRequests(data);
  } catch (error) {
    showAdminLogin();
    showAdminLoginMessage("Could not connect to the server.", "error");
  }
};

const updateSessionStatus = async (id, status) => {
  try {
    const response = await fetch(
      `${API_URL}/session-request/admin/${id}/status`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({ status })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Could not update status.");
      return;
    }

    loadSessionRequests();
  } catch (error) {
    alert("Could not connect to the server.");
  }
};

const deleteSessionRequest = async (id) => {
  const confirmDelete = confirm("Are you sure you want to delete this request?");

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/session-request/admin/${id}`,
      {
        method: "DELETE",
        headers: getAdminHeaders()
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Could not delete request.");
      return;
    }

    loadSessionRequests();
  } catch (error) {
    alert("Could not connect to the server.");
  }
};

if (adminLoginBtn) {
  adminLoginBtn.addEventListener("click", () => {
    const enteredKey = adminLoginKeyInput.value.trim();

    if (!enteredKey) {
      showAdminLoginMessage("Please enter the admin key.", "error");
      return;
    }

    adminKey = enteredKey;
    localStorage.setItem("adminKey", adminKey);

    loadSessionRequests();
  });
}

if (adminLoginKeyInput) {
  adminLoginKeyInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      adminLoginBtn.click();
    }
  });
}

if (adminLogoutBtn) {
  adminLogoutBtn.addEventListener("click", logoutAdmin);
}

if (refreshRequestsBtn) {
  refreshRequestsBtn.addEventListener("click", loadSessionRequests);
}

if (requestsContainer) {
  requestsContainer.addEventListener("click", (event) => {
    const statusButton = event.target.closest("[data-status]");
    const deleteButton = event.target.closest("[data-delete-id]");

    if (statusButton) {
      const id = statusButton.dataset.id;
      const status = statusButton.dataset.status;

      updateSessionStatus(id, status);
    }

    if (deleteButton) {
      const id = deleteButton.dataset.deleteId;

      deleteSessionRequest(id);
    }
  });
}

if (adminKey) {
  loadSessionRequests();
} else {
  showAdminLogin();
}