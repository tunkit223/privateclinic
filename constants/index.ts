export const GenderOptions = ["Male", "Female", "Other"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};

export const sidebarLinks=[
  {
    imgURL:'/assets/images/dashboard-icon.png',
    label:'Dashboard',
    route:'/'
  },
  {
    imgURL:'/assets/images/appointment-icon.png',
    label:'Appointment',
    route:'/appointment'
  },
  {
    imgURL:'/assets/images/patient-icon.png',
    label:'Patient',
    route:'/patientList'
  },
  {
    imgURL:'/assets/images/medicine.png',
    label:'Medicine',
    route:'/medicine'
  },
  {
    imgURL:'/assets/images/revenue.png',
    label:'Bill',
    route:'/bill'
  },
  {
    imgURL:'/assets/images/employee.png',
    label:'Employees',
    route:'/employee'
  },
  {
    imgURL:'/assets/images/import.png',
    label:'Import',
    route:'/import'
  },
  {
    imgURL:'/assets/images/setting.jpg',
    label:'Setting',
    route:'/setting'
  },
  {
    imgURL:'/assets/images/trash.png',
    label:'Garbage',
    route:'/garbage'
  },
]