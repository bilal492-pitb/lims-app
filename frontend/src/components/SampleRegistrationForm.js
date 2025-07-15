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

  // Helper: update grand total
  const updateGrandTotal = (samplesArr) => {
    const total = samplesArr.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
    setGrandTotal(total);
  };

  // Registration type change
  const handleRegistrationTypeChange = (e) => {
    const value = e.target.value;
    setRegistrationType(value);
    if (value === 'panel') {
      setSenderDetails({ ...initialSenderDetails });
    } else {
      setPanelCompany('');
      setCompanyDetails({ ...initialCompanyDetails });
      setFocalPersonDetails({ ...initialFocalPersonDetails });
    }
  };

  // Panel company change
  const handlePanelCompanyChange = (e) => {
    const value = e.target.value;
    setPanelCompany(value);
    const company = panelCompanies.find((c) => c.value === value);
    if (company) {
      setCompanyDetails({
        companyName: company.label,
        companyContact: company.contact,
        companyEmail: company.email,
        companyAddress: company.address,
      });
      setFocalPersonDetails({
        name: company.focal.name,
        contactNumber: company.focal.contact,
        designation: company.focal.designation,
        email: company.focal.email,
      });
    } else {
      setCompanyDetails({ ...initialCompanyDetails });
      setFocalPersonDetails({ ...initialFocalPersonDetails });
    }
  };

  // Delivery method change
  const handleDeliveryMethodChange = (method) => {
    setDeliveredVia((prev) => ({ ...initialDeliveredVia, method }));
    setShowAuthorizedFields(method === 'authorized');
    setShowCourierFields(method === 'courier');
  };

  // Packaging label image
  const handleLabelImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPackagingDetails((prev) => ({ ...prev, labelImage: file }));
      const reader = new FileReader();
      reader.onload = (ev) => setLabelImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };
  const removeLabelImage = () => {
    setPackagingDetails((prev) => ({ ...prev, labelImage: null }));
    setLabelImagePreview(null);
  };

  // Sample logic
  const addSample = () => {
    setSamples((prev) => {
      const newSamples = [...prev, initialSample()];
      updateGrandTotal(newSamples);
      return newSamples;
    });
  };
  const removeSample = (idx) => {
    setSamples((prev) => {
      const newSamples = prev.filter((_, i) => i !== idx);
      updateGrandTotal(newSamples);
      return newSamples;
    });
  };
  const updateSample = (idx, field, value) => {
    setSamples((prev) => {
      const newSamples = prev.map((s, i) =>
        i === idx ? { ...s, [field]: value } : s
      );
      // If lab/sampleType/test changes, update testTable and totalAmount
      if (['lab', 'sampleType', 'selectedTests'].includes(field)) {
        const sample = newSamples[idx];
        let testTable = [];
        let totalAmount = 0;
        if (sample.lab && sample.sampleType && sample.selectedTests.length > 0) {
          testTable = sample.selectedTests.map((code) => {
            const test = labData[sample.lab].tests[sample.sampleType].find((t) => t.code === code);
            totalAmount += test ? test.price : 0;
            return test;
          }).filter(Boolean);
        }
        newSamples[idx] = { ...sample, testTable, totalAmount };
      }
      updateGrandTotal(newSamples);
      return newSamples;
    });
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Prepare data
      const data = {
        registrationNumber: 'PAFDA-25-000001',
        registrationType: registrationType === 'panel' ? 'Panel Company' : 'Self / Individual',
        panelCompany: panelCompany,
        senderDetails: registrationType === 'panel' ? {} : senderDetails,
        companyDetails: registrationType === 'panel' ? companyDetails : {},
        focalPersonDetails: registrationType === 'panel' ? focalPersonDetails : {},
        deliveredVia,
        packagingDetails: { ...packagingDetails, labelImage: undefined }, // Don't send file
        samples: samples.map((s) => ({ ...s, testTable: undefined })),
        grandTotal,
      };
      await axios.post('http://localhost:5000/api/registrations', data);
      alert('Registration submitted successfully!');
      // Reset form
      setRegistrationType('individual');
      setPanelCompany('');
      setSenderDetails({ ...initialSenderDetails });
      setCompanyDetails({ ...initialCompanyDetails });
      setFocalPersonDetails({ ...initialFocalPersonDetails });
      setDeliveredVia({ ...initialDeliveredVia });
      setShowAuthorizedFields(false);
      setShowCourierFields(false);
      setPackagingDetails({ ...initialPackagingDetails });
      setSamples([initialSample()]);
      setGrandTotal(0);
      setLabelImagePreview(null);
    } catch (err) {
      alert('Error submitting registration.');
    }
    setSubmitting(false);
  };

  // Render
  return (
    <div className="form-container">
      <h2>Sample Registration Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Registration Type */}
        <div className="form-section">
          <h3>Registration Type</h3>
          <div>
            <label>
              <input type="radio" name="registrationType" value="individual" checked={registrationType === 'individual'} onChange={handleRegistrationTypeChange} /> Self / Individual
            </label>
            <label style={{ marginLeft: 20 }}>
              <input type="radio" name="registrationType" value="panel" checked={registrationType === 'panel'} onChange={handleRegistrationTypeChange} /> Panel Company
            </label>
          </div>
          {registrationType === 'panel' && (
            <div style={{ marginTop: 10 }}>
              <select value={panelCompany} onChange={handlePanelCompanyChange} required>
                <option value="">-- Select Panel Company --</option>
                {panelCompanies.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Sender/Company Details */}
        {registrationType === 'individual' ? (
          <div className="form-section">
            <h3>Sender Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input type="text" value={senderDetails.name} onChange={e => setSenderDetails({ ...senderDetails, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Designation *</label>
                <input type="text" value={senderDetails.designation} onChange={e => setSenderDetails({ ...senderDetails, designation: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Department *</label>
                <input type="text" value={senderDetails.department} onChange={e => setSenderDetails({ ...senderDetails, department: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Province *</label>
                <input type="text" value={senderDetails.province} onChange={e => setSenderDetails({ ...senderDetails, province: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Division *</label>
                <input type="text" value={senderDetails.division} onChange={e => setSenderDetails({ ...senderDetails, division: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>District *</label>
                <input type="text" value={senderDetails.district} onChange={e => setSenderDetails({ ...senderDetails, district: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Street No *</label>
              <input type="text" value={senderDetails.streetNo} onChange={e => setSenderDetails({ ...senderDetails, streetNo: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Area *</label>
              <input type="text" value={senderDetails.area} onChange={e => setSenderDetails({ ...senderDetails, area: e.target.value })} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Address *</label>
                <input type="text" value={senderDetails.address} onChange={e => setSenderDetails({ ...senderDetails, address: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Number *</label>
                <input type="tel" value={senderDetails.contactNumber} onChange={e => setSenderDetails({ ...senderDetails, contactNumber: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>CNIC *</label>
                <input type="text" value={senderDetails.cnic} onChange={e => setSenderDetails({ ...senderDetails, cnic: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email ID</label>
                <input type="email" value={senderDetails.email} onChange={e => setSenderDetails({ ...senderDetails, email: e.target.value })} />
              </div>
            </div>
          </div>
        ) : (
          <div className="form-section">
            <h3>Company Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Company Name</label>
                <input type="text" value={companyDetails.companyName} readOnly />
              </div>
              <div className="form-group">
                <label>Company Contact</label>
                <input type="text" value={companyDetails.companyContact} readOnly />
              </div>
              <div className="form-group">
                <label>Company Email</label>
                <input type="email" value={companyDetails.companyEmail} readOnly />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ width: '100%' }}>
                <label>Company Address</label>
                <textarea value={companyDetails.companyAddress} rows={2} readOnly />
              </div>
            </div>
            <h4>Focal Person Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Focal Person Name</label>
                <input type="text" value={focalPersonDetails.name} readOnly />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input type="text" value={focalPersonDetails.contactNumber} readOnly />
              </div>
              <div className="form-group">
                <label>Designation</label>
                <input type="text" value={focalPersonDetails.designation} readOnly />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={focalPersonDetails.email} readOnly />
              </div>
            </div>
          </div>
        )}

        {/* Delivery Method */}
        <div className="form-section">
          <h3>Delivered Via</h3>
          <div className="form-row">
            <div className="form-group">
              <label>
                <input type="checkbox" checked={deliveredVia.method === 'self'} onChange={() => handleDeliveryMethodChange('self')} /> Self
              </label>
              <label style={{ marginLeft: 20 }}>
                <input type="checkbox" checked={deliveredVia.method === 'authorized'} onChange={() => handleDeliveryMethodChange('authorized')} /> Authorized Person
              </label>
              <label style={{ marginLeft: 20 }}>
                <input type="checkbox" checked={deliveredVia.method === 'courier'} onChange={() => handleDeliveryMethodChange('courier')} /> Courier Service
              </label>
            </div>
          </div>
          {/* Authorized Person Fields */}
          {showAuthorizedFields && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input type="text" value={deliveredVia.name} onChange={e => setDeliveredVia({ ...deliveredVia, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>CNIC *</label>
                  <input type="text" value={deliveredVia.cnic} onChange={e => setDeliveredVia({ ...deliveredVia, cnic: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Contact Number *</label>
                  <input type="tel" value={deliveredVia.contactNumber} onChange={e => setDeliveredVia({ ...deliveredVia, contactNumber: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Street No *</label>
                  <input type="text" value={deliveredVia.streetNo} onChange={e => setDeliveredVia({ ...deliveredVia, streetNo: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Area *</label>
                  <input type="text" value={deliveredVia.area} onChange={e => setDeliveredVia({ ...deliveredVia, area: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <input type="text" value={deliveredVia.address} onChange={e => setDeliveredVia({ ...deliveredVia, address: e.target.value })} required />
                </div>
              </div>
            </>
          )}
          {/* Courier Fields */}
          {showCourierFields && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Company Name *</label>
                  <input type="text" value={deliveredVia.companyName} onChange={e => setDeliveredVia({ ...deliveredVia, companyName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Contact *</label>
                  <input type="tel" value={deliveredVia.companyContact} onChange={e => setDeliveredVia({ ...deliveredVia, companyContact: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Address *</label>
                  <textarea value={deliveredVia.companyAddress} onChange={e => setDeliveredVia({ ...deliveredVia, companyAddress: e.target.value })} rows={3} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Parcel Tracking Number *</label>
                  <input type="text" value={deliveredVia.parcelTrackingNumber} onChange={e => setDeliveredVia({ ...deliveredVia, parcelTrackingNumber: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Dispatch Date *</label>
                  <input type="date" value={deliveredVia.dispatchDate} onChange={e => setDeliveredVia({ ...deliveredVia, dispatchDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Remarks/Notes</label>
                  <textarea value={deliveredVia.remarks} onChange={e => setDeliveredVia({ ...deliveredVia, remarks: e.target.value })} rows={3} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Packaging Details */}
        <div className="form-section">
          <h3>Packaging Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Packaging Type *</label>
              <select value={packagingDetails.packagingType} onChange={e => setPackagingDetails({ ...packagingDetails, packagingType: e.target.value })} required>
                <option value="">-- Select Packaging Type --</option>
                <option value="wooden">Wooden</option>
                <option value="cardboard">Cardboard</option>
                <option value="plastic">Plastic</option>
                <option value="glass">Glass</option>
                <option value="metal">Metal</option>
                <option value="fabric">Fabric/Cloth</option>
                <option value="paper">Paper</option>
                <option value="foam">Foam</option>
                <option value="vacuum">Vacuum Sealed</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Seal Condition *</label>
              <select value={packagingDetails.sealCondition} onChange={e => setPackagingDetails({ ...packagingDetails, sealCondition: e.target.value })} required>
                <option value="">-- Select Seal Condition --</option>
                <option value="intact">Intact/Sealed</option>
                <option value="broken">Broken/Unsealed</option>
                <option value="tampered">Tampered</option>
                <option value="leaking">Leaking</option>
                <option value="damaged">Damaged</option>
                <option value="partially_sealed">Partially Sealed</option>
                <option value="resealed">Resealed</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Package Type *</label>
              <div>
                <label><input type="radio" name="packageType" value="single" checked={packagingDetails.packageType === 'single'} onChange={e => setPackagingDetails({ ...packagingDetails, packageType: e.target.value })} required /> Single Package</label>
                <label style={{ marginLeft: 10 }}><input type="radio" name="packageType" value="multiple" checked={packagingDetails.packageType === 'multiple'} onChange={e => setPackagingDetails({ ...packagingDetails, packageType: e.target.value })} /> Multiple Packages</label>
                <label style={{ marginLeft: 10 }}><input type="radio" name="packageType" value="bulk" checked={packagingDetails.packageType === 'bulk'} onChange={e => setPackagingDetails({ ...packagingDetails, packageType: e.target.value })} /> Bulk Packaging</label>
                <label style={{ marginLeft: 10 }}><input type="radio" name="packageType" value="individual" checked={packagingDetails.packageType === 'individual'} onChange={e => setPackagingDetails({ ...packagingDetails, packageType: e.target.value })} /> Individual Units</label>
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ width: '100%' }}>
              <label>Label Details</label>
              <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                <input type="text" value={packagingDetails.labelDetails} onChange={e => setPackagingDetails({ ...packagingDetails, labelDetails: e.target.value })} style={{ flex: 1 }} placeholder="Enter label information" />
                <label className="btn btn-secondary" style={{ margin: 0, whiteSpace: 'nowrap' }}>
                  Attach Image
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLabelImageChange} />
                </label>
              </div>
              {labelImagePreview && (
                <div style={{ marginTop: 10 }}>
                  <img src={labelImagePreview} alt="Label Preview" style={{ maxWidth: 200, maxHeight: 150, border: '1px solid #ddd', borderRadius: 4 }} />
                  <button type="button" className="btn btn-sm btn-danger" style={{ marginLeft: 10 }} onClick={removeLabelImage}>Remove</button>
                </div>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ width: '100%' }}>
              <label>Packaging Notes</label>
              <textarea value={packagingDetails.packagingNotes} onChange={e => setPackagingDetails({ ...packagingDetails, packagingNotes: e.target.value })} rows={2} placeholder="Any additional notes about the packaging" />
            </div>
          </div>
        </div>

        {/* Samples Section */}
        <div className="form-section">
          <div className="form-row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 className="form-section-title" style={{ marginBottom: 0 }}>Samples Management</h3>
            <button type="button" className="btn btn-primary" onClick={addSample}>
              Add Sample
            </button>
          </div>
          <div id="samplesContainer">
            {samples.map((sample, idx) => (
              <div className="sample-container expanded" key={idx}>
                <div className="sample-header">
                  <div className="sample-title">Sample #{idx + 1}</div>
                  <div className="sample-actions">
                    {samples.length > 1 && (
                      <button type="button" className="btn btn-danger btn-sm remove-sample" onClick={() => removeSample(idx)}>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <div className="sample-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Select Lab *</label>
                      <select value={sample.lab} onChange={e => updateSample(idx, 'lab', e.target.value)} required>
                        <option value="">-- Select Lab --</option>
                        {Object.entries(labData).map(([key, lab]) => (
                          <option key={key} value={key}>{lab.name} Lab</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Sample Type *</label>
                      <select value={sample.sampleType} onChange={e => updateSample(idx, 'sampleType', e.target.value)} required disabled={!sample.lab}>
                        <option value="">-- Select Sample Type --</option>
                        {sample.lab && Object.entries(labData[sample.lab].sampleTypes).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Manufacturer Name</label>
                      <input type="text" value={sample.manufacturerName} onChange={e => updateSample(idx, 'manufacturerName', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Sample Collection Date</label>
                      <input type="date" value={sample.sampleCollectionDate} onChange={e => updateSample(idx, 'sampleCollectionDate', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input type="date" value={sample.expiryDate} onChange={e => updateSample(idx, 'expiryDate', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Barcode Number</label>
                      <input type="text" value={sample.barcodeNumber} onChange={e => updateSample(idx, 'barcodeNumber', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Offender Details</label>
                      <input type="text" value={sample.offenderDetails} onChange={e => updateSample(idx, 'offenderDetails', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ width: '100%' }}>
                      <label>Additional Note</label>
                      <textarea value={sample.additionalNote} onChange={e => updateSample(idx, 'additionalNote', e.target.value)} rows={2} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ width: '100%' }}>
                      <label>Select Tests (Multiple Selection) *</label>
                      <select multiple value={sample.selectedTests} onChange={e => updateSample(idx, 'selectedTests', Array.from(e.target.selectedOptions, o => o.value))} style={{ height: 100 }} required disabled={!(sample.lab && sample.sampleType)}>
                        {sample.lab && sample.sampleType && labData[sample.lab].tests[sample.sampleType].map((test) => (
                          <option key={test.code} value={test.code}>{test.code} - {test.name} (Rs. {test.price})</option>
                        ))}
                      </select>
                      <small className="form-text text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple tests</small>
                    </div>
                  </div>
                  <div className="test-table-container">
                    <table className="test-fee-table">
                      <thead>
                        <tr>
                          <th>Test Code</th>
                          <th>Test Name</th>
                          <th>Fee (Rs.)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sample.testTable.length === 0 ? (
                          <tr><td colSpan={3} className="text-center">No tests selected</td></tr>
                        ) : (
                          <>
                            {sample.testTable.map((test) => (
                              <tr key={test.code}>
                                <td>{test.code}</td>
                                <td>{test.name}</td>
                                <td>{test.price.toLocaleString()}</td>
                              </tr>
                            ))}
                            <tr className="font-weight-bold">
                              <td colSpan={2} className="text-right">Subtotal:</td>
                              <td>{sample.totalAmount.toLocaleString()}</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                    <div className="total-amount">
                      Total Amount: Rs. <span>{sample.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Grand Total */}
          <div className="grand-total">
            Grand Total: Rs. <span>{grandTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Submit */}
        <div className="form-actions">
        <button
  type="button"
  className="btn btn-secondary"
  onClick={async () => {
    const draftData = {
      registrationType: registrationType === 'panel' ? 'Panel Company' : 'Self / Individual',
      panelCompany: panelCompany,
      senderDetails: registrationType === 'panel' ? {} : senderDetails,
      companyDetails: registrationType === 'panel' ? companyDetails : {},
      focalPersonDetails: registrationType === 'panel' ? focalPersonDetails : {},
      deliveredVia,
      packagingDetails: { ...packagingDetails, labelImage: undefined },
      samples: samples.map((s) => ({ ...s, testTable: undefined })),
      grandTotal,
    };
    await axios.post('http://localhost:5000/api/registrations/drafts', {
      registrationNumber: 'PAFDA-25-000001',
      draftData,
    });
    alert('Draft saved successfully!');
  }}
  disabled={submitting}
>
  Save as Draft
</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Registration'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SampleRegistrationForm;