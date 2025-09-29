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
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Finding {
  id:string;  
  scanId: string;
  organization : string;
  platform : string;
  repository : string;
  branch : string;
  rule_name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  rule_message : string;
  metadata:{
    file_path: string;
    line: number;
  }
  
}

export interface ExecutionMessageValue {
  message: string;
}

export interface ExecutionMessages {
  value: ExecutionMessageValue;
}

export interface CSPMExecutionResponse {
  __interrupt__: ExecutionMessages;
}


interface ChatMessage {
  id: string;
  type: 'system' | 'user';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  customType?: 'diff' | 'normal';
}

interface RemediationChatSCAProps {
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

export function RemediationChatSCA({ finding, isOpen, onClose }: RemediationChatSCAProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const baseUrl = window.REACT_APP_CONFIG.API_BASE_URL || "";
  const SASTRemediationUrl = window.REACT_APP_CONFIG.API_ENDPOINTS.SAST_REMEDIATION || "";
  const [executeMessages, setExecuteMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [fixMessage, setFixMessage] = useState("");
  const { toast } = useToast(); 

  console.log("Remediate SCA Finding:", finding);  

const simulateStreamingExecution = async (content: string, messageId: string) => {
  // setIsStreaming(true);
   const words = content.split(' ');
   let currentContent = '';
   
   for (let i = 0; i < words.length; i++) {
     currentContent += (i > 0 ? ' ' : '') + words[i];
     
     setExecuteMessages(prev => 
       prev.map(msg => 
         msg.id === messageId 
           ? { ...msg,content: currentContent, isStreaming: true }
           : msg
       )
     );
     
     // Add slight delay to simulate typing
     await new Promise(resolve => setTimeout(resolve, 50));
   }
  
   
   // Mark streaming as complete
   setExecuteMessages(prev => 
     prev.map(msg => 
       msg.id === messageId 
         ? { ...msg, isStreaming: false }
         : msg
     )
   );
   
   //setIsStreaming(false);
 };

 
  const handleGenerateCodeFix = async (type) => {

    if(type === 'generate'){
      setExecuteMessages([]);
    }

    if (!finding) return;
    //setIsLoading(true);
    //setCurrentPhase('execution');
    console.log("Fix Type -handleGenerateCodeFix -", type);

    try {
          const postJson = {
            "scan_result_id" : finding.scanId,
            "platform": finding.platform,
            "organization": finding.organization,
            "repository": finding.repository,
            "branch": finding.branch,
            "rule_message": finding.rule_message,
            "rule": finding.rule_name,
            "file_path": finding.metadata.file_path,
            "line_no": finding.metadata.line
          }; 
          const res = await fetchWithAuth(`${baseUrl}${SASTRemediationUrl}?action=${type}`, {        
            method: "POST",           
            body: JSON.stringify(postJson)           
          });    
          
          if (!res.body) {
            throw new Error("ReadableStream not supported or empty response.");
          }
      
          const reader = res.body?.getReader();
          const decoder = new TextDecoder("utf-8");
      
          let partial = "";
      
          while (true) {
            const { value, done } = await reader.read();
      
            if (done) break;
      
            const chunk = decoder.decode(value, { stream: true });
            partial += chunk;  
            
            // Split stream by newlines or `data:` events (depends on backend format)
            //const messages = partial.split("\n");


            let lines = partial.split("\n");

            // If the last line is incomplete, keep it in `partial` for next chunk
            partial = lines.pop() || ""; 
      
            for (let msg of lines) {
              msg = msg.trim();
              if (!msg) continue;
      
              if (msg.startsWith("data:")) {
                const jsonPart = msg.replace("data:", "").trim(); 
                const parsed = JSON.parse(jsonPart);  

                //const aiRespContent = formatCSPMExecuteAsMessage(parsed);
                const aiRespId = `system-${Date.now()}`
                
                const aiResponse: ChatMessage = {
                  id: aiRespId,
                  type: 'system',
                  content: '',
                  timestamp: new Date(),
                  isStreaming: true,
                  customType: parsed.type === 'diff' ? 'diff' : 'normal'
                };                  
                setExecuteMessages(prev => [...prev, aiResponse]);
                setIsStreaming(true);
                let latestFixMessage = fixMessage;
                switch(parsed.type) {
                  case 'content':                    
                    latestFixMessage = `${parsed.content}\n\n`
                    break;
                  // case 'system':                
                  //   //setFixMessage((prev) => prev +`${parsed.subtype} + "\n\n"+ ${parsed.data}` );
                  //   latestFixMessage = `${parsed.subtype}\n\n${parsed.data}`;
                  //   break;
                  case 'debug':                    
                    latestFixMessage = `${parsed.data}\n\n`;
                    break;
                  case 'error':                   
                    latestFixMessage = `${parsed.error}\n\n`;
                    break;
                  case 'diff':                   
                     latestFixMessage = `${parsed.content}\n\n`;
                     break;
                  case 'done':                   
                    latestFixMessage = `The Code Agent has finished processing the task\n\n`;
                    setIsStreaming(false);
                    break;
                  default:                    
                    console.warn("Unknown message type:", parsed.type);
                }
               
               await simulateStreamingExecution(latestFixMessage, aiRespId);               
              }
            }
          }
         
      }
      catch (e) {
       // toast.error("Failed to execute.");
      } finally {
        //setIsLoading(false);
      }
    
  }

  useEffect(() => {
    if(finding){
      handleGenerateCodeFix('generate');
    }   
  },[finding]);

  const handleApprove = () => {
    console.log("Approved diff:");    
    toast({
      title: "Continuing to approve the fix..."        
    });
    handleGenerateCodeFix('approve');
  };

  const handleReject = async () => {   
    console.log("Rejected diff:");
    toast({
      title: "Continuing to reject the fix..."        
    });   
    try{
      const postJson = {
        "scan_result_id" : finding.scanId,
        "platform": finding.platform,
        "organization": finding.organization,
        "repository": finding.repository,
        "branch": finding.branch,
        "rule_message": finding.rule_message,
        "rule": finding.rule_name,
        "file_path": finding.metadata.file_path,
        "line_no": finding.metadata.line
      }; 
      const res = await fetchWithAuth(`${baseUrl}${SASTRemediationUrl}?action=reject`, {        
        method: "POST",        
        body: JSON.stringify(postJson),            
      }); 
      if (!res.ok) throw new Error("Something went wrong");
  
      const result = await res.json();
      console.log("Response from server:", result);  
    }catch (error) {
      console.error("Error rejecting fix:", error);
      toast({
        title: "Failed to reject the fix..."        
      });
    }finally {
      //setIsLoading(false);
    }
    
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
                  {'ruleName' in finding ? finding.rule_name : finding.metadata.file_path }
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
              {executeMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'system' && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                    <div
                      className={`px-3 py-2 rounded-lg text-sm ${
                        message.type === 'user'
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
                    {message.type === 'system' && !message.isStreaming && message.customType === 'diff' &&(
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={handleApprove}
                          className="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={handleReject}
                          className="px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>                      
                    )}
                    
                    {/* {message.type === 'system' && !message.isStreaming && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1 h-6 px-2 text-xs"
                        onClick={() => handleCopyMessage(message.content)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    )} */}
                  </div>
                  {message.type === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1 order-1">
                      <User className="h-3 w-3 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && executeMessages.length > 0 && (
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
            {/* <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about remediation..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerateCodeFix(('generate'));
                  }
                }}
                disabled={isTyping}
              />
              <Button
                onClick={handleGenerateCodeFix}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div> */}
            
            {/* Quick Actions */}
            {/* <div className="flex gap-2 mt-2">
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
            </div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Simulate AI responses based on finding type
//   const getInitialAIResponse = (finding: Finding) => {
//     const isSastFinding = 'ruleName' in finding;
    
//     if (isSastFinding) {
//       return `I've analyzed the ${finding.ruleName} vulnerability in ${finding.filePath}. Here's what I found:

// **Issue**: ${finding.ruleName} - ${finding.confidence} confidence

// **Recommended Fix**:
// 1. Implement input validation and sanitization
// 2. Use parameterized queries instead of string concatenation
// 3. Apply proper encoding/escaping for user inputs

// Would you like me to generate a code patch for this specific issue?`;
//     } else {
//       return `I've reviewed the vulnerability in **${finding.packageName}**. Here's my analysis:

// **Issue**: ${finding.packageName} - ${finding.confidence} confidence

// **Recommended Action**:
// • Upgrade from current version to the latest secure version
// • This will patch the known vulnerability: ${finding.vulnerability}

// **Next Steps**:
// 1. I can generate the exact upgrade command
// 2. Create a pull request with the dependency update
// 3. Include testing recommendations

// What would you like me to help you with first?`;
//     }
//   };

//   useEffect(() => {
//     if (finding && isOpen) {
//       // Initialize chat with AI analysis
//       const initialMessage: ChatMessage = {
//         id: '1',
//         role: 'ai',
//         content: '',
//         timestamp: new Date(),
//         isStreaming: true
//       };

//       setMessages([initialMessage]);
//       setIsTyping(true);


//       console.log("REmediation Chat", finding);

//       // Simulate streaming response
//       const fullResponse = getInitialAIResponse(finding);
//       let currentText = '';
//       let charIndex = 0;

//       const streamInterval = setInterval(() => {
//         if (charIndex < fullResponse.length) {
//           currentText += fullResponse[charIndex];
//           setMessages([{
//             ...initialMessage,
//             content: currentText,
//             isStreaming: charIndex < fullResponse.length - 1
//           }]);
//           charIndex++;
//         } else {
//           clearInterval(streamInterval);
//           setIsTyping(false);
//           setMessages([{
//             ...initialMessage,
//             content: fullResponse,
//             isStreaming: false
//           }]);
//         }
//       }, 30);

//       return () => clearInterval(streamInterval);
//     } else if (!isOpen) {
//       // Reset chat when closed
//       setMessages([]);
//       setInputValue('');
//       setIsTyping(false);
//     }
//   }, [finding, isOpen]);

//   const handleSendMessage = () => {
//     if (!inputValue.trim() || isTyping) return;

//     const userMessage: ChatMessage = {
//       id: `user-${Date.now()}`,
//       role: 'user',
//       content: inputValue.trim(),
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputValue('');
//     setIsTyping(true);

//     // Simulate AI response
//     setTimeout(() => {
//       const aiResponse: ChatMessage = {
//         id: `ai-${Date.now()}`,
//         role: 'ai',
//         content: generateAIResponse(inputValue.trim()),
//         timestamp: new Date(),
//         isStreaming: true
//       };

//       setMessages(prev => [...prev, aiResponse]);
      
//       // Simulate streaming
//       setTimeout(() => {
//         setMessages(prev => prev.map(msg => 
//           msg.id === aiResponse.id 
//             ? { ...msg, isStreaming: false }
//             : msg
//         ));
//         setIsTyping(false);
//       }, 1500);
//     }, 500);
//   };

//   const generateAIResponse = (userInput: string) => {
//     const input = userInput.toLowerCase();
    
//     if (input.includes('patch') || input.includes('code')) {
//       return `Here's a code patch for this vulnerability:

// \`\`\`typescript
// // Before (vulnerable)
// const query = \`SELECT * FROM users WHERE id = \${userId}\`;

// // After (secure)
// const query = 'SELECT * FROM users WHERE id = ?';
// const result = await db.query(query, [userId]);
// \`\`\`

// This change:
// • Uses parameterized queries to prevent SQL injection
// • Properly escapes user input
// • Maintains the same functionality

// Would you like me to create a pull request with this fix?`;
//     }
    
//     if (input.includes('pull request') || input.includes('pr')) {
//       return `Perfect! I'll create a pull request with the security fix. The PR will include:

// ✅ **Security patch implementation**
// ✅ **Updated tests to verify the fix**
// ✅ **Security review checklist**
// ✅ **Documentation updates**

// **PR Title**: "Security: Fix SQL injection vulnerability in user queries"

// **Changes**:
// • \`src/api/users.ts\` - Implement parameterized queries
// • \`tests/security.test.ts\` - Add security regression tests

// Ready to create the PR? I'll also include a detailed security analysis in the description.`;
//     }

//     if (input.includes('test') || input.includes('verify')) {
//       return `Great question! Here's how to test this security fix:

// **1. Unit Tests**
// \`\`\`bash
// npm test -- security.test.ts
// \`\`\`

// **2. Security Regression Test**
// • Test with malicious input: \`'; DROP TABLE users; --\`
// • Verify it's properly escaped
// • Check database logs for any suspicious queries

// **3. Integration Testing**
// • Test all affected API endpoints
// • Verify normal functionality still works
// • Run end-to-end security tests

// Would you like me to generate the specific test cases for this vulnerability?`;
//     }

//     return `I understand you're asking about "${userInput}". Let me help you with that specific aspect of the remediation.

// Based on this ${finding?.severity} severity issue, I recommend focusing on:
// • Immediate security impact mitigation
// • Proper testing procedures
// • Long-term prevention strategies

// What specific aspect would you like me to elaborate on?`;
//   };
