'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { 
  MessageSquare, Hash, Send, Paperclip, Smile, MoreVertical,
  Search, Plus, Phone, Video, Star, Archive, Trash2,
  Check, CheckCheck, Clock, File, Image, X, Users
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  channelId: string;
  reactions?: { emoji: string; users: string[] }[];
  attachments?: { name: string; url: string; type: string }[];
}

interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  members: string[];
  createdBy: string;
}

interface DirectMessage {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: string;
}

const CHANNELS: Channel[] = [
  { id: 'general', name: 'general', description: 'General discussions', type: 'public', members: [], createdBy: 'system' },
  { id: 'announcements', name: 'announcements', description: 'Company announcements', type: 'public', members: [], createdBy: 'system' },
  { id: 'hr', name: 'hr', description: 'HR team discussions', type: 'public', members: [], createdBy: 'system' },
  { id: 'finance', name: 'finance', description: 'Finance team discussions', type: 'public', members: [], createdBy: 'system' },
  { id: 'random', name: 'random', description: 'Random discussions', type: 'public', members: [], createdBy: 'system' },
];

const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

export default function TeamChatPage() {
  const { user } = useAuthStore();
  const [channels, setChannels] = useState<Channel[]>(CHANNELS);
  const [activeChannel, setActiveChannel] = useState<string>('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);
  const [activeDM, setActiveDM] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedMessages = localStorage.getItem('chat-messages');
    const storedChannels = localStorage.getItem('chat-channels');
    const storedDMs = localStorage.getItem('chat-dms');
    
    if (storedMessages) setMessages(JSON.parse(storedMessages));
    if (storedChannels) setChannels([...CHANNELS, ...JSON.parse(storedChannels)]);
    if (storedDMs) setDirectMessages(JSON.parse(storedDMs));
  }, []);

  useEffect(() => {
    localStorage.setItem('chat-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chat-channels', JSON.stringify(channels.filter(c => !CHANNELS.find(cc => cc.id === c.id))));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('chat-dms', JSON.stringify(directMessages));
  }, [directMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const channelMessages = messages.filter(m => m.channelId === activeChannel);
  const dmMessages = activeDM ? messages.filter(m => {
    const dm = directMessages.find(d => d.id === activeDM);
    return dm && m.senderId === dm.participants[0] || m.senderId === dm?.participants[1];
  }) : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: generateId(),
      content: newMessage,
      senderId: user.id,
      senderName: `${user.firstName} ${user.lastName}`,
      timestamp: new Date().toISOString(),
      channelId: activeChannel || activeDM || 'general',
    };

    setMessages([...messages, message]);
    setNewMessage('');
    toast.success('Message sent');
  };

  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return;
    
    const channel: Channel = {
      id: newChannelName.toLowerCase().replace(/\s+/g, '-'),
      name: newChannelName,
      type: 'public',
      members: [user?.id || ''],
      createdBy: user?.id || '',
    };
    
    setChannels([...channels, channel]);
    setNewChannelName('');
    setShowCreateChannel(false);
    toast.success(`Channel #${channel.name} created`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    Array.from(files).forEach(file => {
      const message: Message = {
        id: generateId(),
        content: `Shared a file: ${file.name}`,
        senderId: user.id,
        senderName: `${user.firstName} ${user.lastName}`,
        timestamp: new Date().toISOString(),
        channelId: activeChannel || 'general',
        attachments: [{ name: file.name, url: URL.createObjectURL(file), type: file.type }],
      };
      setMessages([...messages, message]);
    });
    
    toast.success(`${files.length} file(s) shared`);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const publicChannels = channels.filter(c => c.type === 'public');
  const privateChannels = channels.filter(c => c.type === 'private');

  return (
    <div className="min-h-screen bg-gray-50 flex" suppressHydrationWarning>
      {/* Sidebar */}
      <aside className={`${showSidebar ? 'w-72' : 'w-0'} bg-slate-900 text-white transition-all duration-300 overflow-hidden`}>
        <div className="p-4">
          {/* Workspace Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-lg">Team Chat</h2>
              <p className="text-xs text-slate-400">{user?.organizationName || 'Company'}</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border-none rounded-lg text-sm"
            />
          </div>

          {/* Channels */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase">Channels</h3>
              <button onClick={() => setShowCreateChannel(true)} className="text-slate-400 hover:text-white">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {publicChannels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => { setActiveChannel(channel.id); setActiveDM(null); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${
                    activeChannel === channel.id ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Hash className="w-4 h-4" />
                  <span className="truncate">{channel.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messages */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2">Direct Messages</h3>
            <div className="space-y-1">
              {directMessages.map(dm => (
                <button
                  key={dm.id}
                  onClick={() => { setActiveDM(dm.id); setActiveChannel(''); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${
                    activeDM === dm.id ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-xs font-bold">
                    {dm.participants[0]?.[0] || '?'}
                  </div>
                  <span className="truncate text-sm">User</span>
                </button>
              ))}
              <button className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                <Plus className="w-4 h-4" />
                <span className="text-sm">New Message</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSidebar(!showSidebar)} className="p-2 hover:bg-gray-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-gray-600" />
            </button>
            {activeChannel && (
              <div>
                <h2 className="font-semibold text-gray-900"># {channels.find(c => c.id === activeChannel)?.name}</h2>
                <p className="text-xs text-gray-500">{channels.find(c => c.id === activeChannel)?.description}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg"><Phone className="w-5 h-5 text-gray-600" /></button>
            <button className="p-2 hover:bg-gray-100 rounded-lg"><Video className="w-5 h-5 text-gray-600" /></button>
            <button className="p-2 hover:bg-gray-100 rounded-lg"><Star className="w-5 h-5 text-gray-600" /></button>
            <button className="p-2 hover:bg-gray-100 rounded-lg"><MoreVertical className="w-5 h-5 text-gray-600" /></button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeChannel ? (
            channelMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              channelMessages.map(msg => (
                <div key={msg.id} className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {msg.senderName[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{msg.senderName}</span>
                      <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-gray-700">{msg.content}</p>
                    {msg.attachments?.map((att, i) => (
                      <div key={i} className="mt-2 p-3 bg-gray-100 rounded-lg flex items-center gap-2">
                        <File className="w-4 h-4 text-gray-600" />
                        <a href={att.url} target="_blank" className="text-blue-600 hover:underline">{att.name}</a>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a channel to start chatting</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t">
          <div className="flex items-center gap-3">
            <label className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <Paperclip className="w-5 h-5 text-gray-600" />
              <input type="file" multiple className="hidden" onChange={handleFileUpload} />
            </label>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Message #${activeChannel || 'channel'}`}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleSendMessage}
              className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      {/* Create Channel Modal */}
      {showCreateChannel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Create Channel</h3>
            <input
              type="text"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              placeholder="Channel name"
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCreateChannel(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleCreateChannel} className="px-4 py-2 bg-primary text-white rounded-lg">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
