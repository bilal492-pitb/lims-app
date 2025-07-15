import React, { useState } from 'react';
import axios from 'axios';
import './SampleRegistrationForm.css';

// Hardcoded data (from ERU 1.html)
const panelCompanies = [
  { value: 'nestle', label: 'Nestle Pakistan Limited', contact: '042-111-123-456', email: 'info@nestle.com', address: 'Nestle House, Lahore', focal: { name: 'Ali Khan', contact: '0300-1234567', designation: 'Manager', email: 'ali.khan@nestle.com' } },
  { value: 'unilever', label: 'Unilever Pakistan Limited', contact: '042-111-654-321', email: 'info@unilever.com', address: 'Unilever House, Karachi', focal: { name: 'Sara Ahmed', contact: '0321-9876543', designation: 'Coordinator', email: 'sara.ahmed@unilever.com' } },
  { value: 'engro', label: 'Engro Foods Limited', contact: '042-111-222-333', email: 'info@engro.com', address: 'Engro House, Karachi', focal: { name: 'Bilal Raza', contact: '0333-2223334', designation: 'Supervisor', email: 'bilal.raza@engro.com' } },
  { value: 'shan', label: 'Shan Foods Private Limited', contact: '042-111-444-555', email: 'info@shan.com', address: 'Shan House, Karachi', focal: { name: 'Hina Shah', contact: '0345-4445556', designation: 'Executive', email: 'hina.shah@shan.com' } },
  { value: 'national', label: 'National Foods Limited', contact: '042-111-666-777', email: 'info@national.com', address: 'National House, Karachi', focal: { name: 'Usman Tariq', contact: '0301-6667778', designation: 'Manager', email: 'usman.tariq@national.com' } },
  { value: 'cocacola', label: 'Coca-Cola Beverages Pakistan Limited', contact: '042-111-888-999', email: 'info@cocacola.com', address: 'Coke House, Lahore', focal: { name: 'Ayesha Malik', contact: '0322-8889990', designation: 'Coordinator', email: 'ayesha.malik@cocacola.com' } },
  { value: 'pepsi', label: 'PepsiCo International Pakistan', contact: '042-111-000-111', email: 'info@pepsi.com', address: 'Pepsi House, Lahore', focal: { name: 'Imran Qureshi', contact: '0334-0001112', designation: 'Supervisor', email: 'imran.qureshi@pepsi.com' } },
  { value: 'shezan', label: 'Shezan International Limited', contact: '042-111-222-444', email: 'info@shezan.com', address: 'Shezan House, Lahore', focal: { name: 'Nida Farooq', contact: '0346-2224445', designation: 'Executive', email: 'nida.farooq@shezan.com' } },
];

const labData = {
  food: {
    name: 'Food',
    sampleTypes: {
      dairy: 'Dairy Products',
      meat: 'Meat & Poultry',
      beverages: 'Beverages',
      bakery: 'Bakery Products',
      oils: 'Edible Oils',
    },
    tests: {
      dairy: [
        { code: 'FAT', name: 'Fat Content', price: 2000 },
        { code: 'SNF', name: 'SNF Content', price: 1500 },
        { code: 'ADUL', name: 'Adulteration Test', price: 2500 },
        { code: 'MICRO', name: 'Microbiological Analysis', price: 3000 },
      ],
      meat: [
        { code: 'PROT', name: 'Protein Content', price: 2500 },
        { code: 'FAT', name: 'Fat Content', price: 2000 },
        { code: 'MOIST', name: 'Moisture Content', price: 1800 },
        { code: 'MICRO', name: 'Microbiological Analysis', price: 3500 },
      ],
      beverages: [
        { code: 'PROT', name: 'Protein Content', price: 2500 },
        { code: 'FAT', name: 'Fat Content', price: 2000 },
        { code: 'MOIST', name: 'Moisture Content', price: 1800 },
        { code: 'MICRO', name: 'Microbiological Analysis', price: 3500 },
      ],
      bakery: [
        { code: 'PROT', name: 'Protein Content', price: 2500 },
        { code: 'FAT', name: 'Fat Content', price: 2000 },
        { code: 'MOIST', name: 'Moisture Content', price: 1800 },
        { code: 'MICRO', name: 'Microbiological Analysis', price: 3500 },
      ],
      oils: [
        { code: 'PROT', name: 'Protein Content', price: 2500 },
        { code: 'FAT', name: 'Fat Content', price: 2000 },
        { code: 'MOIST', name: 'Moisture Content', price: 1800 },
        { code: 'MICRO', name: 'Microbiological Analysis', price: 3500 },
      ],
    },
  },
  drug: {
    name: 'Drug',
    sampleTypes: {
      tablets: 'Tablets',
      syrups: 'Syrups',
      injections: 'Injections',
      capsules: 'Capsules',
      ointments: 'Ointments',
    },
    tests: {
      tablets: [
        { code: 'ASSAY', name: 'Assay Test', price: 5000 },
        { code: 'DISS', name: 'Dissolution Test', price: 4500 },
        { code: 'DISINT', name: 'Disintegration Test', price: 3000 },
        { code: 'IMP', name: 'Impurities Test', price: 6000 },
      ],
      syrups: [
        { code: 'ASSAY', name: 'Assay Test', price: 5500 },
        { code: 'PH', name: 'pH Test', price: 2000 },
        { code: 'VISC', name: 'Viscosity Test', price: 3000 },
        { code: 'PRES', name: 'Preservative Test', price: 4000 },
      ],
      injections: [
        { code: 'ASSAY', name: 'Assay Test', price: 5500 },
        { code: 'PH', name: 'pH Test', price: 2000 },
        { code: 'VISC', name: 'Viscosity Test', price: 3000 },
        { code: 'PRES', name: 'Preservative Test', price: 4000 },
      ],
      capsules: [
        { code: 'ASSAY', name: 'Assay Test', price: 5500 },
        { code: 'PH', name: 'pH Test', price: 2000 },
        { code: 'VISC', name: 'Viscosity Test', price: 3000 },
        { code: 'PRES', name: 'Preservative Test', price: 4000 },
      ],
      ointments: [
        { code: 'ASSAY', name: 'Assay Test', price: 5500 },
        { code: 'PH', name: 'pH Test', price: 2000 },
        { code: 'VISC', name: 'Viscosity Test', price: 3000 },
        { code: 'PRES', name: 'Preservative Test', price: 4000 },
      ],
    },
  },
  agricultural: {
    name: 'Agricultural',
    sampleTypes: {
      pesticides: 'Pesticides',
      fertilizers: 'Fertilizers',
      seeds: 'Seeds',
      soil: 'Soil Samples',
      water: 'Water Samples',
    },
    tests: {
      pesticides: [
        { code: 'RESID', name: 'Residue Analysis', price: 4000 },
        { code: 'PURITY', name: 'Purity Test', price: 3500 },
        { code: 'EFF', name: 'Efficacy Test', price: 5000 },
      ],
      fertilizers: [
        { code: 'NPK', name: 'NPK Analysis', price: 3000 },
        { code: 'HEAVY', name: 'Heavy Metals', price: 4000 },
        { code: 'MOIST', name: 'Moisture Content', price: 1500 },
      ],
      seeds: [
        { code: 'NPK', name: 'NPK Analysis', price: 3000 },
        { code: 'HEAVY', name: 'Heavy Metals', price: 4000 },
        { code: 'MOIST', name: 'Moisture Content', price: 1500 },
      ],
      soil: [
        { code: 'NPK', name: 'NPK Analysis', price: 3000 },
        { code: 'HEAVY', name: 'Heavy Metals', price: 4000 },
        { code: 'MOIST', name: 'Moisture Content', price: 1500 },
      ],
      water: [
        { code: 'NPK', name: 'NPK Analysis', price: 3000 },
        { code: 'HEAVY', name: 'Heavy Metals', price: 4000 },
        { code: 'MOIST', name: 'Moisture Content', price: 1500 },
      ],
    },
  },
};

const initialSenderDetails = { name: '', designation: '', department: '', province: '', division: '', district: '', streetNo: '', area: '', address: '', contactNumber: '', cnic: '', email: '' };
const initialCompanyDetails = { companyName: '', companyContact: '', companyEmail: '', companyAddress: '' };
const initialFocalPersonDetails = { name: '', contactNumber: '', designation: '', email: '' };
const initialDeliveredVia = { method: 'self', name: '', cnic: '', contactNumber: '', streetNo: '', area: '', address: '', companyName: '', companyContact: '', companyAddress: '', parcelTrackingNumber: '', dispatchDate: '', remarks: '' };
const initialPackagingDetails = { packagingType: '', sealCondition: '', packageType: '', labelDetails: '', labelImage: null, packagingNotes: '' };
const initialSample = () => ({ lab: '', sampleType: '', manufacturerName: '', sampleCollectionDate: '', expiryDate: '', barcodeNumber: '', offenderDetails: '', additionalNote: '', selectedTests: [], testTable: [], totalAmount: 0 });

function SampleRegistrationForm() {
  const [registrationType, setRegistrationType] = useState('individual');
  const [panelCompany, setPanelCompany] = useState('');
  const [senderDetails, setSenderDetails] = useState({ ...initialSenderDetails });
  const [companyDetails, setCompanyDetails] = useState({ ...initialCompanyDetails });
  const [focalPersonDetails, setFocalPersonDetails] = useState({ ...initialFocalPersonDetails });
  const [deliveredVia, setDeliveredVia] = useState({ ...initialDeliveredVia });
  const [showAuthorizedFields, setShowAuthorizedFields] = useState(false);
  const [showCourierFields, setShowCourierFields] = useState(false);
  const [packagingDetails, setPackagingDetails] = useState({ ...initialPackagingDetails });
  const [samples, setSamples] = useState([initialSample()]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [labelImagePreview, setLabelImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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