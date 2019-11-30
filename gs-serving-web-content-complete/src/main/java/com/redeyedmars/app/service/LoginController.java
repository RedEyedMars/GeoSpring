package com.redeyedmars.app.service;

import com.redeyedmars.app.service.messages.ChatMessage;
import com.redeyedmars.app.service.messages.LoginReply;
import com.redeyedmars.app.service.messages.LoginMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class LoginController {


    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);
    @Autowired
    private SimpMessagingTemplate template;
    

    @MessageMapping("/chat.login")
    public void addUser(@Payload LoginMessage loginMessage, 
                               SimpMessageHeaderAccessor headerAccessor) {
    	logger.info("Received a new chat user:"+headerAccessor.getUser().getName());
        // Add username in web socket session
    	
        headerAccessor.getSessionAttributes().put("username", loginMessage.getSender());
        
        if(true) {
        	LoginReply reply = new LoginReply();
        	reply.setType(LoginReply.MessageType.FAIL);
        	reply.setError(LoginReply.FailureType.CREDS);
        	template.convertAndSendToUser(headerAccessor.getUser().getName(),"/queue/login", reply);
        }
    }
}