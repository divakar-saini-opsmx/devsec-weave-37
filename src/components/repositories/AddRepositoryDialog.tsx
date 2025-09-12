import { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, GitBranch } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface AddRepositoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: FormData) => void;
}

interface FormData {
  repository: string;
  branch: string;
  autoScan: boolean;
  prChecks: boolean;
}

// Mock GitHub repositories
const mockRepositories = [
  'frontend-app',
  'api-service',
  'payment-gateway',
  'user-management',
  'notification-service',
  'data-pipeline'
];

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
  
  const form = useForm<FormData>({
    defaultValues: {
      repository: '',
      branch: 'main',
      autoScan: true,
      prChecks: true,
    },
  });

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
            Add New Repository
          </DialogTitle>
          <DialogDescription>
            Connect a GitHub repository to start security scanning.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="repository"
              rules={{ required: 'Please select a repository' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Repository</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a repository" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockRepositories.map((repo) => (
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

            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
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
            </Collapsible>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Save Repository</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}