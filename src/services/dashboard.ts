import { LocalStorage } from "@raycast/api";

interface DashboardData {
  finance: {
    totalBalance: number;
    recentSpending: number;
    savingsRate: number;
  };
  health: {
    exerciseToday: boolean;
    dietStatus: 'good' | 'moderate' | 'poor';
    sleepHours: number;
  };
  tasks: {
    urgentTasks: Array<{
      id: string;
      title: string;
      urgent: boolean;
      dueDate?: Date;
    }>;
    totalTasks: number;
  };
  habits: {
    habits: Array<{
      id: string;
      name: string;
      completed: boolean;
    }>;
    completionRate: number;
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const stored = await LocalStorage.getItem<string>("dashboardData");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load stored data:", error);
  }

  // Default mock data for MVP
  const defaultData: DashboardData = {
    finance: {
      totalBalance: 45000,
      recentSpending: 3200,
      savingsRate: 15
    },
    health: {
      exerciseToday: true,
      dietStatus: 'good',
      sleepHours: 7.5
    },
    tasks: {
      urgentTasks: [
        { id: '1', title: 'Complete project proposal', urgent: true },
        { id: '2', title: 'Review team PRs', urgent: true }
      ],
      totalTasks: 12
    },
    habits: {
      habits: [
        { id: '1', name: 'Morning meditation', completed: true },
        { id: '2', name: 'Read for 30 mins', completed: true },
        { id: '3', name: 'Exercise', completed: true },
        { id: '4', name: 'Journal', completed: false }
      ],
      completionRate: 75
    }
  };

  // Store default data
  await LocalStorage.setItem("dashboardData", JSON.stringify(defaultData));
  
  return defaultData;
}

export async function updateDashboardData(data: Partial<DashboardData>): Promise<void> {
  const current = await getDashboardData();
  const updated = { ...current, ...data };
  await LocalStorage.setItem("dashboardData", JSON.stringify(updated));
}