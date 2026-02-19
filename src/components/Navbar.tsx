"use client";

import Link from "next/link";
import { useState } from "react";
import { TrendingUp, Menu, X } from "lucide-react";
import { useParams } from "next/navigation";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-turq-primary/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5">
            <TrendingUp className="text-turq-primary" size={28} />
            <span className="text-2xl font-[950] tracking-tighter text-deep-blue font-outfit">
              Contractor<span className="text-turq-primary">IA</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-bold text-slate-600 hover:text-turq-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-bold text-slate-600 hover:text-turq-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href={`/${locale}/login`}
              className="text-sm font-bold text-slate-600 hover:text-turq-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href={`/${locale}/register`}
              className="pro-button px-6 py-2.5 text-sm"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-turq-primary transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-turq-primary/5 py-6 px-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-600 hover:text-turq-primary transition-colors py-2"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-600 hover:text-turq-primary transition-colors py-2"
          >
            Pricing
          </Link>
          <Link
            href={`/${locale}/login`}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-600 hover:text-turq-primary transition-colors py-2"
          >
            Sign In
          </Link>
          <Link
            href={`/${locale}/register`}
            onClick={() => setMobileMenuOpen(false)}
            className="pro-button w-full justify-center py-3 text-sm"
          >
            Start Free Trial
          </Link>
        </div>
      )}
    </nav>
  );
}
