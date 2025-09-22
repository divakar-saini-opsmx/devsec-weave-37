import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Eye,
  ArrowLeft
} from 'lucide-react';

interface ScanProgress {
  status: 'started' | 'in-progress' | 'completed';
  scanId: string;
  startedAt: string;
  progress: number;
  completedSteps: string[];
  results: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

const mockScanSteps = [
  'Initializing scan environment',
  'Cloning repository',
  'Dependency analysis',
  'Static code analysis',
  'Secret detection',
  'License compliance check',
  'Generating report'
];

export default function ScanStatusPage() {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const [scanProgress, setScanProgress] = useState<ScanProgress>({
    status: 'started',
    scanId: `scan_${Date.now()}`,
    startedAt: 'Just now',
    progress: 0,
    completedSteps: [],
    results: { critical: 0, high: 0, medium: 0, low: 0 }
  });

  // Mock repository data
  const repoName = 'frontend-app'; // Would come from API based on repoId

  useEffect(() => {
    // Start scan simulation
    setTimeout(() => {
      setScanProgress(prev => ({ ...prev, status: 'in-progress' }));
      simulateScanProgress();
    }, 1000);
  }, []);

  const simulateScanProgress = () => {
    let step = 0;
    const totalSteps = mockScanSteps.length;
    
    const progressInterval = setInterval(() => {
      step++;
      const progress = Math.floor((step / totalSteps) * 100);
      
      setScanProgress(prev => ({
        ...prev,
        progress,
        completedSteps: mockScanSteps.slice(0, step),
        startedAt: `${step * 3} seconds ago`
      }));

      if (step >= totalSteps) {
        clearInterval(progressInterval);
        setScanProgress(prev => ({
          ...prev,
          status: 'completed',
          results: { critical: 2, high: 4, medium: 1, low: 3 }
        }));
      }
    }, 2000);
  };

  const getStatusIcon = () => {
    switch (scanProgress.status) {
      case 'completed':
        return <CheckCircle2 className="h-6 w-6 text-success" />;
      case 'in-progress':
      case 'started':
        return <Clock className="h-6 w-6 text-warning animate-pulse" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (scanProgress.status) {
      case 'started':
        return 'Starting Scan';
      case 'in-progress':
        return 'Scan In Progress';
      case 'completed':
        return 'Scan Completed';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <div className="p-8 min-h-screen">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink 
              onClick={() => navigate('/repositories')}
              className="cursor-pointer"
            >
              Repositories
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{repoName}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Scan</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Status</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
          Security Scan Status
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor the progress of your security scan for <span className="font-medium">{repoName}</span>
        </p>
      </div> */}

      {/* Main Content - Grid Layout that fits on one screen */}
      <div className="grid gap-6 max-w-6xl mx-auto h-[calc(100vh-280px)] grid-rows-[auto_1fr_auto]">
        
        {/* Top Section - Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <span className="text-xl font-semibold">{getStatusText()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Started At</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-semibold">{scanProgress.startedAt}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Scan ID</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-lg font-mono text-muted-foreground">{scanProgress.scanId}</div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Section - Progress */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              Scan Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 h-full">
            {/* Progress Bar */}
            {(scanProgress.status === 'in-progress' || scanProgress.status === 'started') && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">{scanProgress.progress}%</span>
                </div>
                <Progress value={scanProgress.progress} className="h-3" />
              </div>
            )}

            {/* Completed Steps */}
            <div className="space-y-3 flex-1">
              <h4 className="font-medium">Scan Steps</h4>
              <div className="grid gap-2 max-h-64 overflow-y-auto">
                {mockScanSteps.map((step, index) => {
                  const isCompleted = scanProgress.completedSteps.includes(step);
                  const isCurrent = index === scanProgress.completedSteps.length && scanProgress.status === 'in-progress';
                  
                  return (
                    <div key={index} className={`flex items-center gap-3 p-2 rounded-lg ${isCompleted ? 'bg-success/10' : isCurrent ? 'bg-warning/10' : 'bg-muted/50'}`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : isCurrent ? (
                        <Clock className="h-4 w-4 text-warning animate-pulse" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                      )}
                      <span className={`text-sm ${isCompleted ? 'text-success' : isCurrent ? 'text-warning' : 'text-muted-foreground'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Section - Results Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Results Summary</span>
              <div className="flex gap-2">
                {scanProgress.status === 'completed' && (
                  <>
                    <Button 
                      onClick={() => navigate(`/repositories/${repoId}?tab=findings`)} 
                      size="sm"
                    >
                      <Eye className="h-3 w-3 mr-2" />
                      View Detailed Findings
                    </Button>
                    <Button onClick={() => navigate('/repositories')} variant="outline" size="sm">
                      <ArrowLeft className="h-3 w-3 mr-2" />
                      Back to Repositories
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scanProgress.status === 'completed' ? (
              <div className="flex items-center gap-3 flex-wrap">
                {scanProgress.results.critical > 0 && (
                  <Badge variant="destructive" className="text-sm py-1 px-3">
                    {scanProgress.results.critical} Critical
                  </Badge>
                )}
                {scanProgress.results.high > 0 && (
                  <Badge className="bg-orange-500 hover:bg-orange-600 text-sm py-1 px-3">
                    {scanProgress.results.high} High
                  </Badge>
                )}
                {scanProgress.results.medium > 0 && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-sm py-1 px-3">
                    {scanProgress.results.medium} Medium
                  </Badge>
                )}
                {scanProgress.results.low > 0 && (
                  <Badge variant="secondary" className="text-sm py-1 px-3">
                    {scanProgress.results.low} Low
                  </Badge>
                )}
                {Object.values(scanProgress.results).every(count => count === 0) && (
                  <Badge className="bg-success hover:bg-success/80 text-sm py-1 px-3">
                    No Issues Found
                  </Badge>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground">
                Results will appear here once the scan is complete...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}