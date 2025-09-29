import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, GitBranch } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useHub } from "@/contexts/HubContext";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useToast } from '@/hooks/use-toast';
import { set } from 'date-fns';

interface AddRepositoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: FormData) => void;
}

interface FormData {
  name: string;
  integration: string;
  type: 'user' | 'organisation' | '';
  userOrOrganization: string;
  repository: string;
  branch: string;
  autoScan: boolean;
  prChecks: boolean;
}

// 1. Full object as it comes from API (for typing the response)
interface IntegratorApiResponse {
  id: string;
  name: string;
  integratorType: string;
  category: string;
  status: string;
  authType: string;
  url: string;
  team: string[];
  environments: any[];
  featureConfigs: any;
  integratorConfigs: any;
}

// 2. UI-specific type (only the fields you show in UI)
interface IntegratorUI {
  id: string;
  name: string;
  url: string;
}

type AccountOption = { id: string; name: string };


const mockBranches = [
  'main',
  'develop',
  'feature/security-updates',
  'release/v2.0'
];

export function AddRepositoryDialog({ 
  open, 
  onOpenChange, 
  onSave 
}: AddRepositoryDialogProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [availableRepositories, setAvailableRepositories] = useState<string[]>([]);
  
  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      integration: '',
      type: '',
      userOrOrganization: '',
      repository: '',
      branch: 'main',
      autoScan: true,
      prChecks: true,
    },
  });

  const watchType = form.watch('type');
  const watchIntegration = form.watch('integration');
  const watchUserOrOrganization = form.watch('userOrOrganization');
  const { activeHub } = useHub();
  const { toast } = useToast(); 
  const baseUrl = window.REACT_APP_CONFIG.API_BASE_URL || "";
  const getRepository = window.REACT_APP_CONFIG.API_ENDPOINTS.GET_REPOSITORY || "";
  const getIntegrator = window.REACT_APP_CONFIG.API_ENDPOINTS.GET_INTEGRATIONS || "";
  const getRepoUserOrg = window.REACT_APP_CONFIG.API_ENDPOINTS.GET_REPO_USER_ORG || "";
  const [integratorByHub, setIntegratorByHub] = useState<IntegratorUI[]>([]);
  const [accountOptions, setAccountOptions] = useState<AccountOption[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(false);
  
    const getIntegratorByHubList = async () => {    
  
      try {
        const res = await fetchWithAuth(`${baseUrl}${getIntegrator}?teamIds=${activeHub?.id}`);
        const data = await res.json();        
        console.log("getIntegratorByHubList :", data); 
        const uiData: IntegratorUI[] = data?.data.map(item => ({
          id: item.id,
          name: item.name,
          url: item.url
        }));
        setIntegratorByHub(uiData || []);
      
      } catch (err) {     
        toast({
          title: "Failed to load Integrator By Hub  List"        
        });
      }
      
    }
  
    useEffect(() => {
      getIntegratorByHubList();
    }, []);
  

  // Update available repositories when user/organization changes
  // useEffect(() => {
  //   if (watchUserOrOrganization) {
  //     const repos = mockRepositoriesByAccount[watchUserOrOrganization as keyof typeof mockRepositoriesByAccount] || [];
  //     setAvailableRepositories(repos);
  //     form.setValue('repository', ''); // Reset repository selection
  //   }
  // }, [watchUserOrOrganization, form]);

  useEffect(() => {
    const account = form.watch('userOrOrganization');
    const integrationId = form.watch('integration');
    if (!account || !integrationId) {
      setAvailableRepositories([]);
      form.setValue('repository', '');
      return;
    }
  
    const ac = new AbortController();
    const loadRepos = async () => {
      try {
        setLoadingRepos(true);
        const url = `${baseUrl}${getRepoUserOrg}?platform=github&accountId=${encodeURIComponent(
          watchIntegration
        )}&type=${encodeURIComponent(watchType)}&orgName=${account}&scanLevel=repository`;
        
        const res = await fetchWithAuth(url, { signal: ac.signal });
        if (!res.ok) throw new Error('Failed to load repositories');
  
        const json = await res.json();       
        setAvailableRepositories(json?.data);
        form.setValue('repository', '');
      } catch (e) {
        if ((e as any).name !== 'AbortError') {
          toast({ title: 'Failed to load repositories' });
        }
        setAvailableRepositories([]);
      } finally {
        setLoadingRepos(false);
      }
    };
  
    loadRepos();
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchUserOrOrganization, watchIntegration]);

  // // Reset dependent fields when type changes
  // useEffect(() => {
  //   if (watchType) {
  //     form.setValue('userOrOrganization', '');
  //     form.setValue('repository', '');
  //     setAvailableRepositories([]);
  //   }
  // }, [watchType, form]);

  useEffect(() => {
    // Reset dependent fields on change
    form.setValue('userOrOrganization', '');
    form.setValue('repository', '');
    setAvailableRepositories([]);
    setAccountOptions([]);
  
    if (!watchType || !watchIntegration) return;
  
    const ac = new AbortController();
    const load = async () => {
      try {
        setLoadingAccounts(true);
      
        const url = `${baseUrl}${getRepoUserOrg}?platform=github&accountId=${encodeURIComponent(
          watchIntegration
        )}&type=${encodeURIComponent(watchType)}`;
  
        const res = await fetchWithAuth(url, { signal: ac.signal });
        if (!res.ok) throw new Error('Failed to load accounts');
  
        const json = await res.json();
  
        // Normalize to {id, name}
        const opts: AccountOption[] = (json?.data || []).map((x: string) => ({
          id: x,
          name: x,
        }));
  
        setAccountOptions(opts);
      } catch (e) {         
        if ((e as any).name !== 'AbortError') {
          toast({ title: 'Failed to load accounts' });
        }
      } finally {
        setLoadingAccounts(false);
      }
    };
  
    load();
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchType, watchIntegration]);


  const handleSubmit = (data: FormData) => {
    onSave(data);
    form.reset();
    onOpenChange(false);
    setIsAdvancedOpen(false);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
    setIsAdvancedOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Add New Project
          </DialogTitle>
          {/* <DialogDescription>
            Connect a repository from your chosen integration to start security scanning.
          </DialogDescription> */}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Repository Name */}
            <FormField
              control={form.control}
              name="name"
              rules={{ required: 'Repository name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter repository name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Integration Selection */}
            <FormField
              control={form.control}
              name="integration"
              rules={{ required: 'Please select an integration' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Integration</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select integration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {integratorByHub.map((integration) => (
                        <SelectItem key={integration.id} value={integration.id}>
                          {integration.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type Selection */}
            <FormField
              control={form.control}
              name="type"
              rules={{ required: 'Please select a type' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="organisation">Organisation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* User/Organization Selection */}
            {watchType && (
              <FormField
                control={form.control}
                name="userOrOrganization"
                rules={{ required: `Please select a ${watchType}` }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {watchType === 'user' ? 'Select User' : 'Select Organisation'}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={loadingAccounts || accountOptions.length === 0}>
                      <FormControl>
                        <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loadingAccounts
                              ? `Loading ${watchType}s...`
                              : accountOptions.length
                                ? `Choose ${watchType}`
                                : `No ${watchType}s found`
                          }
                        />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accountOptions.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                        {/* {(watchType === 'user' ? mockUsers : mockOrganizations).map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))} */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Repository Selection */}
            {watchUserOrOrganization && availableRepositories.length > 0 && (
              <FormField
                control={form.control}
                name="repository"
                rules={{ required: 'Please select a repository' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repository</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a repository" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableRepositories.map((repo) => (
                          <SelectItem key={repo} value={repo}>
                            {repo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Branch Selection */}
            {/* {form.watch('repository') && (
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockBranches.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )} */}

            {/* <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 p-0 h-auto font-medium"
                  type="button"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                  Advanced Options
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="autoScan"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium">
                          Auto scan on new commits
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Automatically trigger security scans when new commits are pushed
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prChecks"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium">
                          Enable PR checks
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Run security checks on pull requests and block merging if critical issues are found
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible> */}

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Save Project</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}