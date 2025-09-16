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
import { Shield, Eye, MessageSquare, X ,Cog} from 'lucide-react';

interface SastFinding {
  id: string;
  ruleName: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  confidence: 'High' | 'Medium' | 'Low';
  filePath: string;
  description: string;
  codeSnippet: string;
}

const mockSastFindings: SastFinding[] = [
  {
    id: '1',
    ruleName: 'SQL Injection',
    severity: 'Critical',
    confidence: 'High',
    filePath: 'src/api/users.ts',
    description: 'SQL injection vulnerability detected in user query',
    codeSnippet: 'const query = `SELECT * FROM users WHERE id = ${userId}`;'
  },
  {
    id: '2',
    ruleName: 'XSS Vulnerability',
    severity: 'High',
    confidence: 'Medium',
    filePath: 'src/components/UserProfile.tsx',
    description: 'Potential XSS vulnerability in user input rendering',
    codeSnippet: 'dangerouslySetInnerHTML={{ __html: userContent }}'
  },
  {
    id: '3',
    ruleName: 'Hardcoded Secrets',
    severity: 'High',
    confidence: 'High',
    filePath: 'src/config/database.ts',
    description: 'Database credentials hardcoded in source code',
    codeSnippet: 'const PASSWORD = "admin123";'
  },
  {
    id: '4',
    ruleName: 'Insecure Random',
    severity: 'Medium',
    confidence: 'Medium',
    filePath: 'src/utils/token.ts',
    description: 'Using Math.random() for security-sensitive operations',
    codeSnippet: 'const token = Math.random().toString(36);'
  }
];

interface SastFindingsTableProps {
  onRemediate: (finding: SastFinding) => void;
  onViewDetail: (finding: SastFinding) => void;
}

const getSeverityVariant = (severity: string) => {
  switch (severity) {
    case 'Critical':
      return 'destructive';
    case 'High':
      return 'default';
    case 'Medium':
      return 'secondary';
    case 'Low':
      return 'outline';
    default:
      return 'outline';
  }
};

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

export function SastFindingsTable({ onRemediate, onViewDetail }: SastFindingsTableProps) {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [ignoredFindings, setIgnoredFindings] = useState<Set<string>>(new Set());

  const filteredFindings = mockSastFindings.filter(finding => {
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
          <Shield className="h-4 w-4 text-primary" />
          <span className="font-medium">SAST Findings ({filteredFindings.length})</span>
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
                <TableHead>Rule Name</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>File Path</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFindings.map((finding) => (
                <TableRow key={finding.id}>
                  <TableCell className="font-medium">{finding.ruleName}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(finding.severity)}>
                      {finding.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{finding.confidence}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {finding.filePath}
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
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No SAST findings found
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