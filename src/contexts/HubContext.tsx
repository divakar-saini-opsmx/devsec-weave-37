import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  const setActiveHub = (hub: Hub) => {
    setActiveHubState(hub);
  };

 

  return (
    <HubContext.Provider value={{ activeHub, hubs, setActiveHub, setHubs}}>
      {children}
    </HubContext.Provider>
  );
};