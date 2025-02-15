"use client";

import { useState } from "react";
import { BookOpenText, Send, Sparkles } from "lucide-react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [emailOption, setEmailOption] = useState("me"); // 'me' or 'custom'
  const [customEmail, setCustomEmail] = useState(""); // custom email input
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const email = customEmail
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, altEmail: email === '' ? undefined:email }), // Sending email along with the title
      });

      if (response.ok) {
        setSuccess(true);
        setTitle("");
        setCustomEmail(""); // Clear custom email field
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <BookOpenText className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-primary">Book Summary Generator</h1>
          <p className="text-muted-foreground text-lg">
            Get instant book summaries delivered to your inbox
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-8 backdrop-blur-sm bg-opacity-50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-foreground">
                Book Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Enter the book title..."
                  required
                />
                <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              </div>
            </div>

            {/* Dropdown for email selection */}
            <div className="space-y-2">
              <label htmlFor="emailOption" className="text-sm font-medium text-foreground">
                Send Summary To
              </label>
              <select
                id="emailOption"
                value={emailOption}
                onChange={(e) => setEmailOption(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                <option value="me">Send to my email</option>
                <option value="custom">Send to custom email</option>
              </select>
            </div>

            {/* Custom email input */}
            {emailOption === "custom" && (
              <div className="space-y-2">
                <label htmlFor="customEmail" className="text-sm font-medium text-foreground">
                  Custom Email Address
                </label>
                <input
                  type="email"
                  id="customEmail"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Enter custom email..."
                  required={emailOption === "custom"}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !title}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium transition-all
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}
                ${success ? 'bg-green-600' : ''}`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : success ? (
                <>
                  <span>Summary of the book will be sent on your mail shortly!</span>
                  <Sparkles className="h-5 w-5" />
                </>
              ) : (
                <>
                  <span>Generate Summary</span>
                  <Send className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <h2 className="text-lg font-semibold mb-4 text-foreground">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[ 
                {
                  icon: <BookOpenText className="h-6 w-6" />,
                  title: "Enter Title",
                  description: "Input the name of any book you want summarized",
                },
                {
                  icon: <Sparkles className="h-6 w-6" />,
                  title: "AI Processing",
                  description: "Our AI generates a concise summary and key takeaways",
                },
                {
                  icon: <Send className="h-6 w-6" />,
                  title: "Instant Delivery",
                  description: "Receive the summary directly in your email inbox",
                },
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3 text-primary">
                    {step.icon}
                  </div>
                  <h3 className="font-medium mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
