import React, { useState } from 'react';
import axios from 'axios';
import './SampleRegistrationForm.css';

const SampleRegistrationForm = () => {
  const [formData, setFormData] = useState({
    registrationNumber: 'PAFDA-25-000001',
    registrationType: 'Self / Individual',
    panelCompany: '',
    senderDetails: {
      name: '',
      designation: '',
      department: '',
      province: '',
      division: '',
      district: '',
      streetNo: '',
      area: '',
      address: '',
      contactNumber: '',
      cnic: '',
      email: ''
    },
    companyDetails: {
      companyName: '',
      companyContact: '',
      companyEmail: '',
      companyAddress: ''
    },
    focalPersonDetails: {
      name: '',
      contactNumber: '',
      designation: '',
      email: ''
    },
    deliveredVia: {
      method: 'Self',
      name: '',
      cnic: '',
      contactNumber: '',
      streetNo: '',
      area: '',
      address: '',
      companyName: '',
      companyContact: '',
      companyAddress: '',
      parcelTrackingNumber: '',
      dispatchDate: '',
      remarks: ''
    },
    packagingDetails: {
      packagingType: '',
      sealCondition: '',
      packageType: '',
      labelDetails: '',
      packagingNotes: ''
    },
    samples: [],
    grandTotal: 0,
  });

  const panelCompanies = [
    "Nestle Pakistan Limited",
    "Unilever Pakistan Limited",
    "Engro Foods Limited",
    "Shan Foods Private Limited",
    "National Foods Limited",
    "Coca-Cola Beverages Pakistan Limited",
    "PepsiCo International Pakistan",
    "Shezan International Limited",
    "Almarai Pakistan",
    "Dairy Pak",
    "Al-Safi Danone",
    "Friesland Campina Pakistan",
    "Dutch Lady Pakistan",
    "Lacto Food",
    "Milk Pak"
  ];

  const handleInputChange = (e, section, field) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/registrations', formData);
      alert('Registration submitted successfully!');
      setFormData({
        registrationNumber: 'PAFDA-25-000001',
        registrationType: 'Self / Individual',
        panelCompany: '',
        senderDetails: {
          name: '',
          designation: '',
          department: '',
          province: '',
          division: '',
          district: '',
          streetNo: '',
          area: '',
          address: '',
          contactNumber: '',
          cnic: '',
          email: ''
        },
        companyDetails: {
          companyName: '',
          companyContact: '',
          companyEmail: '',
          companyAddress: ''
        },
        focalPersonDetails: {
          name: '',
          contactNumber: '',
          designation: '',
          email: ''
        },
        deliveredVia: {
          method: 'Self',
          name: '',
          cnic: '',
          contactNumber: '',
          streetNo: '',
          area: '',
          address: '',
          companyName: '',
          companyContact: '',
          companyAddress: '',
          parcelTrackingNumber: '',
          dispatchDate: '',
          remarks: ''
        },
        packagingDetails: {
          packagingType: '',
          sealCondition: '',
          packageType: '',
          labelDetails: '',
          packagingNotes: ''
        },
        samples: [],
        grandTotal: 0,
      });
    } catch (error) {
      console.error(error);
      alert('Error submitting registration.');
    }
  };

  return (
    <div className="form-container">
      <h2>Sample Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <label>Registration Number: {formData.registrationNumber}</label>
        </div>

        <div className="form-section">
          <h3>Registration Type</h3>
          <select
            value={formData.registrationType}
            onChange={(e) => handleInputChange(e, 'registrationType', 'value')}
          >
            <option value="Self / Individual">Self / Individual</option>
            <option value="Panel Company">Panel Company</option>
          </select>
          {formData.registrationType === 'Panel Company' && (
            <select
              value={formData.panelCompany}
              onChange={(e) => handleInputChange(e, 'panelCompany', 'value')}
            >
              <option value="">-- Select Panel Company --</option>
              {panelCompanies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Add other form sections as needed */}
        <button type="submit" className="submit-button">
          Submit Registration
        </button>
      </form>
    </div>
  );
};

export default SampleRegistrationForm;