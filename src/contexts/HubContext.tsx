import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Hub {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  repositoryCount: number;
  createdAt: string;
}

interface HubContextType {
  activeHub: Hub | null;
  hubs: Hub[];
  setActiveHub: (hub: Hub) => void;
  addHub: (hub: Omit<Hub, 'id' | 'createdAt'>) => void;
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

  // Initialize with demo data and load from localStorage
  useEffect(() => {
    const storedHubs = localStorage.getItem('devSecOps-hubs');
    const storedActiveHub = localStorage.getItem('devSecOps-activeHub');

    if (storedHubs) {
      const parsedHubs = JSON.parse(storedHubs);
      setHubs(parsedHubs);

      if (storedActiveHub) {
        const parsedActiveHub = JSON.parse(storedActiveHub);
        const hubExists = parsedHubs.find((h: Hub) => h.id === parsedActiveHub.id);
        if (hubExists) {
          setActiveHubState(parsedActiveHub);
        } else if (parsedHubs.length > 0) {
          setActiveHubState(parsedHubs[0]);
        }
      } else if (parsedHubs.length > 0) {
        setActiveHubState(parsedHubs[0]);
      }
    } else {
      // Initialize with default hub
      const defaultHub: Hub = {
        id: 'main-hub',
        name: 'Main Project Hub',
        description: 'Primary development hub',
        status: 'active',
        repositoryCount: 3,
        createdAt: new Date().toISOString(),
      };
      setHubs([defaultHub]);
      setActiveHubState(defaultHub);
    }
  }, []);

  // Persist hubs and active hub to localStorage
  useEffect(() => {
    if (hubs.length > 0) {
      localStorage.setItem('devSecOps-hubs', JSON.stringify(hubs));
    }
  }, [hubs]);

  useEffect(() => {
    if (activeHub) {
      localStorage.setItem('devSecOps-activeHub', JSON.stringify(activeHub));
    }
  }, [activeHub]);

  const setActiveHub = (hub: Hub) => {
    setActiveHubState(hub);
  };

  const addHub = (hubData: Omit<Hub, 'id' | 'createdAt'>) => {
    const newHub: Hub = {
      ...hubData,
      id: `hub-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setHubs(prev => [...prev, newHub]);
    setActiveHub(newHub);
  };

  return (
    <HubContext.Provider value={{ activeHub, hubs, setActiveHub, addHub }}>
      {children}
    </HubContext.Provider>
  );
};