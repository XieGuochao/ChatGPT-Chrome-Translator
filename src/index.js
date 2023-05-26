/**
 * Author: Guochao Xie @XieGuochao
 * Date: 19-05-2023
 */

document.getElementById('save-language').addEventListener('click', async () => {
    const language = new Language();
    await language.save_from_ui();
    update_status(`Language saved: ${language.language}.`);
});

document.querySelector('#go-to-options').addEventListener('click', function () {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
});

async function init() {
    const language = new Language();
    await language.load();
    language.update_ui();
}
init();