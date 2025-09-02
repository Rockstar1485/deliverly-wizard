import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  Email,
  Block,
  ReportProblem,
  OpenInNew,
  Mouse,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Mock data
const kpiData = {
  deliverabilityScore: { value: 92, change: '+2.1%', period: '24h' },
  sendVolume: { value: '12.4K', change: '+8.3%', period: '24h' },
  bounceRate: { value: '2.1%', change: '-0.3%', period: '24h' },
  spamRate: { value: '0.8%', change: '-0.1%', period: '24h' },
  openRate: { value: '24.7%', change: '+1.2%', period: '24h' },
  clickRate: { value: '3.2%', change: '+0.4%', period: '24h' },
};

const timeSeriesData = [
  { date: '2024-01-01', sends: 1200, opens: 300, clicks: 38 },
  { date: '2024-01-02', sends: 1800, opens: 450, clicks: 58 },
  { date: '2024-01-03', sends: 1600, opens: 400, clicks: 52 },
  { date: '2024-01-04', sends: 2200, opens: 550, clicks: 71 },
  { date: '2024-01-05', sends: 2000, opens: 500, clicks: 65 },
  { date: '2024-01-06', sends: 1900, opens: 475, clicks: 61 },
  { date: '2024-01-07', sends: 2400, opens: 600, clicks: 78 },
];

const providerData = [
  { name: 'Gmail', value: 45, color: '#EA4335' },
  { name: 'Outlook', value: 30, color: '#0078D4' },
  { name: 'Yahoo', value: 15, color: '#720E9E' },
  { name: 'Other', value: 10, color: '#34A853' },
];

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  period: string;
  icon: React.ReactNode;
  isPositive?: boolean;
}

function KPICard({ title, value, change, period, icon, isPositive = true }: KPICardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            {icon}
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
          <Chip
            label={`${period}`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        </Box>
        
        <Typography variant="h4" fontWeight="bold" mb={1}>
          {value}
        </Typography>
        
        <Typography
          variant="body2"
          color={isPositive ? 'success.main' : 'error.main'}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <TrendingUp fontSize="small" />
          {change}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Dashboard
      </Typography>
      
      {/* KPI Cards */}
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={3} mb={4}>
        <KPICard
          title="Deliverability Score"
          value={kpiData.deliverabilityScore.value.toString()}
          change={kpiData.deliverabilityScore.change}
          period={kpiData.deliverabilityScore.period}
          icon={<TrendingUp color="success" />}
        />
        <KPICard
          title="Send Volume"
          value={kpiData.sendVolume.value}
          change={kpiData.sendVolume.change}
          period={kpiData.sendVolume.period}
          icon={<Email color="primary" />}
        />
        <KPICard
          title="Bounce Rate"
          value={kpiData.bounceRate.value}
          change={kpiData.bounceRate.change}
          period={kpiData.bounceRate.period}
          icon={<Block color="warning" />}
          isPositive={false}
        />
        <KPICard
          title="Spam Rate"
          value={kpiData.spamRate.value}
          change={kpiData.spamRate.change}
          period={kpiData.spamRate.period}
          icon={<ReportProblem color="error" />}
          isPositive={false}
        />
        <KPICard
          title="Open Rate"
          value={kpiData.openRate.value}
          change={kpiData.openRate.change}
          period={kpiData.openRate.period}
          icon={<OpenInNew color="info" />}
        />
        <KPICard
          title="Click Rate"
          value={kpiData.clickRate.value}
          change={kpiData.clickRate.change}
          period={kpiData.clickRate.period}
          icon={<Mouse color="secondary" />}
        />
      </Box>

      {/* Charts */}
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', lg: '2fr 1fr' }} gap={3}>
        {/* Time Series Chart */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Email Activity (Last 7 Days)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <Area type="monotone" dataKey="sends" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="opens" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="clicks" stackId="3" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>

        {/* Provider Mix Chart */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Mailbox Provider Mix
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={providerData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {providerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
}