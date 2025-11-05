import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  User,
  Phone,
  Mail,
  Star,
  Calendar,
  AlertCircle,
  FileText,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerQuickInfo } from "@/mock/manager-dashboard-mock";

interface CustomerQuickLookupProps {
  customers: CustomerQuickInfo[];
  onAddNote: (customerId: string, note: string) => void;
  isMobile: boolean;
}

export function CustomerQuickLookup({
  customers,
  onAddNote,
  isMobile,
}: CustomerQuickLookupProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerQuickInfo | null>(null);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCustomer = (customer: CustomerQuickInfo) => {
    setSelectedCustomer(customer);
  };

  const handleClose = () => {
    setSelectedCustomer(null);
    setSearchTerm("");
  };

  if (selectedCustomer) {
    if (isMobile) {
      return (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Customer Details
              </CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClose}
                className="h-7 w-7 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{selectedCustomer.name}</h3>
                <Badge variant="outline" className="font-semibold">
                  <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                  {selectedCustomer.averageRating}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Last visit: {selectedCustomer.lastVisit}</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  Total Visits:{" "}
                  <span className="font-bold text-foreground">
                    {selectedCustomer.totalVisits}
                  </span>
                </p>
              </div>
            </div>

            {/* Preferences */}
            {selectedCustomer.preferences.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <Star className="h-3.5 w-3.5" />
                  Preferences
                </div>
                <div className="space-y-1">
                  {selectedCustomer.preferences.map((pref, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <p className="text-xs text-foreground">{pref}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Allergies */}
            {selectedCustomer.allergies &&
              selectedCustomer.allergies.length > 0 && (
                <div className="space-y-2 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-500 uppercase tracking-wide">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Allergies
                  </div>
                  <div className="space-y-1">
                    {selectedCustomer.allergies.map((allergy, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-500 mt-1.5 flex-shrink-0" />
                        <p className="text-xs text-red-700 dark:text-red-400 font-medium">
                          {allergy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Special Notes */}
            {selectedCustomer.specialNotes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <FileText className="h-3.5 w-3.5" />
                  Special Notes
                </div>
                <div className="space-y-1">
                  {selectedCustomer.specialNotes.map((note, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <p className="text-xs text-foreground">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t space-y-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => onAddNote(selectedCustomer.id, "")}
              >
                <FileText className="h-4 w-4 mr-1.5" />
                Add Note
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="w-full"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Customer Details
            </CardTitle>
            <Button size="sm" variant="ghost" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
              <Badge variant="outline" className="font-semibold">
                <Star className="h-4 w-4 mr-1 fill-yellow-500 text-yellow-500" />
                {selectedCustomer.averageRating}
              </Badge>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{selectedCustomer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{selectedCustomer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Last visit: {selectedCustomer.lastVisit}</span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <p className="text-sm text-muted-foreground">
                Total Visits:{" "}
                <span className="font-bold text-foreground">
                  {selectedCustomer.totalVisits}
                </span>
              </p>
            </div>
          </div>

          {/* Preferences */}
          {selectedCustomer.preferences.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <Star className="h-4 w-4" />
                Preferences
              </div>
              <div className="space-y-2">
                {selectedCustomer.preferences.map((pref, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">{pref}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Allergies */}
          {selectedCustomer.allergies &&
            selectedCustomer.allergies.length > 0 && (
              <div className="space-y-3 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-500 uppercase tracking-wide">
                  <AlertCircle className="h-4 w-4" />
                  Allergies
                </div>
                <div className="space-y-2">
                  {selectedCustomer.allergies.map((allergy, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-500 mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                        {allergy}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Special Notes */}
          {selectedCustomer.specialNotes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <FileText className="h-4 w-4" />
                Special Notes
              </div>
              <div className="space-y-2">
                {selectedCustomer.specialNotes.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t flex gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddNote(selectedCustomer.id, "")}
            >
              <FileText className="h-4 w-4 mr-1.5" />
              Add Note
            </Button>
            <Button size="sm" variant="ghost" onClick={handleClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isMobile) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            Customer Lookup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Results */}
          {searchTerm && (
            <div className="space-y-2">
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No customers found
                </div>
              ) : (
                filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => handleSelectCustomer(customer)}
                    className="p-3 rounded-lg border border-border hover:bg-accent/5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {customer.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {customer.phone}
                        </p>
                      </div>
                      <Badge variant="outline" className="flex-shrink-0">
                        <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                        {customer.averageRating}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Customer Quick Lookup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Results */}
        {searchTerm && (
          <div className="space-y-2">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                No customers found
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => handleSelectCustomer(customer)}
                  className="p-4 rounded-lg border border-border hover:bg-accent/5 cursor-pointer transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{customer.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {customer.phone} • {customer.totalVisits} visits
                      </p>
                    </div>
                    <Badge variant="outline" className="flex-shrink-0">
                      <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                      {customer.averageRating}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
