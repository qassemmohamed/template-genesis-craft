import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  CalendarIcon,
  TrendingUpIcon,
  UsersIcon,
  ClockIcon,
  DollarSignIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const serviceData = [
  { name: "Tax Filing", value: 42 },
  { name: "Bookkeeping", value: 28 },
  { name: "Translation", value: 15 },
  { name: "Immigration", value: 10 },
  { name: "Notary", value: 5 },
];

const revenueData = [
  {
    name: "Jan",
    tax: 3200,
    bookkeeping: 1800,
    translation: 900,
    immigration: 1200,
    notary: 400,
  },
  {
    name: "Feb",
    tax: 2800,
    bookkeeping: 2000,
    translation: 1100,
    immigration: 1000,
    notary: 500,
  },
  {
    name: "Mar",
    tax: 3500,
    bookkeeping: 2200,
    translation: 1300,
    immigration: 1500,
    notary: 600,
  },
  {
    name: "Apr",
    tax: 4500,
    bookkeeping: 2400,
    translation: 1500,
    immigration: 1800,
    notary: 700,
  },
  {
    name: "May",
    tax: 3800,
    bookkeeping: 2100,
    translation: 1200,
    immigration: 1400,
    notary: 500,
  },
  {
    name: "Jun",
    tax: 3000,
    bookkeeping: 1900,
    translation: 1000,
    immigration: 1100,
    notary: 400,
  },
];

const clientData = [
  { name: "New Clients", value: 24 },
  { name: "Returning Clients", value: 76 },
];

const languageData = [
  { name: "English", value: 45 },
  { name: "Arabic", value: 35 },
  { name: "French", value: 20 },
];

const taskStatusData = [
  { name: "Completed", value: 68 },
  { name: "In Progress", value: 22 },
  { name: "Overdue", value: 10 },
];

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// Key metrics
const keyMetrics = [
  {
    title: "Total Clients",
    value: "187",
    change: "+12%",
    trend: "up",
    icon: <UsersIcon className="h-5 w-5" />,
  },
  {
    title: "Completed Services",
    value: "342",
    change: "+8%",
    trend: "up",
    icon: <ClockIcon className="h-5 w-5" />,
  },
  {
    title: "Monthly Revenue",
    value: "$14,500",
    change: "+15%",
    trend: "up",
    icon: <DollarSignIcon className="h-5 w-5" />,
  },
  {
    title: "On-time Delivery",
    value: "98%",
    change: "+2%",
    trend: "up",
    icon: <CalendarIcon className="h-5 w-5" />,
  },
];

const SmartReports: React.FC = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<string>("month");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Business Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--paragraph)]">
                    {metric.title}
                  </p>
                  <p className="mt-1 text-2xl font-bold">{metric.value}</p>
                </div>
                <div
                  className={`rounded-full p-3 ${
                    metric.trend === "up"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {metric.icon}
                </div>
              </div>
              <div className="mt-2">
                <span
                  className={`text-xs ${
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.change} vs previous {timeRange}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="service" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="service">Service Distribution</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
          <TabsTrigger value="clients">Client Analytics</TabsTrigger>
          <TabsTrigger value="tasks">Task Performance</TabsTrigger>
        </TabsList>

        {/* Service Distribution Tab */}
        <TabsContent value="service">
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Service Distribution</CardTitle>
                <CardDescription>
                  Breakdown of services by percentage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {serviceData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Language Distribution</CardTitle>
                <CardDescription>Service requests by language</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={languageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {languageData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Monthly Revenue by Service</CardTitle>
              <CardDescription>
                Financial performance breakdown by service type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                    <Bar dataKey="tax" name="Tax Filing" fill="#0088FE" />
                    <Bar
                      dataKey="bookkeeping"
                      name="Bookkeeping"
                      fill="#00C49F"
                    />
                    <Bar
                      dataKey="translation"
                      name="Translation"
                      fill="#FFBB28"
                    />
                    <Bar
                      dataKey="immigration"
                      name="Immigration"
                      fill="#FF8042"
                    />
                    <Bar dataKey="notary" name="Notary" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients">
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Client Retention</CardTitle>
                <CardDescription>New vs returning clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clientData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        <Cell fill="#0088FE" />
                        <Cell fill="#00C49F" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Clients</CardTitle>
                <CardDescription>
                  Clients by service utilization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Ahmed Khan", services: 12, revenue: "$4,500" },
                    { name: "Maria Garcia", services: 8, revenue: "$3,200" },
                    { name: "Jean Dupont", services: 7, revenue: "$2,800" },
                    { name: "John Smith", services: 6, revenue: "$2,400" },
                    { name: "Fatima Rahman", services: 5, revenue: "$2,000" },
                  ].map((client, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b p-3"
                    >
                      <div className="flex items-center">
                        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-[var(--paragraph)]">
                            {client.services} services
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{client.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Task Completion Status</CardTitle>
                <CardDescription>
                  Overview of task completion rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        <Cell fill="#00C49F" /> {/* Completed */}
                        <Cell fill="#FFBB28" /> {/* In Progress */}
                        <Cell fill="#FF8042" /> {/* Overdue */}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>
                  Tasks with approaching deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      task: "Tax Filing for Ahmed Khan",
                      deadline: "2024-04-15",
                      status: "high",
                    },
                    {
                      task: "Immigration Form for Maria Garcia",
                      deadline: "2024-04-18",
                      status: "high",
                    },
                    {
                      task: "Bookkeeping for Jean Dupont",
                      deadline: "2024-04-20",
                      status: "medium",
                    },
                    {
                      task: "Translation for John Smith",
                      deadline: "2024-04-22",
                      status: "medium",
                    },
                    {
                      task: "Notary for Fatima Rahman",
                      deadline: "2024-04-25",
                      status: "low",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b p-3"
                    >
                      <div>
                        <p className="font-medium">{item.task}</p>
                        <div className="mt-1 flex items-center">
                          <CalendarIcon className="mr-1 h-3 w-3 text-[var(--paragraph)]" />
                          <span className="text-sm text-[var(--paragraph)]">
                            {new Date(item.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            item.status === "high"
                              ? "bg-red-100 text-red-800"
                              : item.status === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.status} priority
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartReports;
