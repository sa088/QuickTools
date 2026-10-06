import React, { useState } from 'react';
import { Mail, CheckCircle, Send } from 'lucide-react';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Contact & Feedback</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">We value your suggestions and feedback for new calculators and improvements.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
          <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Direct Email Support</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">support@quicktools.app</p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h2 className="text-base font-bold text-emerald-900 dark:text-emerald-200">Thank you for reaching out!</h2>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">We have received your message and will review your suggestions promptly.</p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setMessage('');
              }}
              className="mt-3 px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label htmlFor="contact-name" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Message or Calculator Request</label>
              <textarea
                id="contact-message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Let us know what feature or calculator you would like to see..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
