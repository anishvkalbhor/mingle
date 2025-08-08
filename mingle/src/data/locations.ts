export const statesData: Record<string, string[]> = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  Delhi: ["New Delhi", "Dwarka", "Karol Bagh", "Rohini"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi"],
  TamilNadu: ["Chennai", "Coimbatore", "Madurai", "Salem"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  UttarPradesh: ["Lucknow", "Kanpur", "Agra", "Varanasi"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Ajmer"],
  WestBengal: ["Kolkata", "Howrah", "Darjeeling", "Siliguri"],
  Punjab: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  AndhraPradesh: ["Vijayawada", "Visakhapatnam", "Guntur", "Nellore"],
  Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
  MadhyaPradesh: ["Indore", "Bhopal", "Jabalpur", "Gwalior"],
  Chhattisgarh: ["Raipur", "Bilaspur", "Korba", "Durg"],
  Odisha: ["Bhubaneswar", "Cuttack", "Puri", "Sambalpur"],
  Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur"],
  Assam: ["Guwahati", "Dibrugarh", "Silchar", "Tezpur"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  Goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
  Himachal: ["Shimla", "Manali", "Dharamshala", "Kullu"],
  Uttarakhand: ["Dehradun", "Haridwar", "Rishikesh", "Nainital"],
  Jammu: ["Jammu", "Srinagar", "Leh", "Kargil"],
  Sikkim: ["Gangtok", "Pelling", "Namchi", "Gyalshing"],
  Tripura: ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar"],
  Meghalaya: ["Shillong", "Tura", "Nongpoh", "Jowai"],
  Manipur: ["Imphal", "Thoubal", "Bishnupur", "Churachandpur"],
  Mizoram: ["Aizawl", "Lunglei", "Serchhip", "Champhai"],
  Nagaland: ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
  Arunachal: ["Itanagar", "Naharlagun", "Pasighat", "Tezpur"],
};

// Get all cities from all states as a flat array
export const getAllCities = (): string[] => {
  return Object.values(statesData).flat().sort();
};

// Get all states
export const getAllStates = (): string[] => {
  return Object.keys(statesData).sort();
};
