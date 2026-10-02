export type Question = { prompt: string; options: string[] };
export type Survey = { id: string; title: string; company: string; category: string; duration: string; questions: Question[] };

const questionSets: Record<string, Question[]> = {
  connectivity: [
    { prompt: "How do you usually get online?", options: ["Mobile data", "Home Wi-Fi", "Public Wi-Fi", "A mix of these"] },
    { prompt: "What matters most in a mobile plan?", options: ["Affordable bundles", "Reliable coverage", "Fast speeds", "Flexible payments"] },
    { prompt: "How often do you buy data bundles?", options: ["Daily", "A few times a week", "Weekly", "Monthly"] },
  ],
  finance: [
    { prompt: "How do you prefer to manage your money?", options: ["Mobile app", "USSD", "In a branch", "A combination"] },
    { prompt: "Which banking feature matters most to you?", options: ["Easy transfers", "Savings tools", "Low fees", "Customer support"] },
    { prompt: "How often do you check your account?", options: ["Every day", "A few times a week", "Weekly", "Less often"] },
  ],
  shopping: [
    { prompt: "Where do you do most of your shopping?", options: ["Local shops", "Supermarkets", "Online", "A mix of places"] },
    { prompt: "What influences your purchase most?", options: ["Price", "Quality", "Convenience", "Recommendations"] },
    { prompt: "How do you discover new products?", options: ["Friends", "Social media", "In-store", "Online search"] },
  ],
  lifestyle: [
    { prompt: "What do you enjoy doing on weekends?", options: ["Staying in", "Exploring outdoors", "Meeting friends", "Trying new places"] },
    { prompt: "Which matters most when choosing a service?", options: ["Value", "Convenience", "Trust", "Experience"] },
    { prompt: "How often do you try something new?", options: ["Very often", "Sometimes", "Rarely", "Not sure"] },
  ],
};

const freeDefinitions = [
  ["Your digital day", "Safaricom", "connectivity"],
  ["Everyday banking", "Equity Bank", "finance"],
  ["How you shop", "Naivas", "shopping"],
  ["Mobile money moments", "M-Pesa", "finance"],
  ["Your next getaway", "Jambojet", "lifestyle"],
  ["Connected Kenya", "Airtel Kenya", "connectivity"],
  ["Food & favourites", "Java House", "lifestyle"],
  ["Smart spending", "KCB", "finance"],
  ["Online finds", "Jumia", "shopping"],
  ["The way you move", "Uber", "lifestyle"],
  ["Your daily essentials", "Carrefour", "shopping"],
  ["Life on the go", "Bolt", "lifestyle"],
  ["Better banking days", "Co-op Bank", "finance"],
] as const;

export const FREE_SURVEY_CAP = 2000;
export const SURVEY_REWARD = 150;
export const FREE_SURVEY_COUNT = freeDefinitions.length;

export const freeSurveys: Survey[] = freeDefinitions.map(([title, company, category], index) => ({
  id: `free-${index}`,
  title,
  company,
  category,
  duration: `${3 + (index % 3)} min`,
  questions: (questionSets[category] ?? []).map((question, questionIndex) => ({
    ...question,
    prompt: index % 2 === 1 && questionIndex === 0
      ? ({ connectivity: "How important is staying connected while travelling?", finance: "What would make financial services easier for you?", shopping: "What makes a shopping experience worth returning to?", lifestyle: "What would make your everyday routine easier?" }[category])
      : question.prompt,
  })),
}));

export const collections = [
  { id: "connect", name: "The connected life", subtitle: "Telco & digital", companies: "Safaricom · Airtel · M-Pesa", price: 150, potential: 2400, count: 16, category: "connectivity", image: "connect" },
  { id: "money", name: "Money moves", subtitle: "Banking & finance", companies: "Equity · KCB · Co-op Bank", price: 250, potential: 3600, count: 24, category: "finance", image: "finance" },
  { id: "everyday", name: "Everyday discoveries", subtitle: "Shopping & lifestyle", companies: "Naivas · Jumia · Java House", price: 300, potential: 5100, count: 34, category: "shopping", image: "lifestyle" },
] as const;

export function getCollectionSurveys(collectionId: string): Survey[] {
  const collection = collections.find((item) => item.id === collectionId);
  if (!collection) return [];
  return Array.from({ length: collection.count }, (_, index) => ({
    id: `${collection.id}-${index}`,
    title: ["Your everyday choices", "The things that matter", "What comes next", "Your experience today"][index % 4] + ` #${index + 1}`,
    company: collection.companies.split(" · ")[index % 3] ?? collection.companies,
    category: collection.category,
    duration: `${3 + (index % 3)} min`,
    questions: (questionSets[collection.category] ?? []).map((q, i) => ({ ...q, prompt: i === 0 ? `${q.prompt}` : q.prompt })),
  }));
}

export const plans = [
  { id: "lite", name: "Lite", price: 250, limit: 5000, note: "More room to grow" },
  { id: "basic", name: "Basic", price: 350, limit: 10000, note: "For your next level" },
  { id: "pro", name: "Pro", price: 450, limit: Infinity, note: "No withdrawal cap" },
] as const;

export const formatKsh = (amount: number) => `KSh ${amount.toLocaleString("en-KE")}`;