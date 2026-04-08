import React from 'react';
import { motion } from 'framer-motion';
import { TrashIcon, DocumentArrowDownIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const BulkActions = ({ selectedCount, onDelete, onExport, onBulkAdd }) => {
    if (selectedCount === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary-50 rounded-lg p-3 flex items-center justify-between"
        >
            <p className="text-sm text-primary-700">
                <span className="font-semibold">{selectedCount}</span> user{selectedCount !== 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onBulkAdd}
                  className="!text-primary-700 !border-primary-200 hover:!bg-primary-100"
                >
                    <UserPlusIcon className="w-4 h-4 mr-1" />
                    Bulk Add
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onExport}
                  className="!text-primary-700 !border-primary-200 hover:!bg-primary-100"
                >
                    <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                    Export CSV
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onDelete}
                  className="!text-red-600 !border-red-200 hover:!bg-red-50"
                >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Delete Selected
                </Button>
            </div>
        </motion.div>
    );
};

export default BulkActions;