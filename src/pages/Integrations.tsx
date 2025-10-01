import React, { useState ,useEffect} from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, GitBranch, Settings,Loader2 } from 'lucide-react';
import { AddIntegrationDialog } from '@/components/integrations/AddIntegrationDialog';
import { useHub } from "@/contexts/HubContext";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  type: 'GitHub' ;
  name: string;
  status: 'active' | 'connected' | 'disconnected';
  url: string;
}

const getStatusBadgeVariant = (status: Integration['status']) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'connected':
      return 'secondary';
    case 'disconnected':
      return 'destructive';
    default:
      return 'outline';
  }
};

const Integrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const baseUrl = window.REACT_APP_CONFIG.API_BASE_URL || "";
  const getIntegrations = window.REACT_APP_CONFIG.API_ENDPOINTS.GET_INTEGRATIONS || "";
  const { activeHub } = useHub();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true); 

  const getIntegrationList = async () => {    

    try {
      setLoading(true);
      const res = await fetchWithAuth(`${baseUrl}${getIntegrations}?teamIds=${activeHub?.id}`);
      const data = await res.json();
      console.log("Integrations List:", data);
      setIntegrations(data?.data);    
    } catch (err) {     
      toast({
        title: "Failed to load Integrations List"        
      });
    }finally{
      setLoading(false); // stop loader in both success/fail
    }    
  }
  
    useEffect(() => {
      getIntegrationList();
    }, []);


  const handleSaveIntegration = (data: { type: 'GitHub'; name: string }) => {
    // const newIntegration: Integration = {
    //   id: Date.now().toString(),
    //   type: data.type,
    //   name: data.name,
    //   status: 'connected'
    // };
    // setIntegrations([...integrations, newIntegration]);
    setIsDialogOpen(false);
    getIntegrationList(); // refresh after saving new integration
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          {/* <p className="text-muted-foreground">
            Manage your repository integrations
          </p> */}
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>

      {loading ? (
         <Card>
         <CardContent className="flex flex-col items-center justify-center py-16">
           <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
           <p className="text-muted-foreground">Loading integrations...</p>
         </CardContent>
       </Card>
      ) : integrations.length === 0 ?(
        <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No integrations yet</h3>
          <p className="text-muted-foreground mb-4 text-center">
            Create your first integration to connect with external repositories
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Integration
          </Button>
        </CardContent>
      </Card>
      ) :(
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Integrations ({integrations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {integrations.map((integration) => (
                  <TableRow key={integration.id}>
                    <TableCell>
                      <span className="font-medium">{integration.name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{integration.url}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(integration.status)}>
                        {integration.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}


      <AddIntegrationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveIntegration}
      />
    </div>
  );
};

export default Integrations;