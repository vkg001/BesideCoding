import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus, ExternalLink, Clock, Building2, Tag, ChevronDown, X } from 'lucide-react';

// Mock data for demonstration - replace with your actual API calls
const mockProblems = [
  { id: 1, title: "Two Sum", category: "Arrays", subCategory: "Hash Table", difficulty: "Easy", company: "Google", timeComplexity: "O(n)", spaceComplexity: "O(n)" },
  { id: 2, title: "Binary Tree Traversal", category: "Trees", subCategory: "DFS", difficulty: "Medium", company: "Amazon", timeComplexity: "O(n)", spaceComplexity: "O(h)" },
  { id: 3, title: "Sliding Window Maximum", category: "Arrays", subCategory: "Sliding Window", difficulty: "Hard", company: "Microsoft", timeComplexity: "O(n)", spaceComplexity: "O(k)" },
  { id: 4, title: "Valid Parentheses", category: "Stacks", subCategory: "String Matching", difficulty: "Easy", company: "Facebook", timeComplexity: "O(n)", spaceComplexity: "O(n)" },
  { id: 5, title: "Graph Shortest Path", category: "Graphs", subCategory: "BFS", difficulty: "Medium", company: "Apple", timeComplexity: "O(V+E)", spaceComplexity: "O(V)" },
];

const mockFilterOptions = {
  subCategories: ["Hash Table", "DFS", "Sliding Window", "String Matching", "BFS"],
  companies: ["Google", "Amazon", "Microsoft", "Facebook", "Apple"]
};

function Problems() {
    const [problems, setProblems] = useState(mockProblems);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    
    const [filters, setFilters] = useState({
        category: '',
        subCategory: [],
        company: [],
        searchTerm: '',
        difficulty: ''
    });

    const [filterOptions, setFilterOptions] = useState(mockFilterOptions);

    const fetchProblems = useCallback(async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            let filteredProblems = mockProblems;
            
            if (filters.searchTerm) {
                filteredProblems = filteredProblems.filter(p => 
                    p.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
                );
            }
            
            if (filters.difficulty) {
                filteredProblems = filteredProblems.filter(p => p.difficulty === filters.difficulty);
            }
            
            if (filters.category) {
                filteredProblems = filteredProblems.filter(p => p.category === filters.category);
            }
            
            setProblems(filteredProblems);
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

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({...prev, [name]: value}));
    }

    const handleMultiSelectFilter = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType].includes(value) 
                ? prev[filterType].filter(item => item !== value)
                : [...prev[filterType], value]
        }));
    }

    const clearFilters = () => {
        setFilters({
            category: '',
            subCategory: [],
            company: [],
            searchTerm: '',
            difficulty: ''
        });
    }

    const hasActiveFilters = Object.values(filters).some(filter => 
        Array.isArray(filter) ? filter.length > 0 : filter !== ''
    );
    
    const DifficultyBadge = ({ difficulty }) => {
        const colors = {
            'Easy': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'Medium': 'bg-amber-100 text-amber-700 border-amber-200',
            'Hard': 'bg-rose-100 text-rose-700 border-rose-200',
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[difficulty] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                {difficulty}
            </span>
        );
    }

    const ProblemCard = ({ problem }) => (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all duration-200 cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {problem.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Problem #{problem.id}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                    <Tag className="w-3 h-3 mr-1" />
                    {problem.category}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                    {problem.subCategory}
                </span>
                <DifficultyBadge difficulty={problem.difficulty} />
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                    <Building2 className="w-4 h-4 mr-1" />
                    {problem.company || 'N/A'}
                </div>
                <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {problem.timeComplexity}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span>Space: {problem.spaceComplexity}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
                                Problem Set
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Explore {problems.length} carefully curated coding challenges
                            </p>
                        </div>
                        <button 
                            onClick={() => {/* navigate('/admin/NewProblemForm') */}}
                            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Problem
                        </button>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="searchTerm"
                                    value={filters.searchTerm}
                                    onChange={handleFilterChange}
                                    placeholder="Search problems by title..."
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Quick Filters */}
                        <div className="flex flex-wrap gap-3">
                            <select
                                name="difficulty"
                                value={filters.difficulty}
                                onChange={handleFilterChange}
                                className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">All Difficulties</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>

                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">All Categories</option>
                                <option value="Arrays">Arrays</option>
                                <option value="Trees">Trees</option>
                                <option value="Graphs">Graphs</option>
                                <option value="Stacks">Stacks</option>
                            </select>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                More Filters
                                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>

                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Companies</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {filterOptions.companies.map(company => (
                                            <button
                                                key={company}
                                                onClick={() => handleMultiSelectFilter('company', company)}
                                                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                                    filters.company.includes(company)
                                                        ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                                                        : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
                                                }`}
                                            >
                                                {company}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Sub Categories</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {filterOptions.subCategories.map(subCat => (
                                            <button
                                                key={subCat}
                                                onClick={() => handleMultiSelectFilter('subCategory', subCat)}
                                                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                                    filters.subCategory.includes(subCat)
                                                        ? 'bg-purple-100 text-purple-700 border-purple-300'
                                                        : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
                                                }`}
                                            >
                                                {subCat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {loading ? 'Loading...' : `${problems.length} Problems Found`}
                        </h2>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>Sort by:</span>
                            <select className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                <option>Difficulty</option>
                                <option>Title</option>
                                <option>Company</option>
                                <option>Recently Added</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Problems Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                                <div className="flex space-x-2 mb-4">
                                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : problems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {problems.map(problem => (
                            <ProblemCard key={problem.id} problem={problem} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No problems found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search criteria or clearing filters.</p>
                        <button 
                            onClick={clearFilters}
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Pagination placeholder */}
                {problems.length > 0 && (
                    <div className="mt-12 flex justify-center">
                        <div className="flex items-center space-x-2">
                            <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50">Previous</button>
                            <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white">1</button>
                            <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">2</button>
                            <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">3</button>
                            <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Problems;