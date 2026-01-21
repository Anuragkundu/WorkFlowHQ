import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Receipt, 
  CheckSquare, 
  Clock, 
  Settings, 
  Moon, 
  Sun,
  LogOut 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Notes', href: '/notes', icon: FileText },
  { name: 'Invoices', href: '/invoices', icon: Receipt },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Time Tracker', href: '/time', icon: Clock },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { signOut } = useAuth();

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-r border-white/20 dark:border-gray-700/20 h-screen flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/20 dark:border-gray-700/20">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          WorkPadHQ
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-800/50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/20 dark:border-gray-700/20 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-800/50 transition-all duration-200"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        
        <button
          onClick={signOut}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </motion.div>
  );
};