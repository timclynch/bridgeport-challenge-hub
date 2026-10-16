import { allResources, type Resource } from "./resources";

export type JourneyId = "food" | "support" | "money" | "events" | "tutoring";

export type PrefQuestion = {
  id: string;
  title: string;
  options: { value: string; label: string }[];
  mismatch: string;
};

export type Journey = {
  id: JourneyId;
  label: string;
  starter: string;
  questions: PrefQuestion[];
  needs: string[];
  confirmQs: string[];
  bring: string;
};

const DAYS: PrefQuestion = {
  id: "days",
  title: "When are you free?",
  options: [
    { value: "any", label: "Any day" },
    { value: "Mon", label: "Mon" },
    { value: "Tue", label: "Tue" },
    { value: "Wed", label: "Wed" },
    { value: "Thu", label: "Thu" },
    { value: "Fri", label: "Fri" },
  ],
  mismatch: "Not open when you’re free",
};
const WHERE: PrefQuestion = {
  id: "where",
  title: "On or off campus?",
  options: [
    { value: "any", label: "Either" },
    { value: "on", label: "On campus" },
    { value: "off", label: "Off campus" },
  ],
  mismatch: "Not where you asked",
};
const HOW: PrefQuestion = {
  id: "how",
  title: "How do you want to connect?",
  options: [
    { value: "any", label: "Any way" },
    { value: "in-person", label: "In person" },
    { value: "online", label: "Online" },
    { value: "phone", label: "Phone" },
  ],
  mismatch: "Not available that way",
};

export const JOURNEYS: Record<JourneyId, Journey> = {
  food: {
    id: "food",
    label: "Food",
    starter: "I need food — I'm looking for groceries or a meal I can get soon.",
    questions: [
      WHERE,
      HOW,
      DAYS,
    ],
    needs: ["food"],
    confirmQs: ["When can I pick up this week?", "Where exactly is pickup?", "What documents, if any, do I need?"],
    bring: "No source lists what to bring. Ask before you go — a student ID and a bag are common.",
  },
  support: {
    id: "support",
    label: "Support",
    starter: "I'm feeling stressed and would like to find someone to talk to.",
    questions: [
      { id: "topic", title: "What kind of support?", options: [{ value: "any", label: "Not sure yet" }, { value: "talk", label: "Someone to talk to" }, { value: "access", label: "Accommodations" }, { value: "housing", label: "Housing" }, { value: "transport", label: "Getting around" }], mismatch: "Handles a different kind of help" },
      HOW,
    ],
    needs: ["support_talk", "support_access", "support_housing", "support_transport", "support_unsure"],
    confirmQs: ["How do I book a first appointment?", "Where is the office right now?", "Is it confidential and free for me?"],
    bring: "Nothing required to ask. You decide what to share.",
  },
  money: {
    id: "money",
    label: "Money",
    starter: "I'm short on money and want to find work, aid or ways to cut costs.",
    questions: [
      { id: "topic", title: "What would help most?", options: [{ value: "any", label: "Not sure" }, { value: "money", label: "Aid & money help" }, { value: "career", label: "Jobs & career" }], mismatch: "Covers something else" },
      HOW,
    ],
    needs: ["money", "career"],
    confirmQs: ["What options do I qualify for?", "Is there an emergency option?", "What’s the deadline?"],
    bring: "Your UB login. Don’t share income details until you’ve confirmed who’s asking and why.",
  },
  events: {
    id: "events",
    label: "Events",
    starter: "I'm bored and want something to do or people to meet on campus.",
    questions: [WHERE, HOW, DAYS],
    needs: ["events_attend"],
    confirmQs: ["Is it okay to come on my own?", "Who should I look for when I arrive?", "Do I need to register?"],
    bring: "Usually nothing. Saving a plan is not registering.",
  },
  tutoring: {
    id: "tutoring",
    label: "Tutoring",
    starter: "I'm stressed about a class and want help with the material.",
    questions: [HOW, DAYS],
    needs: ["tutoring"],
    confirmQs: ["Is my course covered?", "When are sessions open?", "Do I need to book ahead?"],
    bring: "Your course name, notes and the topics you’re stuck on.",
  },
};

export const isJourney = (v: string): v is JourneyId => v in JOURNEYS;

export type FitStatus = "fits" | "no-fit" | "confirm" | "no-prefs";
export type FitResult = { status: FitStatus; reasons: string[]; unknown: string[] };

export function fit(resource: Resource, prefs: Record<string, string>, questions: PrefQuestion[]): FitResult {
  const answered = questions.filter((q) => prefs[q.id] && prefs[q.id] !== "any");
  const reasons: string[] = [];
  const unknown: string[] = [];
  for (const q of answered) {
    const tag = resource.tags[q.id];
    const v = prefs[q.id] as string;
    if (!tag) unknown.push(q.title);
    else if (!tag.includes(v)) reasons.push(q.mismatch);
  }
  if (reasons.length) return { status: "no-fit", reasons, unknown };
  if (!answered.length) return { status: "no-prefs", reasons, unknown };
  if (unknown.length) return { status: "confirm", reasons, unknown };
  return { status: "fits", reasons, unknown };
}

const ORDER: Record<FitStatus, number> = { fits: 0, confirm: 1, "no-prefs": 1, "no-fit": 2 };

export function rankOptions(journey: Journey, prefs: Record<string, string>, withDemo = false) {
  return allResources(withDemo)
    .filter((r) => r.needs.some((n) => journey.needs.includes(n)))
    .map((r) => ({ resource: r, fit: fit(r, prefs, journey.questions) }))
    .sort((a, b) => ORDER[a.fit.status] - ORDER[b.fit.status]);
}
