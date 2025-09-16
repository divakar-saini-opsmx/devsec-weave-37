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
    setUser(userData);
    setHubs(hubsData);
    const connected = localStorage.getItem('githubConnected') === 'true';
    setIsGitHubConnected(connected);
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
        <p className="text-sm font-medium text-foreground mb-4">
          Connect a Provider
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Choose your Git provider to get started
        </p>
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
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Welcome back, {user.name?.split(' ')[0] || 'Developer'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your security posture today.
        </p>
      </div>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric) => (
          <Card key={metric.title} className="border-0 shadow-md hover:shadow-lg transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                  </div>
                  <p className="text-3xl font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-xs">
                    {metric.trend}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest security events across your repositories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
                    <div className={`p-1.5 rounded-full bg-muted ${getSeverityColor(activity.severity)}`}>
                      <Icon className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Security Insights */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Security Insights
            </CardTitle>
            <CardDescription>
              AI-powered recommendations for your security posture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <p className="font-medium text-sm">Great Progress!</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  You've resolved 85% more vulnerabilities this month compared to last month.
                </p>
              </div>
              
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <p className="font-medium text-sm">Recommendation</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enable automated dependency updates to reduce future vulnerabilities by up to 40%.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Enable Auto-Updates
                </Button>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium text-sm">Team Collaboration</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Consider inviting team members to collaborate on security improvements.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hub Overview */}
      {hubs.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Your Security Hubs
            </CardTitle>
            <CardDescription>
              Manage and monitor your connected repositories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hubs.map((hub) => (
                <div key={hub.id} className="p-4 rounded-lg border bg-card hover:shadow-md transition-smooth">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{hub.name}</h4>
                    <Badge variant={hub.githubConnected ? "secondary" : "outline"}>
                      {hub.githubConnected ? "Connected" : "Setup Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {hub.description || "No description provided"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Created {new Date(hub.createdAt).toLocaleDateString()}</span>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;