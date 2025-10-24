/**
 * Type definitions for Resume Builder Agent
 */

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary?: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications?: Certification[];
  projects?: Project[];
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  dateObtained: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  highlights: string[];
}

export interface ResumeTemplate {
  id: string;
  name: string;
  preview: string;
  description: string;
}
