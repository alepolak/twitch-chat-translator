const channelUrl = 'http://localhost:3001/channel/';
const languagesUrl = 'http://localhost:3001/language?';
const usernameUrl = 'http://localhost:3001/me/';
const chatUrl = 'http://localhost:3001/chat';

const setUp = async () => {
    settingsToggle();
    const channel = document.getElementById('channel').value;
    const username = document.getElementById('username').value;
    const foreignLang = document.getElementById('foreignLang').value;
    const nativeLang = document.getElementById('nativeLang').value;

    await changeChannelName(channel);
    await changeLanguages(nativeLang, foreignLang);
    await changeMyUsername(username);

    update();
}

const chat = async () => {  
    const message = document.getElementById('message').value;
    await sendTranslatedMessage(message);
    resetMessageInput();
    addMessagesToChat(getMessageElement("You", message));
}

const resetMessageInput = () => {
    document.getElementById('message').value = "";
}

const update = () => {
    setInterval(() => {
        getChat(updateChat);
    }, 3000);
}

const refresh = () => {
    getChat(updateChat);
}

const getChat = (callback) => {
    fetch(chatUrl, {
        method: "GET"
    }).then(res => {
        callback(res);
    });
}

const updateChat = async (res) => {
    const messages = await res.json();

    if(!isEmpty(messages)) {
        const messagesComponents = messages.map(o => { return getMessageElement(o.username, o.message) });
        addMessagesToChat(messagesComponents);
    }
}

const addMessagesToChat = (messages) => {
    const chat = document.getElementsByClassName('messages')[0];
    chat.innerHTML += messages;
    chat.scrollTop = chat.scrollHeight;
}

const getMessageElement = (username, message) => {
    return `<div class="chat_message_element"> <span class="chat_user">${username}</span><span class="chat_message">: ${message}</span></div>`;
}

const sendTranslatedMessage = async (message) => {
    fetch(chatUrl+'?'+ new URLSearchParams({
        message: message
    }),{
        method: "POST"
    }).then(res => {
        callback();
    }).catch(error => {
        console.log(error);
    });
}

const changeChannelName = async (channelName, callback) => {
    fetch(channelUrl+channelName, {
        method: "POST"
      }).then(res => {
          if(callback)
            callback();
    });
}

const changeLanguages = async (nativeLang, foreignLang, callback) => {

    fetch(languagesUrl + new URLSearchParams({
        nativeLanguage: nativeLang,
        foreignLanguage: foreignLang
    }), 
    {
        method: "POST"
    }).then(res => {
        if(callback)
            callback();
    });
}

const changeMyUsername = async (username, callback) => {
    fetch(usernameUrl+username, {
        method: "POST"
      }).then(res => {
        if(callback)
            callback();
    });
}

function isEmpty(obj) {  
    for (let key in obj) {  
        if (obj.hasOwnProperty(key)) {  
            return false;  
        }  
    }   
    return true;  
} 

