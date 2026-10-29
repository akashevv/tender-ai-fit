import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    usefulnessRating: '',
    easeOfUseRating: '',
    missingClear: '',
    sourcesUnderstandable: '',
    comments: '',
    suggestions: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store feedback locally
    const existing = JSON.parse(localStorage.getItem('taf_feedback') || '[]');
    existing.push({ ...form, timestamp: new Date().toISOString() });
    localStorage.setItem('taf_feedback', JSON.stringify(existing));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="max-w-xl mx-auto space-y-4 text-center">
        <div className="p-8 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-2xl font-bold text-green-700 mb-2">Thank you for your feedback!</h2>
          <p className="text-gray-600 mb-4">Your response has been saved locally in your browser.</p>
          <p className="text-sm text-gray-400 mb-6">Note: Feedback is stored locally and is not automatically sent to the team.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-blue-800">Feedback</h2>
      <p className="text-gray-600 text-sm">Your feedback helps improve Tender AI Fit. Responses are stored locally in your browser only.</p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Overall Usefulness (1–5)</label>
          <select name="usefulnessRating" required value={form.usefulnessRating} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2">
            <option value="">Select rating</option>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Ease of Use (1–5)</label>
          <select name="easeOfUseRating" required value={form.easeOfUseRating} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2">
            <option value="">Select rating</option>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Were missing requirements clearly shown?</label>
          <select name="missingClear" required value={form.missingClear} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2">
            <option value="">Select answer</option>
            <option value="yes">Yes</option>
            <option value="partly">Partly</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Were source references understandable?</label>
          <select name="sourcesUnderstandable" required value={form.sourcesUnderstandable} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2">
            <option value="">Select answer</option>
            <option value="yes">Yes</option>
            <option value="partly">Partly</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Open-ended comments</label>
          <textarea name="comments" value={form.comments} onChange={handleChange} rows={3}
            placeholder="Share your thoughts..."
            className="w-full border border-gray-300 rounded-lg p-2" />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Suggestions for improvement</label>
          <textarea name="suggestions" value={form.suggestions} onChange={handleChange} rows={3}
            placeholder="What would you like to see improved?"
            className="w-full border border-gray-300 rounded-lg p-2" />
        </div>

        <button type="submit"
          className="w-full py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition font-semibold">
          Submit Feedback
        </button>
      </form>
    </section>
  );
}
