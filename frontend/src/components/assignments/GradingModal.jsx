import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const GradingModal = ({ isOpen, onClose, onSubmit, submission, assignment }) => {
  const [points, setPoints] = useState(submission?.grade?.pointsAwarded || '');
  const [feedback, setFeedback] = useState(submission?.grade?.feedback || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!points || points < 0 || points > assignment.points) {
      alert(`Points must be between 0 and ${assignment.points}`);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ pointsAwarded: parseFloat(points), feedback });
      onClose();
    } catch (error) {
      console.error('Grading error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
              <div className="flex items-center justify-between p-4 border-b border-surface-200">
                <h2 className="text-xl font-semibold text-surface-900">
                  Grade Submission
                </h2>
                <button onClick={onClose} className="p-1 rounded-lg text-surface-500 hover:bg-surface-100">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Student
                  </label>
                  <p className="text-surface-900 font-medium">{submission?.student?.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Points Awarded (out of {assignment.points})
                  </label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    className="w-full rounded-lg border border-surface-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={`0-${assignment.points}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Feedback
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide feedback to the student..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full rounded-lg border border-surface-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button variant="secondary" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSubmit} className="flex-1" isLoading={loading}>
                    Save Grade
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GradingModal;