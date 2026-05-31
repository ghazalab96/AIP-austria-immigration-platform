const API_URL = "http://localhost:5050/api";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

const sidebarLinks = document.querySelectorAll(".sidebar-link");
const dashboardSections = document.querySelectorAll(".dashboard-section");

// Profile view elements
const profileView = document.getElementById("profileView");
const profileEdit = document.getElementById("profileEdit");

const editProfileBtn = document.getElementById("editProfileBtn");
const cancelEditProfileBtn = document.getElementById("cancelEditProfileBtn");

const displayFullName = document.getElementById("displayFullName");
const displayNationality = document.getElementById("displayNationality");
const displayCurrentCountry = document.getElementById("displayCurrentCountry");
const displayTargetUniversity = document.getElementById("displayTargetUniversity");
const displayTargetProgram = document.getElementById("displayTargetProgram");
const displayStudyLevel = document.getElementById("displayStudyLevel");

// Profile form elements
const profileForm = document.getElementById("profileForm");
const fullNameInput = document.getElementById("fullName");
const nationalityInput = document.getElementById("nationality");
const currentCountryInput = document.getElementById("currentCountry");
const targetUniversityInput = document.getElementById("targetUniversity");
const targetProgramInput = document.getElementById("targetProgram");
const studyLevelInput = document.getElementById("studyLevel");

// Checklist elements
const checklistForm = document.getElementById("checklistForm");
const checklistMessage = document.getElementById("checklistMessage");

const admissionLetterInput = document.getElementById("admissionLetter");
const passportInput = document.getElementById("passport");
const financialProofInput = document.getElementById("financialProof");
const healthInsuranceInput = document.getElementById("healthInsurance");
const accommodationProofInput = document.getElementById("accommodationProof");
const passportPhotoInput = document.getElementById("passportPhoto");
const applicationFormInput = document.getElementById("applicationForm");

const checklistItems = document.querySelectorAll(".checklist-item");
const checklistProgressText = document.getElementById("checklistProgressText");
const checklistProgressFill = document.getElementById("checklistProgressFill");

// Overview elements
const overviewGreeting = document.getElementById("overviewGreeting");
const overviewNextStep = document.getElementById("overviewNextStep");
const overviewProgressPercent = document.getElementById("overviewProgressPercent");

const profileOverviewCard = document.getElementById("profileOverviewCard");
const profileOverviewStatus = document.getElementById("profileOverviewStatus");
const profileOverviewText = document.getElementById("profileOverviewText");

const checklistOverviewCard = document.getElementById("checklistOverviewCard");
const checklistOverviewStatus = document.getElementById("checklistOverviewStatus");
const checklistOverviewText = document.getElementById("checklistOverviewText");
const overviewChecklistProgressFill = document.getElementById("overviewChecklistProgressFill");
const overviewProfileName = document.getElementById("overviewProfileName");
const overviewProfileUniversity = document.getElementById("overviewProfileUniversity");
const overviewProfileStudyLevel = document.getElementById("overviewProfileStudyLevel");

const overviewMissingChecklist = document.getElementById("overviewMissingChecklist");

const sessionOverviewCard = document.getElementById("sessionOverviewCard");
const sessionOverviewStatus = document.getElementById("sessionOverviewStatus");
const sessionOverviewText = document.getElementById("sessionOverviewText");

const overviewRecommendedAction = document.getElementById("overviewRecommendedAction");

const overviewActionButtons = document.querySelectorAll("[data-go-section]");

let currentProfile = null;


// =============================
// 1. Protect Dashboard
// =============================

if (!token) {
  window.location.href = "/pages/login.html";
}


// =============================
// 2. Show User Info
// =============================

if (user && user.email && userEmail) {
  userEmail.textContent = user.email;
}


// =============================
// 3. Helper: Auth Headers
// =============================

const getAuthHeaders = () => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
};


const isProfileComplete = (profile) => {
  if (!profile) return false;

  return Boolean(
    profile.fullName &&
    profile.nationality &&
    profile.currentCountry &&
    profile.targetUniversity &&
    profile.targetProgram &&
    profile.studyLevel
  );
};

const getChecklistProgress = () => {
  const inputs = getChecklistInputs();
  const total = inputs.length;
  const completed = inputs.filter((input) => input && input.checked).length;

  return {
    total,
    completed,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100)
  };
};

const setStatusStyle = (element, isComplete, completeText, pendingText) => {
  if (!element) return;

  element.textContent = isComplete ? completeText : pendingText;

  element.classList.remove("completed", "pending");
  element.classList.add(isComplete ? "completed" : "pending");
};

const setCardStyle = (card, isComplete) => {
  if (!card) return;

  card.classList.remove("completed", "pending");
  card.classList.add(isComplete ? "completed" : "pending");
};

const checklistLabels = {
  admissionLetter: "University admission letter",
  passport: "Valid passport",
  financialProof: "Proof of financial means",
  healthInsurance: "Health insurance",
  accommodationProof: "Accommodation proof",
  passportPhoto: "Passport photo",
  applicationForm: "Completed application form"
};

const getTextOrDefault = (value) => {
  if (!value || value.trim() === "") {
    return "Not provided";
  }

  return value;
};

const updateOverview = () => {
  const profileComplete = isProfileComplete(currentProfile);
  const checklistProgress = getChecklistProgress();
  const checklistComplete =
    checklistProgress.total > 0 &&
    checklistProgress.completed === checklistProgress.total;

  if (overviewGreeting) {
    const name =
      currentProfile && currentProfile.fullName
        ? currentProfile.fullName
        : "there";

    overviewGreeting.textContent = `Welcome, ${name}`;
  }

  // Profile card
  setStatusStyle(
    profileOverviewStatus,
    profileComplete,
    "Complete",
    "Incomplete"
  );

  setCardStyle(profileOverviewCard, profileComplete);

  if (profileOverviewText) {
    profileOverviewText.textContent = profileComplete
      ? "Your student profile is ready."
      : "Some profile information is still missing.";
  }

  if (overviewProfileName) {
    overviewProfileName.textContent = getTextOrDefault(currentProfile?.fullName);
  }

  if (overviewProfileUniversity) {
    overviewProfileUniversity.textContent = getTextOrDefault(currentProfile?.targetUniversity);
  }

  if (overviewProfileStudyLevel) {
    overviewProfileStudyLevel.textContent = getTextOrDefault(currentProfile?.studyLevel);
  }

  // Checklist card
  setStatusStyle(
    checklistOverviewStatus,
    checklistComplete,
    "Completed",
    "Pending"
  );

  setCardStyle(checklistOverviewCard, checklistComplete);

  if (checklistOverviewText) {
    checklistOverviewText.textContent =
      `${checklistProgress.completed} of ${checklistProgress.total} completed`;
  }

  if (overviewChecklistProgressFill) {
    overviewChecklistProgressFill.style.width = `${checklistProgress.percentage}%`;
  }

  if (overviewMissingChecklist) {
    const missingItems = [];

    Object.keys(checklistLabels).forEach((key) => {
      const checkbox = document.getElementById(key);

      if (checkbox && !checkbox.checked) {
        missingItems.push(checklistLabels[key]);
      }
    });

    if (missingItems.length === 0) {
      overviewMissingChecklist.innerHTML = `<li class="completed-text">All checklist items are completed.</li>`;
    } else {
      overviewMissingChecklist.innerHTML = missingItems
        .map((item) => `<li>${item}</li>`)
        .join("");
    }
  }

  // Session request card, for now static
  setStatusStyle(
    sessionOverviewStatus,
    false,
    "Requested",
    "Not Requested"
  );

  setCardStyle(sessionOverviewCard, false);

  if (sessionOverviewText) {
    sessionOverviewText.textContent =
      "Request an online consultation after completing your profile and checklist.";
  }

  // Overall progress
  const overallSteps = [
    profileComplete,
    checklistComplete,
    false
  ];

  const completedSteps = overallSteps.filter(Boolean).length;
  const overallPercent = Math.round((completedSteps / overallSteps.length) * 100);

  if (overviewProgressPercent) {
    overviewProgressPercent.textContent = `${overallPercent}%`;
  }

  // Next step texts
  if (overviewNextStep) {
    if (!profileComplete) {
      overviewNextStep.textContent = "Complete your profile to continue your student visa preparation.";
    } else if (!checklistComplete) {
      overviewNextStep.textContent = "Complete your checklist before requesting an online session.";
    } else {
      overviewNextStep.textContent = "You are ready to request an online session.";
    }
  }

  if (overviewRecommendedAction) {
    if (!profileComplete) {
      overviewRecommendedAction.textContent =
        "Start by completing your student profile. This helps us understand your study plan and immigration situation.";
    } else if (!checklistComplete) {
      overviewRecommendedAction.textContent =
        "Continue with your student visa checklist and mark the documents you already have.";
    } else {
      overviewRecommendedAction.textContent =
        "Your profile and checklist are ready. You can now submit an online session request.";
    }
  }
};

// =============================
// 4. Sidebar Navigation
// =============================

sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetSection = link.dataset.section;

    sidebarLinks.forEach((item) => {
      item.classList.remove("active");
    });

    link.classList.add("active");

    dashboardSections.forEach((section) => {
      section.classList.remove("active-section");
    });

    const selectedSection = document.getElementById(targetSection);

    if (selectedSection) {
      selectedSection.classList.add("active-section");
    }
  });
});


overviewActionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetSection = button.dataset.goSection;

    sidebarLinks.forEach((item) => {
      item.classList.remove("active");
    });

    const targetSidebarButton = document.querySelector(
      `.sidebar-link[data-section="${targetSection}"]`
    );

    if (targetSidebarButton) {
      targetSidebarButton.classList.add("active");
    }

    dashboardSections.forEach((section) => {
      section.classList.remove("active-section");
    });

    const selectedSection = document.getElementById(targetSection);

    if (selectedSection) {
      selectedSection.classList.add("active-section");
    }
  });
});

// =============================
// 5. Logout
// =============================

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  });
}


// =============================
// 6. Profile UI Helpers
// =============================

const showProfileView = () => {
  if (profileView) {
    profileView.classList.remove("hidden");
  }

  if (profileEdit) {
    profileEdit.classList.add("hidden");
  }
};

const showProfileEdit = () => {
  if (profileView) {
    profileView.classList.add("hidden");
  }

  if (profileEdit) {
    profileEdit.classList.remove("hidden");
  }
};

const getValueOrDefault = (value) => {
  if (!value || value.trim() === "") {
    return "Not provided";
  }

  return value;
};

const updateProfileView = (profile) => {
  if (!profile) {
    if (displayFullName) displayFullName.textContent = "Not provided";
    if (displayNationality) displayNationality.textContent = "Not provided";
    if (displayCurrentCountry) displayCurrentCountry.textContent = "Not provided";
    if (displayTargetUniversity) displayTargetUniversity.textContent = "Not provided";
    if (displayTargetProgram) displayTargetProgram.textContent = "Not provided";
    if (displayStudyLevel) displayStudyLevel.textContent = "Not provided";
    return;
  }

  if (displayFullName) displayFullName.textContent = getValueOrDefault(profile.fullName);
  if (displayNationality) displayNationality.textContent = getValueOrDefault(profile.nationality);
  if (displayCurrentCountry) displayCurrentCountry.textContent = getValueOrDefault(profile.currentCountry);
  if (displayTargetUniversity) displayTargetUniversity.textContent = getValueOrDefault(profile.targetUniversity);
  if (displayTargetProgram) displayTargetProgram.textContent = getValueOrDefault(profile.targetProgram);
  if (displayStudyLevel) displayStudyLevel.textContent = getValueOrDefault(profile.studyLevel);
};

const fillProfileForm = (profile) => {
  if (!profile) return;

  if (fullNameInput) fullNameInput.value = profile.fullName || "";
  if (nationalityInput) nationalityInput.value = profile.nationality || "";
  if (currentCountryInput) currentCountryInput.value = profile.currentCountry || "";
  if (targetUniversityInput) targetUniversityInput.value = profile.targetUniversity || "";
  if (targetProgramInput) targetProgramInput.value = profile.targetProgram || "";
  if (studyLevelInput) studyLevelInput.value = profile.studyLevel || "";
};


// =============================
// 7. Load Profile From Backend
// =============================

const loadProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(data.message || "Failed to load profile");
      return;
    }

    currentProfile = data;

    updateProfileView(currentProfile);
    fillProfileForm(currentProfile);
    showProfileView();
    updateOverview();

  } catch (error) {
    console.log("Cannot connect to server");
  }
};


// =============================
// 8. Save Profile To Backend
// =============================

const saveProfile = async (event) => {
  event.preventDefault();

  const profileData = {
    fullName: fullNameInput.value.trim(),
    nationality: nationalityInput.value.trim(),
    currentCountry: currentCountryInput.value.trim(),
    targetUniversity: targetUniversityInput.value.trim(),
    targetProgram: targetProgramInput.value.trim(),
    studyLevel: studyLevelInput.value
  };

  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to save profile");
      return;
    }

    currentProfile = data.profile;

    updateProfileView(currentProfile);
    fillProfileForm(currentProfile);
    showProfileView();
    updateOverview();

    alert("Profile saved successfully!");

  } catch (error) {
    alert("Cannot connect to server");
  }
};


// =============================
// 9. Profile Buttons
// =============================

if (editProfileBtn) {
  editProfileBtn.addEventListener("click", () => {
    fillProfileForm(currentProfile);
    showProfileEdit();
  });
}

if (cancelEditProfileBtn) {
  cancelEditProfileBtn.addEventListener("click", () => {
    fillProfileForm(currentProfile);
    showProfileView();
  });
}

if (profileForm) {
  profileForm.addEventListener("submit", saveProfile);
}

// =============================
// 10. Checklist Helpers
// =============================

const fillChecklistForm = (checklist) => {
  if (!checklist) return;

  if (admissionLetterInput) admissionLetterInput.checked = checklist.admissionLetter;
  if (passportInput) passportInput.checked = checklist.passport;
  if (financialProofInput) financialProofInput.checked = checklist.financialProof;
  if (healthInsuranceInput) healthInsuranceInput.checked = checklist.healthInsurance;
  if (accommodationProofInput) accommodationProofInput.checked = checklist.accommodationProof;
  if (passportPhotoInput) passportPhotoInput.checked = checklist.passportPhoto;
  if (applicationFormInput) applicationFormInput.checked = checklist.applicationForm;

  updateChecklistUI();
  updateOverview();
};

const showChecklistMessage = (text, type) => {
  if (!checklistMessage) return;

  checklistMessage.textContent = text;
  checklistMessage.className = `message ${type}`;
};

const getChecklistInputs = () => {
  return [
    admissionLetterInput,
    passportInput,
    financialProofInput,
    healthInsuranceInput,
    accommodationProofInput,
    passportPhotoInput,
    applicationFormInput
  ];
};

const updateChecklistUI = () => {
  const inputs = getChecklistInputs();
  const total = inputs.length;

  const completed = inputs.filter((input) => input && input.checked).length;

  if (checklistProgressText) {
    checklistProgressText.textContent = `${completed} of ${total} completed`;
  }

  if (checklistProgressFill) {
    const percentage = total === 0 ? 0 : (completed / total) * 100;
    checklistProgressFill.style.width = `${percentage}%`;
  }

  checklistItems.forEach((item) => {
    const itemKey = item.dataset.item;
    const checkbox = document.getElementById(itemKey);
    const status = item.querySelector(".checklist-status");

    if (!checkbox || !status) return;

    if (checkbox.checked) {
      status.textContent = "Completed";
      status.classList.remove("pending");
      status.classList.add("completed");
    } else {
      status.textContent = "Pending";
      status.classList.remove("completed");
      status.classList.add("pending");
    }
  });

  updateOverview();
};


// =============================
// 11. Checklist Accordion
// =============================

checklistItems.forEach((item) => {
  const mainRow = item.querySelector(".checklist-main");
  const checkbox = item.querySelector("input[type='checkbox']");

  if (mainRow) {
    mainRow.addEventListener("click", () => {
      item.classList.toggle("open");
    });
  }

  if (checkbox) {
    checkbox.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    checkbox.addEventListener("change", () => {
      updateChecklistUI();
    });
  }
});

// =============================
// 12. Load Checklist From Backend
// =============================

const loadChecklist = async () => {
  try {
    const response = await fetch(`${API_URL}/checklist`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(data.message || "Failed to load checklist");
      return;
    }

    fillChecklistForm(data);

  } catch (error) {
    console.log("Cannot connect to server");
  }
};


// =============================
// 13. Save Checklist To Backend
// =============================

const saveChecklist = async (event) => {
  event.preventDefault();

  const checklistData = {
    admissionLetter: admissionLetterInput.checked,
    passport: passportInput.checked,
    financialProof: financialProofInput.checked,
    healthInsurance: healthInsuranceInput.checked,
    accommodationProof: accommodationProofInput.checked,
    passportPhoto: passportPhotoInput.checked,
    applicationForm: applicationFormInput.checked
  };

  try {
    const response = await fetch(`${API_URL}/checklist`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(checklistData)
    });

    const data = await response.json();

    if (!response.ok) {
      showChecklistMessage(data.message || "Failed to save checklist", "error");
      return;
    }

    fillChecklistForm(data.checklist);
    showChecklistMessage("Checklist saved successfully!", "success");

  } catch (error) {
    showChecklistMessage("Cannot connect to server", "error");
  }
};

if (checklistForm) {
  checklistForm.addEventListener("submit", saveChecklist);
}

// =============================
// 14. Initial Load
// =============================

loadProfile();
loadChecklist();