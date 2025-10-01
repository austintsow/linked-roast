'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileDropProps {
  onFileSelect: (file: File) => void;
  onSwitchToPaste: () => void;
}

export function FileDrop({ onFileSelect, onSwitchToPaste }: FileDropProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const validateFile = (file: File): string | null => {
    if (file.type !== 'application/pdf') {
      return 'Only PDF files are supported';
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'File size exceeds 5MB limit';
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setError('');
    setSelectedFile(file);
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError('');
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          accept="application/pdf"
          onChange={handleFileInput}
          className="hidden"
        />

        {!selectedFile ? (
          <label htmlFor="file-upload" className="cursor-pointer block">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold text-blue-600">Click to upload</span> or
              drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF up to 5MB</p>
          </label>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={clearFile}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>
      )}

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={onSwitchToPaste}
          className="text-sm"
        >
          Or paste your profile text instead
        </Button>
      </div>
    </div>
  );
}
