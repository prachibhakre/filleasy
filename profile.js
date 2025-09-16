let profiles = JSON.parse(localStorage.getItem("profiles")) || [];

const form = document.getElementById("profileForm");
const profileList = document.getElementById("profileList");
const toast = document.getElementById("toast");
const saveBtn = form.querySelector("button");

let editIndex = -1; // Track which profile is being edited

// --------------------
// Save / Update Profile
// --------------------
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const profile = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    linkedin: document.getElementById("linkedin").value.trim(),
    summary: document.getElementById("summary").value.trim(),
    education: document.getElementById("education").value.trim(),
    skills: document.getElementById("skills").value.trim(),
    projects: document.getElementById("projects").value.trim(),
  };

  if (editIndex === -1) {
    profiles.push(profile);
    showToast("✅ Profile saved successfully");
  } else {
    profiles[editIndex] = profile;
    editIndex = -1;
    saveBtn.textContent = "💾 Save Profile";
    showToast("✏️ Profile updated successfully");
  }

  localStorage.setItem("profiles", JSON.stringify(profiles));
  form.reset();
  displayProfiles();
});

// --------------------
// Display Profiles
// --------------------
function displayProfiles() {
  profileList.innerHTML = "";

  profiles.forEach((p, index) => {
    const li = document.createElement("li");
    li.className = "profile-item";

    // Profile Info
    const infoDiv = document.createElement("div");
    infoDiv.className = "profile-info";
    infoDiv.innerHTML = `
      <strong>${p.name || ""}</strong><br>
      ${p.email ? "📧 " + p.email + "<br>" : ""}
      ${p.phone ? "📞 " + p.phone + "<br>" : ""}
      ${p.linkedin ? `🔗 <a href="${p.linkedin}" target="_blank">LinkedIn</a><br>` : ""}
      ${p.summary ? "📝 " + p.summary + "<br>" : ""}
      ${p.education ? "🎓 " + p.education + "<br>" : ""}
      ${p.skills ? "💡 " + p.skills + "<br>" : ""}
      ${p.projects ? "📂 " + p.projects + "<br>" : ""}
    `;
    li.appendChild(infoDiv);

    // Buttons
    const btnDiv = document.createElement("div");
    btnDiv.className = "profile-buttons";

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️ Edit";
    editBtn.className = "edit-btn";
    editBtn.addEventListener("click", () => editProfile(index));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑 Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => deleteProfile(index));

    btnDiv.appendChild(editBtn);
    btnDiv.appendChild(deleteBtn);
    li.appendChild(btnDiv);

    profileList.appendChild(li);
  });
}

// --------------------
// Edit Profile
// --------------------
function editProfile(index) {
  const p = profiles[index];
  document.getElementById("name").value = p.name;
  document.getElementById("email").value = p.email;
  document.getElementById("phone").value = p.phone;
  document.getElementById("linkedin").value = p.linkedin;
  document.getElementById("summary").value = p.summary;
  document.getElementById("education").value = p.education;
  document.getElementById("skills").value = p.skills;
  document.getElementById("projects").value = p.projects;

  editIndex = index;
  saveBtn.textContent = "💾 Update Profile";
}

// --------------------
// Delete Profile
// --------------------
function deleteProfile(index) {
  profiles.splice(index, 1);
  localStorage.setItem("profiles", JSON.stringify(profiles));
  showToast("🗑 Profile deleted");
  displayProfiles();
}

// --------------------
// Toast Notification
// --------------------
function showToast(message) {
  toast.textContent = message;
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 2000);
}

// --------------------
// Initial Load
// --------------------
displayProfiles();
