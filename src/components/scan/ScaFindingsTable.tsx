import { useState, useEffect } from 'react';
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
import { useHub } from "@/contexts/HubContext";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useToast } from '@/hooks/use-toast';
import { useParams } from "react-router-dom";


interface ScaFinding {
  id: string;
  scanId: string;
  organization: string;
  platform: string;
  repository: string;
  branch: string;
  vulnerability: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  priority: string;
  description: string;
  installedVersion: string[];
  fixedVersion: string | null;
  title: string;
  component: string[];
  cvss: number;
  epss: number;
  publishedAt: string;
  cweList: string[];
  artifacts: string[];
  timeScanned: string;
  artifactSha: string;
  tool: string;
  exploitation: string;
  automatable: string;
  technicalImpact: string;
}




// const mockScaFindings: ScaFinding[] = [
//   {
//     id: '1',
//     packageName: 'lodash',
//     vulnerability: 'Prototype Pollution',
//     cveId: 'CVE-2019-10744',
//     severity: 'critical',
//     confidence : 'CRITICAL',
//     currentVersion: '4.17.4',
//     upgradeToVersion: '4.17.21',
//     description: 'Prototype pollution vulnerability in lodash allows modification of object properties'
//   },
//   {
//     id: '2',
//     packageName: 'axios',
//     vulnerability: 'Server-Side Request Forgery',
//     cveId: 'CVE-2020-28168',
//     severity: 'high',
//     confidence : 'HIGH',
//     currentVersion: '0.18.0',
//     upgradeToVersion: '0.21.4',
//     description: 'SSRF vulnerability in axios HTTP client library'
//   },
//   {
//     id: '3',
//     packageName: 'express',
//     vulnerability: 'Open Redirect',
//     cveId: 'CVE-2022-24999',
//     severity: 'medium',
//     confidence : 'MEDIUM',
//     currentVersion: '4.16.4',
//     upgradeToVersion: '4.18.2',
//     description: 'Open redirect vulnerability in express.js framework'
//   },
//   {
//     id: '4',
//     packageName: 'moment',
//     vulnerability: 'ReDoS Attack',
//     cveId: 'CVE-2017-18214',
//     severity: 'low',
//     confidence : 'LOW',
//     currentVersion: '2.18.1',
//     upgradeToVersion: '2.29.4',
//     description: 'Regular expression denial of service in moment.js'
//   }
// ];

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

    const { activeHub } = useHub();
    const { toast } = useToast(); 
    const baseUrl = window.REACT_APP_CONFIG.API_BASE_URL || "";
    const getSCA = window.REACT_APP_CONFIG.API_ENDPOINTS.GET_SCA || "";
    const { projectId, organization, repository, branch } = useParams();
    //const [SASTresults, setSASTResults] = useState([]);
  
    const [SCAresults, setSCAResults] = useState<ScaFinding[]>([]);
  
    console.log("SCA - Params:", { projectId, organization, repository, branch });
    
      const getSCAList = async () => {    
    
        try {
          const res = await fetchWithAuth(`${baseUrl}${getSCA}?projectId=${projectId}&hubId=${activeHub?.id}&repository=${repository}&branch=${branch}`);
          
          const data = await res.json();
          
          console.log("setSCAResults List:", data);    
          const rawFindings = data?.data?.vulnerabilityList || [];  
          const scanId = data?.data?.scanId || ''; 
          const platform = data?.data?.platform || 'github';      
  
          // Transform findings to match SCA interface
          const findings: ScaFinding[] = rawFindings.map(
            (item: any, index: number): ScaFinding => ({
              id: `${index}`, // generate unique id if not in API
              scanId,
              organization,
              platform,
              repository,
              branch,
              vulnerability: item.vulnerability || '',
              description: item.description || 'No description provided.',
              title: item.title || '',
              component: item.component || [],
              cvss: item.cvss || 0,
              epss: item.epss || 0,
              publishedAt: item.published_at || '',
              fixedVersion: item.fixed_version,
              cweList: item.cwe_list || [],
              artifacts: item.artifacts || [],
              timeScanned: item.time_scanned || '',
              artifactSha: item.artifact_sha || '',
              tool: item.tool || '',
              exploitation: item.exploitation || '',
              automatable: item.automatable || '',
              technicalImpact: item.technical_impact || '',
              confidence: item.confidence || 'LOW',
              severity: item.severity.charAt(0).toUpperCase() + item.severity.slice(1).toLowerCase() || '',
              // Map severity to match defined types
              //severity: (['Critical', 'High', 'Medium', 'Low'].includes(item.severity) ? item.severity : 'Low') as 'Critical' | 'High' | 'Medium' | 'Low',
              priority: item.priority || 'N/A',
              installedVersion: item.installed_version || []              
            })
          );
  
          setSCAResults(findings);
          
        
        } catch (err) {         
          toast({
            title: "Failed to load SCA List"        
          });
        }
        
      }
    
      useEffect(() => {
        getSCAList();
      }, []);

  // const filteredFindings = mockScaFindings.filter(finding => {
  //   if (severityFilter === 'all') return true;
  //   return finding.severity === severityFilter;
  // }).filter(finding => !ignoredFindings.has(finding.id));

  const handleIgnore = (findingId: string) => {
    setIgnoredFindings(prev => new Set([...prev, findingId]));
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      {/* <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <span className="font-medium">SCA Findings ({SCAresults.length})</span>
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
      </div> */}

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
              {SCAresults.map((finding) => (
                <TableRow key={finding.id}>
                  <TableCell className="font-medium font-mono">
                    {finding.component}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{finding.vulnerability}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(finding.severity)}>
                      {finding.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {finding.installedVersion}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-success font-medium">
                    {finding.fixedVersion}
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
                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleIgnore(finding.id)}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Ignore
                      </Button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {SCAresults.length === 0 && (
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