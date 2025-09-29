import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { 
  Play, 
  GitBranch,
  Shield,
  Search,
  Key,
  FileText,
  Settings,
  CheckCircle2
} from 'lucide-react';

interface ScanConfig {
  type: 'default' | 'custom';
  scanType: 'branch' | 'diff' | '';
  branch: string;
  categories: {
    sast: boolean;
    sca: boolean;
    secrets: boolean;
    license: boolean;
  };
}

const mockBranches = ['main', 'develop', 'feature/auth', 'hotfix/security'];

const defaultScans = [
  { id: 'secrets', label: 'Secret Detection', icon: Key },
  { id: 'sca', label: 'Dependency CVE Check', icon: Shield },
  { id: 'license', label: 'License Compliance', icon: FileText }
];

const customScanOptions = [
  { id: 'sast', label: 'SAST (Static Analysis)', icon: Search, description: 'Analyze source code for vulnerabilities' },
  { id: 'sca', label: 'SCA (Dependency Analysis)', icon: Shield, description: 'Check dependencies for known vulnerabilities' },
  { id: 'secrets', label: 'Secrets Detection', icon: Key, description: 'Find exposed API keys and credentials' },
  { id: 'license', label: 'License Compliance', icon: FileText, description: 'Verify dependency license compatibility' }
];

export default function ScanConfigurationPage() {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const [config, setConfig] = useState<ScanConfig>({
    type: 'default',
    scanType: '',
    branch: '',
    categories: { sast: true, sca: true, secrets: true, license: true }
  });

  // Mock repository data
  const repoName = 'frontend-app'; // Would come from API based on repoId

  const handleUseDefault = () => {
    setConfig(prev => ({
      ...prev,
      type: 'default',
      categories: { sast: false, sca: true, secrets: true, license: true }
    }));
  };

  const handleCustomizeConfig = () => {
    setConfig(prev => ({
      ...prev,
      type: 'custom',
      scanType: '',
      branch: ''
    }));
  };

  const handleCategoryChange = (categoryId: keyof ScanConfig['categories'], checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      categories: { ...prev.categories, [categoryId]: checked }
    }));
  };

  const handleStartScan = () => {
    // Save config and navigate to scan status
    navigate(`/projects/${repoId}/scan/status`);
  };

  const isConfigValid = () => {
    if (config.type === 'default') return true;
    if (config.type === 'custom') {
      return (config.scanType === 'diff' || config.branch) && 
        Object.values(config.categories).some(Boolean);
    }
    return false;
  };

  return (
    <div className="p-8">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink 
              onClick={() => navigate('/projects')}
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
            <BreadcrumbPage>Scan Configuration</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
          Scan Configuration
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure security scan settings for <span className="font-medium">{repoName}</span>
        </p>
      </div> */}

      <div className="grid gap-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Scan Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scan Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Scan Type</label>
                <Select value={config.scanType} onValueChange={(value: 'branch' | 'diff') => setConfig(prev => ({ ...prev, scanType: value, branch: value === 'diff' ? '' : prev.branch }))}>
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
              {config.scanType === 'branch' && (
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
              
              {/* Configuration Options */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Default Configuration */}
                <Card className={`cursor-pointer transition-all hover:shadow-md ${config.type === 'default' ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Use Default Scan Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Comprehensive baseline scanning with security best practices
                    </p>
                    <div className="space-y-2">
                      {defaultScans.map(scan => {
                        const IconComponent = scan.icon;
                        return (
                          <div key={scan.id} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-3 w-3 text-success" />
                            <IconComponent className="h-3 w-3 text-primary" />
                            <span>{scan.label}</span>
                          </div>
                        );
                      })}
                    </div>
                    <Button 
                      onClick={handleUseDefault}
                      className="w-full"
                      variant={config.type === 'default' ? 'default' : 'outline'}
                    >
                      Use Default Config
                    </Button>
                  </CardContent>
                </Card>

                {/* Custom Configuration */}
                <Card className={`cursor-pointer transition-all hover:shadow-md ${config.type === 'custom' ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Customize Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Select specific scan types and configure advanced options
                    </p>
                    <Button 
                      onClick={handleCustomizeConfig}
                      className="w-full"
                      variant={config.type === 'custom' ? 'default' : 'outline'}
                    >
                      Customize Config
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Scan Categories */}
              {config.type === 'custom' &&  (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Select Scan Categories</label>
                  <div className="grid gap-3">
                    {customScanOptions.map(category => {
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
              )}              
            </CardContent>
          </Card>
      

        {/* Start Scan Button */}
        {config.type && (
          <div className="flex justify-center">
            <Button 
              onClick={handleStartScan}
              disabled={!isConfigValid()}
              size="lg"
              className="min-w-[200px]"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Security Scan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}