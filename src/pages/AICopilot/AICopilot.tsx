import { useState, useRef, useEffect } from 'react';
import { copilotService } from '../../services/copilot.service';
import { Bot, Send, User, Loader2, Lightbulb } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: any[];
}

export default function AICopilot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m SafetyIQ AI Copilot. How can I help you with safety intelligence today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    copilotService.getSuggestions().then(setSuggestions).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    try {
      const result = await copilotService.chat(userMessage);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.response,
        citations: result.citations,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full gap-6 animate-fade-in">
      <div className="flex-1 flex flex-col glass-card gradient-border">
        <div className="p-4 border-b border-safety-border">
          <h2 className="text-sm font-medium text-white">AI Copilot</h2>
          <p className="text-xs text-safety-muted">Ask anything about safety</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-safety-cyan/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-safety-cyan" />
                </div>
              )}
              <div className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user' ? 'bg-safety-cyan/20 text-safety-text' : 'bg-safety-card text-safety-text'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-safety-border/50">
                    <p className="text-xs text-safety-muted mb-1">Sources:</p>
                    {msg.citations.map((c, j) => (
                      <p key={j} className="text-xs text-safety-cyan">{c.source}</p>
                    ))}
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-safety-amber/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-safety-amber" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-safety-cyan/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-safety-cyan" />
              </div>
              <div className="p-3 rounded-lg bg-safety-card">
                <Loader2 className="w-4 h-4 text-safety-cyan animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-safety-border">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about safety..."
              className="flex-1 bg-safety-card border border-safety-border rounded-lg px-3 py-2 text-sm text-white placeholder-safety-muted focus:outline-none focus:border-safety-cyan/50"
            />
            <button onClick={handleSend} disabled={loading} className="p-2 bg-safety-cyan/20 border border-safety-cyan/30 rounded-lg text-safety-cyan hover:bg-safety-cyan/30 transition-colors disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="w-64 flex-shrink-0">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-safety-amber" />
            <h3 className="text-sm font-medium text-white">Suggestions</h3>
          </div>
          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => { setInput(s); }}
                className="w-full text-left text-xs text-safety-muted p-2 rounded-lg hover:bg-safety-card hover:text-safety-text transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
