import { Environment, OrbitControls, Html } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, MessageCircle, X } from "lucide-react";
import { useMediaQuery } from 'react-responsive';

export const Experience = () => {
  const [chatStarted, setChatStarted] = useState(false);
  const [triggerGreeting, setTriggerGreeting] = useState(false);
  const [triggerTalking, setTriggerTalking] = useState(false);
  const [triggerSalute, setTriggerSalute] = useState(false);
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [inputMode, setInputMode] = useState("text"); // "text" or "voice"
  const [textInput, setTextInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTyping, setIsTyping]= useState(false);
  const [welcomeCompleted, setWelcomeCompleted] = useState(false);
  const recognitionRef = useRef(null);
  const speechTimeoutRef = useRef(null);
  const chatContainerRef = useRef(null);
  const currentAudioRef = useRef(null);
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Adjust breakpoint as needed

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    
    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setListening(false);
      await handleUserInput(transcript);
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
      setListening(false);
    };

    recognition.onend = () => {
      // Stop recognition completely; will restart manually
     setListening(false);
    };

    return recognition;
  };

  const handleUserInput = async (input) => {
  if (!input.trim()) return;

  // Add user message
  setMessages((prev) => [...prev, { type: "user", text: input }]);

  // Placeholder for AI
  const waitMessage = { type: "ai", text: "Thinking..." };
  setMessages((prev) => [...prev, waitMessage]);

  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: input }),
    });

    const data = await response.json();
    const replyText = data.text || "Sorry, I couldn't get a response.";

    // Replace placeholder with actual reply
    setMessages((prev) => [
      ...prev.filter((msg) => msg !== waitMessage),
      { type: "ai", text: replyText },
    ]);

    // Stop previous audio if any
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      URL.revokeObjectURL(currentAudioRef.current.src);
      currentAudioRef.current = null;
    }

    // Play TTS if available
    if (data.audioBase64) {
      setTriggerTalking(true);
      setIsPlaying(true);

      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0))],
        { type: "audio/wav" }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.play();
      audio.onended = () => {
        setTriggerTalking(false);
        setIsPlaying(false);

        // Restart voice recognition if in voice mode
        if (inputMode === "voice" && !listening) {
          if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
          speechTimeoutRef.current = setTimeout(() => {
            startVoiceRecognition();
          }, 500);
        }
      };
    } else {
      setTriggerTalking(false);
      setIsPlaying(false);
    }
  } catch (err) {
    console.error("Backend error:", err);
    setMessages((prev) => [
      ...prev.filter((msg) => msg !== waitMessage),
      { type: "ai", text: "Sorry, I encountered an error. Please try again." },
    ]);
    setTriggerTalking(false);
    setIsPlaying(false);
  }
};


  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleUserInput(textInput);
      setTextInput("");
    }
  };

  const startVoiceRecognition = () => {
    if (!recognitionRef.current) recognitionRef.current = initRecognition();
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
    }
  };

  const playWelcomeMessage = () => {
    // You can replace this with your actual welcome audio file
    const welcomeText = "Hello! I'm Neeraj's AI avatar. I can tell you about his experience, projects, and skills. You can either type your questions or use voice input. How can I help you today?";
    
    setMessages([{ type: 'ai', text: welcomeText }]);
    
    setTriggerGreeting(true);
    setTimeout(() => {
    setTriggerGreeting(false);
    setTriggerSalute(true);
  }, 6000);
    //setTriggerSalute(true);
    setIsPlaying(true);

  const audio = new Audio("/audio/Welcome.wav"); // your .wav file
  currentAudioRef.current = audio;
  audio.play();

  // When audio finishes, stop talking & salute animations
  audio.onended = () => {
    setTriggerTalking(false);
    setTriggerSalute(false);
    setTriggerGreeting(false);
    setIsPlaying(false);
    setWelcomeCompleted(true);
  };
};

  const handleChatClick = () => {
    setChatStarted(true);
    playWelcomeMessage();  
  };

  const handleBackClick = () => {
    setChatStarted(false);
    setWelcomeCompleted(false);
    setMessages([]);
    setInputMode("text");
    setTextInput("");
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setTriggerTalking(false);
    setIsPlaying(false);
  };

    return (
    <>
      {/* Disable OrbitControls when chat is started */}
      {!chatStarted && <OrbitControls enableZoom={false} enablePan={false} />}
      
      {/* Fixed Avatar position */}
      <Avatar 
        position={[1, -3, 5]} 
        scale={2} 
        triggerGreeting={triggerGreeting}
        triggerTalking={triggerTalking}
        triggerSalute={triggerSalute}
        isTyping={isTyping}
/>
      
      <Environment preset="sunset" />
      
      {/* Chat Interface - Fixed positioning */}
      <Html
        position={[-5, 0, 0]}
        transform={false}
        occlude={false}
        style={{
          position: 'fixed',
          top: '50%',
          left: '20px',
          transform: 'translateY(-50%)',
          zIndex: 1000,
          pointerEvents: 'auto'
        }}
      >
        <AnimatePresence>
          {!chatStarted ? (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="glass-morphism p-6 text-center w-80 ">
                <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">Chat with Neeraj's AI</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Ask me about Neeraj's experience, projects, and skills!
                </p>
                <button
                  onClick={handleChatClick}
                  className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Let's Talk
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-morphism w-96 h-96 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">Neeraj's AI Avatar</span>
                </div>
                <button
                  onClick={handleBackClick}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3"
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.type === "user"
                          ? "bg-primary text-white"
                          : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area - Only show after welcome */}
              {welcomeCompleted && (
                <div className="p-4 border-t border-gray-700">
                  {/* Mode Toggle */}
                  <div className="flex space-x-2 mb-3">
                    <button
                      onClick={() => {
                        setInputMode("text");
                        if (recognitionRef.current) recognitionRef.current.stop();
                        setListening(false);
                      }}
                      className={`flex-1 py-2 px-3 rounded text-sm transition-colors ${
                        inputMode === "text"
                          ? "bg-primary text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      Text
                    </button>
                    <button
                      onClick={() => setInputMode("voice")}
                      className={`flex-1 py-2 px-3 rounded text-sm transition-colors ${
                        inputMode === "voice"
                          ? "bg-primary text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      Voice
                    </button>
                  </div>

                  {/* Input Controls */}
                  {inputMode === "text" ? (
                    <form onSubmit={handleTextSubmit} className="flex space-x-2">
                      <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)
                        }
                        placeholder="Type your message..."
                        className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-primary focus:outline-none text-sm"
                        disabled={isPlaying}
                      />
                      <button
                        type="submit"
                        disabled={!textInput.trim() || isPlaying}
                        className="bg-primary hover:bg-primary/80 disabled:bg-gray-600 text-white p-2 rounded transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-center">
                      <button
                        onClick={startVoiceRecognition}
                        disabled={listening || isPlaying}
                        className={`p-3 rounded-full transition-colors ${
                          listening
                            ? "bg-red-500 animate-pulse"
                            : "bg-primary hover:bg-primary/80"
                        } disabled:bg-gray-600 text-white`}
                      >
                        {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                      <span className="ml-3 text-sm text-gray-300">
                        {listening ? "Listening..." : isPlaying ? "Playing response..." : "Click to speak"}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Html>
    </>
  );
};
