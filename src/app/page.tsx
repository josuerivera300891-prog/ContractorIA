import { redirect } from 'next/navigation'

/**
 * Root page - Redirects to the default locale login page
 * ContractorIA is a multi-tenant SaaS, so users must authenticate first
 */
export default function RootPage() {
    redirect('/en/login')
}
