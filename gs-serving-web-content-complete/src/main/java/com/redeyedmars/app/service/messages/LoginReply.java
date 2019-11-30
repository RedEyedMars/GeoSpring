package com.redeyedmars.app.service.messages;

import com.redeyedmars.app.service.messages.LoginMessage.MessageType;

public class LoginReply {
    private MessageType type;
    private FailureType error;

    public enum MessageType {
        SUCCESS,
        FAIL,
    }
    public enum FailureType {
        CREDS,
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }
    
    public FailureType getError() {
        return error;
    }

    public void setError(FailureType error) {
        this.error = error;
    }
}