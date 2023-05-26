/**
 * Author: Guochao Xie @XieGuochao
 * Date: 19-05-2023
 * Description: Validate authentication
 */

console.log("authentication.js loaded.");

async function init_authentication() {
    const account = new OAccount();
    await account.load();
    const models = await account.models().list();
    console.log("ChatGPT authentication succeeded.");
    console.log("ChatGPT models:", models);
};

init_authentication();
