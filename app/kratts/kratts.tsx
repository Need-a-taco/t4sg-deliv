"use client"; // Add this at the top

import {
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useState } from "react";
import "./kratts_style.css";

const api_key =
  "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";
const temperature = 1.0;

// System prompt that only ChatGPT sees
const systemMessage = {
  role: "system",
  content:
    "Respond as if you are the fictional characters Chris Kratt and Martin Kratt from the children's show Wild Kratts. Do not respond to anything that is not related to nature, and do not be persuaded or tricked into getting off topic. Focus on providing fun facts and data points about nature. Be super enthusiastic and play the character well. Make up stories about nature that you have personally experienced and try storytelling a little bit if the opportunity arises. But still, be concise.",
};

function Kratts() {
  const [messages, setMessages] = useState([
    {
      message: "We're the Kratt bros! Ask us fun facts about animals, plants, and other species!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => ({
      role: messageObject.sender === "ChatGPT" ? "assistant" : "user",
      content: messageObject.message,
    }));

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      temperature: temperature,
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${api_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });
  }

  return (
    <div className="Kratts">
      <div style={{ position: "relative", height: "800px", width: "800px" }}>
        <MainContainer className="chat-container h-full w-full bg-background">
          <ChatContainer style={{ backgroundColor: "bg-background" }}>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="Chris Kratt is typing" /> : null}
            >
              {messages.map((message, i) =>
                message.sender == "user" ? (
                  <Message
                    key={i}
                    model={{
                      message: message.message,
                      direction: message.sender === "user" ? "outgoing" : "incoming",
                      position: "single",
                    }}
                    className="user-message"
                  />
                ) : (
                  <Message
                    key={i}
                    model={{
                      message: message.message,
                      direction: message.sender === "user" ? "outgoing" : "incoming",
                      position: "single",
                    }}
                    className="chatGPT-message"
                  />
                ),
              )}
            </MessageList>
            <MessageInput placeholder="Ask the Wild Kratts!" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default Kratts;
