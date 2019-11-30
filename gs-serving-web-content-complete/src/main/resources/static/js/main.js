'use strict';

var errorPage = document.querySelector('#error-page');
var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var loginForm = document.querySelector('#loginForm');
var loginForm = document.querySelector('#loginForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');
var errorElement = document.querySelector('.error');
var credentialElement = document.querySelector('.cred-error');

var stompClient = null;
var username = null;
var sessionId = null;

var colors = [
	'#2196F3', '#32c787', '#00BCD4', '#ff5652',
	'#ffc107', '#ff85af', '#FF9800', '#39bbb0'
	];


function login() {
    username = document.querySelector('#name').value.trim();
    var pwd = document.querySelector('#pwd').value.trim();

    if(username&&pwd) {
        
        // Tell your username to the server
        stompClient.send("/app/chat.login",
            {},
            JSON.stringify({sender: username, key:encrypt_(pwd+username), type: 'JOIN'})
        )

        connectingElement.classList.remove('hidden');
    }
    event.preventDefault();
}
function encrypt_(upwd){
  return forge_sha256(upwd);
};

function onConnected() {
    //stompClient.subscribe('/user/topic/public', onMessageReceived);
    
    
    stompClient.subscribe('/user/queue/login', onLoginReceived);

}


function onError(error) {
	if(!error){
		connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
	} else {
		connectingElement.textContent = error;
	}
    connectingElement.style.color = 'red';
    connectingElement.classList.remove('hidden');
}
function onLoginError(error) {
	if(!error){
		credentialElement.textContent = 'Could not login properly!';
	} else {
		credentialElement.textContent = error;
	}
	credentialElement.style.color = 'red';
	credentialElement.classList.remove('hidden');
	
	console.log("Cred error:"+error);
}


function sendMessage(event) {
    var messageContent = messageInput.value.trim();

    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };

        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}

function onLoginReceived(payload){
	connectingElement.classList.add('hidden');
    var message = JSON.parse(payload.body);
	if(message.type === 'FAIL') {
		if(message.error === 'Creds'){
			onLoginError("Username is already taken, and the password is wrong for that user, please try again!");
		}
    	
    } else if(message.type === 'SUCCESS' ){
        usernamePage.classList.add('hidden');
    	
        chatPage.classList.remove('hidden');

        // Subscribe to the Public Topic
        stompClient.subscribe('/topic/public', onMessageReceived);
        
        var chatMessage = {
                sender: username,
                content: messageInput.value,
                type: 'JOIN'
            };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
    }
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
    	
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }

    var index = Math.abs(hash % colors.length);
    return colors[index];
}

loginForm.addEventListener('submit', login, true)
messageForm.addEventListener('submit', sendMessage, true)


window.onload = function(){
	if(!stompClient){
		var socket = new SockJS('/ws');
		stompClient = Stomp.over(socket);

		stompClient.connect({}, onConnected, onError);
	}
};