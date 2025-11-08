
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getChatResponse } from '../services/geminiService';
import Spinner from './Spinner';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'أهلاً بك! أنا هنا لأجيب على أسئلتك حول قصة كوكو أو أي شيء آخر. كيف يمكنني مساعدتك؟' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useThinkingMode, setUseThinkingMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const botResponse = await getChatResponse(
        messages, // send previous context
        userInput, 
        useThinkingMode
      );
      setMessages([...newMessages, { sender: 'bot', text: botResponse }]);
    } catch (error) {
      setMessages([...newMessages, { sender: 'bot', text: 'عذراً، حدث خطأ ما. حاول مرة أخرى.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-12 md:mt-16 bg-white rounded-lg shadow-xl p-4 md:p-6 max-w-4xl mx-auto">
      <h3 className="text-xl md:text-2xl font-bold text-teal-800 mb-4 text-center">🤖 دردش مع الراوي</h3>
      <div className="h-80 bg-amber-50 rounded-lg p-4 overflow-y-auto mb-4 border border-amber-200">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <p className="text-sm md:text-base whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-3">
             <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl bg-gray-200 text-gray-800 flex items-center">
                <Spinner className="w-5 h-5 ml-2" />
                <span>...يفكر</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="اسأل عن القصة أو أي شيء آخر..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !userInput.trim()} className="bg-teal-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-800 disabled:bg-gray-400 flex items-center justify-center">
            {isLoading ? <Spinner className="w-6 h-6" /> : 'إرسال'}
        </button>
      </form>
      <div className="flex items-center justify-center mt-4">
        <label htmlFor="thinking-mode" className="ml-3 text-sm font-medium text-gray-900">
          🧠 وضع التفكير المعمق (للأسئلة المعقدة)
        </label>
        <input 
            id="thinking-mode" 
            type="checkbox" 
            checked={useThinkingMode}
            onChange={(e) => setUseThinkingMode(e.target.checked)}
            className="w-5 h-5 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
        />
      </div>
    </div>
  );
};

export default Chatbot;
