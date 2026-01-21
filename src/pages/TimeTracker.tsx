import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Clock, Plus, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, doc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { TimeEntry } from '../types';
import { formatTime, formatDuration } from '../lib/utils';

export const TimeTracker: React.FC = () => {
  const { user } = useAuth();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    project_name: '',
    description: ''
  });

  useEffect(() => {
    fetchTimeEntries();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (activeEntry) {
      interval = setInterval(() => {
        const now = new Date();
        const startTime = new Date(activeEntry.start_time);
        setElapsedTime(Math.floor((now.getTime() - startTime.getTime()) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeEntry]);

  const fetchTimeEntries = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'time_entries'),
        where('user_id', '==', user.uid),
        orderBy('created_at', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimeEntry));

      const running = data.find(entry => entry.is_running);
      setActiveEntry(running || null);
      setTimeEntries(data);
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.project_name.trim()) return;

    try {
      const newEntry = {
        project_name: formData.project_name,
        description: formData.description,
        start_time: new Date().toISOString(),
        is_running: false,
        user_id: user.uid,
        created_at: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'time_entries'), newEntry);
      const createdEntry = { id: docRef.id, ...newEntry } as TimeEntry;

      setTimeEntries([createdEntry, ...timeEntries]);
      setFormData({ project_name: '', description: '' });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating time entry:', error);
    }
  };

  const startTimer = async (entry: TimeEntry) => {
    if (activeEntry && activeEntry.id !== entry.id) {
      await stopTimer();
    }

    try {
      const entryRef = doc(db, 'time_entries', entry.id);
      const updatedData = {
        start_time: new Date().toISOString(),
        is_running: true,
        end_time: null,
        duration: null
      };

      await updateDoc(entryRef, updatedData);

      const updatedEntry = {
        ...entry,
        start_time: new Date().toISOString(),
        is_running: true,
        end_time: undefined,
        duration: undefined
      };
      setActiveEntry(updatedEntry);
      setTimeEntries(timeEntries.map(t => t.id === entry.id ? updatedEntry : { ...t, is_running: false }));
      setElapsedTime(0);
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  const stopTimer = async () => {
    if (!activeEntry) return;

    const now = new Date();
    const startTime = new Date(activeEntry.start_time);
    const duration = Math.floor((now.getTime() - startTime.getTime()) / 1000);

    try {
      const entryRef = doc(db, 'time_entries', activeEntry.id);
      const updatedData = {
        end_time: now.toISOString(),
        is_running: false,
        duration: duration
      };

      await updateDoc(entryRef, updatedData);

      const updatedEntry = {
        ...activeEntry,
        end_time: now.toISOString(),
        is_running: false,
        duration: duration
      };
      setTimeEntries(timeEntries.map(t => t.id === activeEntry.id ? updatedEntry : t));
      setActiveEntry(null);
      setElapsedTime(0);
    } catch (error) {
      console.error('Error stopping timer:', error);
    }
  };

  const quickStart = async () => {
    if (!user || !formData.project_name.trim()) return;

    try {
      // Stop any running timer
      if (activeEntry) {
        await stopTimer();
      }

      const newEntry = {
        project_name: formData.project_name,
        description: formData.description,
        start_time: new Date().toISOString(),
        is_running: true,
        user_id: user.uid,
        created_at: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'time_entries'), newEntry);
      const createdEntry = { id: docRef.id, ...newEntry } as TimeEntry;

      setActiveEntry(createdEntry);
      setTimeEntries([createdEntry, ...timeEntries]);
      setFormData({ project_name: '', description: '' });
      setIsCreating(false);
      setElapsedTime(0);
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  const totalHours = timeEntries
    .filter(entry => entry.duration)
    .reduce((total, entry) => total + (entry.duration || 0), 0);

  const todayEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.created_at).toDateString();
    const today = new Date().toDateString();
    return entryDate === today;
  });

  const todayHours = todayEntries
    .filter(entry => entry.duration)
    .reduce((total, entry) => total + (entry.duration || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Time Tracker</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track your time across projects and tasks
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Entry</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {formatDuration(elapsedTime)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Current Session</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-teal-600 mb-2">
            {formatDuration(todayHours)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Today</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-indigo-600 mb-2">
            {formatDuration(totalHours)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Tracked</div>
        </Card>
      </div>

      {/* Active Timer */}
      {activeEntry && (
        <Card className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {activeEntry.project_name}
              </h3>
              {activeEntry.description && (
                <p className="text-gray-600 dark:text-gray-300">{activeEntry.description}</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Started at {formatTime(activeEntry.start_time)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-mono font-bold text-purple-600">
                {formatDuration(elapsedTime)}
              </div>
              <Button
                onClick={stopTimer}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <Square className="w-4 h-4" />
                <span>Stop</span>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Start / Create Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Project or task name..."
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  required
                />
                <Input
                  placeholder="Description (optional)..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    onClick={quickStart}
                    className="flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Timer</span>
                  </Button>
                  <Button type="submit" variant="outline">
                    Save Entry
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsCreating(false);
                      setFormData({ project_name: '', description: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Entries */}
      {timeEntries.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Entries</h2>
          {timeEntries.map((entry) => (
            <Card key={entry.id} className="group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {entry.project_name}
                    </h3>
                    {entry.is_running && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs rounded-full">
                        Running
                      </span>
                    )}
                  </div>
                  {entry.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                      {entry.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(entry.start_time)}</span>
                      {entry.end_time && (
                        <span>- {formatTime(entry.end_time)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-mono font-semibold text-gray-900 dark:text-white">
                      {entry.duration ? formatDuration(entry.duration) : '00:00:00'}
                    </div>
                  </div>

                  {!entry.is_running ? (
                    <Button
                      onClick={() => startTimer(entry)}
                      variant="outline"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1"
                    >
                      <Play className="w-4 h-4" />
                      <span>Resume</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={stopTimer}
                      variant="secondary"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No time entries yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start tracking your time to see your productivity insights
          </p>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Create Entry
          </Button>
        </Card>
      )}
    </motion.div>
  );
};