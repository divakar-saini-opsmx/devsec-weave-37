import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from "@/components/auth/AuthContext";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useToast } from '@/hooks/use-toast';

interface HubLabel {
  name: string;
  value: string;
}

export interface Hub {
  id: string;
  name: string;
  email: string;
  roles: string[] | null;
  labels: HubLabel[];
  applications: string[] | null;
  description?: string;
  status: "active" | "inactive"; // managed by frontend
  createdAt: string;
}

interface HubContextType {
  activeHub: Hub | null;
  hubs: Hub[];
  setActiveHub: (hub: Hub) => void;  
  //setHubs: (hubs: Hub[]) => void;
  setHubs: React.Dispatch<React.SetStateAction<Hub[]>>;
  loading: boolean;
  onboarding: boolean;
  setOnboarding: (v: boolean) => void;
}


const HubContext = createContext<HubContextType | undefined>(undefined);

export const useHub = () => {
  const context = useContext(HubContext);
  if (!context) {
    throw new Error('useHub must be used within a HubProvider');
  }
  return context;
};

interface HubProviderProps {
  children: ReactNode;
}

export const HubProvider: React.FC<HubProviderProps> = ({ children }) => {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [activeHub, setActiveHubState] = useState<Hub | null>(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = window.REACT_APP_CONFIG.API_BASE_URL || "";
  const getHub = window.REACT_APP_CONFIG.API_ENDPOINTS.GET_HUB || "";
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [onboarding, setOnboarding] = useState<boolean>(
    () => sessionStorage.getItem("onboarding") === "1"
  );

  const setActiveHub = (hub: Hub) => {
    setActiveHubState(hub);
    localStorage.setItem('activeHub', JSON.stringify(hub));
  };

  const setOnboardingWrapped = (v: boolean) => {
       setOnboarding(v);
       if (v) sessionStorage.setItem("onboarding", "1");
       else sessionStorage.removeItem("onboarding");
    };

  // Normalize API -> Hub
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
  
   
    useEffect(() => {
      const getHubList = async () => {
       if (!isAuthenticated || !user?.username) {
             setLoading(false);
             return;
           }   
   
       try {
         const res = await fetchWithAuth(`${baseUrl}${getHub}?email=${user?.username}`);
         //email=${encodeURIComponent(user.username)}
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
            const parsedHub : Hub = JSON.parse(activeHubFromStorage);
            const match = normalized.find(h => h.id === parsedHub.id);
            if (match) {
                setActiveHubState(match);
            } else if (normalized[0]) {
                setActiveHub(normalized[0]);
            }
          } else if (normalized[0]) {
              setActiveHub(normalized[0]);
          }          
       
       } catch (err) {
         toast({
           title: "Failed to load Hub List"        
         });
       }finally {
            setLoading(false);
      }    
     };
     getHubList();
       // run when auth/user changes
     }, [isAuthenticated, user?.username]);

 

  return (
    <HubContext.Provider value={{ activeHub, hubs, setActiveHub, setHubs,loading, onboarding, setOnboarding: setOnboardingWrapped}}>
      {children}
    </HubContext.Provider>
  );
};

