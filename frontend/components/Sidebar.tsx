'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield,
  LayoutDashboard,
  FileCheck2,
  History,
  AlertTriangle,
  FileSearch,
  Database,
  ScrollText,
  FileBarChart,
  Settings,
  LogOut,
  ChevronRight,
  Radio
} from 'lucide-react';
import { api } from '@/lib/api';
import { Officer } from '@/types/verification';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/verify', label: 'New Verification', icon: FileCheck2 },
  { href: '/history', label: 'Verification History', icon: History },
  { href: '/suspicious', label: 'Suspicious Cases', icon: AlertTriangle, badge: '3' },
  { href: '/ledger', label: 'Integrity Ledger', icon: Database },
  { href: '/audit', label: 'Audit Trail', icon: ScrollText },
  { href: '/reports', label: 'Reports', icon: FileBarChart },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [officer, setOfficer] = useState<Officer | null>(null);

  useEffect(() => {
    setOfficer(api.getCurrentOfficer());
  }, []);

  const handleLogout = () => {
    api.logout();
    router.push('/login');
  };

  // Don't render sidebar on landing page or login page
  if (pathname === '/' || pathname === '/login') {
    return null;
  }

  return (
    <aside className="w-64 bg-surface/95 border-r border-surface-border flex flex-col h-screen fixed left-0 top-0 z-40 select-none backdrop-blur-md">
      {/* Brand Header */}
      <div className="p-5 border-b border-surface-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-glow">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-lg tracking-wider text-white">TRUSTFORGE</h1>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              SIH26
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium tracking-tight">Border Screening Platform</p>
        </div>
      </div>

      {/* Authority Badge */}
      <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-navy-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
        <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span className="truncate">SSB Police-II • Raxaul Post</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm shadow-blue-500/10'
                  : 'text-slate-300 hover:bg-surface-hover hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge ? (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {item.badge}
                </span>
              ) : isActive ? (
                <ChevronRight className="w-3.5 h-3.5 text-blue-400 opacity-60" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Officer Profile & Session */}
      <div className="p-3 border-t border-surface-border bg-surface-elevated/40">
        <div className="flex items-center justify-between p-2 rounded-lg bg-navy-950/60 border border-slate-800/80 mb-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-200 border border-slate-600">
                {officer?.name ? officer.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'TF'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-surface" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{officer?.name || 'Insp. Rajesh Sharma'}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-blue-400">{officer?.officerId || 'TF-1024'}</span>
                <span className="text-[10px] text-slate-400">• {officer?.role || 'Officer'}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out Session</span>
        </button>
      </div>
    </aside>
  );
}
