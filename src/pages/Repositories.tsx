import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AddRepositoryDialog } from '@/components/repositories/AddRepositoryDialog';
import { 
  GitBranch, 
  Play, 
  RotateCcw, 
  Eye, 
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface Repository {
  id: string;
  name: string;
  branch: string;
  status: 'Not Scanned' | 'In Progress' | 'Completed';
  issues: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  lastScan?: string;
}

// Mock data for demonstration
const mockRepositories: Repository[] = [
  {
    id: '1',
    name: 'frontend-app',
    branch: 'main',
    status: 'Completed',
    issues: { critical: 2, high: 4, medium: 1, low: 3 },
    lastScan: '2 hours ago'
  },
  {
    id: '2',
    name: 'api-service',
    branch: 'develop',
    status: 'In Progress',
    issues: { critical: 0, high: 0, medium: 0, low: 0 },
    lastScan: undefined
  },
  {
    id: '3',
    name: 'payment-gateway',
    branch: 'main',
    status: 'Completed',
    issues: { critical: 1, high: 2, medium: 5, low: 1 },
    lastScan: '1 day ago'
  }
];

const getStatusIcon = (status: Repository['status']) => {
  switch (status) {
    case 'Completed':
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    case 'In Progress':
      return <Clock className="h-4 w-4 text-warning" />;
    case 'Not Scanned':
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusBadgeVariant = (status: Repository['status']) => {
  switch (status) {
    case 'Completed':
      return 'default';
    case 'In Progress':
      return 'secondary';
    case 'Not Scanned':
      return 'outline';
  }
};

const IssuesSummary = ({ issues }: { issues: Repository['issues'] }) => {
  const hasIssues = Object.values(issues).some(count => count > 0);
  
  if (!hasIssues) {
    return <span className="text-muted-foreground text-sm">No issues found</span>;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {issues.critical > 0 && (
        <Badge variant="destructive" className="text-xs">
          {issues.critical} Critical
        </Badge>
      )}
      {issues.high > 0 && (
        <Badge className="bg-orange-500 hover:bg-orange-600 text-xs">
          {issues.high} High
        </Badge>
      )}
      {issues.medium > 0 && (
        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs">
          {issues.medium} Medium
        </Badge>
      )}
      {issues.low > 0 && (
        <Badge variant="secondary" className="text-xs">
          {issues.low} Low
        </Badge>
      )}
    </div>
  );
};

export default function Repositories() {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState<Repository[]>(mockRepositories);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleScan = (repoId: string) => {
    navigate(`/repositories/${repoId}/scan`);
  };

  const handleAddRepository = (repoData: any) => {
    const newRepo: Repository = {
      id: Date.now().toString(),
      name: repoData.repository,
      branch: repoData.branch,
      status: 'Not Scanned',
      issues: { critical: 0, high: 0, medium: 0, low: 0 }
    };
    setRepositories(prev => [...prev, newRepo]);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-8">
      <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-6">
        <Plus className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-3">
        Ready to get started?
      </h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Connect your first repository to begin scanning and monitoring your code
      </p>
      <Button 
        onClick={() => setIsAddDialogOpen(true)}
        className="px-8 py-3 h-auto"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Your First Repository
      </Button>
      <p className="text-sm text-muted-foreground mt-4 text-center">
        Once connected, we'll scan your repository for security vulnerabilities
      </p>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Repositories
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your connected repositories
          </p>
        </div>
        {repositories.length > 0 && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Repository
          </Button>
        )}
      </div>

      {repositories.length === 0 ? (
        <EmptyState />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Repository List ({repositories.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Repository</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issues Summary</TableHead>
                  <TableHead>Last Scan</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repositories.map((repo) => (
                  <TableRow key={repo.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{repo.name}</span>
                        <span className="text-sm text-muted-foreground">
                          Branch: {repo.branch}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(repo.status)}
                        <Badge variant={getStatusBadgeVariant(repo.status)}>
                          {repo.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <IssuesSummary issues={repo.issues} />
                    </TableCell>
                    <TableCell>
                      {repo.lastScan || (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-end">
                        {repo.status === 'Not Scanned' ? (
                          <Button
                            size="sm"
                            onClick={() => handleScan(repo.id)}
                            className="h-8"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Scan Now
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleScan(repo.id)}
                            className="h-8"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            ReScan
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="h-8">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <AddRepositoryDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddRepository}
      />
    </div>
  );
}