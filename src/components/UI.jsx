import { useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { useLanguage } from "../context/LanguageContext.jsx";

export const UI = ({ hidden, messagePlaying, setMessagePlaying, audioRef, ...props }) => {
  const input = useRef();
  const chatEndRef = useRef(null);
  const { chat, loading, cameraZoomed, setCameraZoomed, message, messages, history, onMessagePlayed, clearHistory } = useChat();
  const [thinking, setThinking] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isCollapsed]);

  if (hidden) {
    return null;
  }

  const handleSendMessage = () => {
    if (messagePlaying) {
      handleSkipMessage();
    }
    const text = input.current.value;
    if (!loading && text) {  // Ensure there's text to send
      chat(text);
      input.current.value = "";
      setThinking(true);
    }
  };

  const handlePlayMessage = () => {
    if (message && (message.audio || message.mp3) && !messagePlaying) {  // Check if message is not already playing
      setMessagePlaying(true);
    }
  };

  const handleSkipMessage = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setMessagePlaying(false);
    onMessagePlayed();
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleClearHistory = () => {
    clearHistory();
    setShowConfirmation(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "confirmation-dialog") {
      setShowConfirmation(false);
    }
  };

  return (
    <>
      {showConfirmation && (
        <div
          id="confirmation-dialog"
          className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-4 rounded-lg shadow-lg pointer-events-auto">
            <p>
              {language === 'English' ? 'Are you sure you want to clear your history?' : ''}
              {language === 'Chinese' ? '您确定要清除历史记录吗？' : ''}
              </p>
            <div className="flex justify-center gap-5 mt-4">
              <button
                onClick={handleClearHistory}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-md"
              >
                {language === 'English' ? 'Yes' : ''}
                {language === 'Chinese' ? '是' : ''}
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-5 rounded-md"
              >
                {language === 'English' ? 'No' : ''}
                {language === 'Chinese' ? '否' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-2 flex-col pointer-events-none">
        <div className="flex flex-row justify-between items-center mt-0">
          <div className="flex flex-col items-center backdrop-blur-md bg-white bg-opacity-50 rounded-lg gap-1 max-w-1/2 pointer-events-auto">
            <a href="https://github.com/ForbiddenForge/" target="_blank" className="pointer-events-auto z-20">
              <div className="backdrop-blur-md bg-emerald-100 bg-opacity-50 py-1 px-1 rounded-lg flex flex-col justify-center items-center">
                <h2 className="flex flex-row gap-1 text-xs font-extrabold bg-clip-text text-transparent bg-[linear-gradient(to_right,theme(colors.purple.400),theme(colors.purple.100),theme(colors.pink.500),theme(colors.purple.400),theme(colors.pink.300),theme(colors.purple.500),theme(colors.purple.400))] bg-[length:200%_auto] animate-gradient">    
                <em className="text-black text-xs"> Project by: </em>ForbiddenForge 
                </h2>
              </div>
            </a>
            <p className={`max-w-full font-extrabold ${loading ? 'animate-bounce' : '' }`}></p>
          </div>
          <div className="relative z-25 pointer-events-auto">
            <label className="text-white mr-2">
              {language === 'English' ? 'Language' : ''}
              {language === 'Chinese' ? '语言' : ''}:
              </label>
            <select
              className="bg-white text-black rounded p-2"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="Chinese">中文</option>
            </select>
          </div>
        </div>

        <div className="flex items-end gap-2 pointer-events-auto w-full max-w-screen-md mx-auto">
          <div className="flex flex-col w-full">
            <div className="flex flex-row gap-2 justify-end">
              <button
                  onClick={() => setShowConfirmation(true)}
                  className="bg-red-300 hover:bg-red-600 text-white p-2 rounded-md self-end mb-2"
                >
                  {language === 'English' ? 'Clear History' : ''}
                  {language === 'Chinese' ? '清除历史记录' : ''}
              </button>
              <button
                onClick={toggleCollapse}
                className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md self-end mb-2"
              >
                {isCollapsed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                )}
              </button>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col w-full h-36 md:h-64 lg:h-72 xl:h-1/3 overflow-y-auto bg-white bg-opacity-50 p-3 rounded-md backdrop-blur-md">
                {history.map((msg, index) => (
                  <div key={index} className={`p-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <p className={`w-full rounded-lg p-2 sm:p-1 md:p-1 text-xs md:text-sm lg:text-md xl:text-lg break-words ${msg.role === 'user' ? 'bg-blue-200' : 'bg-pink-300'}`}>
                      <strong>{msg.role === 'assistant' ? 'Sasha(DRGN3D Assistant): ' : 'User: '}</strong>{msg.role === 'assistant' ? JSON.parse(msg.content).text : msg.content}
                    </p>
                  </div>
                ))}
                {loading ? (
                      <p>
                        <em>
                          {language === 'English' ? 'Copernicus is typing...' : ''}
                          {language === 'Chinese' ? '哥白尼正在打字……' : ''}
                        </em>
                      </p>
                    ) 
                      : ''}
                <div ref={chatEndRef} />
              </div>
            )}
            <input
              className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md mt-2 select-none"
              placeholder={language === 'English' ? 'Type a message...' : '输入消息...'}
              ref={input}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
          </div>
          <div className="flex flex-col items-center justify-end gap-2 pointer-events-auto">
          <button
              disabled={loading || !message || !messagePlaying}
              onClick={handleSkipMessage}
              className={`bg-pink-500 hover:bg-pink-600 text-white sm:p-2 sm:px-3 p-4 px-5 font-semibold uppercase rounded-md text-xs ${
                loading || !message || !messagePlaying ? "cursor-not-allowed opacity-30" : ""
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z" />
              </svg>
            </button>

            <button
              disabled={loading || !message || messagePlaying}
              onClick={handlePlayMessage}
              className={`bg-pink-500 hover:bg-pink-600 text-white sm:p-2 sm:px-3 p-4 px-5 font-semibold uppercase rounded-md text-xs ${
                loading || !message || messagePlaying ? "cursor-not-allowed opacity-30" : "animate-bounce"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
              </svg>
            </button>

            <button
              disabled={loading}
              onClick={handleSendMessage}
              className={`bg-pink-500 hover:bg-pink-600 text-white sm:p-2 sm:px-3 p-4 px-5 font-semibold uppercase rounded-md ${
                loading ? "cursor-not-allowed opacity-30" : ""
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
