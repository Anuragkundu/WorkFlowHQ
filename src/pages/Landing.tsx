import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Receipt, CheckSquare, Clock, Zap, Shield, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { AuthForm } from '../components/auth/AuthForm';

const features = [
  {
    icon: FileText,
    title: 'Smart Notes',
    description: 'Capture and organize your thoughts with our intuitive note-taking system.'
  },
  {
    icon: Receipt,
    title: 'Invoice Generator',
    description: 'Create professional invoices in minutes and export them as PDF.'
  },
  {
    icon: CheckSquare,
    title: 'Task Management',
    description: 'Stay organized with powerful task management and priority tracking.'
  },
  {
    icon: Clock,
    title: 'Time Tracking',
    description: 'Track your time across projects and generate detailed reports.'
  },
];

const benefits = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built for speed and efficiency to keep you in flow state.'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and stored securely in the cloud.'
  },
  {
    icon: Users,
    title: 'Team Friendly',
    description: 'Collaborate with clients and team members seamlessly.'
  },
];

export const Landing: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            {/* Header */}
            <header className="relative pt-6">
              <nav className="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6">
                <div className="flex items-center flex-1">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    WorkPadHQ
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" onClick={() => setShowAuth(true)}>
                    Sign In
                  </Button>
                  <Button onClick={() => setShowAuth(true)}>
                    Get Started
                  </Button>
                </div>
              </nav>
            </header>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center lg:text-left">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
                >
                  <span className="block">Your all-in-one</span>
                  <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    freelance toolkit
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                >
                  WorkPadHQ brings together notes, invoices, tasks, and time tracking in one beautiful, 
                  fast workspace designed for modern freelancers and remote workers.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
                >
                  <div className="rounded-md shadow">
                    <Button
                      size="lg"
                      onClick={() => setShowAuth(true)}
                      className="w-full flex items-center justify-center px-8 py-3"
                    >
                      Start Free Today
                    </Button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full flex items-center justify-center px-8 py-3"
                    >
                      Watch Demo
                    </Button>
                  </div>
                </motion.div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to work efficiently
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              Stop juggling multiple apps. WorkPadHQ brings all your essential tools together.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-600/20"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Built for modern professionals
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to boost your productivity?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-purple-100">
            Join thousands of freelancers who have streamlined their workflow with WorkPadHQ.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-8"
            onClick={() => setShowAuth(true)}
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && <AuthForm onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </div>
  );
};