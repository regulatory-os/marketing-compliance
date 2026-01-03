import React, { useState } from 'react';
import { Shield, Github, BookOpen, History, X } from 'lucide-react';
import {
  ContentInput,
  ScoreCard,
  IssueList,
  HighlightedContent,
  ExportButton,
} from '@/components';
import { useComplianceAnalysis } from '@/hooks';

function App() {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('email');
  const [showHistory, setShowHistory] = useState(false);

  const {
    result,
    isAnalyzing,
    error,
    analyze,
    clearResult,
    filteredIssues,
    severityFilter,
    setSeverityFilter,
    exportReport,
    history,
    clearHistory,
  } = useComplianceAnalysis();

  const handleAnalyze = () => {
    analyze(content, { contentType });
  };

  const handleClear = () => {
    setContent('');
    clearResult();
  };

  const loadFromHistory = (historicalResult: typeof result) => {
    if (historicalResult) {
      setContent(historicalResult.content);
      setShowHistory(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Marketing Compliance Analyzer
                </h1>
                <p className="text-xs text-gray-500">
                  Local analysis - No data leaves your browser
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <History className="h-5 w-5" />
                <span className="hidden sm:inline">History</span>
                {history.length > 0 && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    {history.length}
                  </span>
                )}
              </button>

              <a
                href="https://github.com/regulatory-os/marketing-compliance"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* History Sidebar */}
      {showHistory && (
        <div className="fixed inset-0 z-30 overflow-hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-25"
            onClick={() => setShowHistory(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Analysis History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-full pb-20">
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">No analysis history yet</p>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-sm font-medium ${
                            item.score >= 80
                              ? 'text-green-600'
                              : item.score >= 60
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          Score: {item.score}/100
                        </span>
                        <span className="text-xs text-gray-400">
                          {item.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {item.content.slice(0, 100)}...
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.issues.length} issue(s) found
                      </p>
                    </button>
                  ))}
                  <button
                    onClick={clearHistory}
                    className="w-full py-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Clear History
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <ContentInput
              content={content}
              onContentChange={setContent}
              contentType={contentType}
              onContentTypeChange={setContentType}
              onAnalyze={handleAnalyze}
              onClear={handleClear}
              isAnalyzing={isAnalyzing}
            />

            {/* Sample Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                Try Sample Content
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() =>
                    setContent(
                      `🔥 LAST CHANCE! Only 3 left in stock!

Our MIRACLE weight loss formula is clinically proven to help you lose 30 lbs in just 2 weeks - NO DIET OR EXERCISE NEEDED!

Join the 10,000+ customers who already transformed their lives.

"I lost 50 pounds in one month!" - Sarah M.

✅ 100% Guaranteed Results
✅ Completely FREE trial (just pay $4.99 shipping)
✅ Doctor recommended

ACT NOW before it's too late! This offer expires tonight at midnight!

Click here to claim your FREE bottle: [link]`
                    )
                  }
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200"
                >
                  Weight Loss Ad (Many Issues)
                </button>
                <button
                  onClick={() =>
                    setContent(
                      `Introducing our new project management tool.

Features include:
- Task tracking and organization
- Team collaboration
- Progress reporting

Start your 14-day free trial today. No credit card required.

Pricing starts at $9/month after trial. See our pricing page for details.`
                    )
                  }
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200"
                >
                  SaaS Product (Few Issues)
                </button>
                <button
                  onClick={() =>
                    setContent(
                      `Earn $10,000/month with our revolutionary passive income system!

Our secret formula has helped thousands quit their jobs and achieve financial freedom.

Guaranteed returns of 50% monthly on your investment. This is a risk-free opportunity that everyone is joining!

Unlike other programs, we guarantee you'll get rich quick.

Sign up now and receive our exclusive training for FREE!`
                    )
                  }
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200"
                >
                  Financial Scam (Critical Issues)
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            {result && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Analysis Results
                  </h2>
                  <ExportButton onExport={exportReport} />
                </div>

                <ScoreCard score={result.score} summary={result.summary} />

                <HighlightedContent content={result.content} issues={filteredIssues} />

                <IssueList
                  issues={filteredIssues}
                  severityFilter={severityFilter}
                  onSeverityFilterChange={setSeverityFilter}
                />
              </>
            )}

            {!result && !error && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-gray-500">
                  Enter your marketing content on the left and click "Analyze
                  Compliance" to check for potential regulatory issues.
                </p>
                <div className="mt-4 text-sm text-gray-400">
                  <p>Checks for:</p>
                  <p className="mt-1">
                    FTC Guidelines • GDPR • CAN-SPAM • FDA Claims • And more...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>
              Marketing Compliance Analyzer - An open-source tool by{' '}
              <a
                href="https://github.com/regulatory-os"
                className="text-blue-600 hover:underline"
              >
                regulatory-os
              </a>
            </p>
            <p className="mt-2">
              This tool provides guidance only and does not constitute legal advice.
              Always consult with a legal professional for compliance matters.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
