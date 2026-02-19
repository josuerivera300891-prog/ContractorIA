import { createClient } from '@/lib/supabase/client'

export interface DashboardStats {
  totalClients: number
  totalEstimates: number
  totalProjects: number
  pendingEstimates: number
  monthlyRevenue: number
  activeProjects: number
}

export const dashboardService = {
  async getStats(companyId: string): Promise<DashboardStats> {
    const supabase = createClient()

    // Get clients count
    const { count: totalClients } = await supabase
      .from('clients')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', companyId)

    // Get estimates stats
    const { data: estimates } = await supabase
      .from('estimates')
      .select('id, status, total, created_at')
      .eq('company_id', companyId)

    // Get projects stats
    const { data: projects } = await supabase
      .from('projects')
      .select('id, status')
      .eq('company_id', companyId)

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    let monthlyRevenue = 0
    let pendingEstimates = 0

    for (const est of estimates || []) {
      if (est.status === 'DRAFT' || est.status === 'SENT') {
        pendingEstimates++
      }

      // Calculate revenue from signed estimates this month
      if (est.status === 'SIGNED') {
        const createdAt = new Date(est.created_at)
        if (createdAt >= startOfMonth && createdAt <= endOfMonth) {
          monthlyRevenue += Number(est.total) || 0
        }
      }
    }

    const activeProjects = (projects || []).filter(p =>
      p.status === 'IN_PROGRESS' || p.status === 'PLANNING'
    ).length

    return {
      totalClients: totalClients || 0,
      totalEstimates: estimates?.length || 0,
      totalProjects: projects?.length || 0,
      pendingEstimates,
      monthlyRevenue,
      activeProjects
    }
  }
}
