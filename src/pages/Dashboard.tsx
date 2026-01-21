import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Receipt, CheckSquare, Clock, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

const stats = [
  { name: 'Active Notes', value: '12', icon: FileText, color: 'text-blue-600' },
  { name: 'Pending Invoices', value: '3', icon: Receipt, color: 'text-green-600' },
  { name: 'Open Tasks', value: '8', icon: CheckSquare, color: 'text-purple-600' },
  { name: 'Hours This Week', value: '28', icon: Clock, color: 'text-teal-600' },
];

const recentActivity = [
  { id: 1, type: 'note', title: 'Meeting notes with client', time: '2 hours ago' },
  { id: 2, type: 'task', title: 'Complete project proposal', time: '4 hours ago' },
  { id: 3, type: 'invoice', title: 'Invoice #INV-2024001 sent', time: '1 day ago' },
  { id: 4, type: 'time', title: 'Logged 3h on Project Alpha', time: '2 days ago' },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.user_metadata?.full_name || 'User'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's what's happening with your workspace today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-center">
                <div className={`p-3 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white text-center"
            >
              <FileText className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">New Note</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-center"
            >
              <Receipt className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Create Invoice</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white text-center"
            >
              <CheckSquare className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Task</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white text-center"
            >
              <Clock className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Start Timer</span>
            </motion.button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};