'use client';

import { useState, useEffect } from 'react';
import { Bot, Tag, FileText, MessageSquare, Loader2, Copy, Check, X } from 'lucide-react';

type Tool = 'listing' | 'chat';

interface SellerAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName?: string;
  initialCategory?: string;
  onAutoFill?: (data: { title?: string; category?: string; description?: string; price?: string; keywords?: string[] }) => void;
}

export default function SellerAssistantModal({
  isOpen,
  onClose,
  initialName = '',
  initialCategory = '',
  onAutoFill,
}: SellerAssistantModalProps) {
  const [activeTool, setActiveTool] = useState<Tool>('listing');
  
  // States for Listing Generator
  const [listingName, setListingName] = useState('');
  const [listingCategory, setListingCategory] = useState('');
  const [listingFeatures, setListingFeatures] = useState('');
  const [listingCostPrice, setListingCostPrice] = useState('');
  const [listingResult, setListingResult] = useState<any>(null);
  const [listingLoading, setListingLoading] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);

  // States for Chat
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'assistant', text: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setListingName(initialName);
      setListingCategory(initialCategory);
    }
  }, [isOpen, initialName, initialCategory]);

  if (!isOpen) return null;

  const handleGenerateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingName) return;
    
    setListingLoading(true);
    setListingResult(null);
    try {
      const res = await fetch('/api/seller-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'generate-listing',
          payload: { name: listingName, category: listingCategory, features: listingFeatures, costPrice: listingCostPrice }
        })
      });
      const data = await res.json();
      if (data.success) {
        setListingResult(data.data);
      } else {
        alert(data.error || 'Failed to generate listing');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setListingLoading(false);
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;

    const userMessage = chatQuery;
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatQuery('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/seller-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'general-query',
          payload: { query: userMessage }
        })
      });
      const data = await res.json();
      if (data.success) {
        setChatHistory(prev => [...prev, { role: 'assistant', text: data.data.answer }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'assistant', text: 'Error: ' + (data.error || 'Something went wrong.') }]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'assistant', text: 'Error: Connection failed.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'title' | 'desc') => {
    navigator.clipboard.writeText(text);
    if (type === 'title') {
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    } else {
      setCopiedDesc(true);
      setTimeout(() => setCopiedDesc(false), 2000);
    }
  };

  const handleAutoFill = () => {
    if (onAutoFill && listingResult) {
      onAutoFill({
        title: listingResult.title,
        category: listingResult.category,
        price: listingResult.suggestedPrice?.toString(),
        description: listingResult.description,
        keywords: listingResult.keywords
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">AI Seller Assistant</h2>
              <p className="text-xs text-indigo-600 font-medium">Deligo AI</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:bg-indigo-100 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          {/* Sidebar Tools */}
          <div className="md:w-64 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 p-4 space-y-2 flex-shrink-0">
            <button
              onClick={() => setActiveTool('listing')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium ${
                activeTool === 'listing' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-indigo-100 border border-gray-200'
              }`}
            >
              <FileText className="w-5 h-5" />
              Listing Generator
            </button>

            <button
              onClick={() => setActiveTool('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium ${
                activeTool === 'chat' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-indigo-100 border border-gray-200'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Ask Assistant
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden bg-white">
            {/* Listing Generator Tool */}
            {activeTool === 'listing' && (
              <div className="flex flex-col md:flex-row w-full h-full">
                <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200 md:w-1/2 overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Generate Listing</h3>
                  <form onSubmit={handleGenerateListing} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name / Idea *</label>
                      <input required type="text" value={listingName} onChange={e => setListingName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. Wireless Gaming Mouse" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input type="text" value={listingCategory} onChange={e => setListingCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. Electronics" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (₹)</label>
                      <input type="number" step="0.01" value={listingCostPrice} onChange={e => setListingCostPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. 500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
                      <textarea value={listingFeatures} onChange={e => setListingFeatures(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. RGB lighting, 10000 DPI" />
                    </div>
                    <button disabled={listingLoading} type="submit" className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                      {listingLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Bot className="w-5 h-5 mr-2" />}
                      {listingLoading ? 'Generating...' : 'Generate with AI'}
                    </button>
                  </form>
                </div>
                
                <div className="p-6 md:w-1/2 bg-gray-50 overflow-y-auto">
                  {listingLoading && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                      <p>Drafting the perfect listing...</p>
                    </div>
                  )}
                  {!listingLoading && !listingResult && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                      <FileText className="w-12 h-12 mb-3 opacity-50" />
                      <p>Your AI-generated listing will appear here.</p>
                    </div>
                  )}
                  {listingResult && (
                    <div className="space-y-6">
                      {onAutoFill && (
                        <button onClick={handleAutoFill} className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm font-bold text-white bg-green-600 hover:bg-green-700 transition-colors mb-4">
                          <Check className="w-5 h-5 mr-2" /> Auto Fill Form
                        </button>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</h3>
                          <p className="font-semibold text-gray-900">{listingResult.category}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Suggested Price</h3>
                          <p className="font-bold text-indigo-700 text-lg">₹{listingResult.suggestedPrice}</p>
                        </div>
                      </div>

                      {listingResult.pricingStrategy && (
                        <div className="bg-indigo-50 p-4 rounded-lg shadow-sm border border-indigo-100">
                          <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2 flex items-center"><Tag className="w-3 h-3 mr-1"/> Pricing Strategy</h3>
                          <p className="text-indigo-900 text-sm">{listingResult.pricingStrategy}</p>
                        </div>
                      )}

                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Optimized Title</h3>
                          <button onClick={() => copyToClipboard(listingResult.title, 'title')} className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 p-1.5 rounded-md">
                            {copiedTitle ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="font-semibold text-gray-900">{listingResult.title}</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</h3>
                          <button onClick={() => copyToClipboard(listingResult.description, 'desc')} className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 p-1.5 rounded-md">
                            {copiedDesc ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <div className="prose prose-sm prose-indigo" dangerouslySetInnerHTML={{ __html: listingResult.description }}></div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">SEO Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                          {(listingResult.keywords || []).map((kw: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}


            {/* Chat Tool */}
            {activeTool === 'chat' && (
              <div className="flex flex-col w-full h-full bg-gray-50">
                <div className="p-4 border-b border-gray-200 bg-white flex items-center shadow-sm z-10">
                  <h3 className="text-lg font-semibold text-gray-800">Ask Assistant</h3>
                  <p className="text-xs text-gray-500 ml-3 hidden sm:block">Ask about sales strategies or platform policies.</p>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto flex flex-col space-y-4">
                  {chatHistory.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
                      <p>How can I help you grow your store today?</p>
                      <div className="flex gap-2 mt-4 flex-wrap justify-center max-w-md">
                        <span className="px-3 py-1.5 bg-white border border-gray-200 shadow-sm rounded-full text-xs cursor-pointer hover:bg-gray-50 text-gray-700 font-medium" onClick={() => setChatQuery('How can I increase conversion rate?')}>How can I increase conversion rate?</span>
                        <span className="px-3 py-1.5 bg-white border border-gray-200 shadow-sm rounded-full text-xs cursor-pointer hover:bg-gray-50 text-gray-700 font-medium" onClick={() => setChatQuery('Best practices for product photos?')}>Best practices for product photos?</span>
                      </div>
                    </div>
                  )}
                  
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-indigo-600 text-white rounded-tr-sm' 
                          : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                      }`}>
                        <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\\n/g, '<br/>') }}></div>
                      </div>
                    </div>
                  ))}
                  
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl px-5 py-3.5 rounded-tl-sm border border-gray-100 shadow-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-gray-200 bg-white">
                  <form onSubmit={handleChat} className="flex gap-2 max-w-4xl mx-auto">
                    <input 
                      type="text" 
                      value={chatQuery}
                      onChange={e => setChatQuery(e.target.value)}
                      placeholder="Type your question..." 
                      className="flex-1 px-4 py-3 border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                    />
                    <button 
                      type="submit" 
                      disabled={chatLoading || !chatQuery.trim()}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700 disabled:opacity-50 font-medium transition-colors"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
