/**
 * Author: Guochao Xie @XieGuochao
 * Date: 19-05-2023
 * Description: A demo to trigger selection action
 */

// Add a hidden div to the page
const history_div = document.createElement("div");
history_div.id = "chatgpt-history";

const show_button = document.createElement("button");
function reset_show_button(show_button) {
    show_button.innerHTML = "Translate";
    show_button.style.position = "fixed";
    show_button.style.backgroundColor = "#0d6efd";
    show_button.style.border = "none";
    show_button.style.color = "white";
    show_button.style.display = "none";
    show_button.style.padding = "8px";
    show_button.style.borderRadius = "5px";
    show_button.style.fontSize = "16px";
    show_button.disabled = false;
}

function show_show_button(show_button) {
    show_button.style.display = "block";
}

function asking_show_button(show_button) {
    show_button.innerHTML = "Asking ChatGPT ...";
    show_button.style.backgroundColor = "#28a745";
    show_button.disabled = true;
}

function error_show_button(show_button) {
    show_button.innerHTML = "Error. Please try again.";
    show_button.style.backgroundColor = "#dc3545";
    show_button.disabled = false;
}

function close_show_button(show_button) {
    show_button.innerHTML = "Click blank space to close";
    show_button.style.backgroundColor = "#6c757d";
}

reset_show_button(show_button);

document.body.appendChild(show_button);

let is_asking = false;
function eventHandler(event) {
    const text = window.getSelection().toString();
    if (text.length == 0) {
        reset_show_button(show_button);
        history_div.style.display = "none";
        is_asking = false;
        return;
    }
    if (is_asking) {
        return;
    }

    if (event.clientX !== undefined && event.clientY !== undefined) {
        const mousePosition = {
            x: event.clientX,
            y: event.clientY
        };
        let x = mousePosition.x + 10;
        let y = mousePosition.y + 20;
        if (x + 500 > window.innerWidth) {
            x = window.innerWidth - 500;
        }
        if (y + 500 > window.innerHeight) {
            y = window.innerHeight - 500;
        }

        show_button.style.left = `${x}px`;
        show_button.style.top = `${y}px`;
        is_asking = true;
        reset_show_button(show_button);
        show_show_button(show_button);
    }
}

document.addEventListener("mouseup", eventHandler);
document.addEventListener("keyup", eventHandler);
document.addEventListener("selectionchange", eventHandler);


history_div.style.display = "none";
history_div.style.position = "fixed";
history_div.style.width = "500px";
history_div.style.backgroundColor = "white";
history_div.style.padding = "8px";
history_div.style.marginTop = "16px";
history_div.style.border = "1px solid black";
history_div.style.borderRadius = "5px";
history_div.style.fontSize = "16px";

document.body.appendChild(history_div);

async function askChatGPT(text) {
    const account = new OAccount();
    await account.load()
    const chat = new OChat(account);
    asking_show_button(show_button);

    const [_, errorcode, error_message] = await chat.ask(text, "user", {}, update_history_ui, update_status_error);
    is_asking = false;
    if (errorcode != 0) {
        error_show_button(show_button);

        setTimeout(() => {
            reset_show_button(show_button);
        }, 2000);
        return;
    }
    close_show_button(show_button);

    console.log("Chat History:", chat.history);
    update_history_ui(chat);
} 

show_button.onclick = async function() {
    const text = window.getSelection().toString();
    if (text.length == 0) {
        return;
    }
    const language = await new Language().load();
    const queryText = `
Translate the following text.
Target language: ${language.language}
Text: ${text}

Translation:`
    askChatGPT(queryText);
}

async function update_history_ui(chat) {
    history_div.innerHTML = "";
    history_div.style.left = show_button.style.left;
    history_div.style.top = `${parseInt(show_button.style.top) + 30}px`;
    for (const item of chat.history.history) {
        if (item["role"] == "user") {
            continue;
        }
        const p = document.createElement("p");
        p.innerHTML = `${item["content"]} <br>`
        history_div.appendChild(p);
    }
    history_div.style.display = "block";
}

console.log("selection-action.js loaded.");