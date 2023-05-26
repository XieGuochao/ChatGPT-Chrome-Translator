/**
 * utils.js
 * Utility functions for demos.
 * Author: Guochao Xie @XieGuochao
 * Date: 25-05-2023
 */

const status_div = document.getElementById('status');
const STATUS_TIMEOUT = 1000;

function update_status(message) {
    if (status_div) {
        status_div.textContent = `Status: ${message}`;
        setTimeout(() => {
            status_div.textContent = '';
        }, STATUS_TIMEOUT);
    }
}

/**
 * update_status_error: simple error handler to display error response
 */
function update_status_error(response) {
    update_status(`${response.status} ${response.statusText}`);
    console.log("Error:", response);
}


function ui_components() {
    const org = document.getElementById('org');
    const api_key = document.getElementById('api_key');
    const default_model = document.getElementById('default_model');
    const model_list = document.getElementById('model_list');
    const language = document.getElementById('language');
    return {
        org: org,
        api_key: api_key,
        default_model: default_model,
        model_list: model_list,
        language: language,
    };
}

async function save_options(org, api_key, default_model) {
    const account = new OAccount();
    await account.load();
    const new_account = new OAccount(
        org || account.org, 
        api_key || account.api_key,
        default_model || account.default_model,
    );
    await new_account.save();
    
    update_status("Options saved.", new_account);
    const [models, errorcode, error_message] = await new_account.models().list();
    if (errorcode != 0) {
        update_status(`Error: ${error_message}`);
        return;
    }
    update_options_ui(new_account, models);
}

async function reset_options() {
    const account = new OAccount("", "", "");
    await account.save();
    update_options_ui(account);
}

async function update_options_ui(account, model_list) {
    if (!account) {
        account = new OAccount();
        await account.load();
    }
    const components = ui_components();
    if (components.org)
        components.org.value = account.org;
    if (components.api_key)
        components.api_key.value = account.api_key;
    if (components.default_model)
        components.default_model.value = account.default_model;
    if (components.model_list && model_list) {
        update_model_list(model_list, account.default_model, components.model_list);
    }
    return account;
}

function update_model_list(model_list, default_model, model_list_ui) {
    if (!model_list || !model_list_ui || model_list.length == 0) {
        return;
    }

    model_list_ui.inner_html = "";
    for (const model of model_list) {
        const option = document.createElement('option');
        option.value = model["id"];
        option.text = `${model["id"]}`; // Here you can add more information about the model
        option.classList.add(model["owned_by"]); // More class can be added here
        if (model["id"] == default_model) {
            option.selected = true;
        }
        model_list_ui.appendChild(option);
    }
}

function Language(language) {
    if (language) {
        this.language = language;
        this.save();        
    }
}

Language.prototype.save = async function() {
    await chrome.storage.sync.set({
        "language": this.language,
    });
    return this;
}

Language.prototype.load = async function() {
    const data = await chrome.storage.sync.get(["language"]);
    this.language = data["language"] || "English";
    return this;
}

Language.prototype.save_from_ui = async function() {
    const components = ui_components();
    if (components.language) {
        this.language = components.language.value;
        await this.save();
    }
    return this;
}

Language.prototype.update_ui = function() {
    const components = ui_components();
    if (components.language) {
        components.language.value = this.language;
    }
    return this;
}
