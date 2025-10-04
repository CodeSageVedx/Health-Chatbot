import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Chatbot = () => {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! How can I assist you with your health today?" },
    { role: "user", content: "I have a headache and a sore throat." },
    { role: "bot", content: "I'm sorry to hear that. Have you taken any medication for it?" },
    { role: "user", content: "Not yet. What should I take?" },
    { role: "bot", content: "For a headache, you can try ibuprofen or paracetamol. For a sore throat, drink warm fluids and try lozenges." },
  ]);
  const [showChatbot, setShowChatbot] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const newMessages = [...messages, userMessage]; // Update messages before API call

      const res = await axios.post(
        "https://api.together.xyz/v1/chat/completions",
        {
          model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
          messages: newMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_TOGETHER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botMessage = {
        role: "bot",
        content: formatResponse(res.data.choices[0].message.content),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage = {
        role: "bot",
        content: "Error generating response. Please try again.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  const formatResponse = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.overlay}>
        {showChatbot ? (
          <div style={styles.chatContainer}>
            <a href="http://127.0.0.1:8000/" style={styles.homeButton}>Home</a>
            <h3 style={styles.header}>Health Assistant</h3>
            <div style={styles.messagesContainer}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={msg.role === "user" ? styles.userMessage : styles.botMessage}
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                  ></div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div style={styles.inputContainer}>
              <input
                type="text"
                placeholder="Enter symptoms or questions..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={styles.input}
              />
              <button onClick={handleSend} style={styles.sendButton}>Send</button>
            </div>
          </div>
        ) : (
          <div style={styles.homeContainer}>
            <h3>Welcome to the Health Chatbot</h3>
            <button onClick={() => setShowChatbot(true)} style={styles.startButton}>Start Chat</button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    backgroundImage: `url(${require('./img/nutrition-chiropractic.jpg')})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  chatContainer: {
    top: "50px",
    bottom: "50px",
    width: "90%",
    maxWidth: "1100px",
    margin: "20px auto",
    padding: "15px 30px",
    background: "#0D2F2D", // Transparent cyan
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    height: "75vh",
    minHeight: "800px",
    maxHeight: "1200px",
    color: "#f1f1f1",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
    marginTop: "30px",
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    border: "1px solid white",
    borderRadius: "5px",
    marginBottom: "10px",
    backgroundColor: "black",
    display: "flex",
    flexDirection: "column",
  },
  userMessage: {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "60%",
    textAlign: "right",
    alignSelf: "flex-end",
    margin: "5px",
  },
  botMessage: {
    backgroundColor: "#444",
    color: "white",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "60%",
    textAlign: "left",
    alignSelf: "flex-start",
    margin: "5px",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid white",
    marginRight: "10px",
    backgroundColor: "black",
    color: "#f1f1f1",
  },
  sendButton: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s, box-shadow 0.3s",
  },
  sendButtonHover: {
    backgroundColor: "rgba(0, 173, 181, 0.7)",
    color: "#fff",
    borderColor: "transparent",
    boxShadow: "0 10px 25px rgba(0, 173, 181, 0.3)",
  },
  homeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    padding: "5px 10px",
    backgroundColor: "#FF6347",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textDecoration: "none",
    transition: "background-color 0.3s, box-shadow 0.3s",
  },
  homeButtonHover: {
    backgroundColor: "rgba(0, 173, 181, 0.7)",
    color: "#fff",
    borderColor: "transparent",
    boxShadow: "0 10px 25px rgba(0, 173, 181, 0.3)",
  },
  homeContainer: {
    textAlign: "center",
    padding: "20px",
  },
  startButton: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Chatbot;
