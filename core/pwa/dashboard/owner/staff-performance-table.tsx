import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Star } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { StaffMember } from "@/features/core/types/types.dashboard-owner";
import { AvatarWithBadge } from "./common/avatar-with-badge";
import { ProgressBar } from "./common/progress-bar";

interface StaffPerformanceTableProps {
   staff: StaffMember[];
}

export function StaffPerformanceTable({ staff }: StaffPerformanceTableProps) {
   const topStaff = staff
      .filter((s) => s.status === "present" && s.role === "employee")
      .sort((a, b) => b.todayRevenue - a.todayRevenue)
      .slice(0, 6);

   return (
      <Card className="mb-6">
         <CardHeader>
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-semibold">Staff Performance Today</CardTitle>
               </div>
               <Button variant="outline" size="sm">
                  View All
               </Button>
            </div>
         </CardHeader>
         <CardContent>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Staff Member</TableHead>
                     <TableHead className="text-right">Jobs</TableHead>
                     <TableHead className="text-right">Revenue</TableHead>
                     <TableHead className="text-right">Efficiency</TableHead>
                     <TableHead className="text-right">Rating</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {topStaff.map((member, idx) => (
                     <TableRow key={member.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell>
                           <div className="flex items-center gap-3">
                              <AvatarWithBadge initials={member.avatar} size="sm" showBadge={idx === 0} />
                              <div>
                                 <p className="font-semibold text-sm">{member.name}</p>
                                 <p className="text-xs text-muted-foreground">{member.specialization}</p>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell className="text-right">
                           <span className="font-semibold">{member.todayJobs}</span>
                        </TableCell>
                        <TableCell className="text-right">
                           <span className="font-bold">${member.todayRevenue}</span>
                        </TableCell>
                        <TableCell className="text-right">
                           <div className="flex items-center justify-end gap-2">
                              <ProgressBar
                                 value={member.efficiency}
                                 size="sm"
                                 color={member.efficiency >= 90 ? "success" : "primary"}
                                 className="w-12"
                              />
                              <span
                                 className={cn(
                                    "font-semibold text-sm",
                                    member.efficiency >= 90 ? "text-green-600 dark:text-green-500" : "text-foreground"
                                 )}
                              >
                                 {member.efficiency}%
                              </span>
                           </div>
                        </TableCell>
                        <TableCell className="text-right">
                           <div className="flex items-center justify-end gap-1">
                              <Star className="h-3.5 w-3.5 text-accent fill-accent" />
                              <span className="font-semibold">{member.rating}</span>
                           </div>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
   );
}
