import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SastFindingsTable } from '@/components/scan/SastFindingsTable';
import { ScaFindingsTable } from '@/components/scan/ScaFindingsTable';
import { FindingDetailModal } from '@/components/scan/FindingDetailModal';
import { RemediationChat } from '@/components/scan/RemediationChat';
import { RemediationChatSCA } from '@/components/scan/RemediationChatSCA';
import { Shield, Package, Key, FileText, Calendar } from 'lucide-react';

interface Repository {
  id: string;
  name: string;
  branch: string;
  lastScan: string;
  findings: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

interface Finding {
  id: string;
  scanId: string;
  organization: string;
  platform: string;
  repository: string;
  branch: string;
  rule_name?: string;
  rule_message?: string;
  component?: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  vulnerability?: string;
  metadata?: {
    file_path: string;
    line: number;
  };
  ruleName?: string;
  packageName?: string;
  cveId?: string;
  filePath?: string;
  codeSnippet?: string;
  currentVersion?: string;
  upgradeToVersion?: string;
}

interface RepositoryFindingsProps {
  repository: Repository;
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export function RepositoryFindings() {
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [remediationFinding, setRemediationFinding] = useState<Finding | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRemediationOpen, setIsRemediationOpen] = useState(false);

  const [selectedFindingSCA, setSelectedSCAFinding] = useState<Finding | null>(null);
  const [remediationSCAFinding, setRemediationSCAFinding] = useState<Finding | null>(null);
  const [isDetailModalOpenSCA, setIsDetailModalOpenSCA] = useState(false);
  const [isRemediationSCAOpen, setIsRemediationSCAOpen] = useState(false);

  //console.log("Repository in RepositoryFindings:", repo);

  // const totalFindings = repository.findings.critical + repository.findings.high + 
  //                      repository.findings.medium + repository.findings.low;

  const handleRemediate = (finding: Finding) => {
    setRemediationFinding(finding);
    setIsRemediationOpen(true);
  };

  const handleViewDetail = (finding: Finding) => {
    setSelectedFinding(finding);
    setIsDetailModalOpen(true);
  };

  const handleRemediateSCA = (finding: Finding) => {
    setRemediationSCAFinding(finding);
    setIsRemediationSCAOpen(true);
  };

  const handleViewDetailSCA = (finding: Finding) => {
    setSelectedSCAFinding(finding);
    setIsDetailModalOpenSCA(true);
  };

  return (
    <div className="space-y-6">
      {/* Repository Info */}
      {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span>Last scan: {formatDate(repository.lastScan)}</span>
      </div> */}

      {/* Findings Summary */}
      {/* <Card>
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
      </Card> */}

      {/* Findings Sub-tabs */}
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
            onRemediate={handleRemediateSCA}
            onViewDetail={handleViewDetailSCA}
          />
        </TabsContent>

        {/* <TabsContent value="secrets">
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
        </TabsContent> */}
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

      {/* <FindingDetailModal
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
      /> */}

      {/* Remediation Chat */}
      <RemediationChat
        finding={remediationFinding}
        isOpen={isRemediationOpen}
        onClose={() => {
          setIsRemediationOpen(false);
          setRemediationFinding(null);
        }}
      />

    <RemediationChatSCA
        finding={remediationSCAFinding}
        isOpen={isRemediationSCAOpen}
        onClose={() => {
          setIsRemediationSCAOpen(false);
          setRemediationSCAFinding(null);
        }}
      />
    </div>
  );
}
