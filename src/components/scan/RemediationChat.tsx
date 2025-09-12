import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  User, 
  Send, 
  X, 
  Copy, 
  GitPullRequest,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface Finding {
  id: string;
  ruleName?: string;
  packageName?: string;
  vulnerability?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  filePath?: string;
  description: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface RemediationChatProps {
  finding: Finding | null;
  isOpen: boolean;
  onClose: () => void;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical':
      return 'bg-destructive text-destructive-foreground';
    case 'High':
      return 'bg-orange-500 text-white hover:bg-orange-600';
    case 'Medium':
      return 'bg-yellow-500 text-white hover:bg-yellow-600';
    case 'Low':
      return 'bg-blue-500 text-white hover:bg-blue-600';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};

export function RemediationChat({ finding, isOpen, onClose }: RemediationChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Simulate AI responses based on finding type
  const getInitialAIResponse = (finding: Finding) => {
    const isSastFinding = 'ruleName' in finding;
    
    if (isSastFinding) {
      return `I've analyzed the ${finding.ruleName} vulnerability in ${finding.filePath}. Here's what I found:

**Issue**: ${finding.description}

**Recommended Fix**:
1. Implement input validation and sanitization
2. Use parameterized queries instead of string concatenation
3. Apply proper encoding/escaping for user inputs

Would you like me to generate a code patch for this specific issue?`;
    } else {
      return `I've reviewed the vulnerability in **${finding.packageName}**. Here's my analysis:

**Issue**: ${finding.description}

**Recommended Action**:
• Upgrade from current version to the latest secure version
• This will patch the known vulnerability: ${finding.vulnerability}

**Next Steps**:
1. I can generate the exact upgrade command
2. Create a pull request with the dependency update
3. Include testing recommendations

What would you like me to help you with first?`;
    }
  };

  useEffect(() => {
    if (finding && isOpen) {
      // Initialize chat with AI analysis
      const initialMessage: ChatMessage = {
        id: '1',
        role: 'ai',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      };

      setMessages([initialMessage]);
      setIsTyping(true);

      // Simulate streaming response
      const fullResponse = getInitialAIResponse(finding);
      let currentText = '';
      let charIndex = 0;

      const streamInterval = setInterval(() => {
        if (charIndex < fullResponse.length) {
          currentText += fullResponse[charIndex];
          setMessages([{
            ...initialMessage,
            content: currentText,
            isStreaming: charIndex < fullResponse.length - 1
          }]);
          charIndex++;
        } else {
          clearInterval(streamInterval);
          setIsTyping(false);
          setMessages([{
            ...initialMessage,
            content: fullResponse,
            isStreaming: false
          }]);
        }
      }, 30);

      return () => clearInterval(streamInterval);
    } else if (!isOpen) {
      // Reset chat when closed
      setMessages([]);
      setInputValue('');
      setIsTyping(false);
    }
  }, [finding, isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: generateAIResponse(inputValue.trim()),
        timestamp: new Date(),
        isStreaming: true
      };

      setMessages(prev => [...prev, aiResponse]);
      
      // Simulate streaming
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiResponse.id 
            ? { ...msg, isStreaming: false }
            : msg
        ));
        setIsTyping(false);
      }, 1500);
    }, 500);
  };

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('patch') || input.includes('code')) {
      return `Here's a code patch for this vulnerability:

\`\`\`typescript
// Before (vulnerable)
const query = \`SELECT * FROM users WHERE id = \${userId}\`;

// After (secure)
const query = 'SELECT * FROM users WHERE id = ?';
const result = await db.query(query, [userId]);
\`\`\`

This change:
• Uses parameterized queries to prevent SQL injection
• Properly escapes user input
• Maintains the same functionality

Would you like me to create a pull request with this fix?`;
    }
    
    if (input.includes('pull request') || input.includes('pr')) {
      return `Perfect! I'll create a pull request with the security fix. The PR will include:

✅ **Security patch implementation**
✅ **Updated tests to verify the fix**
✅ **Security review checklist**
✅ **Documentation updates**

**PR Title**: "Security: Fix SQL injection vulnerability in user queries"

**Changes**:
• \`src/api/users.ts\` - Implement parameterized queries
• \`tests/security.test.ts\` - Add security regression tests

Ready to create the PR? I'll also include a detailed security analysis in the description.`;
    }

    if (input.includes('test') || input.includes('verify')) {
      return `Great question! Here's how to test this security fix:

**1. Unit Tests**
\`\`\`bash
npm test -- security.test.ts
\`\`\`

**2. Security Regression Test**
• Test with malicious input: \`'; DROP TABLE users; --\`
• Verify it's properly escaped
• Check database logs for any suspicious queries

**3. Integration Testing**
• Test all affected API endpoints
• Verify normal functionality still works
• Run end-to-end security tests

Would you like me to generate the specific test cases for this vulnerability?`;
    }

    return `I understand you're asking about "${userInput}". Let me help you with that specific aspect of the remediation.

Based on this ${finding?.severity} severity issue, I recommend focusing on:
• Immediate security impact mitigation
• Proper testing procedures
• Long-term prevention strategies

What specific aspect would you like me to elaborate on?`;
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  if (!finding || !isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-background border-l border-border shadow-lg z-50">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                AI Remediation Assistant
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getSeverityColor(finding.severity)}>
                  {finding.severity}
                </Badge>
                <span className="text-xs text-muted-foreground truncate">
                  {'ruleName' in finding ? finding.ruleName : finding.packageName}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col h-[calc(100vh-120px)] p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : ''}`}>
                    <div
                      className={`px-3 py-2 rounded-lg text-sm ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      {message.isStreaming && (
                        <div className="flex items-center gap-1 mt-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span className="text-xs opacity-70">AI is typing...</span>
                        </div>
                      )}
                    </div>
                    {message.role === 'ai' && !message.isStreaming && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1 h-6 px-2 text-xs"
                        onClick={() => handleCopyMessage(message.content)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1 order-1">
                      <User className="h-3 w-3 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && messages.length > 0 && (
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Loader2 className="h-3 w-3 text-primary-foreground animate-spin" />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">AI is analyzing...</div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about remediation..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setInputValue('Generate a code patch')}
                disabled={isTyping}
              >
                <GitPullRequest className="h-3 w-3 mr-1" />
                Generate Patch
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setInputValue('Create pull request')}
                disabled={isTyping}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Create PR
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}