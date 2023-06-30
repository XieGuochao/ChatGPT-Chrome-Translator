/**
 * Author: Guochao Xie @XieGuochao
 * Date: 19-05-2023
 */

document.addEventListener('DOMContentLoaded', async() => {
    const account = await update_options_ui();
    const [models, errorcode, error_message] = await account.models().list();
    if (errorcode != 0) {
        return;
    }
    update_options_ui(account, models);
});

document.getElementById('save').addEventListener('click', () => {
    const components = ui_components();
    save_options(
        components.org.value,
        components.api_key.value,
    );
    update_status("Options saved.");
});

document.getElementById('reset').addEventListener('click', reset_options);
document.getElementById('save-model').addEventListener('click', async () => {
    const components = ui_components();
    await save_options(undefined, undefined, components.model_list.value);
    update_status(`Model saved.`);
});

document.getElementById('save-language').addEventListener('click', async () => {
    const language = new Language();
    await language.save_from_ui();
    update_status(`Language saved: ${language.language}.`);
});

async function init() {
    const language = new Language();
    await language.load();
    language.update_ui();
}
init();