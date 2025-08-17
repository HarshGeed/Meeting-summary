'use client';

import { useState } from 'react';

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [customPrompt, setCustomPrompt] = useState('Summarize in bullet points for executives');
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState('');
  const [message, setMessage] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTranscript(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const generateSummary = async () => {
    if (!transcript.trim()) {
      alert('Please upload a transcript first');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          prompt: customPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareViaEmail = async () => {
    if (!summary.trim() || !emailRecipients.trim()) {
      alert('Please provide both summary and email recipients');
      return;
    }

    setIsSharing(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary,
          recipients: emailRecipients.split(',').map(email => email.trim()),
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      alert('Email sent successfully!');
      setEmailRecipients('');
      setMessage('');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          AI Meeting Notes Summarizer
        </h1>

        {/* File Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">1. Upload Transcript</h2>
          <input
            type="file"
            accept=".txt,.doc,.docx"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {transcript && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Transcript Preview:</h3>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none"
                placeholder="Or paste your transcript here..."
              />
            </div>
          )}
        </div>

        {/* Custom Prompt Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">2. Custom Instructions</h2>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none"
            placeholder="e.g., Summarize in bullet points for executives, Highlight only action items, Create a timeline of events..."
          />
        </div>

        {/* Generate Summary Button */}
        <div className="text-center mb-6">
          <button
            onClick={generateSummary}
            disabled={isGenerating || !transcript.trim()}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Summary'}
          </button>
        </div>

        {/* Generated Summary Section */}
        {summary && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">3. Generated Summary</h2>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full h-48 p-3 border border-gray-300 rounded-md resize-none"
              placeholder="AI-generated summary will appear here..."
            />
          </div>
        )}

        {/* Email Sharing Section */}
        {summary && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">4. Share via Email</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Emails (comma-separated):
                </label>
                <input
                  type="text"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="email1@example.com, email2@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Message (optional):
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none"
                  placeholder="Add a personal message to accompany the summary..."
                />
              </div>
              <button
                onClick={shareViaEmail}
                disabled={isSharing || !emailRecipients.trim()}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSharing ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
