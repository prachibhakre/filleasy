// --------------------
// Button References
// --------------------
const createBtn = document.getElementById("createProfileBtn");
const chooseBtn = document.getElementById("chooseProfileBtn");
const closeBtn = document.getElementById("closeBtn");
const profileSelectList = document.getElementById("profileSelectList");
const activeProfileDisplay = document.getElementById("activeProfileDisplay");
const autofillBtn = document.getElementById("autofillBtn");

// --------------------
// Toast Notification
// --------------------
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// --------------------
// Create Profile
// --------------------
createBtn.addEventListener("click", () => {
  chrome.tabs.create({ url: "profile.html" });
});

// --------------------
// Choose Profile
// --------------------
chooseBtn.addEventListener("click", () => {
  const profiles = JSON.parse(localStorage.getItem("profiles")) || [];
  profileSelectList.innerHTML = "";

  if (profiles.length === 0) {
    profileSelectList.innerHTML = "<li>No profiles found. Please create one first.</li>";
  } else {
    profiles.forEach((profile, index) => {
      const li = document.createElement("li");
      li.textContent = profile.name || `Profile ${index + 1}`;
      li.addEventListener("click", () => {
        localStorage.setItem("activeProfileIndex", index);
        showToast(`✅ ${profile.name} is now active`);
        updateActiveProfileDisplay();
      });
      profileSelectList.appendChild(li);
    });
  }

  profileSelectList.style.display = "block";
});

// --------------------
// Show Active Profile
// --------------------
function updateActiveProfileDisplay() {
  const activeIndex = localStorage.getItem("activeProfileIndex");
  const profiles = JSON.parse(localStorage.getItem("profiles")) || [];
  if (activeIndex !== null && profiles[activeIndex]) {
    activeProfileDisplay.textContent = `Active Profile: ${profiles[activeIndex].name}`;
  } else {
    activeProfileDisplay.textContent = "No active profile selected";
  }
}

// --------------------
// Autofill Active Profile
// --------------------
function autofillActiveProfile() {
  const profiles = JSON.parse(localStorage.getItem("profiles")) || [];
  const activeIndex = localStorage.getItem("activeProfileIndex");

  if (activeIndex === null || !profiles[activeIndex]) {
    showToast("⚠️ No active profile selected!");
    return;
  }

  const profile = profiles[parseInt(activeIndex)];

  const fieldMap = {
    name: ["name", "fullName", "applicantName"],
    email: ["email", "userEmail", "emailAddress"],
    phone: ["phone", "phoneNumber", "contact"],
    linkedin: ["linkedin", "linkedinUrl", "profileLink"],
    summary: ["summary", "about", "description"],
    education: ["education", "degree", "qualification"],
    skills: ["skills", "expertise", "technologies"],
    projects: ["projects", "work", "portfolio"]
  };

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (profile, fieldMap) => {
        document.querySelectorAll("input").forEach(input => {
          const n = (input.name || input.id || "").toLowerCase();
          if (fieldMap.name.some(f => n.includes(f))) input.value = profile.name;
          if (fieldMap.email.some(f => n.includes(f))) input.value = profile.email;
          if (fieldMap.phone.some(f => n.includes(f))) input.value = profile.phone;
          if (fieldMap.linkedin.some(f => n.includes(f))) input.value = profile.linkedin;
        });
        document.querySelectorAll("textarea").forEach(textarea => {
          const n = (textarea.name || textarea.id || "").toLowerCase();
          if (fieldMap.summary.some(f => n.includes(f))) textarea.value = profile.summary;
          if (fieldMap.education.some(f => n.includes(f))) textarea.value = profile.education;
          if (fieldMap.skills.some(f => n.includes(f))) textarea.value = profile.skills;
          if (fieldMap.projects.some(f => n.includes(f))) textarea.value = profile.projects;
        });
      },
      args: [profile, fieldMap]
    });
  });
}

// --------------------
// Event Listeners
// --------------------
autofillBtn.addEventListener("click", autofillActiveProfile);
closeBtn.addEventListener("click", () => window.close());

// --------------------
// Initial Load
// --------------------
updateActiveProfileDisplay();
