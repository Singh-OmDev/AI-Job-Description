import React, { useState } from 'react';
import { CheckCircle, XCircle, Copy, Check, ChevronRight, Star, AlertTriangle } from 'lucide-react';

const ResultsSection = ({ results }) => {
    const [copiedSection, setCopiedSection] = useState(null);

    const handleCopy = (text, section) => {
        navigator.clipboard.writeText(text);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 2000);
    };

    if (!results) return null;

    const {
        atsScore,
        matchedSkills,
        missingSkills,
        extraKeywords,
        optimizedSummary,
        optimizedExperienceBullets,
        improvementTips
    } = results;

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 border-green-200 bg-green-50';
        if (score >= 60) return 'text-yellow-600 border-yellow-200 bg-yellow-50';
        return 'text-red-600 border-red-200 bg-red-50';
    };

    return (
        <div className="space-y-8 animate-fadeIn pb-12">
            {/* Score Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-gradient-to-tr from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-50"></div>

                <div className="flex-1 mb-8 md:mb-0 relative z-10 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Analysis Complete!</h2>
                    <p className="text-lg text-gray-600 max-w-xl">
                        We've analyzed your resume against the job description. Here is your personalized feedback and optimization plan.
                    </p>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className={`relative flex items-center justify-center w-40 h-40 rounded-full border-8 ${getScoreColor(atsScore)} bg-white shadow-2xl`}>
                        <div className="text-center">
                            <span className={`text-5xl font-extrabold block ${atsScore >= 60 ? 'text-gray-900' : 'text-red-600'}`}>{atsScore}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Score</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Skills & Keywords */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Matched Skills */}
                    <div className="bg-white rounded-2xl shadow-lg shadow-green-100/50 border border-green-50 p-6 transition-transform hover:-translate-y-1 duration-300">
                        <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg mr-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            Matched Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {matchedSkills.map((skill, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-100">
                                    {skill}
                                </span>
                            ))}
                            {matchedSkills.length === 0 && <span className="text-gray-400 text-sm italic">No exact matches found.</span>}
                        </div>
                    </div>

                    {/* Missing Skills */}
                    <div className="bg-white rounded-2xl shadow-lg shadow-red-100/50 border border-red-50 p-6 transition-transform hover:-translate-y-1 duration-300">
                        <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg mr-3">
                                <XCircle className="w-5 h-5 text-red-600" />
                            </div>
                            Missing Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {missingSkills.map((skill, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-100">
                                    {skill}
                                </span>
                            ))}
                            {missingSkills.length === 0 && <span className="text-gray-400 text-sm italic">Great job! No key skills missing.</span>}
                        </div>
                    </div>

                    {/* Improvement Tips */}
                    <div className="bg-white rounded-2xl shadow-lg shadow-yellow-100/50 border border-yellow-50 p-6 transition-transform hover:-translate-y-1 duration-300">
                        <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            </div>
                            Improvement Tips
                        </h3>
                        <ul className="space-y-4">
                            {improvementTips.map((tip, idx) => (
                                <li key={idx} className="flex items-start text-sm text-gray-700 bg-yellow-50/50 p-3 rounded-lg">
                                    <ChevronRight className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Optimized Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Optimized Summary */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden transition-all hover:shadow-2xl duration-300">
                        <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                                    <Star className="w-5 h-5 text-indigo-600" />
                                </div>
                                Optimized Professional Summary
                            </h3>
                            <button
                                onClick={() => handleCopy(optimizedSummary, 'summary')}
                                className="flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                            >
                                {copiedSection === 'summary' ? (
                                    <>
                                        <Check className="w-4 h-4 mr-1.5" /> Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 mr-1.5" /> Copy
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="p-8">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">{optimizedSummary}</p>
                        </div>
                    </div>

                    {/* Optimized Experience Bullets */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-purple-100/50 border border-gray-100 overflow-hidden transition-all hover:shadow-2xl duration-300">
                        <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                                    <Star className="w-5 h-5 text-purple-600" />
                                </div>
                                Optimized Experience Bullets
                            </h3>
                            <button
                                onClick={() => handleCopy(optimizedExperienceBullets.join('\n'), 'bullets')}
                                className="flex items-center px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                            >
                                {copiedSection === 'bullets' ? (
                                    <>
                                        <Check className="w-4 h-4 mr-1.5" /> Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 mr-1.5" /> Copy All
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="p-8">
                            <ul className="space-y-4">
                                {optimizedExperienceBullets.map((bullet, idx) => (
                                    <li key={idx} className="flex items-start group p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <span className="flex-shrink-0 w-2 h-2 mt-2.5 bg-purple-400 rounded-full mr-4 group-hover:bg-purple-600 group-hover:scale-125 transition-all"></span>
                                        <span className="text-gray-700 leading-relaxed">{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsSection;
