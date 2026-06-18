import { DashboardStats } from "@/types"


export interface DashboardChartsProps {
  subscriptionData: Record<string, number>
  rolesData: Record<string, number>
  revenueData?: {
    month: string
    totalRevenue: number
    transactionCount: number
  }[]
}

export interface UserDashboardProps {
  stats: DashboardStats
}

export interface AdminDashboardProps {
  stats: DashboardStats
}

export interface RecentActivityProps {
  recentUsers: {
    id: string
    name: string
    email: string
    created_at: string
    avatar: string | null
    role: string
  }[]
}