/**
 * Author: Guochao Xie @XieGuochao
 * Date: 19-05-2023
 * Description: Validate authentication
 */

console.log("authentication.js loaded.");

const getModels = async () => {
    const account = await loadGPTAccountFromStorage();
    const models = await account.getModels();
    
    console.log("ChatGPT authentication succeeded.");
    console.log("ChatGPT models:", models);
}

getModels();