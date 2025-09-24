import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  ListFilter,
} from "lucide-react";

const API_BASE_URL = "${API_BASE_URL}api";

const Problem = () => {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Filter States ---
  const [selectedMainCategory, setSelectedMainCategory] = useState("All Problems");
  const [searchTerm, setSearchTerm] = useState("");

  // Sub-categories
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]); // Array for multiple selections
  const [expandedSubCategories, setExpandedSubCategories] = useState(false);

  // Companies
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]); // Array for multiple selections
  const [companySearchTerm, setCompanySearchTerm] = useState(""); // For sidebar company search


  const navigate = useNavigate();

  const mainCategories = [
    { name: "All Problems", icon: ListFilter },
    { name: "Aptitude", icon: Filter },
    { name: "OS", icon: Filter },
    { name: "DBMS", icon: Filter },
    { name: "OOPS", icon: Filter },
    { name: "CN", icon: Filter },
  ];

  // Fetch initial filter options (sub-categories, companies)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setIsLoading(true);
      try {
        const [subCategoriesRes, companiesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/problems/sub-categories`),
          fetch(`${API_BASE_URL}/problems/companies`),
        ]);
        if (!subCategoriesRes.ok || !companiesRes.ok) {
          throw new Error('Failed to fetch filter options');
        }
        const subCategoriesData = await subCategoriesRes.json();
        const companiesData = await companiesRes.json();
        setAvailableSubCategories(subCategoriesData || []);
        setAvailableCompanies(companiesData || []);
      } catch (err) {
        console.error("Failed to fetch filter options:", err);
        setAvailableSubCategories([]);
        setAvailableCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFilterOptions();
  }, []);

  // Fetch problems based on current filters
  const fetchProblems = useCallback(async () => {
    setIsLoading(true);
    let url = `${API_BASE_URL}/problems`;
    const params = new URLSearchParams();

    if (selectedMainCategory && selectedMainCategory !== "All Problems") {
      params.append("category", selectedMainCategory);
    }

    selectedSubCategories.forEach(subCat => {
      params.append("subCategory", subCat); // Appends multiple times if multiple selected
    });

    selectedCompanies.forEach(comp => {
      params.append("company", comp); // Appends multiple times
    });

    if (searchTerm) {
      params.append("searchTerm", searchTerm);
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setProblems(data || []);
    } catch (err) {
      console.error("Failed to fetch problems:", err);
      setProblems([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMainCategory, selectedSubCategories, selectedCompanies, searchTerm]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  // Client-side search for problems list (applied after backend filtering)
  // Or remove if backend search is comprehensive
  const searchedProblems = problems.filter(prob =>
    prob.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Client-side search for companies in the sidebar
  const filteredAvailableCompanies = availableCompanies.filter(c =>
    c.toLowerCase().includes(companySearchTerm.toLowerCase())
  );


  const handleMainCategoryChange = (categoryName) => {
    setSelectedMainCategory(categoryName);
    // Optionally reset other filters or not, based on desired UX
    // setSelectedSubCategories([]);
    // setSelectedCompanies([]);
  };

  const toggleSubCategory = (subCategoryName) => {
    setSelectedSubCategories(prev =>
      prev.includes(subCategoryName)
        ? prev.filter(sc => sc !== subCategoryName)
        : [...prev, subCategoryName]
    );
  };

  const toggleCompany = (companyName) => {
    setSelectedCompanies(prev =>
      prev.includes(companyName)
        ? prev.filter(c => c !== companyName)
        : [...prev, companyName]
    );
  };


  const getColor = (diff) => {
    if (diff === "Easy") return "text-green-400";
    if (diff === "Medium") return "text-yellow-400";
    if (diff === "Hard") return "text-red-400";
    return "text-white";
  };

  const subCategoriesToDisplay = expandedSubCategories ? availableSubCategories : availableSubCategories.slice(0, 6);

  return (
    <div className="bg-[#1e1e1e] text-white flex min-h-screen px-6 py-4 gap-6">
      {/* Main Content */}
      <div className="w-3/4">
        {/* Main Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {mainCategories.map((cat) => {
            const isActive = selectedMainCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => handleMainCategoryChange(cat.name)}
                className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm transition ${isActive
                    ? "bg-white text-black"
                    : "bg-[#2c2c2c] text-white hover:bg-[#3a3a3a]"
                  }`}
              >
                <cat.icon size={14} /> {cat.name}
              </button>
            );
          })}
        </div>

        {/* Sub-category Tags (formerly Topic Tags) */}
        {availableSubCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center mb-6">
            {subCategoriesToDisplay.map((subCatName) => {
              const isActive = selectedSubCategories.includes(subCatName);
              // Count can be calculated client-side based on 'problems' or fetched if backend provides it
              // const count = problems.filter(p => p.subCategory === subCatName).length;
              return (
                <div
                  key={subCatName}
                  onClick={() => toggleSubCategory(subCatName)}
                  className={`cursor-pointer bg-[#2c2c2c] text-sm px-3 py-1.5 rounded-full flex items-center gap-1 transition hover:bg-[#3f3f3f]
                                ${isActive ? "!bg-blue-500 text-white" : "text-gray-300"}`}
                >
                  <span>{subCatName}</span>
                  {/* Optional: Display count (client-side or from backend) */}
                  {/* <span className={`bg-gray-700 text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-700' : ''}`}>{count}</span> */}
                </div>
              );
            })}
            {availableSubCategories.length > 6 && (
              <button
                className="text-gray-400 hover:text-white"
                onClick={() => setExpandedSubCategories(!expandedSubCategories)}
              >
                {expandedSubCategories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
          </div>
        )}


        {/* Search and Other Filters (like dropdowns if you add them later) */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search questions by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#2c2c2c] text-white rounded-md placeholder-gray-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {/* Placeholder for Sort and other global filters */}
          {/* <button className="bg-[#2c2c2c] px-3 py-2 rounded-md flex items-center gap-1 text-sm">
            <span>Sort</span>
            <ChevronDown size={16} />
          </button>
          <button className="bg-[#2c2c2c] p-2 rounded-md text-sm">
            <Filter size={16} />
          </button> */}
        </div>

        {/* Problems Table */}
        <div className="bg-[#2a2a2a] rounded-md">
          {isLoading && problems.length === 0 ? ( // Show loading only if no problems are yet displayed
            <div className="p-4 text-gray-400 text-sm">Loading problems...</div>
          ) : !isLoading && searchedProblems.length === 0 ? (
            <div className="p-4 text-gray-400 text-sm">No problems found matching your criteria.</div>
          ) : (
            searchedProblems.map((prob) => (
              <div
                key={prob.id}
                onClick={() => navigate(`/problem/${prob.id}`)}
                className="flex justify-between items-center px-4 py-3 border-b border-[#3a3a3a] hover:bg-[#333333] cursor-pointer"
              >
                <div className="text-sm font-medium w-3/5 truncate" title={prob.title}>
                  {prob.id}. {prob.title}
                </div>
                <div className="flex items-center gap-4 text-sm text-right w-2/5 justify-end">
                  <span className="text-gray-400 whitespace-nowrap">{prob.views || 0} views</span>
                  <span className={`${getColor(prob.difficulty)} whitespace-nowrap`}>{prob.difficulty || "N/A"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-1/4">
        <div className="bg-[#2a2a2a] p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Trending Companies</h2>
          <input
            type="text"
            placeholder="Search for a company..."
            value={companySearchTerm}
            onChange={(e) => setCompanySearchTerm(e.target.value)}
            className="w-full mb-3 px-3 py-2 bg-[#1f1f1f] text-sm rounded-md outline-none"
          />
          <div className="flex flex-wrap gap-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
            {filteredAvailableCompanies.length > 0 ? (
              filteredAvailableCompanies.map((companyName) => {
                const isActive = selectedCompanies.includes(companyName);
                // const count = problems.filter(p => p.company === companyName).length;
                return (
                  <div
                    key={companyName}
                    onClick={() => toggleCompany(companyName)}
                    className={`cursor-pointer bg-[#3a3a3a] text-sm text-white px-3 py-1 rounded-full flex items-center gap-1 transition hover:bg-[#4f4f4f]
                                  ${isActive ? "!bg-orange-500 text-black" : ""}`}
                  >
                    {companyName}
                    {/* Optional: Display count */}
                    {/* <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                                      ${isActive ? "bg-orange-700 text-white" : "bg-orange-400 text-black"}`}>
                      {count}
                    </span> */}
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-400">No companies match your search.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem;