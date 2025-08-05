import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SampleRegistrationForm from './components/SampleRegistrationForm';
import LineListing from './components/LineListing';
import Finance from './components/Finance';
import TestConfiguration from './components/TestConfiguration';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="sidebar">
          <div className="sidebar-header">
            <h2>LIMS</h2>
          </div>
          <ul className="sidebar-menu">
            <li>
              <Link to="/line-listing">
                <i className="fas fa-list"></i>
                Line Listing
              </Link>
            </li>
            <li>
              <Link to="/sample-registration">
                <i className="fas fa-file-alt"></i>
                Sample Registration
              </Link>
            </li>
            <li>
              <Link to="/finance">
                <i className="fas fa-money-bill-wave"></i>
                Finance
              </Link>
            </li>
            <li>
              <Link to="/test-configuration">
                <i className="fas fa-cogs"></i>
                Test Configuration
              </Link>
            </li>
            <li>
              <Link to="#" className="disabled">
                <i className="fas fa-user-tie"></i>
                ERU Incharge
              </Link>
            </li>
            <li>
              <Link to="#" className="disabled">
                <i className="fas fa-vial"></i>
                Accessioning
              </Link>
            </li>
            <li>
              <Link to="#" className="disabled">
                <i className="fas fa-flask"></i>
                Lab Analyst
              </Link>
            </li>
            <li>
              <Link to="#" className="disabled">
                <i className="fas fa-check-double"></i>
                Reviewer
              </Link>
            </li>
            <li>
              <Link to="#" className="disabled">
                <i className="fas fa-user-shield"></i>
                Technical Manager
              </Link>
            </li>
            <li>
              <Link to="#" className="disabled">
                <i className="fas fa-user-cog"></i>
                Admin
              </Link>
            </li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<LineListing />} />
            <Route path="/line-listing" element={<LineListing />} />
            <Route path="/sample-registration" element={<SampleRegistrationForm />} />
            <Route path="/sample-registration/:id" element={<SampleRegistrationForm />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/test-configuration" element={<TestConfiguration />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;