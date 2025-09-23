import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { RepositoryDashboard } from '@/components/repository/RepositoryDashboard';
import { RepositoryFindings } from '@/components/repository/RepositoryFindings';
import { ArrowLeft, BarChart3, Shield } from 'lucide-react';

// Mock repository data
const mockRepositories = {
  '1': {
    id: '1',
    name: 'frontend-app',
    branch: 'main',
    lastScan: '2024-01-15T10:30:00Z',
    findings: {
      critical: 2,
      high: 5,
      medium: 12,
      low: 8
    }
  },
  '2': {
    id: '2',
    name: 'backend-api',
    branch: 'main', 
    lastScan: '2024-01-15T09:15:00Z',
    findings: {
      critical: 1,
      high: 3,
      medium: 7,
      low: 15
    }
  },
  '3': {
    id: '3',
    name: 'mobile-client',
    branch: 'develop',
    lastScan: '2024-01-14T16:45:00Z',
    findings: {
      critical: 0,
      high: 2,
      medium: 5,
      low: 10
    }
  }
};

export default function RepositoryDetailsPage() {
  const { repoId } = useParams<{ repoId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const defaultTab = searchParams.get('tab') === 'findings' ? 'findings' : 'dashboard';

  const repository = repoId ? mockRepositories[repoId as keyof typeof mockRepositories] : null;

  if (!repository) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Repository not found</p>
        <Button onClick={() => navigate('/repositories')} className="mt-4">
          Back to Repositories
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/repositories')} className="cursor-pointer">
              Repositories
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{repository.name}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Scan</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Findings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      {/* <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/repositories')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{repository.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Branch: {repository.branch}
            </p>
          </div>
        </div>
      </div> */}

      {/* Main Tabs */}
      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Repository Dashboard
          </TabsTrigger>
          <TabsTrigger value="findings" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Findings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <RepositoryDashboard repository={repository} />
        </TabsContent>

        <TabsContent value="findings">
          <RepositoryFindings repository={repository} />
        </TabsContent>
      </Tabs>
    </div>
  );
}