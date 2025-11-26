import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { parsePdf } from '../services/api';

const InputSection = ({ onAnalyze, isLoading }) => {
    const [jdText, setJdText] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [jdFile, setJdFile] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [error, setError] = useState('');

    const jdFileInputRef = useRef(null);
    const resumeFileInputRef = useRef(null);

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setError('Please upload PDF files only.');
            return;
        }

        try {
            const text = await parsePdf(file);
            if (type === 'jd') {
                setJdFile(file);
                setJdText(text);
            } else {
                setResumeFile(file);
                setResumeText(text);
            }
            setError('');
        } catch (err) {
            setError('Failed to parse PDF. Please try copying and pasting the text.');
            console.error(err);
        }
    };

    const clearFile = (type) => {
        if (type === 'jd') {
            setJdFile(null);
            setJdText('');
            if (jdFileInputRef.current) jdFileInputRef.current.value = '';
        } else {
            setResumeFile(null);
            setResumeText('');
            if (resumeFileInputRef.current) resumeFileInputRef.current.value = '';
        }
    };

    const handleAnalyzeClick = () => {
        if (!jdText.trim() || !resumeText.trim()) {
            setError('Please provide both Job Description and Resume content.');
            return;
        }
        setError('');
        onAnalyze(jdText, resumeText);
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Description Section */}
                <div className="group bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md h-[500px] flex flex-col">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-lg flex justify-between items-center">
                        <h2 className="text-sm font-heading font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                            <FileText className="w-4 h-4 text-indigo-500 dark:text-indigo-400 mr-2" />
                            Job Description
                        </h2>
                        <div className="relative">
                            <input
                                type="file"
                                ref={jdFileInputRef}
                                onChange={(e) => handleFileUpload(e, 'jd')}
                                accept=".pdf"
                                className="hidden"
                            />
                            <button
                                onClick={() => jdFileInputRef.current.click()}
                                className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center transition-colors px-3 py-1.5 rounded-md hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                            >
                                <Upload className="w-3.5 h-3.5 mr-1.5" />
                                Upload PDF
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-4 flex flex-col">
                        {jdFile ? (
                            <div className="flex items-center justify-between p-3 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg mb-3 border border-indigo-100 dark:border-indigo-800">
                                <div className="flex items-center overflow-hidden">
                                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{jdFile.name}</span>
                                </div>
                                <button
                                    onClick={() => clearFile('jd')}
                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : null}

                        <textarea
                            className="flex-1 w-full p-3 bg-transparent border-0 focus:ring-0 resize-none text-sm leading-relaxed text-slate-600 dark:text-slate-300 placeholder-slate-300 dark:placeholder-slate-600"
                            placeholder="Paste the job description here..."
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                        />
                    </div>
                </div>

                {/* Resume Section */}
                <div className="group bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md h-[500px] flex flex-col">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-lg flex justify-between items-center">
                        <h2 className="text-sm font-heading font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                            <FileText className="w-4 h-4 text-indigo-500 dark:text-indigo-400 mr-2" />
                            Your Resume
                        </h2>
                        <div className="relative">
                            <input
                                type="file"
                                ref={resumeFileInputRef}
                                onChange={(e) => handleFileUpload(e, 'resume')}
                                accept=".pdf"
                                className="hidden"
                            />
                            <button
                                onClick={() => resumeFileInputRef.current.click()}
                                className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center transition-colors px-3 py-1.5 rounded-md hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                            >
                                <Upload className="w-3.5 h-3.5 mr-1.5" />
                                Upload PDF
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-4 flex flex-col">
                        {resumeFile ? (
                            <div className="flex items-center justify-between p-3 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg mb-3 border border-indigo-100 dark:border-indigo-800">
                                <div className="flex items-center overflow-hidden">
                                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{resumeFile.name}</span>
                                </div>
                                <button
                                    onClick={() => clearFile('resume')}
                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : null}

                        <textarea
                            className="flex-1 w-full p-3 bg-transparent border-0 focus:ring-0 resize-none text-sm leading-relaxed text-slate-600 dark:text-slate-300 placeholder-slate-300 dark:placeholder-slate-600"
                            placeholder="Paste your resume content here..."
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Analyze Button */}
            <div className="flex justify-center pt-4">
                <button
                    onClick={handleAnalyzeClick}
                    disabled={isLoading}
                    className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 bg-slate-900 dark:bg-indigo-600 rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 dark:focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/30"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2 text-indigo-300 dark:text-indigo-200 group-hover:text-white transition-colors" />
                            Analyze & Optimize
                            <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="animate-fadeIn p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                </div>
            )}
        </div>
    );
};

export default InputSection;
