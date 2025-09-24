import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../Constants';

function Problems() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    const [filters, setFilters] = useState({
        category: '',
        subCategory: [],
        company: [],
        searchTerm: ''
    });

    const [filterOptions, setFilterOptions] = useState({
        subCategories: [],
        companies: []
    });

    const fetchProblems = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.category) params.append('category', filters.category);
            if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
            filters.subCategory.forEach(sc => params.append('subCategory', sc));
            filters.company.forEach(c => params.append('company', c));

            const res = await axios.get(`${API_BASE_URL}api/problems`, { params });
            setProblems(res.data);
        } catch (error) {
            console.error('Failed to fetch problems:', error);
            setProblems([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProblems();
    }, [fetchProblems]);
    
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [subCategoriesRes, companiesRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}api/problems/sub-categories`),
                    axios.get(`${API_BASE_URL}api/problems/companies`)
                ]);
                setFilterOptions({
                    subCategories: subCategoriesRes.data,
                    companies: companiesRes.data
                });
            } catch (error) {
                console.error('Failed to fetch filter options:', error);
            }
        };
        fetchOptions();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({...prev, [name]: value}));
    }
    
    const DifficultyBadge = ({ difficulty }) => {
        const colors = {
            'Easy': 'bg-green-100 text-green-800',
            'Medium': 'bg-yellow-100 text-yellow-800',
            'Hard': 'bg-red-100 text-red-800',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[difficulty] || 'bg-gray-100 text-gray-800'}`}>{difficulty}</span>
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="sm:flex sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Problem Set</h1>
                        <p className="mt-1 text-sm text-gray-500">Browse, filter, and contribute to our growing collection of problems.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/admin/NewProblemForm')}
                        className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        + Contribute Problem
                    </button>
                </div>
                
                {/* Filters could go here if needed in future */}

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-10">Loading problems...</td></tr>
                                ) : problems.length > 0 ? (
                                    problems.map(problem => (
                                        <tr key={problem.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{problem.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{problem.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{problem.category} ({problem.subCategory})</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm"><DifficultyBadge difficulty={problem.difficulty} /></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{problem.company || 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="text-center py-10">No problems found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Problems;

