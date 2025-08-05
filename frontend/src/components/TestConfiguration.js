// src/components/TestConfiguration.js (or src/pages/TestConfiguration.js)
import React, { useState, useEffect } from 'react';
import './TestConfiguration.css'; // Make sure this path is correct relative to this file

// Placeholder for images - adjust paths as needed for your React project's public folder or asset management
import logo from '../assets/logo.svg'; // Example if using webpack/vite asset imports
import userAvatar from '../assets/user.svg'; // Example

const TestConfiguration = () => {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState('testDefinitions'); // 'testDefinitions', 'testCategories', 'testParameters', 'referenceRanges'
    const [showAddTestModal, setShowAddTestModal] = useState(false);
    const [showImportTestsModal, setShowImportTestsModal] = useState(false);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [showAddParameterModal, setShowAddParameterModal] = useState(false);
    const [showAddRangeModal, setShowAddRangeModal] = useState(false);

    // Form data states for each modal (initialize with empty strings or default values)
    const [newTest, setNewTest] = useState({
        testCode: '',
        testName: '',
        category: '',
        department: '',
        testType: 'biochemical', // Default selected
        sampleType: '',
        price: '',
        turnaroundTime: '',
        description: '',
        testProtocol: '',
        samplePreparation: '',
        isActive: true,
        // Specific fields for test types
        microbiologicalMethod: '',
        biochemicalMethod: '',
        ph: '',
        temp: '',
        physicalChemicalMethod: '',
    });

    const [newCategory, setNewCategory] = useState({
        categoryId: '',
        categoryName: '',
        department: '',
        description: '',
        isActive: true,
    });

    const [newParameter, setNewParameter] = useState({
        parameterId: '',
        parameterName: '',
        test: '',
        parameterType: 'numerical', // Default selected
        unit: '',
        method: '',
        lowerLimit: '',
        upperLimit: '',
        description: '',
        isActive: true,
        // Specific fields for parameter types
        microbiologicalTarget: '',
        biochemicalReagent: '',
    });

    const [newRange, setNewRange] = useState({
        rangeId: '',
        parameter: '',
        test: '',
        lowerLimit: '',
        upperLimit: '',
        unit: '',
        applicableTo: '',
        description: '',
        regulatoryReference: '',
    });

    const [importFile, setImportFile] = useState(null);

    // Filter states for tables
    const [testFilters, setTestFilters] = useState({
        name: '',
        category: '',
        type: '',
        status: '',
    });
    const [categoryFilters, setCategoryFilters] = useState({ name: '' });
    const [parameterFilters, setParameterFilters] = useState({ name: '', test: '', type: '' });
    const [rangeFilters, setRangeFilters] = useState({ description: '', parameter: '' });


    // --- Dummy Data (Replace with data fetched from your Node.js backend) ---
    const [tests, setTests] = useState([
        { code: 'T001', name: 'Blood Glucose', category: 'Biochemistry', department: 'Clinical', type: 'Biochemical', price: '20.00', tat: '4 Hrs', status: 'Active' },
        { code: 'T002', name: 'Urine Culture', category: 'Microbiology', department: 'Microbiology', type: 'Microbiological', price: '50.00', tat: '24 Hrs', status: 'Active' },
        { code: 'T003', name: 'Water pH', category: 'Environmental', department: 'Environmental', type: 'Physical/Chemical', price: '15.00', tat: '1 Hrs', status: 'Inactive' },
        // Add more dummy data as needed for each tab's table
    ]);

    const [categories, setCategories] = useState([
        { id: 'C001', name: 'Biochemistry', department: 'Clinical Lab', description: 'Tests related to biochemical analysis.', testsCount: 50, status: 'Active' },
        { id: 'C002', name: 'Microbiology', department: 'Microbiology Lab', description: 'Tests related to microbial analysis.', testsCount: 30, status: 'Active' },
    ]);

    const [parameters, setParameters] = useState([
        { id: 'P001', name: 'Glucose Level', test: 'Blood Glucose', type: 'Numerical', unit: 'mg/dL', normalRange: '70-100', method: 'Enzymatic', status: 'Active' },
        { id: 'P002', name: 'E.coli Count', test: 'Urine Culture', type: 'Microbiological', unit: 'CFU/mL', normalRange: '<10^5', method: 'Culture', status: 'Active' },
    ]);

    const [ranges, setRanges] = useState([
        { id: 'R001', parameter: 'Glucose Level', test: 'Blood Glucose', lowerLimit: '70', upperLimit: '100', unit: 'mg/dL', applicableTo: 'Adults', description: 'Standard adult range' },
        { id: 'R002', parameter: 'pH', test: 'Water pH', lowerLimit: '6.5', upperLimit: '8.5', unit: 'pH', applicableTo: 'Drinking Water', description: 'WHO drinking water standard' },
    ]);


    // --- Handlers for Modals ---
    const openModal = (modalName) => {
        if (modalName === 'addTest') setShowAddTestModal(true);
        else if (modalName === 'importTests') setShowImportTestsModal(true);
        else if (modalName === 'addCategory') setShowAddCategoryModal(true);
        else if (modalName === 'addParameter') setShowAddParameterModal(true);
        else if (modalName === 'addRange') setShowAddRangeModal(true);
    };

    const closeModal = (modalName) => {
        if (modalName === 'addTest') setShowAddTestModal(false);
        else if (modalName === 'importTests') setShowImportTestsModal(false);
        else if (modalName === 'addCategory') setShowAddCategoryModal(false);
        else if (modalName === 'addParameter') setShowAddParameterModal(false);
        else if (modalName === 'addRange') setShowAddRangeModal(false);

        // Optionally reset form state when closing
        setNewTest({ /* reset to initial state */ });
        setNewCategory({ /* reset to initial state */ });
        setNewParameter({ /* reset to initial state */ });
        setNewRange({ /* reset to initial state */ });
        setImportFile(null);
    };

    // --- Form Change Handlers ---
    const handleTestChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewTest(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCategoryChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewCategory(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleParameterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewParameter(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRangeChange = (e) => {
        const { name, value } = e.target;
        setNewRange(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setImportFile(e.target.files[0]);
    };

    // --- Submission Handlers (These would typically call your Node.js API) ---
    const handleAddTestSubmit = (e) => {
        e.preventDefault();
        console.log('Adding new test:', newTest);
        // Call your Node.js API to save the newTest data
        // Example: axios.post('/api/tests', newTest)
        // Then, if successful, update the `tests` state:
        setTests(prev => [...prev, {
            code: newTest.testCode,
            name: newTest.testName,
            category: newTest.category,
            department: newTest.department,
            type: newTest.testType,
            price: newTest.price,
            tat: newTest.turnaroundTime,
            status: newTest.isActive ? 'Active' : 'Inactive'
        }]);
        closeModal('addTest');
    };

    const handleAddCategorySubmit = (e) => {
        e.preventDefault();
        console.log('Adding new category:', newCategory);
        // Call your Node.js API
        setCategories(prev => [...prev, {
            id: newCategory.categoryId,
            name: newCategory.categoryName,
            department: newCategory.department,
            description: newCategory.description,
            testsCount: 0, // New category starts with 0 tests
            status: newCategory.isActive ? 'Active' : 'Inactive'
        }]);
        closeModal('addCategory');
    };

    const handleAddParameterSubmit = (e) => {
        e.preventDefault();
        console.log('Adding new parameter:', newParameter);
        // Call your Node.js API
        setParameters(prev => [...prev, {
            id: newParameter.parameterId,
            name: newParameter.parameterName,
            test: newParameter.test,
            type: newParameter.parameterType,
            unit: newParameter.unit,
            normalRange: `${newParameter.lowerLimit}-${newParameter.upperLimit}`,
            method: newParameter.method,
            status: newParameter.isActive ? 'Active' : 'Inactive'
        }]);
        closeModal('addParameter');
    };

    const handleAddRangeSubmit = (e) => {
        e.preventDefault();
        console.log('Adding new range:', newRange);
        // Call your Node.js API
        setRanges(prev => [...prev, {
            id: newRange.rangeId,
            parameter: newRange.parameter,
            test: newRange.test,
            lowerLimit: newRange.lowerLimit,
            upperLimit: newRange.upperLimit,
            unit: newRange.unit,
            applicableTo: newRange.applicableTo,
            description: newRange.description,
            regulatoryReference: newRange.regulatoryReference
        }]);
        closeModal('addRange');
    };

    const handleImportTestsSubmit = (e) => {
        e.preventDefault();
        if (importFile) {
            console.log('Importing file:', importFile.name);
            // Here you would typically send the file to your Node.js backend
            const formData = new FormData();
            formData.append('file', importFile);
            // Example: axios.post('/api/tests/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            // Upon success, refresh your tests data
        } else {
            alert('Please select a file to import.');
        }
        closeModal('importTests');
    };

    // --- Filter Handlers ---
    const handleTestFilterChange = (e) => {
        const { name, value } = e.target;
        setTestFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryFilterChange = (e) => {
        const { name, value } = e.target;
        setCategoryFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleParameterFilterChange = (e) => {
        const { name, value } = e.target;
        setParameterFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleRangeFilterChange = (e) => {
        const { name, value } = e.target;
        setRangeFilters(prev => ({ ...prev, [name]: value }));
    };

    // --- Filtering Logic (simplified for client-side) ---
    const filteredTests = tests.filter(test => {
        return (
            test.name.toLowerCase().includes(testFilters.name.toLowerCase()) &&
            (testFilters.category === '' || test.category === testFilters.category) &&
            (testFilters.type === '' || test.type === testFilters.type) &&
            (testFilters.status === '' || test.status === testFilters.status)
        );
    });

    const filteredCategories = categories.filter(category => {
        return category.name.toLowerCase().includes(categoryFilters.name.toLowerCase());
    });

    const filteredParameters = parameters.filter(param => {
        return (
            param.name.toLowerCase().includes(parameterFilters.name.toLowerCase()) &&
            (parameterFilters.test === '' || param.test === parameterFilters.test) &&
            (parameterFilters.type === '' || param.type === parameterFilters.type)
        );
    });

    const filteredRanges = ranges.filter(range => {
        return (
            range.description.toLowerCase().includes(rangeFilters.description.toLowerCase()) &&
            (rangeFilters.parameter === '' || range.parameter === rangeFilters.parameter)
        );
    });

    // --- Pagination Logic (simplified for client-side) ---
    const itemsPerPage = 10;
    const [currentPageTests, setCurrentPageTests] = useState(1);
    const [currentPageCategories, setCurrentPageCategories] = useState(1);
    const [currentPageParameters, setCurrentPageParameters] = useState(1);
    const [currentPageRanges, setCurrentPageRanges] = useState(1);

    const paginate = (data, currentPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const totalPagesTests = Math.ceil(filteredTests.length / itemsPerPage);
    const totalPagesCategories = Math.ceil(filteredCategories.length / itemsPerPage);
    const totalPagesParameters = Math.ceil(filteredParameters.length / itemsPerPage);
    const totalPagesRanges = Math.ceil(filteredRanges.length / itemsPerPage);

    const paginatedTests = paginate(filteredTests, currentPageTests);
    const paginatedCategories = paginate(filteredCategories, currentPageCategories);
    const paginatedParameters = paginate(filteredParameters, currentPageParameters);
    const paginatedRanges = paginate(filteredRanges, currentPageRanges);


    // --- JSX (React's UI Description) ---
    return (
        <div className="container-fluid">
            {/* Header */}
            <header className="header">
                <div className="logo">
                    <img src={logo} alt="LIMS Logo" />
                    LIMS
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Search..." />
                    <i className="fas fa-search search-icon"></i>
                </div>
                <div className="user-info">
                    <span>Admin User (Administrator)</span>
                    <img src={userAvatar} alt="User Avatar" />
                </div>
            </header>

            {/* Sidebar */}
            <aside className="sidebar">
                <h3>Main Menu</h3>
                <ul>
                    <li><a href="#dashboard"><i className="fas fa-tachometer-alt"></i> Dashboard</a></li>
                    <li><a href="#admin-panel"><i className="fas fa-user-shield"></i> Admin Panel</a></li>
                    <li className="active">
                        <a href="#test-config"><i className="fas fa-flask"></i> Test Configuration</a>
                        <ul className="submenu">
                            <li className={activeTab === 'testDefinitions' ? 'active' : ''}><a href="#!" onClick={() => setActiveTab('testDefinitions')}>Test Definitions</a></li>
                            <li className={activeTab === 'testCategories' ? 'active' : ''}><a href="#!" onClick={() => setActiveTab('testCategories')}>Test Categories</a></li>
                            <li className={activeTab === 'testParameters' ? 'active' : ''}><a href="#!" onClick={() => setActiveTab('testParameters')}>Test Parameters</a></li>
                            <li className={activeTab === 'referenceRanges' ? 'active' : ''}><a href="#!" onClick={() => setActiveTab('referenceRanges')}>Reference Ranges</a></li>
                        </ul>
                    </li>
                    <li><a href="#user-management"><i className="fas fa-users"></i> User Management</a></li>
                    <li><a href="#role-management"><i className="fas fa-user-tag"></i> Role Management</a></li>
                    <li>
                        <a href="#reports"><i className="fas fa-chart-line"></i> Reports</a>
                        <ul className="submenu">
                            <li><a href="#audit-report">Audit Report</a></li>
                            <li><a href="#sample-report">Sample Report</a></li>
                        </ul>
                    </li>
                </ul>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <div className="test-config-header">
                    <h1>Test Configuration</h1>
                    <div className="test-config-actions">
                        {activeTab === 'testDefinitions' && (
                            <>
                                <button className="btn-import" onClick={() => openModal('importTests')}>
                                    <i className="fas fa-upload"></i> Import Tests
                                </button>
                                <button className="btn-add" onClick={() => openModal('addTest')}>
                                    <i className="fas fa-plus"></i> Add New Test
                                </button>
                            </>
                        )}
                        {activeTab === 'testCategories' && (
                            <button className="btn-add" onClick={() => openModal('addCategory')}>
                                <i className="fas fa-plus"></i> Add New Category
                            </button>
                        )}
                        {activeTab === 'testParameters' && (
                            <button className="btn-add" onClick={() => openModal('addParameter')}>
                                <i className="fas fa-plus"></i> Add New Parameter
                            </button>
                        )}
                        {activeTab === 'referenceRanges' && (
                            <button className="btn-add" onClick={() => openModal('addRange')}>
                                <i className="fas fa-plus"></i> Add New Range
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs">
                    <button className={`tab-button ${activeTab === 'testDefinitions' ? 'active' : ''}`} onClick={() => setActiveTab('testDefinitions')}>Test Definitions</button>
                    <button className={`tab-button ${activeTab === 'testCategories' ? 'active' : ''}`} onClick={() => setActiveTab('testCategories')}>Test Categories</button>
                    <button className={`tab-button ${activeTab === 'testParameters' ? 'active' : ''}`} onClick={() => setActiveTab('testParameters')}>Test Parameters</button>
                    <button className={`tab-button ${activeTab === 'referenceRanges' ? 'active' : ''}`} onClick={() => setActiveTab('referenceRanges')}>Reference Ranges</button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {/* Test Definitions Tab Content */}
                    {activeTab === 'testDefinitions' && (
                        <div>
                            <div className="filters">
                                <div className="filter-group">
                                    <label htmlFor="testNameFilter">Test Name</label>
                                    <input type="text" id="testNameFilter" name="name" value={testFilters.name} onChange={handleTestFilterChange} placeholder="Search by name" />
                                </div>
                                <div className="filter-group">
                                    <label htmlFor="testCategoryFilter">Category</label>
                                    <select id="testCategoryFilter" name="category" value={testFilters.category} onChange={handleTestFilterChange}>
                                        <option value="">All</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div className="filter-group">
                                    <label htmlFor="testTypeFilter">Test Type</label>
                                    <select id="testTypeFilter" name="type" value={testFilters.type} onChange={handleTestFilterChange}>
                                        <option value="">All</option>
                                        <option value="Biochemical">Biochemical</option>
                                        <option value="Microbiological">Microbiological</option>
                                        <option value="Physical/Chemical">Physical/Chemical</option>
                                    </select>
                                </div>
                                <div className="filter-group">
                                    <label htmlFor="testStatusFilter">Status</label>
                                    <select id="testStatusFilter" name="status" value={testFilters.status} onChange={handleTestFilterChange}>
                                        <option value="">All</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Department</th>
                                        <th>Type</th>
                                        <th>Price ($)</th>
                                        <th>TAT</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedTests.length > 0 ? (
                                        paginatedTests.map((test, index) => (
                                            <tr key={index}>
                                                <td>{test.code}</td>
                                                <td>{test.name}</td>
                                                <td>{test.category}</td>
                                                <td>{test.department}</td>
                                                <td>{test.type}</td>
                                                <td>{test.price}</td>
                                                <td>{test.tat}</td>
                                                <td>{test.status}</td>
                                                <td className="actions">
                                                    <button><i className="fas fa-edit"></i></button>
                                                    <button><i className="fas fa-trash-alt"></i></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="9">No tests found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="pagination">
                                <button onClick={() => setCurrentPageTests(prev => Math.max(1, prev - 1))} disabled={currentPageTests === 1}>Previous</button>
                                <span>Page {currentPageTests} of {totalPagesTests}</span>
                                <button onClick={() => setCurrentPageTests(prev => Math.min(totalPagesTests, prev + 1))} disabled={currentPageTests === totalPagesTests}>Next</button>
                            </div>
                        </div>
                    )}

                    {/* Test Categories Tab Content */}
                    {activeTab === 'testCategories' && (
                        <div>
                            <div className="filters">
                                <div className="filter-group">
                                    <label htmlFor="categoryNameFilter">Category Name</label>
                                    <input type="text" id="categoryNameFilter" name="name" value={categoryFilters.name} onChange={handleCategoryFilterChange} placeholder="Search by name" />
                                </div>
                            </div>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Department</th>
                                        <th>Description</th>
                                        <th>Tests Count</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCategories.length > 0 ? (
                                        paginatedCategories.map((category, index) => (
                                            <tr key={index}>
                                                <td>{category.id}</td>
                                                <td>{category.name}</td>
                                                <td>{category.department}</td>
                                                <td>{category.description}</td>
                                                <td>{category.testsCount}</td>
                                                <td>{category.status}</td>
                                                <td className="actions">
                                                    <button><i className="fas fa-edit"></i></button>
                                                    <button><i className="fas fa-trash-alt"></i></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="7">No categories found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="pagination">
                                <button onClick={() => setCurrentPageCategories(prev => Math.max(1, prev - 1))} disabled={currentPageCategories === 1}>Previous</button>
                                <span>Page {currentPageCategories} of {totalPagesCategories}</span>
                                <button onClick={() => setCurrentPageCategories(prev => Math.min(totalPagesCategories, prev + 1))} disabled={currentPageCategories === totalPagesCategories}>Next</button>
                            </div>
                        </div>
                    )}

                    {/* Test Parameters Tab Content */}
                    {activeTab === 'testParameters' && (
                        <div>
                            <div className="filters">
                                <div className="filter-group">
                                    <label htmlFor="parameterNameFilter">Parameter Name</label>
                                    <input type="text" id="parameterNameFilter" name="name" value={parameterFilters.name} onChange={handleParameterFilterChange} placeholder="Search by name" />
                                </div>
                                <div className="filter-group">
                                    <label htmlFor="parameterTestFilter">Test</label>
                                    <select id="parameterTestFilter" name="test" value={parameterFilters.test} onChange={handleParameterFilterChange}>
                                        <option value="">All</option>
                                        {tests.map(test => <option key={test.code} value={test.name}>{test.name}</option>)}
                                    </select>
                                </div>
                                <div className="filter-group">
                                    <label htmlFor="parameterTypeFilter">Parameter Type</label>
                                    <select id="parameterTypeFilter" name="type" value={parameterFilters.type} onChange={handleParameterFilterChange}>
                                        <option value="">All</option>
                                        <option value="Numerical">Numerical</option>
                                        <option value="Text">Text</option>
                                        <option value="Microbiological">Microbiological</option>
                                        <option value="Biochemical">Biochemical</option>
                                    </select>
                                </div>
                            </div>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Test</th>
                                        <th>Type</th>
                                        <th>Unit</th>
                                        <th>Normal Range</th>
                                        <th>Method</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedParameters.length > 0 ? (
                                        paginatedParameters.map((param, index) => (
                                            <tr key={index}>
                                                <td>{param.id}</td>
                                                <td>{param.name}</td>
                                                <td>{param.test}</td>
                                                <td>{param.type}</td>
                                                <td>{param.unit}</td>
                                                <td>{param.normalRange}</td>
                                                <td>{param.method}</td>
                                                <td>{param.status}</td>
                                                <td className="actions">
                                                    <button><i className="fas fa-edit"></i></button>
                                                    <button><i className="fas fa-trash-alt"></i></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="9">No parameters found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="pagination">
                                <button onClick={() => setCurrentPageParameters(prev => Math.max(1, prev - 1))} disabled={currentPageParameters === 1}>Previous</button>
                                <span>Page {currentPageParameters} of {totalPagesParameters}</span>
                                <button onClick={() => setCurrentPageParameters(prev => Math.min(totalPagesParameters, prev + 1))} disabled={currentPageParameters === totalPagesParameters}>Next</button>
                            </div>
                        </div>
                    )}

                    {/* Reference Ranges Tab Content */}
                    {activeTab === 'referenceRanges' && (
                        <div>
                            <div className="filters">
                                <div className="filter-group">
                                    <label htmlFor="rangeDescriptionFilter">Description</label>
                                    <input type="text" id="rangeDescriptionFilter" name="description" value={rangeFilters.description} onChange={handleRangeFilterChange} placeholder="Search by description" />
                                </div>
                                <div className="filter-group">
                                    <label htmlFor="rangeParameterFilter">Parameter</label>
                                    <select id="rangeParameterFilter" name="parameter" value={rangeFilters.parameter} onChange={handleRangeFilterChange}>
                                        <option value="">All</option>
                                        {parameters.map(param => <option key={param.id} value={param.name}>{param.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Parameter</th>
                                        <th>Test</th>
                                        <th>Lower Limit</th>
                                        <th>Upper Limit</th>
                                        <th>Unit</th>
                                        <th>Applicable To</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedRanges.length > 0 ? (
                                        paginatedRanges.map((range, index) => (
                                            <tr key={index}>
                                                <td>{range.id}</td>
                                                <td>{range.parameter}</td>
                                                <td>{range.test}</td>
                                                <td>{range.lowerLimit}</td>
                                                <td>{range.upperLimit}</td>
                                                <td>{range.unit}</td>
                                                <td>{range.applicableTo}</td>
                                                <td className="actions">
                                                    <button><i className="fas fa-edit"></i></button>
                                                    <button><i className="fas fa-trash-alt"></i></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="8">No reference ranges found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="pagination">
                                <button onClick={() => setCurrentPageRanges(prev => Math.max(1, prev - 1))} disabled={currentPageRanges === 1}>Previous</button>
                                <span>Page {currentPageRanges} of {totalPagesRanges}</span>
                                <button onClick={() => setCurrentPageRanges(prev => Math.min(totalPagesRanges, prev + 1))} disabled={currentPageRanges === totalPagesRanges}>Next</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Modals */}
            {/* Add New Test Modal */}
            <div id="addTestModal" className={`modal ${showAddTestModal ? 'show' : ''}`}>
                <div className="modal-content">
                    <span className="close-button" onClick={() => closeModal('addTest')}>&times;</span>
                    <h2>Add New Test</h2>
                    <form className="modal-form" onSubmit={handleAddTestSubmit}>
                        <div className="form-group">
                            <label htmlFor="testCode">Test Code</label>
                            <input type="text" id="testCode" name="testCode" value={newTest.testCode} onChange={handleTestChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="testName">Test Name</label>
                            <input type="text" id="testName" name="testName" value={newTest.testName} onChange={handleTestChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="testCategory">Category</label>
                            <select id="testCategory" name="category" value={newTest.category} onChange={handleTestChange} required>
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="testDepartment">Department</label>
                            <input type="text" id="testDepartment" name="department" value={newTest.department} onChange={handleTestChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="testType">Test Type</label>
                            <select id="testType" name="testType" value={newTest.testType} onChange={handleTestChange} required>
                                <option value="">Select Type</option>
                                <option value="microbiological">Microbiological</option>
                                <option value="biochemical">Biochemical</option>
                                <option value="physical_chemical">Physical/Chemical</option>
                                <option value="general">General</option>
                            </select>
                        </div>

                        {newTest.testType === 'microbiological' && (
                            <div id="microbiologicalFields">
                                <div className="form-group">
                                    <label htmlFor="microbiologicalMethod">Method of Microbiological Test</label>
                                    <input type="text" id="microbiologicalMethod" name="microbiologicalMethod" value={newTest.microbiologicalMethod} onChange={handleTestChange} />
                                </div>
                            </div>
                        )}
                        {newTest.testType === 'biochemical' && (
                            <div id="biochemicalFields">
                                <div className="form-group">
                                    <label htmlFor="biochemicalMethod">Method of Biochemical Test</label>
                                    <input type="text" id="biochemicalMethod" name="biochemicalMethod" value={newTest.biochemicalMethod} onChange={handleTestChange} />
                                </div>
                            </div>
                        )}
                        {newTest.testType === 'physical_chemical' && (
                            <div id="physicalChemicalFields">
                                <div className="form-group">
                                    <label htmlFor="ph">pH</label>
                                    <input type="text" id="ph" name="ph" value={newTest.ph} onChange={handleTestChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="temp">Temperature</label>
                                    <input type="text" id="temp" name="temp" value={newTest.temp} onChange={handleTestChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="physicalChemicalMethod">Method of Physical/Chemical Test</label>
                                    <input type="text" id="physicalChemicalMethod" name="physicalChemicalMethod" value={newTest.physicalChemicalMethod} onChange={handleTestChange} />
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="sampleType">Sample Type</label>
                            <input type="text" id="sampleType" name="sampleType" value={newTest.sampleType} onChange={handleTestChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Price ($)</label>
                            <input type="number" id="price" name="price" value={newTest.price} onChange={handleTestChange} min="0" step="0.01" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="turnaroundTime">Turnaround Time (TAT)</label>
                            <input type="text" id="turnaroundTime" name="turnaroundTime" value={newTest.turnaroundTime} onChange={handleTestChange} placeholder="e.g., 24 Hrs, 3 Days" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea id="description" name="description" value={newTest.description} onChange={handleTestChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="testProtocol">Test Protocol</label>
                            <textarea id="testProtocol" name="testProtocol" value={newTest.testProtocol} onChange={handleTestChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="samplePreparation">Sample Preparation</label>
                            <textarea id="samplePreparation" name="samplePreparation" value={newTest.samplePreparation} onChange={handleTestChange}></textarea>
                        </div>
                        <div className="form-group checkbox-group">
                            <input type="checkbox" id="testIsActive" name="isActive" checked={newTest.isActive} onChange={handleTestChange} />
                            <label htmlFor="testIsActive">Active</label>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={() => closeModal('addTest')}>Cancel</button>
                            <button type="submit" className="btn-save">Save Test</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Import Tests Modal */}
            <div id="importTestsModal" className={`modal import-tests-modal ${showImportTestsModal ? 'show' : ''}`}>
                <div className="modal-content">
                    <span className="close-button" onClick={() => closeModal('importTests')}>&times;</span>
                    <h2>Import Tests</h2>
                    <form className="modal-form" onSubmit={handleImportTestsSubmit}>
                        <div className="form-group">
                            <label htmlFor="importFile">Upload CSV/Excel File</label>
                            <input type="file" id="importFile" name="importFile" accept=".csv, .xls, .xlsx" onChange={handleFileChange} required />
                        </div>
                        <div className="template-links">
                            <h3>Download Templates:</h3>
                            <a href="/templates/microbiological_test_template.csv" download>Microbiological Test Template (CSV)</a>
                            <a href="/templates/biochemical_test_template.csv" download>Biochemical Test Template (CSV)</a>
                            <a href="/templates/general_test_template.csv" download>General Test Template (CSV)</a>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={() => closeModal('importTests')}>Cancel</button>
                            <button type="submit" className="btn-save">Import</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Add New Category Modal */}
            <div id="addCategoryModal" className={`modal ${showAddCategoryModal ? 'show' : ''}`}>
                <div className="modal-content">
                    <span className="close-button" onClick={() => closeModal('addCategory')}>&times;</span>
                    <h2>Add New Category</h2>
                    <form className="modal-form" onSubmit={handleAddCategorySubmit}>
                        <div className="form-group">
                            <label htmlFor="categoryId">Category ID</label>
                            <input type="text" id="categoryId" name="categoryId" value={newCategory.categoryId} onChange={handleCategoryChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="categoryName">Category Name</label>
                            <input type="text" id="categoryName" name="categoryName" value={newCategory.categoryName} onChange={handleCategoryChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="categoryDepartment">Department</label>
                            <input type="text" id="categoryDepartment" name="department" value={newCategory.department} onChange={handleCategoryChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="categoryDescription">Description</label>
                            <textarea id="categoryDescription" name="description" value={newCategory.description} onChange={handleCategoryChange}></textarea>
                        </div>
                        <div className="form-group checkbox-group">
                            <input type="checkbox" id="categoryIsActive" name="isActive" checked={newCategory.isActive} onChange={handleCategoryChange} />
                            <label htmlFor="categoryIsActive">Active</label>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={() => closeModal('addCategory')}>Cancel</button>
                            <button type="submit" className="btn-save">Save Category</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Add New Parameter Modal */}
            <div id="addParameterModal" className={`modal ${showAddParameterModal ? 'show' : ''}`}>
                <div className="modal-content">
                    <span className="close-button" onClick={() => closeModal('addParameter')}>&times;</span>
                    <h2>Add New Parameter</h2>
                    <form className="modal-form" onSubmit={handleAddParameterSubmit}>
                        <div className="form-group">
                            <label htmlFor="parameterId">Parameter ID</label>
                            <input type="text" id="parameterId" name="parameterId" value={newParameter.parameterId} onChange={handleParameterChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="parameterName">Parameter Name</label>
                            <input type="text" id="parameterName" name="parameterName" value={newParameter.parameterName} onChange={handleParameterChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="parameterTest">Test</label>
                            <select id="parameterTest" name="test" value={newParameter.test} onChange={handleParameterChange} required>
                                <option value="">Select Test</option>
                                {tests.map(test => <option key={test.code} value={test.name}>{test.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="parameterType">Parameter Type</label>
                            <select id="parameterType" name="parameterType" value={newParameter.parameterType} onChange={handleParameterChange} required>
                                <option value="">Select Type</option>
                                <option value="numerical">Numerical</option>
                                <option value="text">Text</option>
                                <option value="microbiological">Microbiological</option>
                                <option value="biochemical">Biochemical</option>
                            </select>
                        </div>

                        {newParameter.parameterType === 'microbiological' && (
                            <div id="microbiologicalParamFields">
                                <div className="form-group">
                                    <label htmlFor="microbiologicalTarget">Microbiological Target/Analyte</label>
                                    <input type="text" id="microbiologicalTarget" name="microbiologicalTarget" value={newParameter.microbiologicalTarget} onChange={handleParameterChange} />
                                </div>
                            </div>
                        )}
                        {newParameter.parameterType === 'biochemical' && (
                            <div id="biochemicalParamFields">
                                <div className="form-group">
                                    <label htmlFor="biochemicalReagent">Biochemical Reagent/Method</label>
                                    <input type="text" id="biochemicalReagent" name="biochemicalReagent" value={newParameter.biochemicalReagent} onChange={handleParameterChange} />
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="parameterUnit">Unit</label>
                            <input type="text" id="parameterUnit" name="unit" value={newParameter.unit} onChange={handleParameterChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="parameterMethod">Method</label>
                            <input type="text" id="parameterMethod" name="method" value={newParameter.method} onChange={handleParameterChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="parameterLowerLimit">Lower Limit</label>
                            <input type="number" id="parameterLowerLimit" name="lowerLimit" value={newParameter.lowerLimit} onChange={handleParameterChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="parameterUpperLimit">Upper Limit</label>
                            <input type="number" id="parameterUpperLimit" name="upperLimit" value={newParameter.upperLimit} onChange={handleParameterChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="parameterDescription">Description</label>
                            <textarea id="parameterDescription" name="description" value={newParameter.description} onChange={handleParameterChange}></textarea>
                        </div>
                        <div className="form-group checkbox-group">
                            <input type="checkbox" id="parameterIsActive" name="isActive" checked={newParameter.isActive} onChange={handleParameterChange} />
                            <label htmlFor="parameterIsActive">Active</label>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={() => closeModal('addParameter')}>Cancel</button>
                            <button type="submit" className="btn-save">Save Parameter</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Add New Reference Range Modal */}
            <div id="addRangeModal" className={`modal ${showAddRangeModal ? 'show' : ''}`}>
                <div className="modal-content">
                    <span className="close-button" onClick={() => closeModal('addRange')}>&times;</span>
                    <h2>Add New Reference Range</h2>
                    <form className="modal-form" onSubmit={handleAddRangeSubmit}>
                        <div className="form-group">
                            <label htmlFor="rangeId">Range ID</label>
                            <input type="text" id="rangeId" name="rangeId" value={newRange.rangeId} onChange={handleRangeChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="rangeParameter">Parameter</label>
                            <select id="rangeParameter" name="parameter" value={newRange.parameter} onChange={handleRangeChange} required>
                                <option value="">Select Parameter</option>
                                {parameters.map(param => <option key={param.id} value={param.name}>{param.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="rangeTest">Test</label>
                            <select id="rangeTest" name="test" value={newRange.test} onChange={handleRangeChange} required>
                                <option value="">Select Test</option>
                                {tests.map(test => <option key={test.code} value={test.name}>{test.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="rangeLowerLimit">Lower Limit</label>
                            <input type="number" id="rangeLowerLimit" name="lowerLimit" value={newRange.lowerLimit} onChange={handleRangeChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="rangeUpperLimit">Upper Limit</label>
                            <input type="number" id="rangeUpperLimit" name="upperLimit" value={newRange.upperLimit} onChange={handleRangeChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="rangeUnit">Unit</label>
                            <input type="text" id="rangeUnit" name="unit" value={newRange.unit} onChange={handleRangeChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="rangeApplicableTo">Applicable To</label>
                            <input type="text" id="rangeApplicableTo" name="applicableTo" value={newRange.applicableTo} onChange={handleRangeChange} placeholder="e.g., Adults, Children, Male, Female" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="rangeDescription">Description</label>
                            <textarea id="rangeDescription" name="description" value={newRange.description} onChange={handleRangeChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="regulatoryReference">Regulatory Reference (if any)</label>
                            <input type="text" id="regulatoryReference" name="regulatoryReference" value={newRange.regulatoryReference} onChange={handleRangeChange} />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={() => closeModal('addRange')}>Cancel</button>
                            <button type="submit" className="btn-save">Save Range</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TestConfiguration;