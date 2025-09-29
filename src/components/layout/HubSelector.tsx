import React, { useState ,useEffect, act} from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, Plus, Circle } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useHub } from '@/contexts/HubContext';
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from "@/components/auth/AuthContext";
import { Hub } from "@/contexts/HubContext";
import { set } from 'date-fns';

interface HubSelectorProps {
  isCollapsed: boolean;
}



export const HubSelector: React.FC<HubSelectorProps> = ({ isCollapsed }) => {
  const { activeHub, hubs, setActiveHub ,setHubs} = useHub();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const baseUrl = window.REACT_APP_CONFIG.API_BASE_URL || "";
  const getHub = window.REACT_APP_CONFIG.API_ENDPOINTS.GET_HUB || "";
  const { user, isAuthenticated } = useAuth();

  const normalizeHubs = (apiData: any[]): Hub[] => {
    return apiData.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      roles: item.roles ?? null,
      labels: item.labels ?? [],
      applications: item.applications ?? null,
      description: "", // default
      status: "inactive", // default until user picks
      createdAt: new Date().toISOString(),
    }));
  };

  
  const handleHubSelect = (hub: typeof activeHub) => {
    if (hub) {
      setActiveHub(hub);
      setIsOpen(false);
    }
  };

  const getHubList = async () => {    

    try {
      const res = await fetchWithAuth(`${baseUrl}${getHub}?email=${user?.username}`);
      const data = await res.json();

      console.log("Hub List:", data);

       // Normalize & store in context
       const normalized = normalizeHubs(data.data || []);
       setHubs(normalized);
 
       // pick first hub as active by default if none
      //  if (normalized.length > 0 && !activeHub) {
      //    setActiveHub({ ...normalized[normalized.length -1 ], status: "active" });
      //  }   
       const activeHubFromStorage = localStorage.getItem('activeHub');
       if (activeHubFromStorage) {
         const parsedHub = JSON.parse(activeHubFromStorage);
         setActiveHub(parsedHub);
       }
       
    
    } catch (err) {
      toast({
        title: "Failed to load Hub List"        
      });
    }
    
  }

  useEffect(() => {
   // getHubList();
  }, []);

  const handleAddHub = () => {
    navigate('/hub-setup');
    setIsOpen(false);
  };

  if (!activeHub) return null;

  return (
    <div className="p-4 border-t border-sidebar-border">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between h-auto p-3 bg-sidebar-accent/50 hover:bg-sidebar-accent transition-smooth"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="p-1.5 bg-gradient-primary rounded-md shadow-glow flex-shrink-0">
                <Circle className="h-3 w-3 text-white fill-white" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-xs font-medium text-sidebar-foreground/70">Active Hub</p>
                  <p className="text-sm font-semibold text-sidebar-foreground truncate">
                    {activeHub.name}
                  </p>                  
                </div>
              )}
            </div>
            {!isCollapsed && (
              <ChevronUp className={`h-4 w-4 text-sidebar-foreground/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-64 p-2 bg-sidebar border-sidebar-border" 
          side="top" 
          align="start"
          sideOffset={8}
        >
          <div className="space-y-1">            
            
            {hubs.map((hub) => (
              <Button
                key={hub.id}
                variant="ghost"
                className={`w-full justify-start h-auto p-3 ${
                  activeHub.id === hub.id 
                    ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                    : 'hover:bg-sidebar-accent text-sidebar-foreground'
                }`}
                onClick={() => handleHubSelect(hub)}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`p-1 rounded-full ${
                    hub.status === 'active' ? 'bg-success' : 'bg-muted-foreground'
                  }`}>
                    <Circle className="h-2 w-2 text-white fill-white" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{hub.name}</p>
                      {activeHub.id === hub.id && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                          Active
                        </Badge>
                      )}
                    </div>                   
                  </div>
                </div>
              </Button>
            ))}
            
            <Separator className="my-2" />
            
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-3 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleAddHub}
            >
              <Plus className="h-4 w-4 mr-3" />
              <span className="text-sm font-medium">Add Hub</span>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};