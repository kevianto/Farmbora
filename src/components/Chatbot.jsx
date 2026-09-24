import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, User, Activity, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your FarmBora AI assistant. I'm connected to your farm's live telemetry. How can I help you optimize your yields today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const mockResponses = [
    "Based on current telemetry, I recommend increasing irrigation frequency by 15% for optimal vegetative growth.",
    "Weather patterns suggest a 70% chance of rain in 48 hours. You might want to delay your scheduled fertilizing.",
    "Your Soil pH is holding steady at 6.5. This is perfect for your current Maize crop.",
    "I've detected a slight increase in ambient humidity. Monitor for early signs of fungal growth in the lower leaves.",
    "Market data shows a KES 200 price increase for Maize in your region. It might be an optimal time to list your harvest.",
    "Applying nitrogen-based fertilizer now would maximize the current growth spurt detected by our sensors.",
    "I've analyzed your water usage; switching to evening irrigation could reduce evaporation loss by 20%."
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.post(endpoints.ai.chat, { message: input });
      const botMessage = {
        id: messages.length + 2,
        text: res.data.response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "I'm having trouble connecting to your farm's brain right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-2xl flex flex-col z-[100] border border-surface-200 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-surface-900 text-white p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600 opacity-20 blur-3xl -z-0"></div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-600 p-2.5 rounded-2xl">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black tracking-tight text-lg leading-none">FarmBora AI</h3>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Systems Online</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-50/30"
            >
              {messages.map((message) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                    <div
                      className={`rounded-3xl p-4 shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-primary-600 text-white rounded-tr-none'
                          : 'bg-white text-surface-900 border border-surface-200 rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm font-medium leading-relaxed">{message.text}</p>
                    </div>
                    <div className="flex items-center space-x-1 mt-2 px-1">
                      {message.sender === 'bot' ? <Sparkles className="h-3 w-3 text-primary-600" /> : <User className="h-3 w-3 text-surface-400" />}
                      <span className="text-[10px] font-black text-surface-400 uppercase tracking-tighter">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-surface-200 rounded-3xl rounded-tl-none p-4 shadow-sm">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-6 bg-white border-t border-surface-100">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your farm..."
                  className="flex-1 bg-surface-50 border border-surface-200 rounded-2xl px-5 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-bold text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="absolute right-2 bg-primary-600 text-white p-2.5 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 disabled:bg-surface-200 disabled:shadow-none"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-center space-x-4">
                 <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest flex items-center">
                    <Activity className="h-3 w-3 mr-1" />
                    AI Engine v2.4
                 </p>
                 <span className="h-1 w-1 bg-surface-200 rounded-full"></span>
                 <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest flex items-center">
                    <CornerDownLeft className="h-3 w-3 mr-1" />
                    Enter to send
                 </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 p-5 rounded-[2rem] shadow-2xl flex items-center space-x-3 z-[100] transition-all duration-500 ${
          isOpen ? 'bg-surface-900 text-white' : 'bg-primary-600 text-white'
        }`}
      >
        <div className="relative">
           {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
           {!isOpen && (
             <span className="absolute -top-1 -right-1 flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-primary-600"></span>
             </span>
           )}
        </div>
        {!isOpen && <span className="font-black tracking-tight">AI Assistant</span>}
      </motion.button>
    </>
  );
}
