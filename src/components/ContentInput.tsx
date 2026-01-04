import React, { useCallback, useRef } from 'react';
import type { Language } from '@/types';
import { t, MAX_FILE_SIZE, ACCEPTED_FILE_TYPES, MIN_CONTENT_CHARS } from '@/utils/constants';

interface ContentInputProps {
  content: string;
  onContentChange: (content: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  language: Language;
}

export function ContentInput({
  content,
  onContentChange,
  onSubmit,
  isLoading,
  language,
}: ContentInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [extracting, setExtracting] = React.useState(false);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    if (file.size > MAX_FILE_SIZE) {
      alert(language === 'fr' ? 'Fichier trop volumineux (max 10 Mo)' : 'File too large (max 10 MB)');
      return;
    }

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_FILE_TYPES.includes(extension)) {
      alert(language === 'fr'
        ? `Format non supporté. Formats acceptés: ${ACCEPTED_FILE_TYPES.join(', ')}`
        : `Unsupported format. Accepted: ${ACCEPTED_FILE_TYPES.join(', ')}`
      );
      return;
    }

    setExtracting(true);

    try {
      if (extension === '.txt') {
        const text = await file.text();
        onContentChange(text);
      } else {
        // For PDF/DOC files, we'd need a library - for standalone, show message
        alert(language === 'fr'
          ? 'Pour les fichiers PDF/DOC, veuillez copier-coller le texte directement.'
          : 'For PDF/DOC files, please copy-paste the text directly.'
        );
      }
    } catch (err) {
      console.error('Error reading file:', err);
      alert(language === 'fr' ? 'Erreur lors de la lecture du fichier' : 'Error reading file');
    } finally {
      setExtracting(false);
    }
  }, [language, onContentChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const isValid = content.length >= MIN_CONTENT_CHARS;

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={ACCEPTED_FILE_TYPES.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        <div className="text-gray-600">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-3"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="font-medium">{t('dropDocument', language)}</p>
          <p className="text-sm mt-1">{t('clickToSelect', language)}</p>
          <p className="text-xs text-gray-500 mt-2">{t('acceptedFormats', language)}</p>
        </div>
      </div>

      {/* Text area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('documentContent', language)}
        </label>
        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('pasteText', language)}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          disabled={isLoading || extracting}
        />
        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
          <span>
            {content.length} {t('characters', language)}
            {content.length > 0 && content.length < MIN_CONTENT_CHARS && (
              <span className="text-red-500 ml-2">
                (min. {MIN_CONTENT_CHARS})
              </span>
            )}
          </span>
          <button
            onClick={onSubmit}
            disabled={!isValid || isLoading || extracting}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isValid && !isLoading && !extracting
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? t('analyzing', language) : extracting ? t('extracting', language) : t('startAnalysis', language)}
          </button>
        </div>
      </div>
    </div>
  );
}
