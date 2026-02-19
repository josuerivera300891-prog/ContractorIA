"use client";

import { useState, useEffect } from "react";
import { Bell, Search, User, Settings, ChevronDown, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface UserProfile {
  full_name: string | null;
  email: string;
  role: string;
}

export default function DashboardHeader() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', authUser.id)
          .single();

        setUser({
          full_name: profile?.full_name || null,
          email: authUser.email || '',
          role: profile?.role || 'user'
        });
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/en/login');
  };

  return (
    <header className="h-20 border-b border-turq-primary/5 bg-white/60 backdrop-blur-xl sticky top-0 z-30">
      <div className="h-full px-10 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search clients, estimates, invoices..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm text-deep-blue placeholder:text-slate-400 focus:outline-none focus:border-turq-primary focus:ring-2 focus:ring-turq-primary/10 transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl text-slate-500 hover:text-turq-primary hover:bg-turq-primary/5 transition-all">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 pr-3 rounded-xl hover:bg-slate-50 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-turq-primary/10 flex items-center justify-center">
                <User size={18} className="text-turq-primary" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-deep-blue leading-tight">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {user?.role || 'Loading...'}
                </p>
              </div>
              <ChevronDown size={16} className="text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-bold text-deep-blue">{user?.full_name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <Settings size={16} />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
