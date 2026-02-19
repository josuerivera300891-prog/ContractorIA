'use server'

import { createClient } from '@/lib/supabase/server'

export interface InvoicePayment {
  id: string
  invoice_id: string
  amount: number
  payment_method: 'stripe' | 'cash' | 'check' | 'bank_transfer' | 'other'
  transaction_id: string | null
  notes: string | null
  recorded_by: string | null
  created_at: string
}

export interface PaymentWithInvoice extends InvoicePayment {
  invoice: {
    id: string
    invoice_number: string
    total: number
    balance_due: number
    status: string
    client: {
      first_name: string
      last_name: string
      email: string
      company_name: string | null
    } | null
  } | null
}

export const paymentService = {
  /**
   * Get all payments for a company
   */
  async getPaymentsByCompany(companyId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('invoice_payments')
      .select(`
        *,
        invoice:invoices(
          id,
          invoice_number,
          total,
          balance_due,
          status,
          client:clients(first_name, last_name, email, company_name)
        )
      `)
      .eq('invoice.company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching payments:', error)
      return []
    }

    return data as PaymentWithInvoice[]
  },

  /**
   * Get payment statistics for a company
   */
  async getPaymentStats(companyId: string) {
    const supabase = await createClient()

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    // Get all invoices for this company
    const { data: invoices } = await supabase
      .from('invoices')
      .select('id, total, amount_paid, balance_due, status')
      .eq('company_id', companyId)

    if (!invoices) return {
      totalRevenue: 0,
      monthlyRevenue: 0,
      pendingPayments: 0,
      paidInvoices: 0,
      outstandingBalance: 0
    }

    // Get payments this month
    const { data: monthlyPayments } = await supabase
      .from('invoice_payments')
      .select('amount, created_at, invoice:invoices!inner(company_id)')
      .eq('invoice.company_id', companyId)
      .gte('created_at', startOfMonth.toISOString())

    const totalRevenue = invoices
      .reduce((sum, inv) => sum + Number(inv.amount_paid || 0), 0)

    const monthlyRevenue = monthlyPayments
      ?.reduce((sum, p) => sum + Number(p.amount), 0) || 0

    const pendingPayments = invoices
      .filter(inv => inv.status === 'UNPAID' || inv.status === 'PARTIAL').length

    const paidInvoices = invoices
      .filter(inv => inv.status === 'PAID').length

    const outstandingBalance = invoices
      .reduce((sum, inv) => sum + Number(inv.balance_due || 0), 0)

    return {
      totalRevenue,
      monthlyRevenue,
      pendingPayments,
      paidInvoices,
      outstandingBalance
    }
  },

  /**
   * Record a new payment for an invoice
   */
  async recordPayment(
    invoiceId: string,
    amount: number,
    paymentMethod: InvoicePayment['payment_method'],
    transactionId?: string,
    notes?: string,
    recordedBy?: string
  ) {
    const supabase = await createClient()

    // Insert payment record
    const { data: payment, error: paymentError } = await supabase
      .from('invoice_payments')
      .insert({
        invoice_id: invoiceId,
        amount,
        payment_method: paymentMethod,
        transaction_id: transactionId || null,
        notes: notes || null,
        recorded_by: recordedBy || null
      })
      .select()
      .single()

    if (paymentError) {
      return { error: paymentError.message }
    }

    // Get current invoice
    const { data: invoice } = await supabase
      .from('invoices')
      .select('total, amount_paid, balance_due')
      .eq('id', invoiceId)
      .single()

    if (invoice) {
      const newAmountPaid = Number(invoice.amount_paid || 0) + amount
      const newBalanceDue = Number(invoice.total) - newAmountPaid
      const newStatus = newBalanceDue <= 0 ? 'PAID' : newBalanceDue < Number(invoice.total) ? 'PARTIAL' : 'UNPAID'

      // Update invoice totals
      await supabase
        .from('invoices')
        .update({
          amount_paid: newAmountPaid,
          balance_due: Math.max(0, newBalanceDue),
          status: newStatus
        })
        .eq('id', invoiceId)
    }

    return { success: true, data: payment }
  },

  /**
   * Get payments for a specific invoice
   */
  async getInvoicePayments(invoiceId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('invoice_payments')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching invoice payments:', error)
      return []
    }

    return data as InvoicePayment[]
  }
}
