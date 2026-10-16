// Real UB / Connecticut resources from the Challenge 3 research (Oct 2026).
// Never add hours, rooms or emails the research did not establish.

export type Category = "food" | "support" | "money" | "events" | "tutoring" | "housing" | "transport";
export type Confidence = "published" | "confirm" | "conflict";

export type Contact = {
  phone?: string;
  phoneLabel?: string;
  url?: string;
  urlLabel?: string;
  walkIn?: string;
};

export type Resource = {
  id: string;
  name: string;
  categories: Category[];
  helps: string;
  access: string;
  contact: Contact;
  confidence: Confidence;
  source: string;
  offCampus?: boolean;
  unresolved: string[];
  /** Attributes used to compare against preferences. Missing key = unknown. */
  tags: Record<string, string[]>;
  conflict?: { summary: string; sources: { label: string; states: string }[] };
};

const UB_MAIN = "1-800-392-3582";
const UB_SITE = "https://www.bridgeport.edu";

export const RESOURCES: Resource[] = [
  {
    id: "knights-pantry",
    name: "Knights Pantry",
    categories: ["food", "money"],
    helps: "Free groceries and basics for UB students",
    access: "For UB students · order then pick up",
    contact: { url: UB_SITE, urlLabel: "Search “Knights Pantry” on bridgeport.edu", phone: UB_MAIN, phoneLabel: "UB main line — ask for Knights Pantry" },
    confidence: "conflict",
    source: "UB pantry page and an older UB news article",
    unresolved: ["Current pickup location", "Pickup days and times", "Whether an order is needed ahead"],
    tags: { kind: ["groceries"], where: ["on"], how: ["in-person"] },
    conflict: {
      summary: "An older UB article describes a previous pantry location.",
      sources: [
        { label: "UB pantry page", states: "Current ordering process" },
        { label: "Older UB news article", states: "A previous location" },
      ],
    },
  },
  {
    id: "ct-foodshare",
    name: "Connecticut Foodshare",
    categories: ["food"],
    helps: "Finds community food pantries and mobile pantries near you",
    access: "Open to the community · off campus",
    contact: { url: "https://www.ctfoodshare.org", urlLabel: "Find food on ctfoodshare.org" },
    confidence: "confirm",
    source: "Connecticut Foodshare public site",
    offCampus: true,
    unresolved: ["Which pantry is closest to you", "That pantry’s hours and pickup rules"],
    tags: { kind: ["groceries", "meal"], where: ["off"], how: ["in-person"] },
  },
  {
    id: "ct-211",
    name: "CT 2-1-1",
    categories: ["food", "money", "housing", "support", "transport"],
    helps: "Statewide directory for food, housing, bills and crisis help",
    access: "Free · anyone in Connecticut · 24/7 by phone",
    contact: { phone: "211", phoneLabel: "Dial 2-1-1", url: "https://www.211ct.org", urlLabel: "Search 211ct.org" },
    confidence: "published",
    source: "211ct.org",
    offCampus: true,
    unresolved: ["Which listed provider fits your situation"],
    tags: { kind: ["groceries", "meal"], where: ["off"], how: ["phone", "online"], topic: ["money", "housing"] },
  },
  {
    id: "counseling",
    name: "Counseling Services",
    categories: ["support"],
    helps: "Free, confidential counseling for enrolled students",
    access: "Enrolled UB students · confidential",
    contact: { phone: UB_MAIN, phoneLabel: "UB main line — ask for Counseling Services", url: UB_SITE, urlLabel: "Counseling page on bridgeport.edu" },
    confidence: "conflict",
    source: "UB counseling pages and student FAQ (Oct 14 research, not re-checked)",
    unresolved: ["Office location", "Whether psychiatric services are offered", "How to book a first appointment"],
    tags: { how: ["in-person"], where: ["on"], topic: ["talk"] },
    conflict: {
      summary: "UB pages disagree on location and on psychiatric service scope.",
      sources: [
        { label: "Counseling Services page", states: "One location and service list" },
        { label: "Student FAQ page", states: "A different location and scope" },
      ],
    },
  },
  {
    id: "student-affairs",
    name: "Student Affairs",
    categories: ["support", "money", "housing"],
    helps: "A general starting point when you’re not sure which office fits",
    access: "UB students",
    contact: { phone: UB_MAIN, phoneLabel: "UB main line — ask for Student Affairs", url: UB_SITE, urlLabel: "Student Affairs on bridgeport.edu" },
    confidence: "confirm",
    source: "UB public site",
    unresolved: ["Office hours", "Best way to reach them"],
    tags: { where: ["on"], how: ["in-person", "phone"], topic: ["talk", "money", "housing", "access"] },
  },
  {
    id: "accessibility",
    name: "Accessibility Services",
    categories: ["support"],
    helps: "Registration and accommodation requests",
    access: "UB students · documentation process applies",
    contact: { phone: UB_MAIN, phoneLabel: "UB main line — ask for Accessibility Services", url: UB_SITE, urlLabel: "Accessibility Services on bridgeport.edu" },
    confidence: "confirm",
    source: "UB public site",
    unresolved: ["What documents are needed", "Timeline for accommodations"],
    tags: { where: ["on"], topic: ["access"] },
  },
  {
    id: "heckman",
    name: "Heckman Center",
    categories: ["tutoring", "support"],
    helps: "Student success hub: advising, academic support, small meeting spaces",
    access: "UB students",
    contact: { phone: UB_MAIN, phoneLabel: "UB main line — ask for the Heckman Center", url: UB_SITE, urlLabel: "Heckman Center on bridgeport.edu" },
    confidence: "confirm",
    source: "UB Heckman pages",
    unresolved: ["Hours", "Whether advising needs an appointment"],
    tags: { where: ["on"], how: ["in-person"], topic: ["talk"] },
  },
  {
    id: "tutoring",
    name: "Free tutoring (via Canvas)",
    categories: ["tutoring"],
    helps: "Free subject tutoring for UB students",
    access: "Free · campus login · walk-ins depend on tutor availability",
    contact: { url: UB_SITE, urlLabel: "Open tutoring info (Canvas login)" },
    confidence: "confirm",
    source: "UB tutoring page",
    unresolved: ["Whether your subject is covered", "Open session times"],
    tags: { where: ["on"], how: ["in-person", "online"] },
  },
  {
    id: "wahlstrom",
    name: "Wahlstrom Library study rooms",
    categories: ["tutoring", "events"],
    helps: "Bookable 1st-floor study rooms for you or a study group",
    access: "UB students · book in the Dibs app",
    contact: { url: UB_SITE, urlLabel: "Library page (Dibs room booking)" },
    confidence: "published",
    source: "UB room-booking guide",
    unresolved: [],
    tags: { where: ["on"], how: ["in-person"] },
  },
  {
    id: "handshake",
    name: "Handshake (jobs & internships)",
    categories: ["money"],
    helps: "On-campus jobs, internships and career events",
    access: "UB students · log in with UB account",
    contact: { url: "https://joinhandshake.com", urlLabel: "Open Handshake" },
    confidence: "published",
    source: "UB career services / Handshake",
    unresolved: ["Which on-campus jobs are open now"],
    tags: { where: ["on", "off"], how: ["online"], topic: ["money"] },
  },
  {
    id: "financial-aid",
    name: "Financial Aid office",
    categories: ["money"],
    helps: "Questions about aid, payment plans and emergency options",
    access: "UB students",
    contact: { phone: UB_MAIN, phoneLabel: "UB main line — ask for Financial Aid", url: UB_SITE, urlLabel: "Financial Aid on bridgeport.edu" },
    confidence: "confirm",
    source: "UB public site",
    unresolved: ["Whether emergency funds exist and how to apply"],
    tags: { where: ["on"], how: ["in-person", "phone"], topic: ["money"] },
  },
  {
    id: "knightlife",
    name: "KnightLife (CampusGroups)",
    categories: ["events"],
    helps: "Browse campus events, clubs and organizations",
    access: "UB students · UB login",
    contact: { url: UB_SITE, urlLabel: "Open KnightLife" },
    confidence: "published",
    source: "UB KnightLife / CampusGroups",
    unresolved: ["Whether a given event needs registration", "Who to look for if you arrive alone"],
    tags: { where: ["on"], how: ["in-person", "online"] },
  },
  {
    id: "csi",
    name: "Center for Student Involvement (CSI)",
    categories: ["events"],
    helps: "Clubs, student organizations and starting your own event",
    access: "UB students",
    contact: { phone: UB_MAIN, phoneLabel: "UB main line — ask for CSI", url: UB_SITE, urlLabel: "CSI on bridgeport.edu" },
    confidence: "confirm",
    source: "UB room-booking guide",
    unresolved: ["Office hours", "Club meeting times"],
    tags: { where: ["on"], how: ["in-person"] },
  },
  {
    id: "reslife",
    name: "Residential Life",
    categories: ["housing"],
    helps: "Campus housing questions",
    access: "UB students",
    contact: { phone: UB_MAIN, phoneLabel: "UB main line — ask for Residential Life", url: UB_SITE, urlLabel: "Residential Life on bridgeport.edu" },
    confidence: "confirm",
    source: "UB public site",
    unresolved: ["Office hours"],
    tags: { where: ["on"], topic: ["housing"] },
  },
  {
    id: "gbt",
    name: "Greater Bridgeport Transit (GBT)",
    categories: ["transport"],
    helps: "Local bus routes and schedules",
    access: "Public transit · fares apply",
    contact: { url: "https://gogbt.com", urlLabel: "Open gogbt.com" },
    confidence: "confirm",
    source: "Commuter research",
    offCampus: true,
    unresolved: ["Student fare options"],
    tags: { where: ["off"] },
  },
];

export const getResource = (id: string | undefined) => RESOURCES.find((r) => r.id === id);
