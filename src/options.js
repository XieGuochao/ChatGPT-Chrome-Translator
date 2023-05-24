/**
 * Author: Guochao Xie @XieGuochao
 * Date: 19-05-2023
 */

function updateStatus(message) {
    const status = document.getElementById('status');
    status.textContent = `Status: ${message}`;
    setTimeout(() => {
      status.textContent = '';
    }, 1000);
};

const saveOptions = async () => {
    const org = document.getElementById('org').value;
    const token = document.getElementById('token').value;
    const oldAccount = await loadGPTAccountFromStorage();
    const model = oldAccount.getDefaultModel();
    
    const account = new GPTAccount(org, token, model);
    await account.saveToStorage();
    
    updateStatus("Options saved.")
    updateModelList(account.getDefaultModel());
};

const resetOptions = async () => {
    const account = new GPTAccount("", "");
    await account.saveToStorage();
    restoreOptions();
};

const restoreOptions = async () => {
    const account = await loadGPTAccountFromStorage();
    document.getElementById('org').value = account.getOrg();
    document.getElementById('token').value = account.getToken();
    updateModelList(account.getDefaultModel());
    console.log("Restored options:", account);
};

const getModels = async () => {
    const account = await loadGPTAccountFromStorage();
    const models = await account.getModels();
    
    console.log("ChatGPT models:", models);
}

const updateModelList = async (defaultModel) => {
    const account = await loadGPTAccountFromStorage();
    const models = await account.getModels();
    if (models.length == 0) {
        return;
    }

    const modelList = document.getElementById('models');
    modelList.innerHTML = "";
    for (const model of models) {
        const option = document.createElement('option');
        option.value = model["id"];
        option.text = `${model["id"]}`; // Here you can add more information about the model
        option.classList.add(model["owned_by"], model["permission"][0].is_blocking ? "is_blocking" : "is_not_blocking"); // More class can be added here
        if (model["id"] == defaultModel) {
            option.selected = true;
        }
        modelList.appendChild(option);
    }
    console.log("Updated model list:", models);
}

const updateDefaultModel = async () => {
    const account = await loadGPTAccountFromStorage();
    const model = document.getElementById('models').value;
    console.log("Setting default model to", model);
    account.default_model = model;
    account.saveToStorage();
    updateStatus("Default model saved.")
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('reset').addEventListener('click', resetOptions);
document.getElementById('save-model').addEventListener('click', updateDefaultModel);