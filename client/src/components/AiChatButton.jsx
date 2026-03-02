import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./AiChatButton.css";

const LLM_URL = "http://localhost:8000/generate";

const AiChatButton = () => {
    const { user } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [persona, setPersona] = useState("Friendly");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // ⚠️ Must be AFTER all hooks — early returns between hooks break React's rules
    if (!user) return null;

    const sendMessage = async () => {
        const question = input.trim();
        if (!question || loading) return;

        setMessages((prev) => [...prev, { role: "user", text: question }]);
        setInput("");
        setLoading(true);

        try {
            const { data } = await axios.post(LLM_URL, {
                question,
                persona,
            });

            setMessages((prev) => [
                ...prev,
                { role: "bot", text: data.response || data.error || "No response." },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: "⚠️ Could not reach the AI service." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                id="ai-chat-fab"
                className="ai-fab"
                onClick={() => setOpen((v) => !v)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Open AI Chat"
            >
                <AnimatePresence mode="wait">
                    {open ? (
                        <motion.span
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X size={26} />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="bot"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Sparkles size={26} />
                        </motion.span>
                    )}
                </AnimatePresence>
                {!open && <span className="ai-fab-label">AI</span>}
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="ai-chat-panel"
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    >
                        {/* Header */}
                        <div className="ai-chat-header">
                            <h3>
                                <Bot size={18} /> StudyRox AI
                            </h3>
                            <button
                                className="ai-chat-close"
                                onClick={() => setOpen(false)}
                                aria-label="Close chat"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Persona Selector */}
                        <div className="ai-persona-bar">
                            {["Friendly", "Academic"].map((p) => (
                                <button
                                    key={p}
                                    className={`ai-persona-btn ${persona === p ? "active" : ""}`}
                                    onClick={() => setPersona(p)}
                                >
                                    {p === "Friendly" ? "😊 Friendly" : "🎓 Academic"}
                                </button>
                            ))}
                        </div>

                        {/* Messages */}
                        <div className="ai-chat-messages">
                            {messages.length === 0 && (
                                <div className="ai-empty-state">
                                    <Sparkles size={28} />
                                    <span>Ask me anything about your studies!</span>
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} className={`ai-msg ${msg.role}`}>
                                    {msg.text}
                                </div>
                            ))}
                            {loading && (
                                <div className="ai-msg bot loading">Thinking…</div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="ai-chat-input-area">
                            <input
                                className="ai-chat-input"
                                type="text"
                                placeholder="Ask a question…"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={loading}
                            />
                            <button
                                className="ai-chat-send"
                                onClick={sendMessage}
                                disabled={!input.trim() || loading}
                                aria-label="Send message"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AiChatButton;
