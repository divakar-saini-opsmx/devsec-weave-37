import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SastFindingsTable } from '@/components/scan/SastFindingsTable';
import { ScaFindingsTable } from '@/components/scan/ScaFindingsTable';
import { FindingDetailModal } from '@/components/scan/FindingDetailModal';
import { RemediationChat } from '@/components/scan/RemediationChat';
import { ArrowLeft, Shield, Package, Key, FileText, Calendar } from 'lucide-react';

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

interface Finding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  //description: string;
  ruleName?: string;
  packageName?: string;
  cveId?: string;
  filePath?: string;
  //confidence?: 'High' | 'Medium' | 'Low';  
  codeSnippet?: string;
  currentVersion?: string;
  upgradeToVersion?: string;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical':
      return 'bg-destructive text-destructive-foreground';
    case 'High':
      return 'bg-orange-500 text-white hover:bg-orange-600';
    case 'Medium':
      return 'bg-yellow-500 text-white hover:bg-yellow-600';
    case 'Low':
      return 'bg-blue-500 text-white hover:bg-blue-600';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};

export default function FindingsPage() {
  const { repoId } = useParams<{ repoId: string }>();
  const navigate = useNavigate();
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [remediationFinding, setRemediationFinding] = useState<Finding | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRemediationOpen, setIsRemediationOpen] = useState(false);

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

  const totalFindings = repository.findings.critical + repository.findings.high + 
                       repository.findings.medium + repository.findings.low;

  const handleRemediate = (finding: Finding) => {
    setRemediationFinding(finding);
    setIsRemediationOpen(true);
  };

  const handleViewDetail = (finding: Finding) => {
    setSelectedFinding(finding);
    setIsDetailModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            <BreadcrumbPage>Findings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Calendar className="h-4 w-4" />
              <span>Last scan: {formatDate(repository.lastScan)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Findings Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security Findings Summary ({totalFindings} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Badge className={getSeverityColor('Critical')}>
                Critical: {repository.findings.critical}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getSeverityColor('High')}>
                High: {repository.findings.high}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getSeverityColor('Medium')}>
                Medium: {repository.findings.medium}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getSeverityColor('Low')}>
                Low: {repository.findings.low}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Findings View */}
      <Tabs defaultValue="sast" className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="sast" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            SAST Findings
          </TabsTrigger>
          <TabsTrigger value="sca" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            SCA Findings
          </TabsTrigger>
          {/* <TabsTrigger value="secrets" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Secrets
          </TabsTrigger>
          <TabsTrigger value="license" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            License Compliance
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="sast">
          <SastFindingsTable 
            onRemediate={handleRemediate}
            onViewDetail={handleViewDetail}
          />
        </TabsContent>

        <TabsContent value="sca">
          <ScaFindingsTable 
            onRemediate={handleRemediate}
            onViewDetail={handleViewDetail}
          />
        </TabsContent>

        <TabsContent value="secrets">
          <Card>
            <CardContent className="p-8 text-center">
              <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-muted-foreground mb-2">Secret Detection</h3>
              <p className="text-sm text-muted-foreground">
                Secret detection findings will be displayed here once the feature is implemented.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="license">
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-muted-foreground mb-2">License Compliance</h3>
              <p className="text-sm text-muted-foreground">
                License compliance findings will be displayed here once the feature is implemented.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <FindingDetailModal
        finding={selectedFinding}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedFinding(null);
        }}
        onRemediate={(finding) => {
          setIsDetailModalOpen(false);
          handleRemediate(finding);
        }}
      />

      {/* Remediation Chat */}
      <RemediationChat
        finding={remediationFinding}
        isOpen={isRemediationOpen}
        onClose={() => {
          setIsRemediationOpen(false);
          setRemediationFinding(null);
        }}
      />
    </div>
  );
}