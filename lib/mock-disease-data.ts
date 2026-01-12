// Centralized logical mock data for all analytics, dashboard, and prediction pages
// This data is used for all static/mock displays across the app

export const MOCK_DISEASE_DATA = [
  { state: "Delhi", disease: "Cholera", cases: 120, deaths: 2, risk: 0.82 },
  { state: "Maharashtra", disease: "Dengue", cases: 340, deaths: 8, risk: 0.67 },
  { state: "Uttar Pradesh", disease: "Typhoid", cases: 210, deaths: 4, risk: 0.54 },
  { state: "Assam", disease: "Hepatitis A", cases: 95, deaths: 1, risk: 0.48 },
  { state: "Meghalaya", disease: "Cholera", cases: 60, deaths: 0, risk: 0.41 },
  { state: "West Bengal", disease: "Dengue", cases: 180, deaths: 3, risk: 0.59 },
  { state: "Kerala", disease: "Leptospirosis", cases: 75, deaths: 1, risk: 0.36 },
  { state: "Bihar", disease: "Typhoid", cases: 130, deaths: 2, risk: 0.44 },
  { state: "Punjab", disease: "Cholera", cases: 55, deaths: 0, risk: 0.29 },
  { state: "Karnataka", disease: "Dengue", cases: 110, deaths: 1, risk: 0.38 },
];

export const MOCK_DEMOGRAPHIC_DATA = [
  { age_group: "0-5 years", cases: 580, severity_percentage: 10, severity_cases: 58 },
  { age_group: "6-12 years", cases: 1050, severity_percentage: 12, severity_cases: 126 },
  { age_group: "13-18 years", cases: 1980, severity_percentage: 15, severity_cases: 297 },
  { age_group: "19-35 years", cases: 3340, severity_percentage: 17, severity_cases: 568 },
  { age_group: "36-60 years", cases: 2640, severity_percentage: 20, severity_cases: 528 },
  { age_group: "60+ years", cases: 410, severity_percentage: 25, severity_cases: 103 },
];

export const MOCK_SEASONAL_INSIGHTS = [
  { season: "Monsoon (Jun-Sep)", prediction: "Peak outbreak period", cases_avg: 185000, recommendation: "Enhanced surveillance, vector control, community awareness" },
  { season: "Post-Monsoon (Oct-Nov)", prediction: "High but declining", cases_avg: 80000, recommendation: "Maintain surveillance and case management, continue preventive measures" },
  { season: "Winter (Dec-Feb)", prediction: "Low-risk period", cases_avg: 15000, recommendation: "Maintain preparedness, train staff, restock supplies" },
  { season: "Summer (Mar-May)", prediction: "Gradual rise before rains", cases_avg: 25000, recommendation: "Pre-monsoon clean-up, source reduction, public messaging" },
];

export const MOCK_VULNERABLE_DEMOGRAPHICS = [
  { group: "0-5 years", risk: "Critical", percentage: 10, recommendations: "Vaccination drives, nutrition, pediatric care" },
  { group: "6-12 years", risk: "High", percentage: 12, recommendations: "School health programs, hygiene education" },
  { group: "13-18 years", risk: "High", percentage: 15, recommendations: "Adolescent health awareness, mental health support" },
  { group: "19-35 years", risk: "Medium", percentage: 17, recommendations: "Workplace health, reproductive health services" },
  { group: "36-60 years", risk: "Medium", percentage: 20, recommendations: "Chronic disease screening, lifestyle counseling" },
  { group: "60+ years", risk: "High", percentage: 25, recommendations: "Geriatric care, regular checkups, home support" },
];
