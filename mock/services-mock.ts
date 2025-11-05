import type { Specialization, Service, ServiceRelationship } from "@/features/core/types/types.services";

export const mockSpecializations: Specialization[] = [
  { id: "1", name: "Hair Styling", icon: "Scissors", color: "blue" },
  { id: "2", name: "Beard Grooming", icon: "Sparkles", color: "green" },
  { id: "3", name: "Hair Coloring", icon: "Palette", color: "purple" },
  { id: "4", name: "Spa Services", icon: "Droplet", color: "cyan" },
  { id: "5", name: "Nail Care", icon: "Star", color: "pink" },
];

export const mockServices: Service[] = [
  { id: "a", name: "Haircut", price: 25, duration: 30, icon: "Scissors", color: "blue", description: "Classic haircut" },
  { id: "b", name: "Beard Trim", price: 15, duration: 15, icon: "Sparkles", color: "green", description: "Professional beard trimming" },
  { id: "c", name: "Hair Wash", price: 10, duration: 10, icon: "Droplet", color: "cyan", description: "Relaxing hair wash" },
  { id: "d", name: "Full Color", price: 80, duration: 90, icon: "Palette", color: "purple", description: "Complete hair coloring" },
  { id: "e", name: "Highlights", price: 60, duration: 60, icon: "Star", color: "yellow", description: "Hair highlights" },
  { id: "f", name: "Shave", price: 20, duration: 20, icon: "Sparkles", color: "green", description: "Hot towel shave" },
  { id: "g", name: "Hair Treatment", price: 45, duration: 45, icon: "Heart", color: "pink", description: "Deep conditioning treatment" },
  { id: "h", name: "Styling", price: 35, duration: 30, icon: "Wind", color: "orange", description: "Professional styling" },
  { id: "i", name: "Manicure", price: 30, duration: 40, icon: "Star", color: "pink", description: "Basic manicure" },
  { id: "j", name: "Pedicure", price: 40, duration: 50, icon: "Star", color: "pink", description: "Basic pedicure" },
];

export const mockServiceRelationships: ServiceRelationship = {
  "1": ["a", "c", "h"], // Hair Styling
  "2": ["b", "f"],       // Beard Grooming
  "3": ["d", "e"],       // Hair Coloring
  "4": ["c", "g"],       // Spa Services
  "5": ["i", "j"],       // Nail Care
};
