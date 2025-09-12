import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, ExternalLink, FileText } from 'lucide-react';

interface Finding {
  id: string;
  ruleName?: string;
  packageName?: string;
  vulnerability?: string;
  cveId?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  confidence?: 'High' | 'Medium' | 'Low';
  filePath?: string;
  currentVersion?: string;
  upgradeToVersion?: string;
  description: string;
  codeSnippet?: string;
}

interface FindingDetailModalProps {
  finding: Finding | null;
  isOpen: boolean;
  onClose: () => void;
  onRemediate: (finding: Finding) => void;
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

export function FindingDetailModal({ finding, isOpen, onClose, onRemediate }: FindingDetailModalProps) {
  if (!finding) return null;

  const isSastFinding = 'ruleName' in finding;
  const isScaFinding = 'packageName' in finding;

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isSastFinding ? finding.ruleName : `${finding.packageName} Vulnerability`}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-full max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Basic Information */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(finding.severity)}>
                    {finding.severity}
                  </Badge>
                  {finding.confidence && (
                    <Badge variant="outline">
                      {finding.confidence} Confidence
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{finding.description}</p>
              </div>
              <Button onClick={() => onRemediate(finding)}>
                Start Remediation
              </Button>
            </div>

            {/* SAST Finding Details */}
            {isSastFinding && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">File Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm">{finding.filePath}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyToClipboard(finding.filePath || '')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {finding.codeSnippet && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Code Snippet</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                          <code>{finding.codeSnippet}</code>
                        </pre>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => handleCopyToClipboard(finding.codeSnippet || '')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* SCA Finding Details */}
            {isScaFinding && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Vulnerability Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">CVE ID:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{finding.cveId}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://nvd.nist.gov/vuln/detail/${finding.cveId}`, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Current Version:</span>
                      <span className="font-mono text-sm">{finding.currentVersion}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Recommended Version:</span>
                      <span className="font-mono text-sm text-success font-medium">{finding.upgradeToVersion}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Upgrade Command</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-md text-sm">
                        <code>{`npm install ${finding.packageName}@${finding.upgradeToVersion}`}</code>
                      </pre>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleCopyToClipboard(`npm install ${finding.packageName}@${finding.upgradeToVersion}`)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Remediation Guidance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Remediation Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {isSastFinding ? (
                    <>
                      <p>• Review the highlighted code section for potential security risks</p>
                      <p>• Consider input validation and sanitization measures</p>
                      <p>• Follow secure coding practices for this vulnerability type</p>
                      <p>• Test the fix thoroughly before deployment</p>
                    </>
                  ) : (
                    <>
                      <p>• Update the package to the recommended version</p>
                      <p>• Test your application after the upgrade</p>
                      <p>• Review breaking changes in the new version</p>
                      <p>• Consider using dependency scanning tools regularly</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}