import React from 'react';
import { FileText, Sparkles, Moon, Sun, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ darkMode, toggleTheme }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-slate-900 dark:bg-indigo-600 p-2 rounded-lg shadow-sm group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 transition-colors duration-300">
                        <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                            Resume<span className="text-indigo-600 dark:text-indigo-400">Tailor</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Toggle Dark Mode"
                    >
                        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300">
                                {user.name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700">
                                <Sparkles className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                                <span>AI Powered 2.0</span>
                            </div>
                            <button
                                onClick={() => navigate('/login')}
                                className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                            >
                                Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
