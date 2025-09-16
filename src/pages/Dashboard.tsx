import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  GitBranch, 
  Activity,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';


const Dashboard = () => {
  const [user, setUser] = useState<any>({});
  const [hubs, setHubs] = useState<any[]>([]);
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const hubsData = JSON.parse(localStorage.getItem('hubs') || '[]');
    const githubConnected = localStorage.getItem('githubConnected') === 'true';
    setUser(userData);
    setHubs(hubsData);
    setIsGitHubConnected(githubConnected);
  }, []);

  const handleConnectGitHub = () => {
    // Simulate GitHub connection
    localStorage.setItem('githubConnected', 'true');
    setIsGitHubConnected(true);
  };

  // Empty state when no GitHub connection
  const GitHubEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-8 min-h-[60vh]">
      <div className="w-16 h-16 rounded-lg bg-muted/30 flex items-center justify-center mb-6">
        <GitBranch className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-3">
        Welcome to Dashboard
      </h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Connect a Git provider and add your first repository to start scanning your codebase for security vulnerabilities.
      </p>
      <div className="mb-6">
        {/* <p className="text-sm font-medium text-foreground mb-4">

          Connect a Provider
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Choose your Git provider to get started
        </p> */}

        <Button 
          onClick={handleConnectGitHub}
          variant="outline"
          className="px-8 py-3 h-auto min-w-[200px]"
        >
          <GitBranch className="h-4 w-4 mr-2" />
          GitHub
        </Button>
      </div>
    </div>
  );

  // If GitHub is not connected, show empty state
  if (!isGitHubConnected) {
    return <GitHubEmptyState />;
  }


  const securityMetrics = [
    {
      title: 'Security Score',
      value: '94%',
      description: 'Overall security health',
      icon: Shield,
      trend: '+2.3%',
      color: 'text-secondary'
    },
    {
      title: 'Active Vulnerabilities',
      value: '12',
      description: 'Across all repositories',
      icon: AlertTriangle,
      trend: '-3',
      color: 'text-destructive'
    },
    {
      title: 'Resolved This Week',
      value: '28',
      description: 'Security issues fixed',
      icon: CheckCircle,
      trend: '+15%',
      color: 'text-secondary'
    },
    {
      title: 'Repositories',
      value: hubs.length.toString(),
      description: 'Connected & monitored',
      icon: GitBranch,
      trend: '+1',
      color: 'text-primary'
    }
  ];

  const recentActivity = [
    {
      type: 'vulnerability',
      message: 'Critical vulnerability detected in main-api',
      timestamp: '2 minutes ago',
      severity: 'high'
    },
    {
      type: 'fix',
      message: 'Security patch applied to user-service',
      timestamp: '1 hour ago',
      severity: 'success'
    },
    {
      type: 'scan',
      message: 'Weekly security scan completed',
      timestamp: '3 hours ago',
      severity: 'info'
    },
    {
      type: 'vulnerability',
      message: 'Medium severity issue found in frontend-app',
      timestamp: '5 hours ago',
      severity: 'medium'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vulnerability': return AlertTriangle;
      case 'fix': return CheckCircle;
      case 'scan': return Activity;
      default: return Activity;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-yellow-600';
      case 'success': return 'text-secondary';
      case 'info': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Issues Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Issues */}
        <Card className="border-0 shadow-md bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Open Issues</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl font-bold text-foreground mb-4">0</div>
              <div className="w-32 h-32 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                <div className="w-24 h-24 bg-muted/50 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pressing Issues */}
        <Card className="border-0 shadow-md bg-card">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Pressing Issues</CardTitle>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              ⚡
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-6xl font-bold text-destructive mb-2">0</div>
              <p className="text-sm text-muted-foreground mb-4">No urgent issues</p>
              <div className="flex items-center gap-2 text-secondary">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">No pressing issues found</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
      </div>

      
      {/* 
      Commented out existing dashboard content:
      - Security metrics grid with cards showing security score, vulnerabilities, etc.
      - Recent activity feed with vulnerability alerts and fixes
      - Security insights with AI-powered recommendations  
      - Hub overview showing connected repositories
      */}
    </div>
  );
};

export default Dashboard;