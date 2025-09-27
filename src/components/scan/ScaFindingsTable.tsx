import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Package, Eye, MessageSquare, X, Cog } from 'lucide-react';


interface ScaFinding {
  id: string;
  packageName: string;
  vulnerability: string;
  cveId: string;
  //severity: 'Critical' | 'High' | 'Medium' | 'Low';
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  currentVersion: string;
  upgradeToVersion: string;
  description: string;
}

const mockScaFindings: ScaFinding[] = [
  {
    id: '1',
    packageName: 'lodash',
    vulnerability: 'Prototype Pollution',
    cveId: 'CVE-2019-10744',
    severity: 'critical',
    confidence : 'CRITICAL',
    currentVersion: '4.17.4',
    upgradeToVersion: '4.17.21',
    description: 'Prototype pollution vulnerability in lodash allows modification of object properties'
  },
  {
    id: '2',
    packageName: 'axios',
    vulnerability: 'Server-Side Request Forgery',
    cveId: 'CVE-2020-28168',
    severity: 'high',
    confidence : 'HIGH',
    currentVersion: '0.18.0',
    upgradeToVersion: '0.21.4',
    description: 'SSRF vulnerability in axios HTTP client library'
  },
  {
    id: '3',
    packageName: 'express',
    vulnerability: 'Open Redirect',
    cveId: 'CVE-2022-24999',
    severity: 'medium',
    confidence : 'MEDIUM',
    currentVersion: '4.16.4',
    upgradeToVersion: '4.18.2',
    description: 'Open redirect vulnerability in express.js framework'
  },
  {
    id: '4',
    packageName: 'moment',
    vulnerability: 'ReDoS Attack',
    cveId: 'CVE-2017-18214',
    severity: 'low',
    confidence : 'LOW',
    currentVersion: '2.18.1',
    upgradeToVersion: '2.29.4',
    description: 'Regular expression denial of service in moment.js'
  }
];

interface ScaFindingsTableProps {
  onRemediate: (finding: ScaFinding) => void;
  onViewDetail: (finding: ScaFinding) => void;
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

export function ScaFindingsTable({ onRemediate, onViewDetail }: ScaFindingsTableProps) {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [ignoredFindings, setIgnoredFindings] = useState<Set<string>>(new Set());

  const filteredFindings = mockScaFindings.filter(finding => {
    if (severityFilter === 'all') return true;
    return finding.severity === severityFilter;
  }).filter(finding => !ignoredFindings.has(finding.id));

  const handleIgnore = (findingId: string) => {
    setIgnoredFindings(prev => new Set([...prev, findingId]));
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <span className="font-medium">SCA Findings ({filteredFindings.length})</span>
        </div>
        
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Findings Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>Vulnerability</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Current Version</TableHead>
                <TableHead>Upgrade To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFindings.map((finding) => (
                <TableRow key={finding.id}>
                  <TableCell className="font-medium font-mono">
                    {finding.packageName}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{finding.vulnerability}</p>
                      <p className="text-xs text-muted-foreground">{finding.cveId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(finding.severity)}>
                      {finding.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {finding.currentVersion}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-success font-medium">
                    {finding.upgradeToVersion}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemediate(finding)}
                      >
                        {/* <MessageSquare className="h-3 w-3 mr-1" /> */}
                        <Cog className="h-3 w-3 mr-1"/>
                        Remediate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetail(finding)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleIgnore(finding.id)}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Ignore
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredFindings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No SCA findings found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}