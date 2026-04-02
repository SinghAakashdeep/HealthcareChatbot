export interface ClinicLocation {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  phone: string
  hours: string
  specialties: string[]
  rating: number
  distance: number // in km
}

export const clinicLocations: ClinicLocation[] = [
  {
    id: "1",
    name: "Downtown Medical Center",
    address: "123 Main Street, Suite 100, New York, NY 10001",
    lat: 40.7128,
    lng: -74.006,
    phone: "+1 (212) 555-0100",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 3:00 PM",
    specialties: ["General Practice", "Cardiology", "Neurology"],
    rating: 4.8,
    distance: 0.5,
  },
  {
    id: "2",
    name: "Uptown Health Clinic",
    address: "456 Park Avenue, Suite 200, New York, NY 10022",
    lat: 40.7489,
    lng: -73.9680,
    phone: "+1 (212) 555-0200",
    hours: "Mon-Fri: 7:00 AM - 7:00 PM, Sat: 8:00 AM - 4:00 PM",
    specialties: ["General Practice", "Orthopedics", "Physical Therapy"],
    rating: 4.7,
    distance: 2.3,
  },
  {
    id: "3",
    name: "Riverside Medical Hospital",
    address: "789 West Street, New York, NY 10014",
    lat: 40.7228,
    lng: -74.0077,
    phone: "+1 (212) 555-0300",
    hours: "24/7 Emergency & Urgent Care",
    specialties: ["Emergency Medicine", "Surgery", "Intensive Care"],
    rating: 4.6,
    distance: 1.2,
  },
  {
    id: "4",
    name: "Midtown Health Center",
    address: "321 5th Avenue, Suite 500, New York, NY 10016",
    lat: 40.7549,
    lng: -73.9840,
    phone: "+1 (212) 555-0400",
    hours: "Mon-Fri: 8:00 AM - 8:00 PM, Sat-Sun: 10:00 AM - 5:00 PM",
    specialties: ["Family Medicine", "Pediatrics", "Mental Health"],
    rating: 4.9,
    distance: 3.1,
  },
  {
    id: "5",
    name: "Brooklyn Medical Plaza",
    address: "555 Flatbush Avenue, Brooklyn, NY 11238",
    lat: 40.6782,
    lng: -73.9442,
    phone: "+1 (718) 555-0500",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM",
    specialties: ["General Practice", "Dermatology", "Ophthalmology"],
    rating: 4.5,
    distance: 5.8,
  },
]
