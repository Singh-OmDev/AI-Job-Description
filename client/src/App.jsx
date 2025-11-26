import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Target, Zap, FileCheck } from 'lucide-react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { analyzeResume } from './services/api';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function Dashboard() {
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Pass token to API calls (you might need to update api.js or use axios interceptor)
    // For now, let's assume api.js handles it or we pass it
    // Actually, we need to update api.js to include the token header.
    // But for now, let's just get the UI working.

    const handleAnalyze = async (jdText, resumeText) => {
        setIsLoading(true);
        try {
            const data = await analyzeResume(jdText, resumeText);
            setResults(data);
        } catch (error) {
            console.error("Error analyzing resume:", error);
            if (error.response && error.response.status === 403) {
                alert("Session expired. Please login again.");
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                alert("An error occurred while analyzing the resume. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="space-y-16">
                <section className="text-center space-y-8 max-w-3xl mx-auto">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase animate-fadeIn">
                        AI-Powered Resume Optimization
                    </div>

                    <h2 className="text-5xl md:text-7xl font-heading font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] animate-slideUp">
                        Craft the Perfect <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                            Job Application
                        </span>
                    </h2>

                    <p className="max-w-xl mx-auto text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed animate-slideUp animation-delay-200">
                        Beat the ATS with precision. Tailor your resume to any job description instantly using advanced AI analysis.
                    </p>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 animate-slideUp animation-delay-400 text-left">
                        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                                <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">ATS Analysis</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                Get an instant match score and detailed feedback on how well your resume fits the job.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Smart Optimization</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                Identify missing keywords and skills to bridge the gap between you and the role.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-pink-50 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-4">
                                <FileCheck className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Tailored Content</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                Generate professional summaries and bullet points optimized for the specific job.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="animate-slideUp animation-delay-400">
                    <InputSection onAnalyze={handleAnalyze} isLoading={isLoading} />
                </section>

                {results && (
                    <section id="results" className="scroll-mt-24 animate-slideUp">
                        <ResultsSection results={results} />
                    </section>
                )}
            </div>
        </div>
    );
}

function App() {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <Router>
            <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white relative transition-colors duration-300">
                {/* Dot Grid Background */}
                <div className="fixed inset-0 z-0 pointer-events-none bg-grid-pattern opacity-[0.4] [mask-image:linear-gradient(to_bottom,white,transparent)] dark:[mask-image:linear-gradient(to_bottom,black,transparent)]"></div>

                <Header darkMode={darkMode} toggleTheme={toggleTheme} />

                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>

                <footer className="relative z-10 border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm mt-24 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-sm text-slate-400 dark:text-slate-500 font-medium">
                            &copy; {new Date().getFullYear()} AI ATS Resume Tailor.
                        </p>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
