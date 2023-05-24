/**
 * Author: Guochao Xie @XieGuochao
 * Date: 19-05-2023
 */

document.getElementById('save-language').addEventListener('click', updateDefaultLanguage);
refreshLanguage();

document.querySelector('#go-to-options').addEventListener('click', function () {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
});