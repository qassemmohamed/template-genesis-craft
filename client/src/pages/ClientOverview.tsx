import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
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
  BarChart3,
  MessageSquare,
  LayoutDashboard,
  Activity,
  FileText,
  Clock,
  CalendarDays,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { api } from "@/utils/api";
import { DashboardNavbar } from "@/components/layouts/navbar/dashboard/DashboardNavbar";

interface ClientFeature {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  icon: React.ReactNode;
}

interface ServiceStatus {
  id: string;
  name: string;
  status: "pending" | "in-progress" | "completed";
  updated: string;
}

const ClientOverview: React.FC = () => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<ClientFeature[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);

  // This would be replaced with actual data from your API
  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true);
      try {
        // In a real implementation, fetch from server
        // const response = await api.get("/client/dashboard");

        // Sample data for demonstration
        const sampleFeatures: ClientFeature[] = [
          {
            id: "1",
            name: "Document Extractor",
            description: "Extract data from your documents automatically",
            isEnabled: true,
            icon: <FileText className="h-6 w-6 text-blue-500" />,
          },
          {
            id: "2",
            name: "Service Tracker",
            description: "Track the progress of your services",
            isEnabled: true,
            icon: <Activity className="h-6 w-6 text-green-500" />,
          },
          {
            id: "3",
            name: "Calendar Integration",
            description: "Schedule meetings with our team",
            isEnabled: true,
            icon: <CalendarDays className="h-6 w-6 text-purple-500" />,
          },
          {
            id: "4",
            name: "Report Generator",
            description: "Generate reports for your business",
            isEnabled: false,
            icon: <BarChart3 className="h-6 w-6 text-orange-500" />,
          },
        ];

        const sampleServices: ServiceStatus[] = [
          {
            id: "1",
            name: "Tax Filing 2023",
            status: "in-progress",
            updated: "2023-12-01",
          },
          {
            id: "2",
            name: "Business Consultation",
            status: "pending",
            updated: "2023-11-20",
          },
          {
            id: "3",
            name: "Financial Planning",
            status: "completed",
            updated: "2023-10-15",
          },
        ];

        setFeatures(sampleFeatures);
        setServices(sampleServices);
      } catch (error) {
        console.error("Error fetching client data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-[var(--headline)] border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in-progress":
        return <Activity className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <DashboardNavbar />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--headline)]">
            Welcome back, {user?.fullName || user?.username || "Client"}!
          </h1>
          <p className="text-[var(--paragraph)]">
            Here's what's happening with your account today.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="border border-[var(--border)] bg-[var(--card)]">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-[var(--accent)] data-[state=active]:text-[var(--accent-foreground)]"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="services"
            className="data-[state=active]:bg-[var(--accent)] data-[state=active]:text-[var(--accent-foreground)]"
          >
            <Activity className="mr-2 h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger
            value="messages"
            className="data-[state=active]:bg-[var(--accent)] data-[state=active]:text-[var(--accent-foreground)]"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-[var(--border)] bg-[var(--card)]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[var(--card-foreground)]">
                  Active Services
                </CardTitle>
                <Activity className="h-4 w-4 text-[var(--muted-foreground)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[var(--headline)]">
                  {services.filter((s) => s.status !== "completed").length}
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  +2 from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-[var(--border)] bg-[var(--card)]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[var(--card-foreground)]">
                  Unread Messages
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-[var(--muted-foreground)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[var(--headline)]">
                  3
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  +1 new since yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="border-[var(--border)] bg-[var(--card)]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[var(--card-foreground)]">
                  Available Features
                </CardTitle>
                <LayoutDashboard className="h-4 w-4 text-[var(--muted-foreground)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[var(--headline)]">
                  {features.filter((f) => f.isEnabled).length}
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {features.length - features.filter((f) => f.isEnabled).length}{" "}
                  disabled
                </p>
              </CardContent>
            </Card>

            <Card className="border-[var(--border)] bg-[var(--card)]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[var(--card-foreground)]">
                  Completed Tasks
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-[var(--muted-foreground)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[var(--headline)]">
                  {services.filter((s) => s.status === "completed").length}
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  All tasks are up to date
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card className="border-[var(--border)] bg-[var(--card)]">
              <CardHeader>
                <CardTitle className="text-[var(--headline)]">
                  Available Features
                </CardTitle>
                <CardDescription className="text-[var(--paragraph)]">
                  Features enabled for your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {features.map((feature) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center rounded-lg border p-3 ${feature.isEnabled ? "border-[var(--accent)] bg-[var(--accent-subtle)]" : "border-[var(--border)] bg-[var(--muted)]"}`}
                    >
                      <div className="mr-3">{feature.icon}</div>
                      <div>
                        <h3 className="font-medium text-[var(--headline)]">
                          {feature.name}
                        </h3>
                        <p className="text-sm text-[var(--paragraph)]">
                          {feature.description}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${feature.isEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-[var(--headline)]"}`}
                        >
                          {feature.isEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[var(--border)] bg-[var(--card)]">
              <CardHeader>
                <CardTitle className="text-[var(--headline)]">
                  Service Status
                </CardTitle>
                <CardDescription className="text-[var(--paragraph)]">
                  Your active and recent services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card-background)] p-3"
                    >
                      <div>
                        <h3 className="font-medium text-[var(--headline)]">
                          {service.name}
                        </h3>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          Last updated: {service.updated}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(service.status)}`}
                        >
                          {getStatusIcon(service.status)}
                          {service.status.charAt(0).toUpperCase() +
                            service.status.slice(1)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <button className="text-sm text-[var(--link-color)] hover:underline">
                  View all services
                </button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services">
          <Card className="border-[var(--border)] bg-[var(--card)]">
            <CardHeader>
              <CardTitle className="text-[var(--headline)]">
                My Services
              </CardTitle>
              <CardDescription className="text-[var(--paragraph)]">
                View and manage your active services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-lg border border-[var(--border)] bg-[var(--card-background)] p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-lg font-medium text-[var(--headline)]">
                        {service.name}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(service.status)}`}
                      >
                        {getStatusIcon(service.status)}
                        {service.status.charAt(0).toUpperCase() +
                          service.status.slice(1)}
                      </span>
                    </div>
                    <p className="mb-4 text-sm text-[var(--paragraph)]">
                      Last updated on {service.updated}
                    </p>
                    <div className="flex gap-2">
                      <button className="rounded-md bg-[var(--button)] px-3 py-1 text-sm text-[var(--button-foreground)] transition-colors hover:bg-[var(--button-hover)]">
                        View Details
                      </button>
                      <button className="rounded-md border border-[var(--border)] bg-transparent px-3 py-1 text-sm text-[var(--paragraph)] transition-colors hover:bg-[var(--accent-subtle)]">
                        Request Update
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card className="border-[var(--border)] bg-[var(--card)]">
            <CardHeader>
              <CardTitle className="text-[var(--headline)]">
                My Messages
              </CardTitle>
              <CardDescription className="text-[var(--paragraph)]">
                Communications with our team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-lg border border-[var(--accent)] bg-[var(--accent-subtle)] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-medium text-[var(--headline)]">
                          Tax Filing Update
                        </h3>
                        <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                          New
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-[var(--paragraph)]">
                        We've reviewed your documents and need additional
                        information for your tax filing. Please check the
                        attachment.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--muted-foreground)]">
                          Dec 2, 2023 - Admin Team
                        </span>
                        <button className="text-xs text-[var(--link-color)] hover:underline">
                          View Message
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-lg border border-[var(--border)] bg-[var(--card-background)] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <MessageSquare className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-medium text-[var(--headline)]">
                        Appointment Confirmation
                      </h3>
                      <p className="mb-2 text-sm text-[var(--paragraph)]">
                        Your appointment with Sarah Jones has been confirmed for
                        December 10th at 2:00 PM.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--muted-foreground)]">
                          Nov 28, 2023 - Scheduling Team
                        </span>
                        <button className="text-xs text-[var(--link-color)] hover:underline">
                          View Message
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-lg border border-[var(--border)] bg-[var(--card-background)] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <MessageSquare className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-medium text-[var(--headline)]">
                        Welcome to SamTax
                      </h3>
                      <p className="mb-2 text-sm text-[var(--paragraph)]">
                        Thank you for choosing SamTax for your tax and
                        accounting needs. We're excited to work with you!
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--muted-foreground)]">
                          Nov 15, 2023 - Support Team
                        </span>
                        <button className="text-xs text-[var(--link-color)] hover:underline">
                          View Message
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <button className="text-sm text-[var(--link-color)] hover:underline">
                View all messages
              </button>
              <button className="rounded-md bg-[var(--button)] px-3 py-1 text-sm text-[var(--button-foreground)] transition-colors hover:bg-[var(--button-hover)]">
                New Message
              </button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientOverview;
