const airports = [
  {
    id: 1,
    code: "DEL",
    city: "Delhi",
    name: "Indira Gandhi International Airport",
    country: "India"
  },
  {
    id: 2,
    code: "BOM",
    city: "Mumbai",
    name: "Chhatrapati Shivaji Maharaj International Airport",
    country: "India"
  },
  {
    id: 3,
    code: "BLR",
    city: "Bengaluru",
    name: "Kempegowda International Airport",
    country: "India"
  },
  {
    id: 4,
    code: "MAA",
    city: "Chennai",
    name: "Chennai International Airport",
    country: "India"
  },
  {
    id: 5,
    code: "HYD",
    city: "Hyderabad",
    name: "Rajiv Gandhi International Airport",
    country: "India"
  },
  {
    id: 6,
    code: "CCU",
    city: "Kolkata",
    name: "Netaji Subhas Chandra Bose International Airport",
    country: "India"
  },
  {
    id: 7,
    code: "GOI",
    city: "Goa",
    name: "Manohar International Airport",
    country: "India"
  },
  {
    id: 8,
    code: "AMD",
    city: "Ahmedabad",
    name: "Sardar Vallabhbhai Patel International Airport",
    country: "India"
  },
  {
    id: 9,
    code: "PNQ",
    city: "Pune",
    name: "Pune International Airport",
    country: "India"
  },
  {
    id: 10,
    code: "COK",
    city: "Kochi",
    name: "Cochin International Airport",
    country: "India"
  },
  {
    id: 11,
    code: "IXC",
    city: "Chandigarh",
    name: "Chandigarh International Airport",
    country: "India"
  },
  {
    id: 12,
    code: "ATQ",
    city: "Amritsar",
    name: "Sri Guru Ram Dass Jee International Airport",
    country: "India"
  },
  {
    id: 13,
    code: "JAI",
    city: "Jaipur",
    name: "Jaipur International Airport",
    country: "India"
  },
  {
    id: 14,
    code: "LKO",
    city: "Lucknow",
    name: "Chaudhary Charan Singh International Airport",
    country: "India"
  },
  {
    id: 15,
    code: "IXM",
    city: "Madurai",
    name: "Madurai Airport",
    country: "India"
  },
  {
    id: 16,
    code: "TRV",
    city: "Thiruvananthapuram",
    name: "Trivandrum International Airport",
    country: "India"
  },
  {
    id: 17,
    code: "VTZ",
    city: "Visakhapatnam",
    name: "Visakhapatnam International Airport",
    country: "India"
  },
  {
    id: 18,
    code: "GAU",
    city: "Guwahati",
    name: "Lokpriya Gopinath Bordoloi International Airport",
    country: "India"
  },
  {
    id: 19,
    code: "PAT",
    city: "Patna",
    name: "Jayprakash Narayan Airport",
    country: "India"
  },
  {
    id: 20,
    code: "BBI",
    city: "Bhubaneswar",
    name: "Biju Patnaik International Airport",
    country: "India"
  },
  {
    id: 21,
    code: "VNS",
    city: "Varanasi",
    name: "Lal Bahadur Shastri International Airport",
    country: "India"
  },
  {
    id: 22,
    code: "IXB",
    city: "Siliguri",
    name: "Bagdogra International Airport",
    country: "India"
  },
  {
    id: 23,
    code: "SXR",
    city: "Srinagar",
    name: "Sheikh ul-Alam International Airport",
    country: "India"
  },
  {
    id: 24,
    code: "IXE",
    city: "Mangaluru",
    name: "Mangaluru International Airport",
    country: "India"
  },
  {
    id: 25,
    code: "TRZ",
    city: "Tiruchirappalli",
    name: "Tiruchirappalli International Airport",
    country: "India"
  },
  {
    id: 26,
    code: "STV",
    city: "Surat",
    name: "Surat International Airport",
    country: "India"
  },
  {
    id: 27,
    code: "BDQ",
    city: "Vadodara",
    name: "Vadodara Airport",
    country: "India"
  },
  {
    id: 28,
    code: "IDR",
    city: "Indore",
    name: "Devi Ahilya Bai Holkar Airport",
    country: "India"
  },
  {
    id: 29,
    code: "NAG",
    city: "Nagpur",
    name: "Dr. Babasaheb Ambedkar International Airport",
    country: "India"
  },
  {
    id: 30,
    code: "UDR",
    city: "Udaipur",
    name: "Maharana Pratap Airport",
    country: "India"
  },
  {
    id: 16,
    code: "DXB",
    city: "Dubai",
    name: "Dubai International Airport",
    country: "United Arab Emirates"
  },
  {
    id: 17,
    code: "LHR",
    city: "London",
    name: "London Heathrow Airport",
    country: "United Kingdom"
  },
  {
    id: 18,
    code: "JFK",
    city: "New York",
    name: "John F. Kennedy International Airport",
    country: "United States"
  },
  {
    id: 19,
    code: "SIN",
    city: "Singapore",
    name: "Singapore Changi Airport",
    country: "Singapore"
  },
  {
    id: 20,
    code: "HND",
    city: "Tokyo",
    name: "Tokyo Haneda Airport",
    country: "Japan"
  },
  {
    id: 21,
    code: "CDG",
    city: "Paris",
    name: "Charles de Gaulle Airport",
    country: "France"
  },
  {
    id: 22,
    code: "FRA",
    city: "Frankfurt",
    name: "Frankfurt Airport",
    country: "Germany"
  },
  {
    id: 23,
    code: "AMS",
    city: "Amsterdam",
    name: "Amsterdam Airport Schiphol",
    country: "Netherlands"
  },
  {
    id: 24,
    code: "ICN",
    city: "Seoul",
    name: "Incheon International Airport",
    country: "South Korea"
  },
  {
    id: 25,
    code: "BKK",
    city: "Bangkok",
    name: "Suvarnabhumi Airport",
    country: "Thailand"
  },
  {
    id: 26,
    code: "HKG",
    city: "Hong Kong",
    name: "Hong Kong International Airport",
    country: "Hong Kong"
  },
  {
    id: 27,
    code: "SYD",
    city: "Sydney",
    name: "Sydney Kingsford Smith Airport",
    country: "Australia"
  },
  {
    id: 28,
    code: "DOH",
    city: "Doha",
    name: "Hamad International Airport",
    country: "Qatar"
  },
  {
    id: 29,
    code: "LAX",
    city: "Los Angeles",
    name: "Los Angeles International Airport",
    country: "United States"
  },
  {
    id: 30,
    code: "IST",
    city: "Istanbul",
    name: "Istanbul Airport",
    country: "Turkey"
  }
];

export default airports;