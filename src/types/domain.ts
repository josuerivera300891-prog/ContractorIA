export type UnitType = 'sqft' | 'hour' | 'day' | 'unit' | 'fixed';

export type EstimateStatus = 'DRAFT' | 'SENT' | 'VIEWED' | 'APPROVED' | 'SIGNED' | 'REJECTED';

export interface Company {
    id: string; // tenant_id
    name: string;
    slug: string;
    created_at: string;
    logo_url?: string;
    settings: {
        currency: string;
        tax_rate: number;
        address: string;
    };
}

export interface Client {
    id: string;
    company_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    address?: string;
    created_at: string;
    updated_at: string;
}

export interface LineItem {
    id: string;
    description: string;
    unit_type: UnitType;
    quantity: number;
    rate: number;
    total: number; // Calculated: quantity * rate (or just rate if fixed)
}

export interface Estimate {
    id: string;
    company_id: string;
    client_id: string;
    number: string; // Friendly ID like EST-001
    version: number;
    status: EstimateStatus;
    date_issued: string;
    date_expires?: string;
    items: LineItem[];
    subtotal: number;
    tax_rate?: number;
    tax_amount: number;
    total: number;
    deposit_amount: number;
    balance_due: number; // total - deposit_amount
    notes?: string;
    signature_id?: string; // If status === SIGNED
    created_at: string;
    updated_at: string;
    created_by: string; // User UUID
}

export interface Signature {
    id: string;
    estimate_id: string;
    signer_name: string;
    signer_email: string;
    signature_asset_url: string; // Secure storage path
    ip_address: string;
    user_agent: string;
    signed_at: string;
    document_hash: string; // Integrity verification
}

export interface Deposit {
    id: string;
    estimate_id: string;
    company_id: string;
    amount: number;
    method: 'STRIPE' | 'MANUAL' | 'CHECK' | 'CASH';
    status: 'PENDING' | 'PAID' | 'FAILED';
    transaction_id?: string;
    paid_at?: string;
}

// =====================================================
// PROJECTS & TASKS
// =====================================================

export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';

export interface Project {
    id: string;
    company_id: string;
    client_id?: string;
    estimate_id?: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    start_date?: string;
    end_date?: string;
    created_at: string;
    updated_at: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface ProjectTask {
    id: string;
    project_id: string;
    company_id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    due_date?: string;
    assigned_to?: string;
    priority: TaskPriority;
    position: number;
    created_at: string;
    updated_at: string;
}

export interface ProjectProgress {
    total: number;
    done: number;
    inProgress: number;
    todo: number;
    percent: number;
}

// =====================================================
// INVOICE PAYMENTS (para pagos parciales)
// =====================================================

export type PaymentMethod = 'STRIPE' | 'MANUAL' | 'CASH' | 'CHECK' | 'TRANSFER';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface InvoicePayment {
    id: string;
    invoice_id: string;
    company_id: string;
    amount: number;
    payment_method: PaymentMethod;
    status: PaymentStatus;
    stripe_session_id?: string;
    stripe_payment_intent?: string;
    notes?: string;
    paid_at?: string;
    created_at: string;
    created_by?: string;
}

export type InvoiceStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface Invoice {
    id: string;
    company_id: string;
    estimate_id?: string;
    invoice_number: string;
    status: InvoiceStatus;
    client_id: string;
    items: LineItem[];
    subtotal: number;
    tax_amount: number;
    total: number;
    amount_paid: number;
    balance_due: number;
    due_date?: string;
    created_at: string;
    updated_at: string;
}
