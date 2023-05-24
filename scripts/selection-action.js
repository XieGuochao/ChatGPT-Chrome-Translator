/**
 * Author: Guochao Xie @XieGuochao
 * Date: 19-05-2023
 * Description: A demo to trigger selection action
 */

// Add a hidden div to the page
const historyDiv = document.createElement("div");
historyDiv.id = "chatgpt-history";

const showButton = document.createElement("button");
showButton.innerHTML = "Ask ChatGPT";
showButton.style.position = "fixed";
showButton.style.backgroundColor = "blue";
showButton.style.color = "white";
showButton.style.display = "none";
showButton.style.margin = "20px";
document.body.appendChild(showButton);

let isAsking = false;
document.addEventListener("mouseup", function(event) {
    const text = window.getSelection().toString();
    if (text.length == 0) {
        showButton.innerHTML = "Ask ChatGPT";
        showButton.style.display = "none";
        historyDiv.style.display = "none";
        return;
    }
    if (isAsking) {
        return;
    }
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

    showButton.style.display = "block";
    showButton.style.left = `${x}px`;
    showButton.style.top = `${y}px`;
    isAsking = true;
});


historyDiv.style.display = "none";
historyDiv.style.position = "fixed";
historyDiv.style.width = "500px";
historyDiv.style.backgroundColor = "white";
historyDiv.style.margin = "20px";
historyDiv.style.padding = "20px";
historyDiv.style.border = "1px solid black";
historyDiv.style.borderRadius = "10px";

document.body.appendChild(historyDiv);

async function askChatGPT(text) {
    const account = await loadGPTAccountFromStorage();
    const chat = new GPTChat(account);
    showButton.innerHTML = "Asking ChatGPT...";
    await chat.ask(text, {}, updateHistoryUI);
    showButton.innerHTML = "Click blank space to close";
    console.log("Chat History:", chat.getHistory());
    updateHistoryUI(chat);
} 

showButton.onclick = async function() {
    const text = window.getSelection().toString();
    if (text.length == 0) {
        return;
    }
    askChatGPT(text);
}

async function updateHistoryUI(chat) {
    historyDiv.innerHTML = "";
    historyDiv.style.left = showButton.style.left;
    historyDiv.style.top = `${parseInt(showButton.style.top) + 30}px`;
    for (const item of chat.getHistory()) {
        const p = document.createElement("p");
        p.innerHTML = `${item["role"]}: ${item["content"]}`
        historyDiv.appendChild(p);
    }
    historyDiv.style.display = "block";
    isAsking = false;
}

console.log("selection-action.js loaded.");