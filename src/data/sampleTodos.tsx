import { type Todo } from "@/types/todo";

export const sampleTodos: Todo[] = [
  {
    id: "1",
    title: "Complete Project Documentation",
    description:
      "Write comprehensive documentation for the new feature including API references and usage examples",
    priority: "High",
    is_completed: false,
    category: "Work",
  },
  {
    id: "2",
    title: "Review Pull Requests",
    description:
      "Review and provide feedback on pending pull requests from team members",
    priority: "High",
    is_completed: false,
    category: "Work",
  },
  {
    id: "3",
    title: "Team Meeting",
    description:
      "Weekly sync meeting with the development team to discuss progress and blockers",
    priority: "Medium",
    is_completed: true,
    category: "Meetings",
  },
  {
    id: "4",
    title: "Update Dependencies",
    description:
      "Update project dependencies to latest stable versions and test for compatibility",
    priority: "Medium",
    is_completed: false,
    category: "Maintenance",
  },
  {
    id: "5",
    title: "Grocery Shopping",
    description: "Buy vegetables, fruits, and other essentials for the week",
    priority: "Low",
    is_completed: false,
    category: "Personal",
  },
  {
    id: "6",
    title: "Fix Critical Bug",
    description:
      "Resolve the authentication issue reported by users in production",
    priority: "High",
    is_completed: false,
    category: "Bug Fix",
  },
  {
    id: "7",
    title: "Prepare Presentation",
    description:
      "Create slides for next week's client presentation about project milestones",
    priority: "Medium",
    is_completed: false,
    category: "Work",
  },
  {
    id: "8",
    title: "Code Review Training",
    description: "Attend the code review best practices workshop",
    priority: "Low",
    is_completed: true,
    category: "Learning",
  },
];
