export interface DefaultAccount {
  role: string;
  email: string;
  password: string;
  name: string;
  organization: string;
  icon: string;
}

export const DEFAULT_ACCOUNTS: DefaultAccount[] = [
  {
    role: "DISCOM Operations Lead",
    email: "operator@gridflex.ai",
    password: "GridFlex2026!",
    name: "Rajesh Sharma",
    organization: "State Distribution Co. (DISCOM)",
    icon: "building"
  },
  {
    role: "Hackathon Evaluator & Judge",
    email: "judge@gridflex.ai",
    password: "Judge2026!",
    name: "Dr. Priya Sundaram",
    organization: "Smart Grid Innovation Jury",
    icon: "award"
  },
  {
    role: "Grid Resilience Officer",
    email: "officer@gridflex.ai",
    password: "Resilience2026!",
    name: "Vikram Patel",
    organization: "National Load Dispatch Center",
    icon: "shield"
  },
  {
    role: "Microgrid Coordinator",
    email: "community@gridflex.ai",
    password: "Flex2026!",
    name: "Ananya Sen",
    organization: "Green Valley Solar Cooperative",
    icon: "users"
  }
];
