/**
 * Author: Guochao Xie @XieGuochao
 * Date: 19-05-2023
 * Description: A demo to trigger selection action
 */

// Add a hidden div to the page
const history_div = document.createElement("div");
history_div.id = "chatgpt-history";

const show_button = document.createElement("button");
show_button.innerHTML = "Translate";
show_button.style.position = "fixed";
show_button.style.backgroundColor = "blue";
show_button.style.color = "white";
show_button.style.display = "none";
show_button.style.padding = "8px";
show_button.style.borderRadius = "5px";
show_button.style.fontSize = "16px";
document.body.appendChild(show_button);

let is_asking = false;
function eventHandler(event) {
    const text = window.getSelection().toString();
    if (text.length == 0) {
        show_button.innerHTML = "Translate";
        show_button.style.display = "none";
        history_div.style.display = "none";
        is_asking = false;
        return;
    }
    // console.log("Selected text:", text);
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

        show_button.style.display = "block";
        show_button.style.left = `${x}px`;
        show_button.style.top = `${y}px`;
        is_asking = true;
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
    show_button.innerHTML = "Translating with ChatGPT...";
    const [_, errorcode, error_message] = await chat.ask(text, "user", {}, update_history_ui, update_status_error);
    is_asking = false;
    if (errorcode != 0) {
        show_button.innerHTML = "Error. Please try again.";
        setTimeout(() => {
            show_button.innerHTML = "Translate";
        }, 2000);
        return;
    }
    show_button.innerHTML = "Click blank space to close";
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