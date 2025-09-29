import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Shield, Settings, ChevronRight, CheckCircle2, Search, Lock, Container, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHub } from '@/contexts/HubContext';

const ScanConfig = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<'default' | 'custom' | null>(null);
  const [customScans, setCustomScans] = useState({
    secrets: true,
    pii: false,
    container: false,
    license: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const { setOnboarding } = useHub();

  const defaultScans = [
    { name: 'Secret Detection', icon: Lock, enabled: true },
    { name: 'Dependency CVE Check', icon: Shield, enabled: true },
    { name: 'License Compliance', icon: FileText, enabled: true }
  ];

  const customScanOptions = [
    { key: 'secrets', name: 'Secrets Detection', icon: Lock, description: 'Scan for API keys, tokens, and credentials' },
    { key: 'pii', name: 'PII Detection', icon: Search, description: 'Detect personally identifiable information' },
    { key: 'container', name: 'Container Scan', icon: Container, description: 'Analyze Docker images for vulnerabilities' },
    { key: 'license', name: 'Open Source License Scan', icon: FileText, description: 'Check license compatibility and compliance' }
  ];

  const handleSaveConfig = async () => {
    setIsLoading(true);
    
    // Simulate API call to save configuration
    setTimeout(() => {
      const scanConfig = selectedOption === 'default' 
        ? { type: 'default', scans: defaultScans.map(s => s.name) }
        : { type: 'custom', scans: Object.entries(customScans).filter(([_, enabled]) => enabled).map(([key, _]) => {
            const option = customScanOptions.find(o => o.key === key);
            return option?.name || key;
          }) };
      
      // Store configuration
      localStorage.setItem('scanConfig', JSON.stringify(scanConfig));
      
      setIsLoading(false);
      toast({
        title: "Scan configuration saved!",
        description: `${scanConfig.scans.length} scan types configured successfully.`
      });
      
      setOnboarding(false); 
      navigate('/dashboard');
    }, 1000);
  };

  const handleCustomScanToggle = (key: string) => {
    setCustomScans(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb Steps */}
        <div className="flex items-center justify-center space-x-2 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-secondary" />
            <span className="text-secondary">Hub Creation</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-secondary" />
            <span className="text-secondary">GitHub Integration</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
            <span className="font-medium">Scan Configuration</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Dashboard</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="p-3 bg-gradient-primary rounded-2xl shadow-glow">
              <Settings className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Configure Security Scans</h1>
            <p className="text-muted-foreground">
              Choose your scanning preferences to protect your repositories
            </p>
          </div>
        </div>

        {/* Configuration Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Default Configuration */}
          <Card className={`cursor-pointer transition-all border-2 ${
            selectedOption === 'default' 
              ? 'border-primary shadow-lg shadow-primary/25' 
              : 'border-border hover:border-primary/50'
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Default Scan Configuration
              </CardTitle>
              <CardDescription>
                Comprehensive baseline scanning with security best practices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {defaultScans.map((scan, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
                    <scan.icon className="h-4 w-4 text-secondary" />
                    <span className="font-medium">{scan.name}</span>
                    <Badge variant="secondary" className="ml-auto">Enabled</Badge>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setSelectedOption('default')}
                className={`w-full h-12 transition-smooth ${
                  selectedOption === 'default'
                    ? 'bg-gradient-primary shadow-glow'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                {selectedOption === 'default' ? 'Selected' : 'Use Default Config'}
              </Button>
            </CardContent>
          </Card>

          {/* Custom Configuration */}
          <Card className={`cursor-pointer transition-all border-2 ${
            selectedOption === 'custom' 
              ? 'border-primary shadow-lg shadow-primary/25' 
              : 'border-border hover:border-primary/50'
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Customize Configuration
              </CardTitle>
              <CardDescription>
                Manually select scan types based on your specific needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedOption === 'custom' ? (
                <div className="space-y-4">
                  {customScanOptions.map((option) => (
                    <div key={option.key} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Checkbox
                        id={option.key}
                        checked={customScans[option.key as keyof typeof customScans]}
                        onCheckedChange={() => handleCustomScanToggle(option.key)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4 text-muted-foreground" />
                          <label htmlFor={option.key} className="font-medium cursor-pointer">
                            {option.name}
                          </label>
                        </div>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Customize Config" to select individual scan types</p>
                </div>
              )}
              <Button
                onClick={() => setSelectedOption('custom')}
                variant={selectedOption === 'custom' ? 'default' : 'outline'}
                className={`w-full h-12 transition-smooth ${
                  selectedOption === 'custom'
                    ? 'bg-gradient-primary shadow-glow'
                    : 'hover:shadow-md'
                }`}
              >
                {selectedOption === 'custom' ? 'Customizing...' : 'Customize Config'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        {selectedOption && (
          <div className="flex justify-center">
            <Button
              onClick={handleSaveConfig}
              disabled={isLoading}
              size="lg"
              className="px-8 h-12 bg-gradient-primary hover:opacity-90 transition-smooth shadow-glow"
            >
              {isLoading ? 'Saving Configuration...' : 'Save & Continue to Dashboard'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanConfig;