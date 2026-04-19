import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Search, ChevronLeft, CheckCheck } from 'lucide-react';
import { Conversation, DirectMessage, UserProfile } from '../types';
import { MOCK_CONVERSATIONS } from '../constants';
import { getDirectMessageResponse } from '../services/gemini';

interface DirectMessagingProps {
  initialChat?: {
    recipientName: string;
    jobTitle: string;
  } | null;
  user: UserProfile;
}

export const DirectMessaging: React.FC<DirectMessagingProps> = ({ initialChat, user }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('/api/conversations');
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Initialize view based on initialChat prop
  useEffect(() => {
    if (initialChat && !isLoading) {
      const existingConv = conversations.find(c => c.recipientName === initialChat.recipientName);
      if (existingConv) {
        setSelectedChatId(existingConv.id);
      } else {
        // Create a new conversation on the server
        const createConversation = async () => {
          const newConv: Conversation = {
            id: `new_${Date.now()}`,
            recipientName: initialChat.recipientName,
            recipientAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${initialChat.recipientName}`,
            lastMessage: '',
            lastMessageTime: new Date(),
            unreadCount: 0,
            relatedJobTitle: initialChat.jobTitle,
            messages: []
          };
          
          try {
            const response = await fetch('/api/conversations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newConv)
            });
            if (response.ok) {
              setConversations(prev => [newConv, ...prev]);
              setSelectedChatId(newConv.id);
            }
          } catch (error) {
            console.error('Failed to create conversation:', error);
          }
        };
        createConversation();
      }
    }
  }, [initialChat, isLoading]);

  // Scroll to bottom when messages change or chat is selected
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChatId, conversations]);

  const activeConversation = conversations.find(c => c.id === selectedChatId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedChatId) return;

    const currentText = inputText;
    setInputText('');

    const newMessage: DirectMessage = {
      id: `msg_${Date.now()}`,
      senderId: user.name,
      text: currentText,
      timestamp: new Date()
    };

    // Optimistic update
    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedChatId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: currentText,
          lastMessageTime: new Date(),
        };
      }
      return conv;
    }));

    try {
      // Save to backend
      await fetch(`/api/messages/${selectedChatId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage })
      });

      // Simulate response
      const activeConv = conversations.find(c => c.id === selectedChatId);
      if (activeConv) {
          setIsTyping(true);
          
          // Short delay before AI starts "thinking"
          setTimeout(async () => {
              const responseText = await getDirectMessageResponse(
                  activeConv.recipientName,
                  activeConv.relatedJobTitle || 'General Inquiry',
                  [...activeConv.messages, newMessage],
                  user.name
              );

              // Simulate typing delay
              setTimeout(async () => {
                  const responseMsg: DirectMessage = {
                      id: `msg_${Date.now()}_reply`,
                      senderId: activeConv.recipientName,
                      text: responseText,
                      timestamp: new Date()
                  };

                  // Save response to backend
                  await fetch(`/api/messages/${selectedChatId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: responseMsg })
                  });

                  setConversations(prev => prev.map(conv => {
                      if (conv.id === selectedChatId) {
                          return {
                              ...conv,
                              messages: [...conv.messages, responseMsg],
                              lastMessage: responseText,
                              lastMessageTime: new Date(),
                              unreadCount: conv.unreadCount + 1
                          };
                      }
                      return conv;
                  }));
                  setIsTyping(false);
              }, 1500);
          }, 1000);
      }
    } catch (error) {
      console.error('Failed to send message to backend:', error);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white overflow-hidden max-w-7xl mx-auto border-x border-slate-200 shadow-sm">
      
      {/* Sidebar - Conversation List */}
      <div className={`${selectedChatId ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col border-r border-slate-200 bg-slate-50`}>
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-xs">Loading messages...</p>
            </div>
          ) : conversations.map(conv => (
            <div 
              key={conv.id}
              onClick={() => setSelectedChatId(conv.id)}
              className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors ${selectedChatId === conv.id ? 'bg-white border-l-4 border-l-emerald-500 shadow-sm' : ''}`}
            >
              <div className="flex gap-3">
                <img 
                  src={conv.recipientAvatar} 
                  alt={conv.recipientName} 
                  className="w-12 h-12 rounded-full bg-slate-200 border border-slate-200 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{conv.recipientName}</h3>
                    <span className="text-xs text-slate-500">{new Date(conv.lastMessageTime).toLocaleDateString()}</span>
                  </div>
                  {conv.relatedJobTitle && (
                    <p className="text-xs text-emerald-600 font-medium truncate mb-1">{conv.relatedJobTitle}</p>
                  )}
                  <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                    {conv.lastMessage || <span className="italic text-slate-400">Drafting...</span>}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedChatId ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-white shadow-sm z-10">
            <button 
              onClick={() => setSelectedChatId(null)}
              className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="relative">
                <img 
                    src={activeConversation?.recipientAvatar} 
                    alt={activeConversation?.recipientName} 
                    className="w-10 h-10 rounded-full bg-slate-200 border border-slate-200 object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{activeConversation?.recipientName}</h3>
              <p className="text-xs text-slate-500 flex items-center">
                {activeConversation?.relatedJobTitle ? `Re: ${activeConversation.relatedJobTitle}` : 'Online'}
              </p>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {activeConversation?.messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                    <User className="w-12 h-12 mb-2 opacity-50" />
                    <p>Start the conversation with {activeConversation.recipientName}</p>
                </div>
            )}
            {activeConversation?.messages.map((msg) => {
              const isMe = msg.senderId === user.name;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                    <div 
                      className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                        isMe 
                          ? 'bg-emerald-600 text-white rounded-tr-none' 
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                        {formatTime(msg.timestamp)}
                        {isMe && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
            {isTyping && (
                <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm">
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-slate-300 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-slate-50"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-emerald-600 text-white p-2.5 rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-slate-50 text-slate-400">
           <div className="bg-slate-100 p-6 rounded-full mb-4">
              <User className="w-16 h-16 text-slate-300" />
           </div>
           <h3 className="text-lg font-medium text-slate-600">Select a conversation</h3>
           <p className="text-sm">Choose a person from the list to start chatting</p>
        </div>
      )}
    </div>
  );
};
