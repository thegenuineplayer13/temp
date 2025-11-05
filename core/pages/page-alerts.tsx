import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { AlertsList } from "../pwa/alerts/alerts-list";
import { AlertDetail } from "../pwa/alerts/alert-detail";
import { mockAlertsData, type Alert } from "@/mock/mock-alerts-data";

export default function AlertsPage() {
  const isMobile = useIsMobile();
  const [alerts] = React.useState<Alert[]>(mockAlertsData);
  const [selectedAlertId, setSelectedAlertId] = React.useState<string | null>(
    alerts[0]?.id || null
  );
  const [filterTab, setFilterTab] = React.useState<
    "all" | "active" | "resolved"
  >("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showDetail, setShowDetail] = React.useState(false);

  const selectedAlert = alerts.find((a) => a.id === selectedAlertId) || null;

  const filteredAlerts = alerts.filter((alert) => {
    // Filter by tab
    if (filterTab === "active" && alert.resolved) return false;
    if (filterTab === "resolved" && !alert.resolved) return false;

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(query) ||
        alert.message.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleSelectAlert = (alertId: string) => {
    setSelectedAlertId(alertId);
    if (isMobile) {
      setShowDetail(true);
    }
  };

  const handleBackToList = () => {
    setShowDetail(false);
  };

  const handleResolve = (alertId: string) => {
    console.log("Resolve alert:", alertId);
    // In real app, update alert status
  };

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {/* Mobile Header */}
        {!showDetail ? (
          <>
            <div className="sticky top-0 z-10 bg-background border-b">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Alerts</h1>
                  <Button variant="ghost" size="icon">
                    <Filter className="h-5 w-5" />
                  </Button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Tabs
                  value={filterTab}
                  onValueChange={(v) => setFilterTab(v as any)}
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="all" className="flex-1">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="active" className="flex-1">
                      Active
                    </TabsTrigger>
                    <TabsTrigger value="resolved" className="flex-1">
                      Resolved
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <AlertsList
                alerts={filteredAlerts}
                selectedAlertId={selectedAlertId}
                onSelectAlert={handleSelectAlert}
              />
            </div>
          </>
        ) : (
          <>
            <div className="sticky top-0 z-10 bg-background border-b">
              <div className="p-4 flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={handleBackToList}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="font-semibold">Alert Details</h2>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <AlertDetail alert={selectedAlert} onResolve={handleResolve} />
            </div>
          </>
        )}
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Desktop Header */}
      <div className="border-b">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Alerts</h1>
            <Button variant="ghost" size="icon">
              <Filter className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Tabs
              value={filterTab}
              onValueChange={(v) => setFilterTab(v as any)}
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Desktop Master-Detail Layout */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
            <AlertsList
              alerts={filteredAlerts}
              selectedAlertId={selectedAlertId}
              onSelectAlert={handleSelectAlert}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={65}>
            <AlertDetail alert={selectedAlert} onResolve={handleResolve} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
