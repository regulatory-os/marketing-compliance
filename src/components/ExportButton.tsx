import React, { useState } from 'react';
import { Download, Copy, Check, FileText } from 'lucide-react';

interface ExportButtonProps {
  onExport: () => string;
  disabled?: boolean;
}

export function ExportButton({ onExport, disabled }: ExportButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleCopy = async () => {
    const report = onExport();
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowMenu(false);
  };

  const handleDownload = () => {
    const report = onExport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Download className="h-4 w-4" />
        Export Report
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          <button
            onClick={handleDownload}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <FileText className="h-4 w-4" />
            Download Markdown
          </button>
        </div>
      )}
    </div>
  );
}
