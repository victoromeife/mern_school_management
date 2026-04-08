import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const SubmissionModal = ({ isOpen, onClose, onSubmit, assignment }) => {
  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert('Please upload at least one file');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ files, comments });
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
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
                  Submit Assignment
                </h2>
                <button onClick={onClose} className="p-1 rounded-lg text-surface-500 hover:bg-surface-100">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Upload Files
                  </label>
                  <div className="border-2 border-dashed border-surface-300 rounded-lg p-6 text-center">
                    <DocumentArrowUpIcon className="w-8 h-8 text-surface-400 mx-auto mb-2" />
                    <p className="text-sm text-surface-600 mb-2">
                      Drag and drop files here, or click to select
                    </p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block px-4 py-2 bg-surface-100 text-surface-700 rounded-lg text-sm cursor-pointer hover:bg-surface-200 transition-colors"
                    >
                      Select Files
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-surface-50 rounded-lg">
                          <span className="text-sm text-surface-700">{file.name}</span>
                          <button
                            onClick={() => removeFile(idx)}
                            className="text-red-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Comments (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add any notes for your teacher..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full rounded-lg border border-surface-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button variant="secondary" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    className="flex-1"
                    isLoading={loading}
                  >
                    Submit Assignment
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

export default SubmissionModal;