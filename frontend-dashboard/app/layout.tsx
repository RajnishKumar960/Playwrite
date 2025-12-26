import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import {
  LayoutDashboard, Users, UserPlus, Settings, ShieldCheck,
  Rocket, MonitorPlay, Target, Inbox, BarChart, Brain
} from 'lucide-react';
import InteractiveBackground from '@/components/InteractiveBackground';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TSI Automations Dashboard',
  description: 'Manage and monitor your AI agents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen text-gray-100 overflow-hidden`}>
        <Providers>
          <InteractiveBackground />

          <div className="flex h-screen relative z-10">
            {/* Glass Sidebar */}
            <aside className="w-64 glass border-r border-white/10 hidden md:flex flex-col backdrop-blur-md bg-black/30">
              <div className="p-6 border-b border-white/5 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
                  <Rocket className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                    TSI Auto
                  </h1>
                  <p className="text-[10px] text-gray-400 tracking-wider uppercase font-medium">Pro Dashboard</p>
                </div>
              </div>

              <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
                <NavSection title="Main" />
                <NavItem href="/" icon={<LayoutDashboard size={20} />} label="Overview" />
                <NavItem href="/live-view" icon={<MonitorPlay size={20} />} label="Live View" />

                <NavSection title="Growth Engine" />
                <NavItem href="/analytics" icon={<BarChart size={20} />} label="Analytics" />
                <NavItem href="/leads" icon={<Users size={20} />} label="Leads CRM" />
                <NavItem href="/connections" icon={<UserPlus size={20} />} label="Connections" />
                <NavItem href="/campaigns" icon={<Target size={20} />} label="Campaigns" />

                <NavSection title="Intelligence" />
                <NavItem href="/pain-points" icon={<Brain size={20} />} label="Pain Points" />
                <NavItem href="/safety" icon={<ShieldCheck size={20} />} label="Safety" />
                <NavItem href="/settings" icon={<Settings size={20} />} label="Settings" />
              </nav>

              <div className="p-4 border-t border-white/5 bg-black/20">
                <div className="flex items-center space-x-3 px-3 py-2 rounded-xl transition-colors hover:bg-white/5 cursor-pointer group">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold shadow-lg ring-2 ring-transparent group-hover:ring-white/20 transition-all">
                      JS
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-200 group-hover:text-white truncate">John Smith</p>
                    <p className="text-xs text-red-400 flex items-center">
                      Admin Access
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto scrollbar-thin relative scroll-smooth">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

function NavSection({ title }: { title: string }) {
  return (
    <div className="pt-4 pb-2">
      <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        {title}
      </p>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 px-4 py-2.5 text-gray-400 hover:text-white rounded-xl transition-all duration-300 hover:bg-white/5 group border border-transparent hover:border-white/5 hover:shadow-lg hover:shadow-blue-500/5 relative overflow-hidden"
    >
      <span className="relative z-10 group-hover:text-blue-400 transition-colors duration-300">{icon}</span>
      <span className="font-medium relative z-10">{label}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  );
}
