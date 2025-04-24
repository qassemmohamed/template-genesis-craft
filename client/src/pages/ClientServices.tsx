import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  LucideActivity,
  FileText,
  Calendar,
  BarChart,
  ExternalLink,
  Download,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "pending";
  startDate: string;
  endDate?: string;
  progress: number;
  documents: {
    id: string;
    name: string;
    uploadDate: string;
    status: "approved" | "pending" | "rejected";
  }[];
  meetings: {
    id: string;
    title: string;
    date: string;
    time: string;
    duration: string;
    location: string;
    status: "upcoming" | "completed" | "canceled";
  }[];
}

const ClientServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        // Simulated API call - In a real app, fetch from your backend
        // const response = await api.get("/client/services");

        // Sample data for demonstration
        const mockServices: Service[] = [
          {
            id: "svc1",
            name: "Tax Filing 2023",
            description:
              "Complete personal tax filing service for the 2023 tax year including preparation, review, and submission.",
            status: "active",
            startDate: "2023-11-10",
            progress: 60,
            documents: [
              {
                id: "doc1",
                name: "W-2 Form.pdf",
                uploadDate: "2023-11-15",
                status: "approved",
              },
              {
                id: "doc2",
                name: "Investment Statements.pdf",
                uploadDate: "2023-11-20",
                status: "approved",
              },
              {
                id: "doc3",
                name: "Business Expenses.xlsx",
                uploadDate: "2023-11-25",
                status: "pending",
              },
            ],
            meetings: [
              {
                id: "meet1",
                title: "Initial Tax Consultation",
                date: "2023-11-15",
                time: "10:00 AM",
                duration: "60 min",
                location: "Video Call",
                status: "completed",
              },
              {
                id: "meet2",
                title: "Tax Filing Review",
                date: "2023-12-10",
                time: "2:00 PM",
                duration: "45 min",
                location: "Video Call",
                status: "upcoming",
              },
            ],
          },
          {
            id: "svc2",
            name: "Business Consultation",
            description:
              "Strategic business planning and financial analysis to optimize operations and tax efficiency.",
            status: "pending",
            startDate: "2023-12-05",
            progress: 0,
            documents: [],
            meetings: [
              {
                id: "meet3",
                title: "Initial Business Consultation",
                date: "2023-12-05",
                time: "11:00 AM",
                duration: "90 min",
                location: "Video Call",
                status: "upcoming",
              },
            ],
          },
          {
            id: "svc3",
            name: "Financial Planning",
            description:
              "Comprehensive financial planning including retirement, investment, and tax strategy.",
            status: "completed",
            startDate: "2023-09-01",
            endDate: "2023-10-15",
            progress: 100,
            documents: [
              {
                id: "doc4",
                name: "Financial Plan.pdf",
                uploadDate: "2023-10-10",
                status: "approved",
              },
              {
                id: "doc5",
                name: "Investment Recommendations.pdf",
                uploadDate: "2023-10-12",
                status: "approved",
              },
            ],
            meetings: [
              {
                id: "meet4",
                title: "Financial Planning Session",
                date: "2023-09-10",
                time: "1:00 PM",
                duration: "60 min",
                location: "In Person",
                status: "completed",
              },
              {
                id: "meet5",
                title: "Financial Plan Review",
                date: "2023-10-05",
                time: "3:30 PM",
                duration: "45 min",
                location: "Video Call",
                status: "completed",
              },
            ],
          },
        ];

        setServices(mockServices);
        if (mockServices.length > 0) {
          setSelectedService(mockServices[0]);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getStatusColors = (status: string) => {
    switch (status) {
      case "active":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
          icon: <LucideActivity className="h-4 w-4" />,
        };
      case "completed":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
          icon: <CheckCircle className="h-4 w-4" />,
        };
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
          icon: <Clock className="h-4 w-4" />,
        };
      case "approved":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
        };
      case "rejected":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
        };
      case "upcoming":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
        };
      case "canceled":
        return {
          bg: "bg-gray-100",
          text: "text-[var(--headline)]",
          border: "border-gray-200",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-[var(--headline)]",
          border: "border-gray-200",
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--headline)]">
            My Services
          </h1>
          <p className="text-[var(--paragraph)]">
            Manage and track your active services
          </p>
        </div>
        <Button className="bg-[var(--button)] text-[var(--button-foreground)] hover:bg-[var(--button-hover)]">
          Request New Service
        </Button>
      </div>

      <div className="flex flex-col space-y-6 lg:flex-row lg:space-x-6 lg:space-y-0">
        {/* Service List */}
        <div className="lg:w-1/3">
          <Card className="border-[var(--border)] bg-[var(--card)]">
            <CardHeader>
              <CardTitle className="text-[var(--headline)]">
                Your Services
              </CardTitle>
              <CardDescription className="text-[var(--paragraph)]">
                {services.filter((s) => s.status === "active").length} active,{" "}
                {services.filter((s) => s.status === "completed").length}{" "}
                completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                      selectedService?.id === service.id
                        ? "border-[var(--accent)] bg-[var(--accent-subtle)]"
                        : "border-[var(--border)] bg-[var(--card-background)] hover:bg-[var(--hover)]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-[var(--headline)]">
                          {service.name}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--paragraph)]">
                          Started {formatDate(service.startDate)}
                        </p>
                      </div>
                      <Badge
                        className={`${getStatusColors(service.status).bg} ${getStatusColors(service.status).text} border ${getStatusColors(service.status).border} flex items-center gap-1`}
                      >
                        {getStatusColors(service.status).icon}
                        {service.status.charAt(0).toUpperCase() +
                          service.status.slice(1)}
                      </Badge>
                    </div>
                    {service.status === "active" && (
                      <div className="mt-2">
                        <div className="mb-1 flex justify-between text-xs text-[var(--muted-foreground)]">
                          <span>Progress</span>
                          <span>{service.progress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${service.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Details */}
        <div className="lg:w-2/3">
          {selectedService ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={selectedService.id}
            >
              <Card className="border-[var(--border)] bg-[var(--card)]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge
                        className={`mb-2 ${getStatusColors(selectedService.status).bg} ${getStatusColors(selectedService.status).text} border ${getStatusColors(selectedService.status).border} flex items-center gap-1`}
                      >
                        {getStatusColors(selectedService.status).icon}
                        {selectedService.status.charAt(0).toUpperCase() +
                          selectedService.status.slice(1)}
                      </Badge>
                      <CardTitle className="text-xl text-[var(--headline)]">
                        {selectedService.name}
                      </CardTitle>
                      <CardDescription className="mt-1 text-[var(--paragraph)]">
                        {selectedService.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[var(--border)] text-[var(--paragraph)]"
                      >
                        <MessageSquare className="mr-1 h-4 w-4" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList className="border border-[var(--border)] bg-[var(--card-background)]">
                      <TabsTrigger
                        value="overview"
                        className="data-[state=active]:bg-[var(--accent)] data-[state=active]:text-[var(--accent-foreground)]"
                      >
                        Overview
                      </TabsTrigger>
                      <TabsTrigger
                        value="documents"
                        className="data-[state=active]:bg-[var(--accent)] data-[state=active]:text-[var(--accent-foreground)]"
                      >
                        Documents
                      </TabsTrigger>
                      <TabsTrigger
                        value="meetings"
                        className="data-[state=active]:bg-[var(--accent)] data-[state=active]:text-[var(--accent-foreground)]"
                      >
                        Meetings
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="rounded-lg border border-[var(--border)] bg-[var(--card-background)] p-4">
                            <h3 className="mb-1 text-sm font-medium text-[var(--muted-foreground)]">
                              Timeline
                            </h3>
                            <div className="mb-3 flex items-center justify-between">
                              <div>
                                <div className="font-medium text-[var(--headline)]">
                                  Started
                                </div>
                                <div className="text-[var(--paragraph)]">
                                  {formatDate(selectedService.startDate)}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold text-[var(--headline)]">
                                  {selectedService.progress}%
                                </div>
                                <div className="text-xs text-[var(--muted-foreground)]">
                                  Completed
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-[var(--headline)]">
                                  Estimated Completion
                                </div>
                                <div className="text-[var(--paragraph)]">
                                  {selectedService.endDate
                                    ? formatDate(selectedService.endDate)
                                    : "In progress"}
                                </div>
                              </div>
                            </div>
                            <div className="mb-4 h-2 w-full rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-blue-600 transition-all duration-700"
                                style={{
                                  width: `${selectedService.progress}%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="rounded-lg border border-[var(--border)] bg-[var(--card-background)] p-4">
                            <h3 className="mb-1 text-sm font-medium text-[var(--muted-foreground)]">
                              Next Steps
                            </h3>
                            {selectedService.status === "active" ? (
                              <div className="space-y-3">
                                {selectedService.documents.some(
                                  (d) => d.status === "pending",
                                ) && (
                                  <div className="flex items-start">
                                    <div className="mr-2 mt-0.5 text-yellow-500">
                                      <Clock className="h-4 w-4" />
                                    </div>
                                    <span className="text-[var(--paragraph)]">
                                      Documents awaiting review
                                    </span>
                                  </div>
                                )}
                                {selectedService.meetings.some(
                                  (m) => m.status === "upcoming",
                                ) && (
                                  <div className="flex items-start">
                                    <div className="mr-2 mt-0.5 text-blue-500">
                                      <Calendar className="h-4 w-4" />
                                    </div>
                                    <span className="text-[var(--paragraph)]">
                                      Upcoming meeting scheduled
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-start">
                                  <div className="mr-2 mt-0.5 text-green-500">
                                    <CheckCircle className="h-4 w-4" />
                                  </div>
                                  <span className="text-[var(--paragraph)]">
                                    Service progressing as planned
                                  </span>
                                </div>
                              </div>
                            ) : selectedService.status === "completed" ? (
                              <div className="flex items-start">
                                <div className="mr-2 mt-0.5 text-green-500">
                                  <CheckCircle className="h-4 w-4" />
                                </div>
                                <span className="text-[var(--paragraph)]">
                                  This service has been completed
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-start">
                                <div className="mr-2 mt-0.5 text-yellow-500">
                                  <Clock className="h-4 w-4" />
                                </div>
                                <span className="text-[var(--paragraph)]">
                                  Service scheduled to begin soon
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="rounded-lg border border-[var(--border)] bg-[var(--card-background)] p-4">
                          <h3 className="mb-3 text-sm font-medium text-[var(--muted-foreground)]">
                            Service Details
                          </h3>
                          <div className="prose max-w-none text-[var(--paragraph)]">
                            <p>This service includes:</p>
                            <ul className="list-disc space-y-1 pl-5">
                              <li>
                                Comprehensive review of financial documents
                              </li>
                              <li>Preparation and filing of tax returns</li>
                              <li>Tax planning and strategy consultation</li>
                              <li>
                                Year-round support for tax-related questions
                              </li>
                              <li>Digital copies of all filed documents</li>
                            </ul>
                            <p className="mt-3">
                              Our team is committed to ensuring your tax filing
                              is accurate, maximizes eligible deductions, and
                              complies with all relevant tax laws.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="documents">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-[var(--headline)]">
                            Service Documents
                          </h3>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[var(--border)] text-[var(--paragraph)]"
                          >
                            Upload Document
                          </Button>
                        </div>

                        {selectedService.documents.length > 0 ? (
                          <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card-background)]">
                            <div className="divide-y divide-[var(--border)]">
                              {selectedService.documents.map((doc) => (
                                <div
                                  key={doc.id}
                                  className="flex items-center justify-between p-4"
                                >
                                  <div className="flex items-center">
                                    <FileText className="mr-3 h-5 w-5 text-blue-500" />
                                    <div>
                                      <h4 className="font-medium text-[var(--headline)]">
                                        {doc.name}
                                      </h4>
                                      <p className="text-sm text-[var(--muted-foreground)]">
                                        Uploaded on {formatDate(doc.uploadDate)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Badge
                                      className={`${getStatusColors(doc.status).bg} ${getStatusColors(doc.status).text} border ${getStatusColors(doc.status).border}`}
                                    >
                                      {doc.status.charAt(0).toUpperCase() +
                                        doc.status.slice(1)}
                                    </Badge>
                                    <button className="p-1 text-[var(--link-color)] hover:text-[var(--link-hover)]">
                                      <Download className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-lg border border-[var(--border)] bg-[var(--card-background)] p-6 text-center">
                            <FileText className="mx-auto mb-3 h-12 w-12 text-[var(--muted-foreground)]" />
                            <h3 className="mb-1 text-lg font-medium text-[var(--headline)]">
                              No Documents Yet
                            </h3>
                            <p className="mb-4 text-[var(--paragraph)]">
                              There are no documents associated with this
                              service yet.
                            </p>
                            <Button className="bg-[var(--button)] text-[var(--button-foreground)] hover:bg-[var(--button-hover)]">
                              Upload First Document
                            </Button>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="meetings">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-[var(--headline)]">
                            Scheduled Meetings
                          </h3>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[var(--border)] text-[var(--paragraph)]"
                          >
                            Request Meeting
                          </Button>
                        </div>

                        {selectedService.meetings.length > 0 ? (
                          <div className="space-y-3">
                            {selectedService.meetings.map((meeting) => (
                              <div
                                key={meeting.id}
                                className="rounded-lg border border-[var(--border)] bg-[var(--card-background)] p-4"
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center">
                                      <h4 className="font-medium text-[var(--headline)]">
                                        {meeting.title}
                                      </h4>
                                      <Badge
                                        className={`ml-2 ${getStatusColors(meeting.status).bg} ${getStatusColors(meeting.status).text} border ${getStatusColors(meeting.status).border}`}
                                      >
                                        {meeting.status
                                          .charAt(0)
                                          .toUpperCase() +
                                          meeting.status.slice(1)}
                                      </Badge>
                                    </div>
                                    <div className="mt-1 flex items-center text-[var(--paragraph)]">
                                      <Calendar className="mr-1 h-4 w-4" />
                                      <span>
                                        {formatDate(meeting.date)} at{" "}
                                        {meeting.time} ({meeting.duration})
                                      </span>
                                    </div>
                                    <div className="mt-1 text-[var(--paragraph)]">
                                      <span className="text-sm">
                                        Location: {meeting.location}
                                      </span>
                                    </div>
                                  </div>

                                  {meeting.status === "upcoming" && (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-[var(--border)] text-[var(--paragraph)]"
                                      >
                                        Reschedule
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="bg-[var(--button)] text-[var(--button-foreground)] hover:bg-[var(--button-hover)]"
                                      >
                                        <ExternalLink className="mr-1 h-4 w-4" />
                                        Join
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-lg border border-[var(--border)] bg-[var(--card-background)] p-6 text-center">
                            <Calendar className="mx-auto mb-3 h-12 w-12 text-[var(--muted-foreground)]" />
                            <h3 className="mb-1 text-lg font-medium text-[var(--headline)]">
                              No Meetings Scheduled
                            </h3>
                            <p className="mb-4 text-[var(--paragraph)]">
                              There are no meetings scheduled for this service.
                            </p>
                            <Button className="bg-[var(--button)] text-[var(--button-foreground)] hover:bg-[var(--button-hover)]">
                              Schedule Meeting
                            </Button>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="border-[var(--border)] bg-[var(--card)]">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart className="mb-4 h-16 w-16 text-[var(--muted-foreground)]" />
                <h3 className="mb-2 text-xl font-medium text-[var(--headline)]">
                  No Service Selected
                </h3>
                <p className="mb-4 max-w-md text-center text-[var(--paragraph)]">
                  Select a service from the list on the left to view its
                  details, or request a new service.
                </p>
                <Button className="bg-[var(--button)] text-[var(--button-foreground)] hover:bg-[var(--button-hover)]">
                  Request New Service
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientServices;
