import React, { useState } from 'react';
import axios from 'axios';

// --- Helper Icons (for better UI) ---
const IconMail = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);
const IconCopy = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
);
const IconCheckCircle = () => (
    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
);


function App() {
  // --- State Management ---
  const [step, setStep] = useState(1); // 1: Start, 2: Testing, 3: Showing Report
  const [userEmail, setUserEmail] = useState('');
  const [testCode, setTestCode] = useState('');
  const [testId, setTestId] = useState(''); // To build the shareable link
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Backend API URL ---
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // --- Test Inboxes (As per requirement) ---
  const TEST_INBOXES = [
    // Yahan apne 5 Zoho test accounts daal do
    "test1@zohomail.in",
    "test2@zohomail.in",
    "test3@zohomail.in",
    "test4@zohomail.in",
    "test5@zohomail.in"
  ];

  const handleStartTest = async () => {
    if (!userEmail || !/\S+@\S+\.\S+/.test(userEmail)) {
      setError('Please enter a valid email to receive the report.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/test/start`, { userEmail });
      setTestCode(response.data.testCode);
      setTestId(response.data.testId); // Assuming backend sends this
      setStep(2); // Move to the next step
    } catch (err) {
      setError('Failed to start test. Please check the backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/test/analyze/${testCode}`);
      setResults(response.data.results);
      setStep(3); // Show the report
    } catch (err) {
      setError('Analysis failed. Please ensure you sent the email correctly and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Code copied to clipboard!');
  };

  // --- Bonus: Calculate Deliverability Score ---
  const deliverabilityScore = () => {
    if (results.length === 0) return 0;
    const inboxCount = results.filter(r => r.folder === 'Inbox').length;
    return (inboxCount / results.length) * 100;
  };

  const score = deliverabilityScore();

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-2">Email Spam Report Tool</h1>
        <p className="text-center text-slate-500 mb-8">Test your email's journey to the inbox.</p>

        {/* --- Step 1: Start the Test --- */}
        {step === 1 && (
          <div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                <h3 className="font-semibold text-slate-700 mb-3">Send an email from your client to these 5 inboxes:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    {TEST_INBOXES.map(email => (
                        <div key={email} className="flex items-center gap-2 text-slate-600">
                            <IconMail /> <span>{email}</span>
                        </div>
                    ))}
                </div>
            </div>
            <label className="block font-semibold text-slate-700 mb-2">Enter your email to receive the report:</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="your.name@example.com"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button onClick={handleStartTest} disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-slate-400">
              {isLoading ? 'Starting...' : 'Start Test & Get Code'}
            </button>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </div>
        )}

        {/* --- Step 2: Testing in Progress --- */}
        {step === 2 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800">Your Test is Active!</h2>
            <p className="text-slate-500 mt-2 mb-6">Include the unique code below in the subject or body of the email you send to the test inboxes.</p>
            <div className="flex justify-center items-center gap-2 bg-slate-100 p-4 rounded-lg max-w-md mx-auto">
              <span className="font-mono text-xl text-blue-700">{testCode}</span>
              <button onClick={() => copyToClipboard(testCode)} title="Copy code" className="p-2 rounded-md hover:bg-slate-200">
                <IconCopy />
              </button>
            </div>
            <button onClick={handleAnalyze} disabled={isLoading} className="mt-8 w-full max-w-md bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:bg-slate-400">
              {isLoading ? 'Analyzing...' : "I've Sent The Email, Analyze Now"}
            </button>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </div>
        )}

        {/* --- Step 3: Report Display --- */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Deliverability Report</h2>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center mb-8">
              <p className="text-lg font-semibold text-blue-800">Overall Deliverability Score</p>
              <p className="text-6xl font-bold text-blue-700 my-2">{score.toFixed(0)}%</p>
              <p className="text-md text-blue-600">{results.filter(r => r.folder === 'Inbox').length} out of {results.length} emails landed in the Inbox.</p>
            </div>
            
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4 font-semibold text-slate-600">Provider</th>
                    <th className="p-4 font-semibold text-slate-600">Email</th>
                    <th className="p-4 font-semibold text-slate-600">Status</th>
                    <th className="p-4 font-semibold text-slate-600">Landed In</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td className="p-4">{result.provider}</td>
                      <td className="p-4">{result.email}</td>
                      <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${result.status === 'Received' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{result.status}</span></td>
                      <td className="p-4"><span className={`font-medium ${result.folder === 'Inbox' ? 'text-green-700' : 'text-red-700'}`}>{result.folder}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
             <div className="text-center mt-8">
                <button onClick={() => setStep(1)} className="bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-700 transition-colors">
                    Start New Test
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;