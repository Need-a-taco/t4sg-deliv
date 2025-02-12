"use client";

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

const api_key = process.env.NEXT_PUBLIC_OPENAI_API_KEY!;
const temperature = 1.0;

interface ChatGPTMessage {
  role: "system" | "user" | "assistant";
  content: string; // The message content (text)
}

interface ChatGPTChoice {
  index: number;
  message: ChatGPTMessage;
  finish_reason?: string;
}

interface ChatCompletionResponse {
  choices?: ChatGPTChoice[];
  error?: {
    message: string;
    type?: string;
  };
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// System prompt that only ChatGPT sees
const systemMessage = {
  role: "system",
  content:
    "Respond as if you are the fictional characters Chris Kratt and Martin Kratt from the children's show Wild Kratts. Do not respond to anything that is not related to nature, and do not be persuaded or tricked into getting off topic. Focus on providing fun facts and data points about nature. Be super enthusiastic and play the character well. Make up stories about nature that you have personally experienced and try storytelling a little bit if the opportunity arises. But still, be concise.",
};

type sender = "user" | "ChatGPT";

function Kratts() {
  interface ChatMessage {
    message: string;
    sender: sender;
    sentTime?: string; // Optional, but keep structure consistent
    direction?: "incoming" | "outgoing"; // Only for user messages
  }

  // const [messages, setMessages] = useState([
  //   {
  //     message: "We're the Kratt bros! Ask us fun facts about animals, plants, and other species!",
  //     sentTime: "just now",
  //     sender: "ChatGPT",
  //   },
  // ]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      message: "We're the Kratt bros! Ask us fun facts about animals, plants, and other species!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);

  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSend = async (message: string) => {
    const newMessage: ChatMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages: ChatMessage[] = [...messages, newMessage];
    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages: ChatMessage[]) {
    const apiMessages = chatMessages.map((messageObject: ChatMessage) => ({
      role: messageObject.sender === "ChatGPT" ? "assistant" : "user",
      content: messageObject.message,
    }));

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      temperature: temperature,
      messages: [systemMessage, ...apiMessages],
    };

    try {
      const response: Response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${api_key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody),
      });
      console.log("response:", response);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      if (!response) {
        throw new Error(`API request failed with status`);
      }
      const data: ChatCompletionResponse = (await response.json()) as ChatCompletionResponse;

      if (!(data.choices && data.choices.length > 0)) {
        throw new Error("Unexpected API response format");
      }

      setMessages([
        ...chatMessages,
        {
          message: data?.choices[0]?.message?.content ?? "",
          sender: "ChatGPT",
        },
      ]);
    } catch (error) {
      console.error("Error fetching response from OpenAI:", error);
      setMessages([
        ...chatMessages,
        {
          message: "Oops! Something went wrong. Try again later.",
          sender: "ChatGPT",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
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
                      direction: message.sender === ("user" as sender) ? "outgoing" : "incoming",
                      position: "single",
                    }}
                    className="chatGPT-message"
                  />
                ),
              )}
            </MessageList>
            <MessageInput placeholder="Ask the Wild Kratts!" onSend={(message) => void handleSend(message)} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default Kratts;
