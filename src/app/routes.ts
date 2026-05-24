export const routes = {
  start: "start",
  event: "event",
  feedback: "feedback",
  result: "result",
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
