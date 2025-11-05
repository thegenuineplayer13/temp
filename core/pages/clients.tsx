"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react";
import { ClientInfoCard } from "../pwa/dashboard/employee/client-info-card";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: "registered" | "walk-in";
  totalVisits: number;
  lastVisit: string;
  lastService: string;
  totalSpent: number;
  averageRating: number;
  preferences: string[];
  specialNotes: string[];
  pastIssues: string[];
}

const sampleClients: Client[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    type: "registered",
    totalVisits: 24,
    lastVisit: "2025-10-28",
    lastService: "Premium Haircut",
    totalSpent: 840,
    averageRating: 4.8,
    preferences: [
      "Prefers morning appointments",
      "Likes classic styles",
      "Sensitive scalp",
    ],
    specialNotes: ["Regular customer since 2023", "Brings referrals often"],
    pastIssues: ["Had scheduling conflict on 2024-05-15"],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 234-5678",
    type: "registered",
    totalVisits: 18,
    lastVisit: "2025-10-25",
    lastService: "Color Treatment",
    totalSpent: 1260,
    averageRating: 5.0,
    preferences: [
      "Prefers afternoon slots",
      "Allergic to certain dyes",
      "Likes trendy styles",
    ],
    specialNotes: ["Birthday in November", "VIP client"],
    pastIssues: [],
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "",
    phone: "(555) 345-6789",
    type: "walk-in",
    totalVisits: 3,
    lastVisit: "2025-10-20",
    lastService: "Basic Haircut",
    totalSpent: 90,
    averageRating: 4.5,
    preferences: ["No specific preferences recorded"],
    specialNotes: ["Pays cash"],
    pastIssues: [],
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "(555) 456-7890",
    type: "registered",
    totalVisits: 32,
    lastVisit: "2025-11-01",
    lastService: "Styling + Treatment",
    totalSpent: 1920,
    averageRating: 4.9,
    preferences: [
      "Weekly appointments",
      "Prefers stylist Maria",
      "Likes natural products",
    ],
    specialNotes: ["Loyalty program member", "Books 4 weeks in advance"],
    pastIssues: [],
  },
  {
    id: 5,
    name: "David Wilson",
    email: "d.wilson@email.com",
    phone: "(555) 567-8901",
    type: "registered",
    totalVisits: 15,
    lastVisit: "2025-10-30",
    lastService: "Beard Trim",
    totalSpent: 375,
    averageRating: 4.7,
    preferences: ["Prefers quick services", "Likes traditional barbering"],
    specialNotes: ["Works nearby", "Comes during lunch break"],
    pastIssues: [],
  },
  {
    id: 6,
    name: "Jennifer Martinez",
    email: "",
    phone: "(555) 678-9012",
    type: "walk-in",
    totalVisits: 5,
    lastVisit: "2025-10-22",
    lastService: "Haircut",
    totalSpent: 175,
    averageRating: 4.6,
    preferences: [],
    specialNotes: ["Tourist - visiting from out of town"],
    pastIssues: [],
  },
  {
    id: 7,
    name: "Robert Taylor",
    email: "rob.taylor@email.com",
    phone: "(555) 789-0123",
    type: "registered",
    totalVisits: 28,
    lastVisit: "2025-10-27",
    lastService: "Haircut + Shave",
    totalSpent: 1120,
    averageRating: 4.8,
    preferences: [
      "Bi-weekly appointments",
      "Prefers hot towel shave",
      "Coffee - black, no sugar",
    ],
    specialNotes: ["Business professional", "Always tips well"],
    pastIssues: [],
  },
  {
    id: 8,
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    phone: "(555) 890-1234",
    type: "registered",
    totalVisits: 12,
    lastVisit: "2025-10-15",
    lastService: "Highlights",
    totalSpent: 720,
    averageRating: 4.4,
    preferences: ["Prefers weekend appointments", "Likes subtle changes"],
    specialNotes: ["Recently moved to area"],
    pastIssues: ["Ran late for appointment on 2025-08-10"],
  },
  {
    id: 9,
    name: "Christopher Lee",
    email: "",
    phone: "(555) 901-2345",
    type: "walk-in",
    totalVisits: 1,
    lastVisit: "2025-11-02",
    lastService: "Haircut",
    totalSpent: 30,
    averageRating: 4.0,
    preferences: [],
    specialNotes: ["First visit"],
    pastIssues: [],
  },
  {
    id: 10,
    name: "Amanda White",
    email: "amanda.white@email.com",
    phone: "(555) 012-3456",
    type: "registered",
    totalVisits: 22,
    lastVisit: "2025-10-29",
    lastService: "Perm Treatment",
    totalSpent: 1540,
    averageRating: 4.9,
    preferences: [
      "Prefers advanced booking",
      "Likes magazine recommendations",
      "Sensitive to heat",
    ],
    specialNotes: ["Referred 3 new clients", "Writes online reviews"],
    pastIssues: [],
  },
  {
    id: 11,
    name: "James Harris",
    email: "j.harris@email.com",
    phone: "(555) 123-4568",
    type: "registered",
    totalVisits: 19,
    lastVisit: "2025-10-26",
    lastService: "Haircut",
    totalSpent: 570,
    averageRating: 4.7,
    preferences: ["Prefers same stylist", "Quick service preferred"],
    specialNotes: ["Works irregular hours"],
    pastIssues: [],
  },
  {
    id: 12,
    name: "Patricia Clark",
    email: "",
    phone: "(555) 234-5679",
    type: "walk-in",
    totalVisits: 2,
    lastVisit: "2025-10-18",
    lastService: "Basic Haircut",
    totalSpent: 70,
    averageRating: 4.5,
    preferences: [],
    specialNotes: [],
    pastIssues: [],
  },
];

// -------------------------------
// 🧠 Component
// -------------------------------
export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [filterType, setFilterType] = useState<
    "all" | "registered" | "walk-in"
  >("all");
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
  };

  const filteredClients = sampleClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      (client.email &&
        client.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === "all" || client.type === filterType;

    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentClients = filteredClients.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const stats = {
    totalClients: sampleClients.length,
    registeredClients: sampleClients.filter((c) => c.type === "registered")
      .length,
    walkInClients: sampleClients.filter((c) => c.type === "walk-in").length,
    totalRevenue: sampleClients.reduce((sum, c) => sum + c.totalSpent, 0),
    averageSpending: Math.round(
      sampleClients.reduce((sum, c) => sum + c.totalSpent, 0) /
        sampleClients.length
    ),
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your client relationships
          </p>
        </div>

        {/* Filters */}
        <Card className="flex-1">
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9"
                />
              </div>
              <Select
                value={filterType}
                onValueChange={(value: "all" | "registered" | "walk-in") => {
                  setFilterType(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Client Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="walk-in">Walk-in</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Contact
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Last Visit
                  </TableHead>
                  <TableHead className="text-right">Visits</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">
                    Total Spent
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentClients.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No clients found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{client.name}</div>
                          <div className="text-xs text-muted-foreground md:hidden">
                            {client.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm">
                          <div>{client.phone}</div>
                          {client.email && (
                            <div className="text-xs text-muted-foreground">
                              {client.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            client.type === "registered"
                              ? "default"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {client.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm">
                          <div>{formatDate(client.lastVisit)}</div>
                          <div className="text-xs text-muted-foreground">
                            {client.lastService}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {client.totalVisits}
                      </TableCell>
                      <TableCell className="text-right font-medium hidden sm:table-cell">
                        {formatCurrency(client.totalSpent)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(client)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="ml-2 hidden sm:inline">View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredClients.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Rows per page:
                </span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} ({filteredClients.length}{" "}
                  total)
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Details Modal */}
      <Dialog
        open={!!selectedClient}
        onOpenChange={(open) => !open && setSelectedClient(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedClient?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-6">
              {/* Example detail card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {selectedClient.phone}
                  </p>
                </CardContent>
              </Card>

              <ClientInfoCard
                clientHistory={{
                  clientName: selectedClient.name,
                  totalVisits: selectedClient.totalVisits,
                  lastVisit: {
                    date: formatDate(selectedClient.lastVisit),
                    service: selectedClient.lastService,
                  },
                  preferences: selectedClient.preferences,
                  specialNotes: selectedClient.specialNotes,
                  pastIssues: selectedClient.pastIssues,
                  averageRating: selectedClient.averageRating,
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
