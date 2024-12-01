export interface PropsWithChildren {
  children: React.ReactNode;
}

export type IAnalytics = {
  [K in "task" | "assigned" | "complete" | "incomplete" | "overdue"]: {
    count: number;
    difference: number;
  };
};
