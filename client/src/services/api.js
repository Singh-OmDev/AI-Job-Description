import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const parsePdf = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/parse-pdf`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.text;
};

export const analyzeResume = async (jobDescription, resumeText) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/analyze`, {
        jobDescription,
        resumeText,
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};
