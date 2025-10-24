import {
  ClipboardList,
  Users,
  Settings,
  Layout,
  FileText,
  Palette,
  Shield,
  Target,
  Lightbulb,
} from "lucide-react";

export type TaskStatus = "To Do" | "In Progress" | "In Review" | "Accepted" | "Rejected" | "Done" | "Overdue";

export interface Task {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  type: string;
  category: "UX" | "PM";
  href: string;
  icon: any;
  coins: number;
  status: TaskStatus;
  deadline: string;
  image?: string;
  completionCount?: number;
}

export const tasks: Task[] = [
  {
    id: 1,
    title: "Create a Customer Journey Map",
    description: "Test your ability to identify user pain points and ideate solutions through customer journey mapping.",
    duration: "1h",
    level: "Advanced",
    type: "BRIEF",
    category: "UX",
    href: "/tasks/customer-journey-map",
    icon: Users,
    coins: 150,
    status: "To Do",
    deadline: "1 week",
    image: "/image.png",
  },
  {
    id: 2,
    title: "Build a Product Roadmap",
    description: "Create a comprehensive product roadmap for a new SaaS solution that aligns user needs with business goals.",
    duration: "2h",
    level: "Advanced",
    type: "BRIEF",
    category: "PM",
    href: "/tasks/product-roadmap",
    icon: Target,
    coins: 200,
    status: "In Review",
    deadline: "2 weeks",
    image: "/image.png",
  },
  {
    id: 3,
    title: "Design Ethical and Inclusive Experience",
    description: "Demonstrate your understanding and application of inclusive design principles by creating an accessible solution.",
    duration: "1h",
    level: "Advanced",
    type: "BRIEF",
    category: "UX",
    href: "/tasks/ethical-design",
    icon: Shield,
    coins: 180,
    status: "Done",
    deadline: "1 week",
    image: "/image.png",
  },
  {
    id: 4,
    title: "Information Architecture Design",
    description: "Create an effective information architecture for a complex web application.",
    duration: "2h",
    level: "Intermediate",
    type: "BRIEF",
    category: "UX",
    href: "/tasks/information-architecture",
    icon: Layout,
    coins: 120,
    status: "To Do",
    deadline: "1 week",
    image: "/image.png",
  },
  {
    id: 5,
    title: "Product Requirements Document",
    description: "Write a detailed PRD for a new feature in an existing product.",
    duration: "1h",
    level: "Advanced",
    type: "BRIEF",
    category: "PM",
    href: "/tasks/prd",
    icon: FileText,
    coins: 150,
    status: "Accepted",
    deadline: "1 week",
    image: "/image.png",
  },
  {
    id: 6,
    title: "Design System Creation",
    description: "Develop a comprehensive design system for a growing startup.",
    duration: "2h",
    level: "Advanced",
    type: "BRIEF",
    category: "UX",
    href: "/tasks/design-system",
    icon: Palette,
    coins: 250,
    status: "To Do",
    deadline: "3 weeks",
    image: "/image.png",
  },
  {
    id: 7,
    title: "Feature Prioritization",
    description: "Prioritize a backlog of features using various prioritization frameworks.",
    duration: "1h",
    level: "Intermediate",
    type: "BRIEF",
    category: "PM",
    href: "/tasks/feature-prioritization",
    icon: ClipboardList,
    coins: 100,
    status: "Done",
    deadline: "1 week",
    image: "/image.png",
  },
  {
    id: 8,
    title: "Technical Requirements Gathering",
    description: "Create technical requirements for a new system integration project.",
    duration: "2h",
    level: "Advanced",
    type: "BRIEF",
    category: "PM",
    href: "/tasks/tech-requirements",
    icon: Settings,
    coins: 180,
    status: "Rejected",
    deadline: "1 week",
    image: "/image.png",
  },
  {
    id: 9,
    title: "Innovation Workshop Planning",
    description: "Design and plan an innovation workshop for a product team.",
    duration: "1h",
    level: "Advanced",
    type: "BRIEF",
    category: "PM",
    href: "/tasks/innovation-workshop",
    icon: Lightbulb,
    coins: 130,
    status: "To Do",
    deadline: "2 weeks",
    image: "/image.png",
  },
];
