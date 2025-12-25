import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import {
  LayoutDashboard, Users, UserPlus, Settings, ShieldCheck,
  Rocket, MonitorPlay, Target, Inbox, BarChart
} from 'lucide-react';

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
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Rocket className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                TSI Auto
              </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <div className="pt-2 pb-2">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Main
                </p>
              </div>
              <NavItem href="/" icon={<LayoutDashboard size={20} />} label="Overview" />
              <NavItem href="/live-view" icon={<MonitorPlay size={20} />} label="Live View" />

              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Growth
                </p>
              </div>
              <NavItem href="/campaigns" icon={<Target size={20} />} label="Campaigns" />
              <NavItem href="/leads" icon={<Users size={20} />} label="Leads CRM" />
              <NavItem href="/inbox" icon={<Inbox size={20} />} label="Inbox" />
              <NavItem href="/connections" icon={<UserPlus size={20} />} label="Connections" />

              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  System
                </p>
              </div>
              <NavItem href="/analytics" icon={<BarChart size={20} />} label="Analytics" />
              <NavItem href="/live-command" icon={<Rocket size={20} />} label="Run Agent" />
              <NavItem href="/safety" icon={<ShieldCheck size={20} />} label="Safety" />
              <NavItem href="/settings" icon={<Settings size={20} />} label="Settings" />
            </nav>

            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  JS
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">John Smith</p>
                  <p className="text-xs text-green-500 font-medium flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 px-4 py-2.5 text-gray-600 hover:bg-white hover:text-blue-600 rounded-xl transition-all hover:shadow-sm group border border-transparent hover:border-gray-100"
    >
      <span className="text-gray-400 group-hover:text-blue-500 transition-colors">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
