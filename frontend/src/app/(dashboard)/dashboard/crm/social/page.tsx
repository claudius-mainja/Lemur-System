'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useDataStore } from '@/stores/data.store';
import {
  MessageSquare, Calendar, Clock, Image, Video, Send, Sparkles,
  Facebook, Twitter, Instagram, Linkedin, Link2, Upload, X, Plus,
  Check, AlertCircle, Loader2, Trash2, Edit, Eye, Play,
  Settings, Wifi, WifiOff, RefreshCw, FileText, Wand2, Hash
} from 'lucide-react';
import toast from 'react-hot-toast';

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600', maxLength: 63206 },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-sky-500', maxLength: 280 },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400', maxLength: 2200 },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700', maxLength: 3000 },
];

const AI_PROMPTS = [
  'Generate a professional announcement',
  'Create an engaging product launch post',
  'Write a team celebration message',
  'Draft an industry insight article',
  'Generate a promotional offer',
];

const POST_TEMPLATES = [
  { name: 'Product Launch', prompt: 'Write an exciting product launch announcement for our new service' },
  { name: 'Team Update', prompt: 'Create a team achievement announcement' },
  { name: 'Industry News', prompt: 'Write a thought leadership post about industry trends' },
  { name: 'Customer Spotlight', prompt: 'Create a customer success story highlight' },
  { name: 'Event Promotion', prompt: 'Write an event promotion post' },
];

export default function SocialMediaPage() {
  const { user } = useAuthStore();
  const { socialPosts, socialAccounts, addSocialPost, updateSocialPost, deleteSocialPost } = useDataStore();
  
  const [activeTab, setActiveTab] = useState<'create' | 'posts' | 'accounts'>('create');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin']);
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSource, setAiSource] = useState<'chatgpt' | 'perplexity' | 'manual'>('manual');
  const [scheduledFor, setScheduledFor] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const generateWithAI = async (type: 'chatgpt' | 'perplexity') => {
    setIsGenerating(true);
    setAiSource(type);
    
    toast.loading(`Generating content with ${type === 'chatgpt' ? 'ChatGPT' : 'Perplexity AI'}...`, { id: 'ai-generate' });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedContent = type === 'chatgpt'
      ? "Excited to share that we're launching our newest innovation! Our team has been working tirelessly to bring you a solution that transforms how you do business. Stay tuned for more details coming soon! #Innovation #Business #Growth"
      : "Breaking: Industry leaders are taking notice of our latest breakthrough. This development represents a significant leap forward in our commitment to excellence. What does this mean for our customers? Excellence just got more accessible. #Leadership #Excellence";
    
    setContent(generatedContent);
    toast.success(`${type === 'chatgpt' ? 'ChatGPT' : 'Perplexity AI'} content generated!`, { id: 'ai-generate' });
    setIsGenerating(false);
  };

  const generateFromTemplate = (template: typeof POST_TEMPLATES[0]) => {
    setIsGenerating(true);
    setAiSource('chatgpt');
    
    toast.loading('Generating content from template...', { id: 'ai-generate' });
    
    setTimeout(() => {
      const content = `${template.prompt}: ${template.name} - Discover how we're transforming the industry with our latest innovation. Our commitment to excellence drives us forward every day. Join us on this journey! #${template.name.replace(' ', '')} #Innovation`;
      setContent(content);
      toast.success('Content generated from template!', { id: 'ai-generate' });
      setIsGenerating(false);
    }, 1500);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setMediaFiles(prev => [...prev, ...newFiles]);

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setMediaPreview(prev => [...prev, ...newPreviews]);

    toast.success(`${newFiles.length} file(s) added`);
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreview(prev => prev.filter((_, i) => i !== index));
  };

  const schedulePost = () => {
    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    selectedPlatforms.forEach(platform => {
      addSocialPost({
        platform: platform as any,
        content,
        mediaUrls: mediaPreview,
        scheduledFor: scheduledFor || new Date().toISOString(),
        status: scheduledFor ? 'scheduled' : 'draft',
        aiGenerated: aiSource !== 'manual',
        aiSource,
      });
    });

    toast.success(`Post ${scheduledFor ? 'scheduled' : 'saved as draft'}!`);
    setContent('');
    setMediaFiles([]);
    setMediaPreview([]);
    setScheduledFor('');
  };

  const publishNow = () => {
    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    selectedPlatforms.forEach(platform => {
      addSocialPost({
        platform: platform as any,
        content,
        mediaUrls: mediaPreview,
        publishedAt: new Date().toISOString(),
        status: 'published',
        aiGenerated: aiSource !== 'manual',
        aiSource,
      });
    });

    toast.success('Post published to selected platforms!');
    setContent('');
    setMediaFiles([]);
    setMediaPreview([]);
  };

  const connectAccount = (platformId: string) => {
    toast.loading(`Connecting to ${platformId}...`, { id: 'connect' });
    setTimeout(() => {
      toast.success(`${platformId} account connected!`, { id: 'connect' });
    }, 1500);
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = PLATFORMS.find(p => p.id === platformId);
    return platform?.icon || MessageSquare;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'draft':
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
      default:
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Social Media</h1>
          <p className="text-white/60 text-sm">Create, schedule, and manage your social media posts</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit">
        {[
          { id: 'create', label: 'Create Post', icon: Plus },
          { id: 'posts', label: 'All Posts', icon: FileText },
          { id: 'accounts', label: 'Accounts', icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-accent to-accentDark text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Create Post Tab */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              {/* Platform Selection */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-white/60 mb-3 uppercase tracking-wider">
                  Select Platforms
                </label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map(platform => {
                    const Icon = platform.icon;
                    const isSelected = selectedPlatforms.includes(platform.id);
                    const account = socialAccounts.find(a => a.platform === platform.id);
                    
                    return (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        disabled={!account?.isConnected}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-accent bg-accent/10'
                            : 'border-white/10 hover:border-white/20'
                        } ${!account?.isConnected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className={`w-6 h-6 ${platform.color} rounded flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-white">
                          {platform.name}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-accent" />}
                        {!account?.isConnected && <WifiOff className="w-4 h-4 text-white/40" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Generation */}
              <div className="mb-4 p-4 bg-gradient-to-r from-accent/10 to-accentDark/10 rounded-xl border border-accent/20">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="font-bold text-white uppercase tracking-wider text-sm">AI Content Generation</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    onClick={() => generateWithAI('chatgpt')}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Wand2 className="w-4 h-4" />
                    ChatGPT
                  </button>
                  <button
                    onClick={() => generateWithAI('perplexity')}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    Perplexity AI
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POST_TEMPLATES.map(template => (
                    <button
                      key={template.name}
                      onClick={() => generateFromTemplate(template)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg text-xs font-medium transition-colors"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Editor */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-white/60 uppercase tracking-wider">
                    Post Content
                  </label>
                  <span className="text-xs text-white/40">
                    {content.length} characters
                  </span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What would you like to share?"
                  className="w-full h-48 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                />
              </div>

              {/* Media Upload */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-white/60 mb-3 uppercase tracking-wider">
                  Media
                </label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-accent/50 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                    id="media-upload"
                  />
                  <label htmlFor="media-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                    <p className="text-sm text-white/60">Click to upload images or videos</p>
                    <p className="text-xs text-white/40 mt-1">PNG, JPG, GIF, MP4 up to 10MB</p>
                  </label>
                </div>

                {mediaPreview.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {mediaPreview.map((preview, index) => (
                      <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <img src={preview} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeMedia(index)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Schedule */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">
                  Schedule (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={publishNow}
                  disabled={!content.trim()}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  Publish Now
                </button>
                <button
                  onClick={schedulePost}
                  disabled={!content.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Tips */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="font-bold text-white uppercase tracking-wider text-sm mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                Quick Tips
              </h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li className="flex items-start gap-2">
                  <Hash className="w-4 h-4 text-accent mt-0.5" />
                  Use relevant hashtags to increase reach
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-accent mt-0.5" />
                  Best times to post: 9am, 12pm, 5pm
                </li>
                <li className="flex items-start gap-2">
                  <Image className="w-4 h-4 text-accent mt-0.5" />
                  Posts with images get 2.3x more engagement
                </li>
              </ul>
            </div>

            {/* Connected Accounts */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="font-bold text-white uppercase tracking-wider text-sm mb-3">
                Connected Accounts
              </h3>
              <div className="space-y-2">
                {socialAccounts.map(account => {
                  const Icon = getPlatformIcon(account.platform);
                  return (
                    <div key={account.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-white/60" />
                        <span className="text-sm text-white/80">{account.accountName}</span>
                      </div>
                      {account.isConnected ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                          <Wifi className="w-3 h-3" />
                          Connected
                        </span>
                      ) : (
                        <button
                          onClick={() => connectAccount(account.platform)}
                          className="text-xs text-accent hover:text-accent/80"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Posts Tab */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialPosts.map(post => {
              const Icon = getPlatformIcon(post.platform);
              return (
                <div key={post.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-white/60" />
                      <span className="text-sm font-medium text-white capitalize">{post.platform}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${getStatusBadge(post.status)}`}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-sm text-white/80 mb-3 line-clamp-3">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      {post.aiGenerated && <Sparkles className="w-3 h-3 text-accent" />}
                      {post.scheduledFor && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(post.scheduledFor).toLocaleDateString()}
                        </span>
                      )}
                      {post.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Published
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {socialPosts.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">No posts yet. Create your first post!</p>
            </div>
          )}
        </div>
      )}

      {/* Accounts Tab */}
      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLATFORMS.map(platform => {
            const Icon = platform.icon;
            const account = socialAccounts.find(a => a.platform === platform.id);
            
            return (
              <div key={platform.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${platform.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{platform.name}</h3>
                      <p className="text-sm text-white/40">{account?.accountName || 'Not connected'}</p>
                    </div>
                  </div>
                  {account?.isConnected ? (
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold flex items-center gap-1">
                      <Wifi className="w-3 h-3" />
                      Connected
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-white/10 text-white/40 rounded-lg text-xs font-bold flex items-center gap-1">
                      <WifiOff className="w-3 h-3" />
                      Disconnected
                    </span>
                  )}
                </div>
                <button
                  onClick={() => connectAccount(platform.id)}
                  className={`w-full py-2 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${
                    account?.isConnected
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-gradient-to-r from-accent to-accentDark text-white hover:shadow-lg hover:shadow-accent/30'
                  }`}
                >
                  {account?.isConnected ? 'Disconnect' : 'Connect Account'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
