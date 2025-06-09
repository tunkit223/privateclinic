import { finished } from "stream";

export const GenderOptions = ["Male", "Female", "Other"];
export const Role = [
  {
    name: "admin",
  },
  {
    name: "receptionist",
  },
  {
    name: "doctor",
  }
]
export const Unit = [
  {
    name: "Pill",
  },
  {
    name: "Jar",
  },
]
export const MedicineTypes = [
  { name: "Pain Reliever" },
  { name: "Antibiotic" },
  { name: "Antipyretic" },
  { name: "Antihistamine" },
  { name: "Antacid" },
  { name: "Antiviral" },
  { name: "Antifungal" },
  { name: "Anti-inflammatory" },
  { name: "Antidepressant" },
  { name: "Antihypertensive" },
  { name: "Diuretic" },
  { name: "Cough Suppressant" },
  { name: "Expectorant" },
  { name: "Bronchodilator" },
  { name: "Hormone Replacement" },
  { name: "Anticonvulsant" },
  { name: "Sedative" },
  { name: "Stimulant" },
  { name: "Laxative" },
  { name: "Antidiarrheal" },
  { name: "Cholesterol-lowering" },
  { name: "Anticoagulant" },
  { name: "Muscle Relaxant" },
  { name: "Antipsychotic" },
  { name: "Vaccine" },
  { name: "Insulin" },
  { name: "Thyroid Hormone" },
  { name: "Eye Drop" },
  { name: "Nasal Spray" },
  { name: "Topical Cream" }
];

export const Usage = [
  {
    name: "Take one tablet by mouth every 8 hours",
  },
  {
    name: "Apply a thin layer to the affected area twice daily",
  },
  {
    name: "Inhale one puff every 6 hours as needed",
  },
  {
    name: "Inject 1 mL subcutaneously once a week",
  },
]
export const Diseasetype = [
  {
    name: "Hypertension",
  },
  {
    name: "Diabetes mellitus",
  },
  {
    name: "Common cold",
  },
  {
    name: "Gastritis",
  },
  {
    name: "Asthma",
  }
]
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
  confirmed: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};

export const MedicalStatusIcon = {
  examined: "/assets/icons/check.svg",
  examining: "/assets/icons/pending.svg",
  unexamined: "/assets/icons/cancelled.svg",
};

export const sidebarLinks = [
  {
    imgURL: '/assets/icons/dashboard-icon.png',
    label: 'Dashboard',
    route: '/',
  },
  {
    imgURL: '/assets/icons/appointment-icon.png',
    label: 'Appointment',
    route: '/appointment'
  },
  {
    imgURL: '/assets/images/medical-report.png',
    label: 'Medical Report',
    route: '/medicalreport'
  },
  {
    imgURL: '/assets/images/medical-report.png',
    label: 'Prescription',
    route: '/prescription'
  },
  {
    imgURL: '/assets/icons/revenue.png',
    label: 'Invoice',
    route: '/invoice'
  },
  {
    imgURL: '/assets/icons/patient-icon.png',
    label: 'Patient',
    route: '/patientList'
  },
  {
    imgURL: '/assets/icons/medicine.png',
    label: 'Medicine',
    route: '/medicine'
  },
  {
    imgURL: '/assets/icons/tags-icon.png',
    label: 'Medicine Type',
    route: '/Type'
  },

  {
    imgURL: '/assets/images/workschedule.png',
    label: 'Work Schedule',
    route: '/workschedule'
  },
  {
    imgURL: '/assets/icons/employee.png',
    label: 'Employees',
    route: '/employee'
  },
  {
    imgURL: '/assets/icons/import.png',
    label: 'Import',
    route: '/import'
  },
  {
    imgURL: '/assets/icons/setting-icon.png',
    label: 'Setting',
    route: '/setting'
  },
  {
    imgURL: '/assets/icons/trash.png',
    label: 'Garbage',
    route: '/garbage'
  },
]