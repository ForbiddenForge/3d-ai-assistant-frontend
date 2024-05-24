import { createContext, useContext, useEffect, useRef, useState } from "react";
import { CONFIG } from "../config/config.js";

import { useLanguage } from "../context/LanguageContext.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const chatHistoryKey = "chatHistory";
const maxTokens = 5000; // Adjust based on the models' token limit
const averageCharsPerToken = 4;

const calculateTokenCount = (texts) => {
  const totalChars = texts.reduce((acc, text) => acc + text.content?.length, 0);
  return Math.ceil(totalChars / averageCharsPerToken);
};

const trimHistoryToFitTokenLimit = (history) => {
  while (history.length > 0 && calculateTokenCount(history) > maxTokens) {
    history.shift();
  }
};

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem(chatHistoryKey);
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  const ws = useRef(null);
  const { language } = useLanguage();
  // NOTE, even though the UI displays the language as ‘中文’ when you go to try to read the language state,
  // it will output "Chinese". I have no idea why. This is why the object key is Chinese and not 中文
  const promptLanguage = {
    English: 'forbiddenforge_prompt',
    Chinese: 'forbiddenforge_chinese_prompt',
  };
  console.log('LANGUAGE',language)
  console.log(promptLanguage[language]);

  const historyRef = useRef(history);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    ws.current = new WebSocket(`wss://${new URL(backendUrl).host}`);
    ws.current.onopen = () => {
      console.log("WebSocket connection established");
    };
    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };
    ws.current.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      console.log("Received message from WebSocket:", receivedMessage);

      // Update the messages state
      setMessages(receivedMessage);
      setLoading(false);

      // Update the history with the new message and save to local storage
      setHistory((prevHistory) => {
        const updatedHistory = [
          ...prevHistory,
          ...receivedMessage.map((msg) => ({
            role: 'assistant',
            content: JSON.stringify({
              text: msg.text,
              facialExpression: msg.facialExpression,
              animation: msg.animation,
            }),
          })),
        ];
        trimHistoryToFitTokenLimit(updatedHistory);
        localStorage.setItem(chatHistoryKey, JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    };
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendJobId = (jobId) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log("Sending jobId to WebSocket:", jobId);
      ws.current.send(JSON.stringify({ jobId }));
    } else {
      console.log("WebSocket is not open. Ready state is:", ws.current.readyState);
      setTimeout(() => sendJobId(jobId), 1000);
    }
  };

  const chat = async (userChat) => {
    setLoading(true);
    const historyToSend = historyRef.current.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
    trimHistoryToFitTokenLimit(historyToSend);
    // include user's most recent chat in the history
    const updatedHistory = [
      ...historyRef.current,
      {
        role: 'user',
        content: userChat,
      },
    ];
    localStorage.setItem(chatHistoryKey, JSON.stringify(updatedHistory));
    trimHistoryToFitTokenLimit(updatedHistory);
    setHistory(updatedHistory);

    const response = await fetch(`${backendUrl}/api/v1/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userChat,
        history: historyToSend,
        voice: CONFIG.voice,
        voice_gender: CONFIG.voice_gender,
        prompt: promptLanguage[language], //language provider gets language state from UI dropdown, then use to map to the proper prompt variable name for the backend based on the promptLanguage object.
        isAppleDevice: CONFIG.isAppleDevice,
      }),
      credentials: "include",
    });

    if (response.ok) {
      const { jobId, message } = await response.json();
      console.log("THIS IS THE JOB ID INSIDE CHAT", jobId);
      sendJobId(jobId);
      setMessages([{ role: 'system', content: message }]); // Initial message setting
    } else {
      console.error("Failed to send message");
      setLoading(false);
    }
  };

  const onMessagePlayed = () => {
    setMessages((currentMessages) => currentMessages.slice(1));
  };

  const clearHistory = () => {
    localStorage.removeItem(chatHistoryKey);
    setHistory([]);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
    console.log("Updated message:", messages[0]);
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        messages,
        history,
        clearHistory,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
