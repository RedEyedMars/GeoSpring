package com.redeyedmars.app.service;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import com.redeyedmars.app.service.messages.LoginMessage;


@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

   // private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);
	
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
        	.addEndpoint("/ws")
        	.setHandshakeHandler(new CustomHandshakeHandler())
        	.withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic", "/queue");   // Enables a simple in-memory broker
    }

    class StompPrincipal implements Principal {
        String name;

        StompPrincipal(String name) {
            this.name = name;
        }

        @Override
		public String getName() {
            return name;
        }
    }
    class CustomHandshakeHandler extends DefaultHandshakeHandler {
        // Custom class for storing principal
        @Override
        protected Principal determineUser(ServerHttpRequest request,
                                          WebSocketHandler wsHandler,
                                          Map<String, Object> attributes) {
            // Generate principal with UUID as name
            return new StompPrincipal(UUID.randomUUID().toString());
        }
    }
}