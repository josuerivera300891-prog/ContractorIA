// ============================================
// TIPOS DEL DOMINIO - ContractorIA
// ============================================

export type UserRole = 'admin' | 'estimator' | 'viewer'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  company_id: string | null
  created_at: string
  updated_at: string
}

// Re-export types from domain.ts for backwards compatibility
export type {
  Company,
  Client,
  Estimate,
  EstimateStatus,
  LineItem,
  UnitType,
  Invoice,
  InvoiceStatus,
  InvoicePayment,
  Project,
  ProjectStatus,
  ProjectTask,
  TaskStatus,
  TaskPriority,
  Signature,
  Deposit,
  PaymentMethod,
  PaymentStatus
} from './domain'

// ============================================
// Permisos por Rol
// ============================================

export const ROLE_PERMISSIONS = {
  admin: {
    canViewAllEstimates: true,
    canViewFinancials: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canManageSettings: true,
    canDeleteRecords: true,
  },
  estimator: {
    canViewAllEstimates: true,
    canViewFinancials: false,
    canManageUsers: false,
    canViewAnalytics: false,
    canManageSettings: false,
    canDeleteRecords: false,
  },
  viewer: {
    canViewAllEstimates: false,
    canViewFinancials: false,
    canManageUsers: false,
    canViewAnalytics: false,
    canManageSettings: false,
    canDeleteRecords: false,
  },
} as const

export type Permission = keyof typeof ROLE_PERMISSIONS.admin

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role][permission]
}
