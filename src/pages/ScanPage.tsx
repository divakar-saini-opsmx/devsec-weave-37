import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SastFindingsTable } from '@/components/scan/SastFindingsTable';
import { ScaFindingsTable } from '@/components/scan/ScaFindingsTable';
import { FindingDetailModal } from '@/components/scan/FindingDetailModal';
import { RemediationChat } from '@/components/scan/RemediationChat';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  GitBranch,
  Shield,
  Search,
  Key,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface ScanConfig {
  type: 'branch' | 'diff' | '';
  branch: string;
  categories: {
    sast: boolean;
    sca: boolean;
    secrets: boolean;
    license: boolean;
  };
}

interface ScanProgress {
  status: 'idle' | 'started' | 'in-progress' | 'completed';
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

const mockBranches = ['main', 'develop', 'feature/auth', 'hotfix/security'];

const scanCategories = [
  { id: 'sast', label: 'SAST (Static Analysis)', icon: Search, description: 'Analyze source code for vulnerabilities' },
  { id: 'sca', label: 'SCA (Dependency Analysis)', icon: Shield, description: 'Check dependencies for known vulnerabilities' },
  { id: 'secrets', label: 'Secret Detection', icon: Key, description: 'Find exposed API keys and credentials' },
  { id: 'license', label: 'License Compliance', icon: FileText, description: 'Verify dependency license compatibility' }
];

const mockScanSteps = [
  'Initializing scan environment',
  'Cloning repository',
  'Dependency analysis',
  'Static code analysis',
  'Secret detection',
  'License compliance check',
  'Generating report'
];

export default function ScanPage() {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const [config, setConfig] = useState<ScanConfig>({
    type: '',
    branch: '',
    categories: { sast: true, sca: true, secrets: true, license: false }
  });
  const [scanProgress, setScanProgress] = useState<ScanProgress>({
    status: 'idle',
    scanId: '',
    startedAt: '',
    progress: 0,
    completedSteps: [],
    results: { critical: 0, high: 0, medium: 0, low: 0 }
  });

  // Modal and chat states
  const [selectedFinding, setSelectedFinding] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [remediationFinding, setRemediationFinding] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Mock repository data
  const repoName = 'frontend-app'; // Would come from API based on repoId

  const handleStartScan = () => {
    const scanId = `scan_${Date.now()}`;
    setScanProgress({
      status: 'started',
      scanId,
      startedAt: 'Just now',
      progress: 0,
      completedSteps: [],
      results: { critical: 0, high: 0, medium: 0, low: 0 }
    });

    // Mock scan progress
    setTimeout(() => {
      setScanProgress(prev => ({ ...prev, status: 'in-progress' }));
      simulateScanProgress();
    }, 1000);
  };

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

  const handleCategoryChange = (categoryId: keyof ScanConfig['categories'], checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      categories: { ...prev.categories, [categoryId]: checked }
    }));
  };

  const isConfigValid = config.type && (config.type === 'diff' || config.branch) && 
    Object.values(config.categories).some(Boolean);

  const getStatusIcon = () => {
    switch (scanProgress.status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'in-progress':
      case 'started':
        return <Clock className="h-5 w-5 text-warning animate-pulse" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  // Handle finding actions
  const handleViewDetail = (finding: any) => {
    setSelectedFinding(finding);
    setIsDetailModalOpen(true);
  };

  const handleStartRemediation = (finding: any) => {
    setRemediationFinding(finding);
    setIsChatOpen(true);
    setIsDetailModalOpen(false);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedFinding(null);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setRemediationFinding(null);
  };

  return (
    <div className="p-8">
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
            <BreadcrumbPage>Scan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">
          Security Scan
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure and run security analysis for <span className="font-medium">{repoName}</span>
        </p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* Scan Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Scan Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scan Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Scan Type</label>
              <Select value={config.type} onValueChange={(value: 'branch' | 'diff') => setConfig(prev => ({ ...prev, type: value, branch: value === 'diff' ? '' : prev.branch }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose scan type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="branch">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Branch Scan</span>
                      <span className="text-xs text-muted-foreground">Recommended, comprehensive security analysis</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="diff">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Diff Scan</span>
                      <span className="text-xs text-muted-foreground">Faster, scans only changed files</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Branch Selection */}
            {config.type === 'branch' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Branch</label>
                <Select value={config.branch} onValueChange={(value) => setConfig(prev => ({ ...prev, branch: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose branch..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBranches.map(branch => (
                      <SelectItem key={branch} value={branch}>
                        <div className="flex items-center gap-2">
                          <GitBranch className="h-3 w-3" />
                          {branch}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Scan Categories */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Scan Categories</label>
              <div className="grid gap-3">
                {scanCategories.map(category => {
                  const IconComponent = category.icon;
                  return (
                    <div key={category.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={category.id}
                        checked={config.categories[category.id as keyof ScanConfig['categories']]}
                        onCheckedChange={(checked) => handleCategoryChange(category.id as keyof ScanConfig['categories'], checked as boolean)}
                      />
                      <div className="flex items-start gap-3 flex-1">
                        <IconComponent className="h-4 w-4 mt-0.5 text-primary" />
                        <div className="space-y-1">
                          <label htmlFor={category.id} className="text-sm font-medium cursor-pointer">
                            {category.label}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button 
              onClick={handleStartScan}
              disabled={!isConfigValid || scanProgress.status !== 'idle'}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Security Scan
            </Button>
          </CardContent>
        </Card>

        {/* Scan Progress & Results */}
        {scanProgress.status !== 'idle' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon()}
                Scan Progress & Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scan Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{scanProgress.status.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scan Started</p>
                  <p className="font-medium">{scanProgress.startedAt}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scan ID</p>
                  <p className="font-mono text-sm">{scanProgress.scanId}</p>
                </div>
              </div>

              {/* Progress Bar */}
              {scanProgress.status === 'in-progress' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Scan Progress</span>
                    <span className="text-sm text-muted-foreground">{scanProgress.progress}%</span>
                  </div>
                  <Progress value={scanProgress.progress} className="h-2" />
                </div>
              )}

              {/* Completed Steps */}
              {scanProgress.completedSteps.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Completed Steps</h4>
                  <div className="space-y-1">
                    {scanProgress.completedSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-3 w-3 text-success" />
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Results Summary */}
              {scanProgress.status === 'completed' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Security Issues Found</h4>
                    <div className="flex gap-2">
                      <Button onClick={() => navigate('/repositories')} variant="outline" size="sm">
                        Back to Repositories
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {scanProgress.results.critical > 0 && (
                      <Badge variant="destructive">
                        {scanProgress.results.critical} Critical
                      </Badge>
                    )}
                    {scanProgress.results.high > 0 && (
                      <Badge className="bg-orange-500 hover:bg-orange-600">
                        {scanProgress.results.high} High
                      </Badge>
                    )}
                    {scanProgress.results.medium > 0 && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">
                        {scanProgress.results.medium} Medium
                      </Badge>
                    )}
                    {scanProgress.results.low > 0 && (
                      <Badge variant="secondary">
                        {scanProgress.results.low} Low
                      </Badge>
                    )}
                    {Object.values(scanProgress.results).every(count => count === 0) && (
                      <Badge className="bg-success hover:bg-success/80">
                        No Issues Found
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Detailed Results - Only show when scan is completed */}
        {scanProgress.status === 'completed' && Object.values(scanProgress.results).some(count => count > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Detailed Findings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="sast" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="sast" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    SAST Findings
                  </TabsTrigger>
                  <TabsTrigger value="sca" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    SCA Findings
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="sast" className="space-y-4">
                  <SastFindingsTable 
                    onRemediate={handleStartRemediation}
                    onViewDetail={handleViewDetail}
                  />
                </TabsContent>
                <TabsContent value="sca" className="space-y-4">
                  <ScaFindingsTable 
                    onRemediate={handleStartRemediation}
                    onViewDetail={handleViewDetail}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Finding Detail Modal */}
      <FindingDetailModal
        finding={selectedFinding}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onRemediate={handleStartRemediation}
      />

      {/* Remediation Chat */}
      <RemediationChat
        finding={remediationFinding}
        isOpen={isChatOpen}
        onClose={handleCloseChat}
      />
    </div>
  );
}