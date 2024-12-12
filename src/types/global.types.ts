import "@tanstack/react-query";

export class CustomError extends Error {
  title: string;
  constructor(title: string, message: string) {
    super(message);
    this.title = title;
    this.name = "CustomError";
  }
}

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: CustomError;
  }
}

export interface PropsWithChildren {
  children: React.ReactNode;
}

export type IAnalytics = {
  [K in "task" | "assigned" | "complete" | "incomplete" | "overdue"]: {
    count: number;
    difference: number;
  };
};
