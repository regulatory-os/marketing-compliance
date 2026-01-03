import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { CONTENT_TYPES } from '@/types';

interface ContentInputProps {
  content: string;
  onContentChange: (content: string) => void;
  contentType: string;
  onContentTypeChange: (type: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
  isAnalyzing: boolean;
}

export function ContentInput({
  content,
  onContentChange,
  contentType,
  onContentTypeChange,
  onAnalyze,
  onClear,
  isAnalyzing,
}: ContentInputProps) {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onContentChange(text);
    } catch {
      // Clipboard access denied
    }
  };

  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Marketing Content
          </h2>
          <div className="flex items-center gap-2">
            <select
              value={contentType}
              onChange={(e) => onContentTypeChange(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CONTENT_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Paste or type your marketing content here for compliance analysis...

Example content to try:
- Email campaigns
- Social media posts
- Website copy
- Advertising scripts
- Press releases"
          className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />

        <div className="flex items-center justify-between mt-3">
          <div className="text-sm text-gray-500">
            {charCount} characters | {wordCount} words
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePaste}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Paste
            </button>
            <button
              onClick={onClear}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || !content.trim()}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              Analyzing...
            </>
          ) : (
            'Analyze Compliance'
          )}
        </button>
      </div>
    </div>
  );
}
