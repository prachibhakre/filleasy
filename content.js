// content.js
chrome.storage.local.get("profile", (data) => {
  if (!data.profile) return;

  const profile = data.profile;

  function fillInput(fieldNames, value) {
    if (!value) return;

    const inputs = document.querySelectorAll("input, textarea");
    inputs.forEach(input => {
      const attrText = (input.name + " " + input.id + " " + (input.placeholder || "")).toLowerCase();

      fieldNames.forEach(name => {
        if (attrText.includes(name.toLowerCase())) {
          input.value = value;
          input.dispatchEvent(new Event("input", { bubbles: true })); // triggers form listeners
        }
      });
    });
  }

  fillInput(["name", "fullname", "first name"], profile.name);
  fillInput(["email", "mail"], profile.email);
  fillInput(["phone", "mobile", "contact"], profile.phone);
  fillInput(["address", "location"], profile.address);
});
