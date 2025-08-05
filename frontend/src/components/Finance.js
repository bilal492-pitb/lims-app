import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import './Finance.css';

function Finance() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

  const handlePaymentClick = (registration) => {
    setSelectedRegistration(registration);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const paymentData = {
        registrationId: selectedRegistration.id,
        paymentStatus: e.target.paymentStatus.value,
        amountReceived: parseFloat(e.target.amountReceived.value),
        paymentDate: e.target.paymentDate.value,
        transactionId: e.target.transactionId.value,
        remarks: e.target.remarks.value
      };

      await axios.post(`${API_BASE_URL}/sample-registrations/${selectedRegistration.id}/payment`, paymentData);
      setShowPaymentModal(false);
      fetchRegistrations(); // Refresh the list
    } catch (err) {
      alert('Error updating payment status');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="finance-container">
      <h2>Finance Management</h2>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Registration No</th>
              <th>Applicant Name</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => (
              <tr key={reg.id}>
                <td>{reg.registration_number}</td>
                <td>{reg.sender_details?.name || reg.company_details?.companyName || '-'}</td>
                <td>Rs. {reg.grand_total?.toFixed(2) || '0.00'}</td>
                <td>
                  <span className={`payment-status ${reg.payment_status?.toLowerCase() || 'not-paid'}`}>
                    {reg.payment_status || 'Not Paid'}
                  </span>
                </td>
                <td>
                  <button 
                    className="edit-button"
                    onClick={() => handlePaymentClick(reg)}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPaymentModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Update Payment Status</h3>
            <form onSubmit={handlePaymentSubmit}>
              <div className="form-group">
                <label>Registration Number</label>
                <input type="text" value={selectedRegistration.registration_number} disabled />
              </div>
              
              <div className="form-group">
                <label>Payment Status</label>
                <select name="paymentStatus" required>
                  <option value="Paid">Paid</option>
                  <option value="Not Paid">Not Paid</option>
                  <option value="Partial">Partial</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount Received</label>
                <input 
                  type="number" 
                  name="amountReceived" 
                  step="0.01" 
                  defaultValue={selectedRegistration.amount_received || 0}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Payment Date</label>
                <input 
                  type="date" 
                  name="paymentDate" 
                  defaultValue={new Date().toISOString().split('T')[0]}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Transaction ID</label>
                <input 
                  type="text" 
                  name="transactionId" 
                  placeholder="Enter transaction ID"
                />
              </div>

              <div className="form-group">
                <label>Remarks</label>
                <textarea 
                  name="remarks" 
                  placeholder="Enter any remarks"
                  rows="3"
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Finance;