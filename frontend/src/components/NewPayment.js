import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import './NewPayment.css';

function NewPayment() {
  const [companies, setCompanies] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    documentType: 'Invoice',
    panelCompany: '',
    period: new Date().toISOString().slice(0, 7), // YYYY-MM format
    paymentDueDate: '',
    fromDate: '',
    toDate: '',
    additionalNotes: ''
  });

  useEffect(() => {
    fetchCompanies();
    fetchRecentInvoices();
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

  const fetchRecentInvoices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/invoices`);
      setRecentInvoices(response.data);
    } catch (err) {
      console.error('Failed to fetch recent invoices:', err);
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
      await axios.post(`${API_BASE_URL}/invoices`, formData);
      // Reset form
      setFormData({
        documentType: 'Invoice',
        panelCompany: '',
        period: new Date().toISOString().slice(0, 7),
        paymentDueDate: '',
        fromDate: '',
        toDate: '',
        additionalNotes: ''
      });
      // Refresh recent invoices
      fetchRecentInvoices();
    } catch (err) {
      setError('Failed to generate invoice');
    }
  };

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log('Preview invoice:', formData);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="new-payment-container">
      <div className="period-selector">
        <span className="calendar-icon">📅</span>
        <span>Period: {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
      </div>

      <div className="content-section">
        <h2>New Payment</h2>
        <div className="invoice-form">
          <h3>Generate Invoice/Letter for Panel Companies</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Document Type</label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleInputChange}
                >
                  <option value="Invoice">Invoice</option>
                  <option value="Reminder">Reminder</option>
                  <option value="Notice">Notice</option>
                </select>
              </div>

              <div className="form-group">
                <label>Panel Company</label>
                <select
                  name="panelCompany"
                  value={formData.panelCompany}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Panel Company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Period</label>
                <input
                  type="month"
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Payment Due Date</label>
                <input
                  type="date"
                  name="paymentDueDate"
                  value={formData.paymentDueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Include Tests From</label>
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>To</label>
                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                placeholder="Enter any additional information to include in the invoice/letter..."
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={handlePreview}>Preview</button>
              <button type="submit" className="generate-btn">Generate & Send</button>
            </div>
          </form>
        </div>

        <div className="recent-invoices">
          <h3>Recent Invoices/Letters</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Document ID</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Generated Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td>{invoice.documentId}</td>
                    <td>{invoice.company}</td>
                    <td>{invoice.type}</td>
                    <td>Rs {invoice.amount.toLocaleString()}</td>
                    <td>{new Date(invoice.generatedDate).toLocaleDateString()}</td>
                    <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status ${invoice.status.toLowerCase()}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="actions">
                      <button className="view-btn" title="View">👁</button>
                      <button className="print-btn" title="Print">🖨</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPayment;