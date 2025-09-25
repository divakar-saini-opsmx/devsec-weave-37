import { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, Github, Plus, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useHub } from '@/contexts/HubContext';
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useAuth } from "@/components/auth/AuthContext";
import { Hub } from "@/contexts/HubContext";

const HubSetup = () => {

  const baseUrl = window.REACT_APP_CONFIG.API_BASE_URL || "";
  const getHub = window.REACT_APP_CONFIG.API_ENDPOINTS.GET_HUB || "";
  const createHub = window.REACT_APP_CONFIG.API_ENDPOINTS.CREATE_HUB || "";
  const navigate = useNavigate();
  const { toast } = useToast();  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [hubCreated, setHubCreated] = useState(false); 
  const { user, isAuthenticated } = useAuth();
  const { activeHub, hubs, setActiveHub ,setHubs} = useHub();

  const handleCreateHub1 = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Hub name required",
        description: "Please provide a name for your hub.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    // Simulate hub creation
    setTimeout(() => {

     

      // const hubData = {
      //   id: Date.now().toString(),
      //   ...formData,
      //   createdAt: new Date().toISOString(),
      //   githubConnected
      // };

      // // Store hub data
      // const existingHubs = JSON.parse(localStorage.getItem('hubs') || '[]');
      // existingHubs.push(hubData);
      // localStorage.setItem('hubs', JSON.stringify(existingHubs));
      
      setIsCreating(false);
      setHubCreated(true); // ✅ Show GitHub Integration after hub is created
      toast({
        title: "Hub created successfully!",
        description: `${formData.name} is ready for secure development.`
      });
      
      //navigate('/dashboard');
    }, 1000);
  };

    const getHubList = async () => {    
  
      try {
        const res = await fetchWithAuth(`${baseUrl}${getHub}?email=${user?.username}`);
        const data = await res.json();
        
        if(data.data.length > 0){
          navigate('/repositories');
        }        
      
      } catch (err) {
        toast({
          title: "Failed to load Hub List"        
        });
      }
      
    }
  
    useEffect(() => {
      getHubList();
    }, []);

  const handleCreateHub = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Hub name required",
        description: "Please provide a name for your hub.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
   
    try {
          const postJson = {
            "name": formData.name,
            "tag": formData.description,
            "email": user?.username
          };
         
          //const res = await fetch(`http://127.0.0.1:5000/conversation`, {      
          const res = await fetchWithAuth(`${baseUrl}${createHub}`, { 
            method: "POST",
            // headers: {
            //   "Content-Type": "application/json",           
            // },
            // credentials: 'include',
            body: JSON.stringify(postJson),            
          });    
          
          if (!res.ok) throw new Error("Something went wrong");
  
          const result = await res.json();
          console.log("Response from server:", result);

          const hubData = result.data;

          const newHub: Hub = {
            id: hubData.id,
            name: hubData.name,
            email: hubData.email,
            roles: hubData.roles ?? null,          // API doesn’t send, so fallback
            labels: hubData.labels ?? [],          // default empty array
            applications: hubData.applications ?? null,
            description: hubData.tag ?? "",        // your API used "tag" at creation
            status: "active",                      // new hub becomes active
            createdAt: new Date().toISOString(),   // fallback to "now"
          };

          setHubs((prev) => {
            const updated = prev.map(h => ({ ...h, status: "inactive" as "inactive" }));
            return [...updated, newHub];
          });
          setActiveHub(newHub);
      
          toast({
            title: "Hub created successfully!",
            description: `${formData.name} is ready for secure development.`
          });
          setHubCreated(true);
          
      }
      catch (e) {
        console.error("Failed Hub Creation", e);
        toast({
          title: "Hub creation failed!",
          description: `${e}`
        });
      } finally {
        setIsCreating(false);
      }

  };

  const handleGithubConnect = () => {
    // Simulate GitHub app connection
    setTimeout(() => {
      setGithubConnected(true);
      localStorage.setItem('githubConnected', 'true');
      toast({
        title: "GitHub connected!",
        description: "Your repositories are now ready for automated security scans."
      });
      navigate('/scan-config');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        {/* <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="p-3 bg-gradient-primary rounded-2xl shadow-glow">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Create Your Security Hub</h1>
            <p className="text-muted-foreground">
              Set up a centralized workspace for your repositories and security workflows
            </p>
          </div>
        </div> */}

        {/* Hub Creation Form */}
        {!hubCreated && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Hub Configuration
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="ml-1 text-muted-foreground hover:text-foreground">
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-sm">
                    <p>
                      A Hub is your centralized workspace for managing repositories and security workflows.
                      <br />
                      Give it a clear name and optional description to easily identify its purpose.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            {/* <CardDescription>
              Define your hub settings to get started with automated security scanning
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateHub} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Hub Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Main Project Hub, Frontend Security"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12"
                />
              </div>
             
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this hub's purpose and scope..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                disabled={isCreating}
                className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-smooth shadow-glow"
              >
                {/* {isCreating ? 'Creating Hub...' : 'Create Security Hub'} */}
                Create Security Hub
              </Button>
            </form>
          </CardContent>
        </Card>
        )}

        {/* GitHub Integration - Only after hub created */}
        {hubCreated && ( 
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              GitHub Integration
            </CardTitle>
            {/* <CardDescription>
              Connect your GitHub repositories to enable automated security scanning
            </CardDescription> */}
          </CardHeader>
          <CardContent className="space-y-4">
            {githubConnected ? (
              <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                <CheckCircle className="h-5 w-5 text-secondary" />
                <div className="flex-1">
                  <p className="font-medium">GitHub App Connected</p>
                  <p className="text-sm text-muted-foreground">
                    Your repositories are ready for automated scans
                  </p>
                </div>
                <Badge variant="secondary">Connected</Badge>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    onClick={handleGithubConnect}
                    variant="outline"
                    className="flex-1 h-12 hover:shadow-md transition-smooth"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    Connect GitHub App
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/scan-config')}
                    variant="ghost"
                    className="flex-1 h-12"
                  >
                    Skip for Now
                  </Button>
                </div>
                
                {/* <div className="text-sm text-muted-foreground space-y-2">
                  <p className="font-medium">Why connect GitHub?</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Automated SAST & SCA vulnerability scanning</li>
                    <li>• AI-powered security patches in pull requests</li>
                    <li>• Real-time security feedback for developers</li>
                  </ul>
                </div> */}
              </div>
            )}
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
};

export default HubSetup;