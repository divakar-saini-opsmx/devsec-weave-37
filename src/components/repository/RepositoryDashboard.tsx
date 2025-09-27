import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, GitCommit, GitBranch, Activity, Shield, Package, AlertTriangle, CheckCircle2 } from 'lucide-react';

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

interface RepositoryDashboardProps {
  repository: Repository;
}

// Mock data for charts
const scanFrequencyData = [
  { date: '2024-01-01', scans: 2 },
  { date: '2024-01-05', scans: 3 },
  { date: '2024-01-10', scans: 1 },
  { date: '2024-01-15', scans: 4 },
  { date: '2024-01-20', scans: 2 },
];

const issuesOverTimeData = [
  { date: '2024-01-01', closed: 15, opened: 8 },
  { date: '2024-01-05', closed: 12, opened: 5 },
  { date: '2024-01-10', closed: 18, opened: 3 },
  { date: '2024-01-15', closed: 20, opened: 7 },
  { date: '2024-01-20', closed: 16, opened: 4 },
];

const mockScans = [
  {
    id: 'scan-1',
    name: 'Security Audit - Main Branch',
    branch: 'main',
    commitId: 'a1b2c3d',
    time: '2024-01-15T10:30:00Z',
    issues: { critical: 2, high: 5, medium: 12, low: 8 }
  },
  {
    id: 'scan-2',
    name: 'Daily Security Check',
    branch: 'main',
    commitId: 'e4f5g6h',
    time: '2024-01-14T09:15:00Z',
    issues: { critical: 1, high: 4, medium: 10, low: 6 }
  },
  {
    id: 'scan-3',
    name: 'Pre-deployment Scan',
    branch: 'develop',
    commitId: 'i7j8k9l',
    time: '2024-01-13T16:45:00Z',
    issues: { critical: 0, high: 2, medium: 8, low: 12 }
  },
];

const COLORS = ['hsl(var(--destructive))', 'hsl(var(--orange-500))', 'hsl(var(--yellow-500))', 'hsl(var(--blue-500))'];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-destructive text-destructive-foreground';
    case 'high':
      return 'bg-orange-500 text-white hover:bg-orange-600';
    case 'medium':
      return 'bg-yellow-500 text-white hover:bg-yellow-600';
    case 'low':
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

export function RepositoryDashboard() {
  // const totalFindings = repository.findings.critical + repository.findings.high + 
  //                      repository.findings.medium + repository.findings.low;

  // const vulnerabilityData = [
  //   { name: 'Critical', value: repository.findings.critical, color: COLORS[0] },
  //   { name: 'High', value: repository.findings.high, color: COLORS[1] },
  //   { name: 'Medium', value: repository.findings.medium, color: COLORS[2] },
  //   { name: 'Low', value: repository.findings.low, color: COLORS[3] },
  // ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Top Section - Metrics Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> */}
        {/* Scan Frequency */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card> */}

        {/* Open Issues */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFindings}</div>
            <p className="text-xs text-muted-foreground">Across all severity levels</p>
          </CardContent>
        </Card> */}

        {/* Total Vulnerabilities */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Found</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground">All-time discoveries</p>
          </CardContent>
        </Card> */}

        {/* Closed Issues */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">58</div>
            <p className="text-xs text-muted-foreground">Fixed issues</p>
          </CardContent>
        </Card> */}
      {/* </div> */}

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Scan Frequency Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Scan Frequency Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={scanFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="scans" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vulnerability Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Current Vulnerabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                {/* <Pie
                  data={vulnerabilityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {vulnerabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie> */}
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issues Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Issues Resolution Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={issuesOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="closed" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="opened" stroke="hsl(var(--destructive))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Scans History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Scans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scan Name</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Commit ID</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Issues Found</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockScans.map((scan) => (
                <TableRow key={scan.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{scan.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <GitBranch className="h-3 w-3 text-muted-foreground" />
                      {scan.branch}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <GitCommit className="h-3 w-3 text-muted-foreground" />
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {scan.commitId}
                      </code>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(scan.time)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {scan.issues.critical > 0 && (
                        <Badge className={getSeverityColor('critical')} variant="secondary">
                          {scan.issues.critical}
                        </Badge>
                      )}
                      {scan.issues.high > 0 && (
                        <Badge className={getSeverityColor('high')} variant="secondary">
                          {scan.issues.high}
                        </Badge>
                      )}
                      {scan.issues.medium > 0 && (
                        <Badge className={getSeverityColor('medium')} variant="secondary">
                          {scan.issues.medium}
                        </Badge>
                      )}
                      {scan.issues.low > 0 && (
                        <Badge className={getSeverityColor('low')} variant="secondary">
                          {scan.issues.low}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}