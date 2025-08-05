import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import './PanelCompanies.css';

function PanelCompanies() {
  const [companies, setCompanies] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    status: 'Active',
    address: '',
    contactNumber: '',
    email: '',
    focalPersonName: '',
    designation: '',
    focalContactNumber: '',
    focalEmail: '',
    contractStartDate: '',
    contractEndDate: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/panel-companies`);
      setCompanies(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch companies');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/panel-companies`, formData);
      setShowAddModal(false);
      setFormData({
        companyName: '',
        status: 'Active',
        address: '',
        contactNumber: '',
        email: '',
        focalPersonName: '',
        designation: '',
        focalContactNumber: '',
        focalEmail: '',
        contractStartDate: '',
        contractEndDate: ''
      });
      fetchCompanies();
    } catch (err) {
      setError('Failed to add company');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="panel-companies-container">
      <div className="stats-cards">
        <div className="stat-card total">
          <h2>{companies.length}</h2>
          <p>Total Companies</p>
          <span>Active and inactive</span>
        </div>
        <div className="stat-card active">
          <h2>{companies.filter(c => c.status === 'Active').length}</h2>
          <p>Active Companies</p>
          <span>Currently in business</span>
        </div>
        <div className="stat-card inactive">
          <h2>{companies.filter(c => c.status === 'Inactive').length}</h2>
          <p>Inactive Companies</p>
          <span>Temporarily suspended</span>
        </div>
        <div className="stat-card outstanding">
          <h2>Rs {companies.reduce((sum, c) => sum + (c.outstanding || 0), 0).toLocaleString()}</h2>
          <p>Outstanding Amount</p>
          <span>Across all companies</span>
        </div>
      </div>

      <div className="actions">
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          + Add New Company
        </button>
        <button className="export-btn">⬇ Export List</button>
        <button className="print-btn">🖨 Print</button>
      </div>

      <div className="companies-list">
        <h2>Panel Companies List</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Company ID</th>
                <th>Company Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Focal Person</th>
                <th>Status</th>
                <th>Outstanding</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(company => (
                <tr key={company.id}>
                  <td>{company.companyId}</td>
                  <td>{company.companyName}</td>
                  <td>{company.contactNumber}</td>
                  <td>{company.email}</td>
                  <td>{company.focalPersonName}</td>
                  <td>
                    <span className={`status ${company.status.toLowerCase()}`}>
                      {company.status}
                    </span>
                  </td>
                  <td>Rs {company.outstanding?.toLocaleString() || 0}</td>
                  <td className="actions">
                    <button className="view-btn" title="View">👁</button>
                    <button className="edit-btn" title="Edit">✏</button>
                    <button className="delete-btn" title="Delete">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Panel Company</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Company Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Company Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Contact Number *</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Focal Person Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Focal Person Name *</label>
                    <input
                      type="text"
                      name="focalPersonName"
                      value={formData.focalPersonName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Contact Number *</label>
                    <input
                      type="tel"
                      name="focalContactNumber"
                      value={formData.focalContactNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="focalEmail"
                      value={formData.focalEmail}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Additional Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Contract Start Date</label>
                    <input
                      type="date"
                      name="contractStartDate"
                      value={formData.contractStartDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contract End Date</label>
                    <input
                      type="date"
                      name="contractEndDate"
                      value={formData.contractEndDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Company</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PanelCompanies;