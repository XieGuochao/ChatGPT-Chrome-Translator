async function saveLanguage(language) {
    await chrome.storage.sync.set({
        "language": language,
    });
}

async function loadLanguage() {
    const data = await chrome.storage.sync.get(["language"]);
    return data["language"] || "English";
}


async function refreshLanguage() {
    const data = await loadLanguage();
    const languageInput = document.getElementById('language');
    languageInput.value = data;
}

async function updateDefaultLanguage() {
    const language = document.getElementById('language').value;
    console.log("Setting default language to", language);
    saveLanguage(language);
    updateStatus("Default language saved.");
    refreshLanguage();
}


function updateStatus(message) {
    const status = document.getElementById('status');
    if (!status) {
        return;
    }
    status.textContent = `Status: ${message}`;
    setTimeout(() => {
      status.textContent = '';
    }, 1000);
};