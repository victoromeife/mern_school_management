import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AvatarUpload = ({ currentAvatar, onUpload, size = 'lg' }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentAvatar);
  const fileInputRef = useRef(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      await onUpload(formData);
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Failed to upload avatar');
      setPreview(currentAvatar);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setUploading(true);
    try {
      await onUpload(null); // Pass null to remove avatar
      setPreview(null);
      toast.success('Avatar removed');
    } catch (error) {
      toast.error('Failed to remove avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center`}>
          {preview ? (
            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-4xl font-bold">
              {currentAvatar ? '👤' : '?'}
            </span>
          )}
        </div>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border border-surface-200 hover:bg-surface-50 transition-colors disabled:opacity-50"
        >
          <CameraIcon className="w-4 h-4 text-surface-600" />
        </button>
        
        {preview && preview !== currentAvatar && (
          <button
            onClick={handleRemove}
            disabled={uploading}
            className="absolute top-0 right-0 p-1 bg-red-500 rounded-full shadow-md hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="w-3 h-3 text-white" />
          </button>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {uploading && (
        <div className="mt-2 flex items-center gap-2 text-sm text-surface-500">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600"></div>
          Uploading...
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;