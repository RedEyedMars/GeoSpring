package com.redeyedmars.app.service.messages;

import com.redeyedmars.app.service.messages.LoginReply.MessageType;

public class LoginMessage {

    private MessageType type;
    private String key;
    private String sender;

    public enum MessageType {
        JOIN,
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }
    
    public String getKey() {
    	return this.key;
    }
    public void setKey(String key) {
    	this.key = key;
    }

}