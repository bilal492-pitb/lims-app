import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import './LineListing.css';

function LineListing() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sample-registrations`);
      setRegistrations(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch registrations');
      setLoading(false);
    }
  };

  const handlePrintSlip = (registrationId) => {
    // TODO: Implement print functionality
    console.log('Print slip for registration:', registrationId);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="line-listing-container">
      <div className="header">
        <h2>Sample Registrations</h2>
        <Link to="/sample-registration" className="add-new-button">
          + New Registration
        </Link>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Registration Number</th>
              <th>Registration Type</th>
              <th>Sender Name</th>
              <th>Department</th>
              <th>Total Samples</th>
              <th>Grand Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => (
              <tr key={reg.id}>
                <td>{reg.registration_number}</td>
                <td>{reg.registration_type}</td>
                <td>{reg.sender_details?.name || reg.company_details?.companyName || '-'}</td>
                <td>{reg.sender_details?.department || '-'}</td>
                <td>{reg.samples?.length || 0}</td>
                <td>Rs. {reg.grand_total?.toFixed(2) || '0.00'}</td>
                <td>
                  <span className={`status ${reg.status?.toLowerCase() || 'pending'}`}>
                    {reg.status || 'Pending'}
                  </span>
                </td>
                <td>{new Date(reg.created_at).toLocaleDateString()}</td>
                <td className="actions">
                  <Link to={`/sample-registration/${reg.id}`} className="action-button edit">
                    <i className="fas fa-edit"></i> Edit
                  </Link>
                  <button 
                    onClick={() => handlePrintSlip(reg.id)} 
                    className="action-button print"
                  >
                    <i className="fas fa-print"></i> Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LineListing;