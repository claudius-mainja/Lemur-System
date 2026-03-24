'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { 
  Mail, Inbox, Send, Archive, Trash2, Star, Search, Plus, 
  MoreHorizontal, Paperclip, Clock, User, ChevronDown, Reply,
  Forward, X, AlertCircle, CheckCircle, Search as SearchIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

type EmailFolder = 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash';
type EmailStatus = 'read' | 'unread';

interface Email {
  id: string;
  subject: string;
  preview: string;
  from: string;
  to: string;
  date: string;
  status: EmailStatus;
  starred: boolean;
  body: string;
  attachments?: { name: string; size: string }[];
}

interface EmailAccount {
  id: string;
  email: string;
  name: string;
  provider: string;
  unreadCount: number;
}

export default function EmailPage() {
  const { user } = useAuthStore();
  const [activeFolder, setActiveFolder] = useState<EmailFolder>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [activeAccount, setActiveAccount] = useState<EmailAccount | null>(null);
  
  const [composeEmail, setComposeEmail] = useState({
    to: '',
    cc: '',
    subject: '',
    body: '',
  });

  const [emails, setEmails] = useState<Record<EmailFolder, Email[]>>({
    inbox: [],
    sent: [],
    drafts: [],
    archive: [],
    trash: [],
  });

  useEffect(() => {
    const userEmail = user?.email || 'user@lemursystem.com';
    const account = { id: '1', email: userEmail, name: user?.firstName || 'User', provider: 'LemurMail', unreadCount: 0 };
    setAccounts([account]);
    setActiveAccount(account);
    
    const storedEmails = localStorage.getItem('lemur-emails');
    if (storedEmails) {
      setEmails(JSON.parse(storedEmails));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('lemur-emails', JSON.stringify(emails));
  }, [emails]);

  const folderCounts: Record<EmailFolder, number> = {
    inbox: emails.inbox.filter(e => e.status === 'unread').length,
    sent: 0,
    drafts: emails.drafts.length,
    archive: emails.archive.length,
    trash: emails.trash.length,
  };

  const folders: { id: EmailFolder; icon: typeof Inbox; label: string }[] = [
    { id: 'inbox', icon: Inbox, label: 'Inbox' },
    { id: 'sent', icon: Send, label: 'Sent' },
    { id: 'drafts', icon: Mail, label: 'Drafts' },
    { id: 'archive', icon: Archive, label: 'Archive' },
    { id: 'trash', icon: Trash2, label: 'Trash' },
  ];

  const filteredEmails = emails[activeFolder].filter(email =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendEmail = () => {
    if (!composeEmail.to || !composeEmail.subject) {
      toast.error('Please fill in required fields');
      return;
    }
    
    const newEmail: Email = {
      id: Date.now().toString(),
      subject: composeEmail.subject,
      preview: composeEmail.body.substring(0, 50) + '...',
      from: activeAccount?.email || user?.email || 'user@lemursystem.com',
      to: composeEmail.to,
      date: new Date().toLocaleString(),
      status: 'read',
      starred: false,
      body: composeEmail.body,
    };
    
    setEmails(prev => ({
      ...prev,
      sent: [newEmail, ...prev.sent],
    }));
    
    setComposeEmail({ to: '', cc: '', subject: '', body: '' });
    setShowCompose(false);
    toast.success('Email sent successfully');
  };

  const handleStarEmail = (emailId: string) => {
    setEmails(prev => {
      const updated = { ...prev };
      for (const folder of Object.keys(updated) as EmailFolder[]) {
        updated[folder] = updated[folder].map(email =>
          email.id === emailId ? { ...email, starred: !email.starred } : email
        );
      }
      return updated;
    });
  };

  const handleDeleteEmail = (emailId: string) => {
    setEmails(prev => {
      const email = Object.values(prev).flat().find(e => e.id === emailId);
      if (email) {
        const updated = { ...prev };
        for (const folder of Object.keys(updated) as EmailFolder[]) {
          updated[folder] = updated[folder].filter(e => e.id !== emailId);
        }
        updated.trash = [...updated.trash, email];
        return updated;
      }
      return prev;
    });
    toast.success('Email moved to trash');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520]" suppressHydrationWarning>
      {/* Header */}
      <header className="bg-[#0b2535]/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-secondary/25">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-wider">Email</h1>
              <p className="text-sm text-white/50">Communication hub</p>
            </div>
          </div>
          <button
            onClick={() => setShowCompose(true)}
            className="px-4 py-2 bg-gradient-to-r from-secondary to-accent text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:shadow-lg hover:shadow-secondary/25 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Compose
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0b2535]/80 backdrop-blur-xl border-r border-white/10 p-4">
          {/* Account Selector */}
          <div className="mb-6">
            <select
              value={activeAccount?.id || ''}
              onChange={(e) => {
                const account = accounts.find(a => a.id === e.target.value);
                if (account) setActiveAccount(account);
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
            >
              {accounts.map(account => (
                <option key={account.id} value={account.id} className="bg-[#0b2535]">
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Folders */}
          <nav className="space-y-1">
            {folders.map(folder => {
              const Icon = folder.icon;
              const count = folderCounts[folder.id];
              return (
                <button
                  key={folder.id}
                  onClick={() => { setActiveFolder(folder.id); setSelectedEmail(null); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition ${
                    activeFolder === folder.id
                      ? 'bg-gradient-to-r from-secondary to-accent text-white shadow-lg shadow-secondary/25'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {folder.label}
                  </div>
                  {count > 0 && (
                    <span className="w-6 h-6 bg-accent rounded-full text-white text-xs flex items-center justify-center font-bold">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Starred Section */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <button
              onClick={() => {
                const starredEmail = Object.values(emails).flat().find(e => e.starred);
                if (starredEmail) {
                  setActiveFolder('inbox');
                  setSelectedEmail(starredEmail);
                } else {
                  toast.success('No starred emails');
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white/50 hover:text-white hover:bg-white/5 transition"
            >
              <Star className="w-5 h-5 text-yellow-500" />
              Starred
            </button>
          </div>
        </aside>

        {/* Email List */}
        <div className="w-96 border-r border-white/10 bg-[#0a1520]/50">
          {/* Search */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
            </div>
          </div>

          {/* Email List */}
          <div className="overflow-y-auto h-[calc(100%-80px)]">
            {filteredEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-white/50">
                <Mail className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-sm">No emails in {activeFolder}</p>
              </div>
            ) : (
              filteredEmails.map(email => (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`p-4 border-b border-white/5 cursor-pointer transition ${
                    selectedEmail?.id === email.id
                      ? 'bg-white/10'
                      : email.status === 'unread'
                      ? 'bg-[#0b2535]/30 hover:bg-white/5'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className={`font-bold text-sm ${email.status === 'unread' ? 'text-white' : 'text-white/70'}`}>
                      {email.from.split('@')[0]}
                    </span>
                    <span className="text-xs text-white/40">{email.date}</span>
                  </div>
                  <h4 className={`text-sm mb-1 truncate ${email.status === 'unread' ? 'font-bold text-white' : 'text-white/70'}`}>
                    {email.subject}
                  </h4>
                  <p className="text-xs text-white/40 truncate">{email.preview}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Email Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {selectedEmail ? (
            <div className="bg-[#0b2535]/50 border border-white/10 rounded-2xl p-6 h-full">
              {/* Email Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedEmail.subject}</h2>
                  <div className="flex items-center gap-4 text-sm text-white/50">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {selectedEmail.from}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {selectedEmail.date}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStarEmail(selectedEmail.id)}
                    className={`p-2 rounded-lg transition ${selectedEmail.starred ? 'text-yellow-500' : 'text-white/50 hover:text-white'}`}
                  >
                    <Star className={`w-5 h-5 ${selectedEmail.starred ? 'fill-yellow-500' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleDeleteEmail(selectedEmail.id)}
                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition">
                    <Archive className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Attachments */}
              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <div className="mb-6 p-4 bg-white/5 rounded-xl">
                  <p className="text-sm text-white/50 mb-2 flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    {selectedEmail.attachments.length} Attachment{selectedEmail.attachments.length > 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmail.attachments.map((attachment, index) => (
                      <div key={index} className="px-3 py-2 bg-white/5 rounded-lg text-sm text-white/70 flex items-center gap-2">
                        <Paperclip className="w-4 h-4" />
                        {attachment.name}
                        <span className="text-white/40">({attachment.size})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Email Body */}
              <div className="prose prose-invert max-w-none">
                <p className="text-white/80 whitespace-pre-wrap">{selectedEmail.body}</p>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-white/10 flex gap-3">
                <button className="px-4 py-2 bg-gradient-to-r from-secondary to-accent text-white rounded-xl font-bold uppercase tracking-wider text-sm flex items-center gap-2 hover:shadow-lg transition">
                  <Reply className="w-4 h-4" />
                  Reply
                </button>
                <button className="px-4 py-2 bg-white/10 text-white rounded-xl font-bold uppercase tracking-wider text-sm flex items-center gap-2 hover:bg-white/20 transition">
                  <Forward className="w-4 h-4" />
                  Forward
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/50">
              <Mail className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">Select an email to read</p>
            </div>
          )}
        </main>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b2535] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">New Message</h3>
              <button onClick={() => setShowCompose(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div>
                <label className="block text-sm text-white/50 mb-1 uppercase tracking-wider">To</label>
                <input
                  type="email"
                  value={composeEmail.to}
                  onChange={(e) => setComposeEmail({ ...composeEmail, to: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  placeholder="recipient@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1 uppercase tracking-wider">CC</label>
                <input
                  type="email"
                  value={composeEmail.cc}
                  onChange={(e) => setComposeEmail({ ...composeEmail, cc: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  placeholder="cc@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  value={composeEmail.subject}
                  onChange={(e) => setComposeEmail({ ...composeEmail, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  placeholder="Email subject"
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1 uppercase tracking-wider">Message</label>
                <textarea
                  value={composeEmail.body}
                  onChange={(e) => setComposeEmail({ ...composeEmail, body: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none"
                  placeholder="Write your message..."
                />
              </div>
            </div>
            <div className="p-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 bg-white/10 text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-white/20 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-gradient-to-r from-secondary to-accent text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:shadow-lg transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
