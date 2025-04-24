import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  RefreshCcwIcon,
  UsersIcon,
  MailIcon,
  GlobeIcon,
  ServerIcon,
  BarChartIcon,
  PieChartIcon,
  TrendingUpIcon,
  ClockIcon,
  CalendarIcon,
  SearchIcon,
  FilterIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for when API is not available
const mockVisitorData = [
  { name: "Jan", visitors: 1200, uniqueVisitors: 800 },
  { name: "Feb", visitors: 1900, uniqueVisitors: 1400 },
  { name: "Mar", visitors: 1500, uniqueVisitors: 1000 },
  { name: "Apr", visitors: 2200, uniqueVisitors: 1800 },
  { name: "May", visitors: 2800, uniqueVisitors: 2200 },
  { name: "Jun", visitors: 2600, uniqueVisitors: 2000 },
];

const mockReferrerData = [
  { name: "Direct", value: 45 },
  { name: "Search", value: 30 },
  { name: "Social", value: 15 },
  { name: "Email", value: 10 },
];

const COLORS = ["#8B5CF6", "#0EA5E9", "#F97316", "#10B981", "#EF4444"];

const Statistics = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("30days");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/stats?timeRange=${timeRange}`);
      setStats(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching statistics:", err);
      setError(err.response?.data?.message || "Failed to load statistics");
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
    toast.success("Statistics refreshed");
  };

  // Format large numbers with K, M, B suffixes
  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + "B";
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Format uptime from seconds to human-readable format
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Calculate trend percentage
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Statistics Dashboard
          </h1>
          <Button variant="outline" size="sm" disabled>
            <RefreshCcwIcon className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="mb-2 h-8 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent className="flex h-[300px] items-center justify-center">
            <Skeleton className="h-full w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">
            Error Loading Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={handleRefresh}>
            Try Again <RefreshCcwIcon className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Use real data if available, otherwise use mock data
  const visitorData = stats?.visitorStats?.dailyData || mockVisitorData;
  const referrerData =
    stats?.visitorStats?.topReferrers?.map((ref: any) => ({
      name: ref.url || "Direct",
      value: ref.count,
    })) || mockReferrerData;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Statistics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor your website performance and user engagement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last quarter</SelectItem>
              <SelectItem value="365days">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCcwIcon
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {formatNumber(stats?.visitors?.total || 0)}
                  </div>
                  <div className="mt-1 flex items-center">
                    {stats?.visitors?.trend > 0 ? (
                      <Badge variant="success" className="text-xs">
                        <ArrowUpIcon className="mr-1 h-3 w-3" />
                        {Math.abs(stats?.visitors?.trend || 0).toFixed(1)}%
                      </Badge>
                    ) : (
                      <Badge variant="default" className="text-xs">
                        <ArrowDownIcon className="mr-1 h-3 w-3" />
                        {Math.abs(stats?.visitors?.trend || 0).toFixed(1)}%
                      </Badge>
                    )}
                    <span className="ml-2 text-xs text-muted-foreground">
                      vs prev. period
                    </span>
                  </div>
                </div>
                <GlobeIcon className="h-8 w-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {stats?.visitors?.today || 0}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    <span className="font-medium">
                      {stats?.visitors?.unique || 0}
                    </span>{" "}
                    unique visitors
                  </div>
                </div>
                <UsersIcon className="h-8 w-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Contact Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {stats?.contacts?.total || 0}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    <span className="font-medium">
                      {stats?.contacts?.new || 0}
                    </span>{" "}
                    new messages
                  </div>
                </div>
                <MailIcon className="h-8 w-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {stats?.services || 0}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    <span className="font-medium">{stats?.users || 0}</span>{" "}
                    active users
                  </div>
                </div>
                <BarChartIcon className="h-8 w-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="traffic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="traffic">Traffic Analysis</TabsTrigger>
          <TabsTrigger value="referrers">Referral Sources</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Traffic Over Time</CardTitle>
              <CardDescription>
                Analysis of website traffic trend
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={visitorData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="visitors"
                      name="Total Visitors"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="uniqueVisitors"
                      name="Unique Visitors"
                      stroke="#0EA5E9"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>
                  Most visited pages on your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(stats?.visitorStats?.topPages || []).map(
                    (page: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                            {index + 1}
                          </div>
                          <span className="max-w-[200px] truncate text-sm font-medium">
                            {page.path || "/page"}
                          </span>
                        </div>
                        <Badge variant="secondary">
                          {page.count || 0} views
                        </Badge>
                      </div>
                    ),
                  )}
                  {(!stats?.visitorStats?.topPages ||
                    stats?.visitorStats?.topPages.length === 0) && (
                    <div className="py-6 text-center text-muted-foreground">
                      No page view data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Avg. Daily Traffic
                    </span>
                    <span className="font-bold">
                      {stats?.visitorStats?.summary?.averageDailyVisits || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Total Unique Visitors
                    </span>
                    <span className="font-bold">
                      {stats?.visitorStats?.summary?.totalUniqueVisits || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Bounce Rate</span>
                    <span className="font-bold">
                      {stats?.visitorStats?.bounceRate || "42%"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Avg. Visit Duration
                    </span>
                    <span className="font-bold">
                      {stats?.visitorStats?.avgDuration || "2m 32s"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="referrers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Referral Sources</CardTitle>
              <CardDescription>
                Where your visitors are coming from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={referrerData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {referrerData.map((entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Top Referrers</h3>
                  {(stats?.visitorStats?.topReferrers || []).map(
                    (referrer: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div
                            className="mr-3 h-3 w-3 rounded-full"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          ></div>
                          <span className="max-w-[200px] truncate text-sm font-medium">
                            {referrer.url || "Direct"}
                          </span>
                        </div>
                        <Badge variant="outline">{referrer.count || 0}</Badge>
                      </div>
                    ),
                  )}
                  {(!stats?.visitorStats?.topReferrers ||
                    stats?.visitorStats?.topReferrers.length === 0) && (
                    <div className="py-6 text-center text-muted-foreground">
                      No referrer data available
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Server and application performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <ServerIcon className="mr-2 h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">
                      Server Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                        <p className="font-medium">
                          {stats?.system?.status || "Active"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Uptime</p>
                      <p className="font-medium">
                        {stats?.system?.uptime
                          ? formatUptime(stats.system.uptime)
                          : "3d 12h 45m"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Node Version
                      </p>
                      <p className="font-medium">
                        {stats?.system?.nodeVersion || "v18.x"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Memory Usage
                      </p>
                      <p className="font-medium">
                        {stats?.system?.memory?.heapUsed
                          ? `${Math.round(stats.system.memory.heapUsed / 1024 / 1024)} MB`
                          : "420 MB"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <TrendingUpIcon className="mr-2 h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">
                      Performance Metrics
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex justify-between">
                        <span className="text-sm font-medium">CPU Usage</span>
                        <span className="text-sm font-medium">
                          {stats?.system?.cpu || "28%"}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: stats?.system?.cpu || "28%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex justify-between">
                        <span className="text-sm font-medium">Memory</span>
                        <span className="text-sm font-medium">
                          {stats?.system?.memoryPercentage || "45%"}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{
                            width: stats?.system?.memoryPercentage || "45%",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex justify-between">
                        <span className="text-sm font-medium">Disk</span>
                        <span className="text-sm font-medium">
                          {stats?.system?.diskUsage || "62%"}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: stats?.system?.diskUsage || "62%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-3">
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleString()}
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
