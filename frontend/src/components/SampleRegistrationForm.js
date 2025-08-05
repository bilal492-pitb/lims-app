import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import './SampleRegistrationForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faBuilding, faPhone, faEnvelope, faMapMarker, faBox, faClipboard, 
  faFlask, faSave, faTimes, faVial, faFingerprint, faWeightHanging, faRuler, 
  faComment, faTrash, faPlus, faUndo, faMoneyBillWave, faCode, faMoneyBill, 
  faInfoCircle, faCog, faUserTie, faTruck
} from '@fortawesome/free-solid-svg-icons';

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
  // Food Lab
  food: {
      name: 'Food',
      subLabs: [
          { id: 'fc', name: 'Food Chemistry' },
          { id: 'fm', name: 'Food Microbiology' }
      ],
      sampleCategories: {
          'fats_oils': 'Fats and Oils',
          'food_additives': 'Food Additives',
          'antibiotic_residues': 'Antibiotic Residues & Hormones',
          'aflatoxin': 'Aflatoxin',
          'milk_products': 'Milk and Milk Products',
          'bakery': 'Bakery and Bakery Wares',
          'egg_products': 'Egg and Egg Products'
      },
      tests: {
          fc: {
              fats_oils: [
                  { code: 'FC.001.001', name: 'Determination of moisture content Oils & Fats (Air Oven Method)', requirements: '100 g in airtight glass jar (1 liter over all)', fee: 2500 },
                  { code: 'FC.001.002', name: 'Determination of free fatty acids (acid value) in crude and refined oil', requirements: '100 ml in sealed bottle (1 liter over all)', fee: 3000 },
                  { code: 'FC.001.003', name: 'Determination of Saponification Value', requirements: '100 g in clean container (1 liter over all)', fee: 3500 }
              ],
              food_additives: [
                  { code: 'FC.014.001', name: 'Detection of synthetic colours in food samples by TLC', requirements: '100-200 gm', fee: 4000 },
                  { code: 'FC.014.002', name: 'Detection of synthetic colours in food samples by HPLC', requirements: '100-200 gm', fee: 5000 },
                  { code: 'FC.014.003', name: 'Determination of saccharin in food samples', requirements: '100-200 gm', fee: 3500 }
              ],
              antibiotic_residues: [
                  { code: 'FC.015.001', name: 'Determination of chloramphenicol – HPLC-MS/MS method', requirements: '100-200 gm', fee: 8000 },
                  { code: 'FC.015.002', name: 'Determination of nitrofuran metabolites – HPLC-MS/MS method', requirements: '100-200 gm', fee: 8500 },
                  { code: 'FC.015.003', name: 'Determination of tetracyclines – HPLC-UV/DAD / LC-MS/MS method', requirements: '100-200 gm', fee: 9000 }
              ],
              aflatoxin: [
                  { code: 'FC.016.001', name: 'Determination of aflatoxins (for groundnuts and groundnut products, oilseeds and food grains) – CB method', requirements: '100-200 gm', fee: 7000 },
                  { code: 'FC.016.002', name: 'Determination of aflatoxins - Romer Minicolumn method', requirements: '100-200 gm', fee: 6500 },
                  { code: 'FC.016.003', name: 'Determination of aflatoxins in corn and peanut powder / butter - Liquid Chromatographic method', requirements: '100-200 gm', fee: 7500 }
              ]
          },
          fm: {
              milk_products: [
                  { code: 'FM.002.001', name: 'Total plate count (TPC)/Aerobic Plate count (APC) of Bacteria', requirements: '1L or kg, Pouched, plastic or glass container, sealed, leak proof, food grade container', fee: 3000 },
                  { code: 'FM.002.002', name: 'TPC of Yeast', requirements: '1L or kg, Pouched, plastic or glass container, sealed, leak proof, food grade container', fee: 3000 },
                  { code: 'FM.002.003', name: 'TPC of Mold', requirements: '1L or kg, Pouched, plastic or glass container, sealed, leak proof, food grade container', fee: 3000 }
              ],
              bakery: [
                  { code: 'FM.011.001', name: 'Total plate count (TPC)/Aerobic Plate count (APC) of Bacteria', requirements: '14 Kg, pouched, plastic and glass container, leak proof, food grade', fee: 3500 },
                  { code: 'FM.011.002', name: 'TPC of Yeast', requirements: '14 Kg, pouched, plastic and glass container, leak proof, food grade', fee: 3500 },
                  { code: 'FM.011.003', name: 'TPC of Mold', requirements: '14 Kg, pouched, plastic and glass container, leak proof, food grade', fee: 3500 }
              ],
              egg_products: [
                  { code: 'FM.012.001', name: 'Total plate count (TPC)/Aerobic Plate count (APC) of Bacteria', requirements: '1 Kg, pouched, plastic and glass container, leak proof, food grade', fee: 4000 },
                  { code: 'FM.012.002', name: 'TPC of Yeast', requirements: '2 Kg, pouched, plastic and glass container, leak proof, food grade', fee: 4000 },
                  { code: 'FM.012.003', name: 'TPC of Mold', requirements: '3 Kg, pouched, plastic and glass container, leak proof, food grade', fee: 4000 }
              ]
          }
      },
  // Drug Lab
  drug: {
      name: 'Drug',
      subLabs: [
          { id: 'dc', name: 'Drug Chemistry' },
          { id: 'dm', name: 'Drug Microbiology' }
      ],
      sampleCategories: {
          'tablets': 'Tablets',
          'capsules': 'Capsules',
          'syrups': 'Syrups',
          'suspensions': 'Suspensions',
          'ointments': 'Ointments',
          'cosmetics': 'Cosmetics',
          'suspected_material': 'Suspected Material'
      },
      tests: {
          dc: {
              tablets: [
                  { code: 'DC.001.001', name: 'Physical Description of Tablets', requirements: 'As per recommended guidelines/label claim', fee: 2000 },
                  { code: 'DC.001.002', name: 'Weight Variation of Tablets', requirements: 'As per recommended guidelines/label claim', fee: 2500 },
                  { code: 'DC.001.003', name: 'Tablet Friability', requirements: 'As per recommended guidelines/label claim', fee: 3000 }
              ],
              capsules: [
                  { code: 'DC.002.001', name: 'Physical Description of Capsules', requirements: 'As per recommended guidelines/label claim', fee: 2200 },
                  { code: 'DC.002.002', name: 'Weight Variation of Capsules', requirements: 'As per recommended guidelines/label claim', fee: 2700 },
                  { code: 'DC.002.003', name: 'Capsule Disintegration', requirements: 'As per recommended guidelines/label claim', fee: 3200 }
              ],
              syrups: [
                  { code: 'DC.005.001', name: 'Assay of Syrups', requirements: 'As per recommended guidelines/label claim', fee: 2800 },
                  { code: 'DC.005.002', name: 'Identification of Syrups', requirements: 'As per recommended guidelines/label claim', fee: 2300 },
                  { code: 'DC.005.003', name: 'pH of Syrups', requirements: 'As per recommended guidelines/label claim', fee: 2000 }
              ],
              suspensions: [
                  { code: 'DC.006.001', name: 'Assay of Suspensions', requirements: 'As per recommended guidelines/label claim', fee: 3000 },
                  { code: 'DC.006.002', name: 'Identification of Suspensions', requirements: 'As per recommended guidelines/label claim', fee: 2500 },
                  { code: 'DC.006.003', name: 'pH of Suspensions', requirements: 'As per recommended guidelines/label claim', fee: 2200 }
              ],
              ointments: [
                  { code: 'DC.007.001', name: 'Assay of Ointments', requirements: 'As per recommended guidelines/label claim', fee: 3200 },
                  { code: 'DC.007.002', name: 'Identification of Ointments', requirements: 'As per recommended guidelines/label claim', fee: 2700 },
                  { code: 'DC.007.003', name: 'pH of Ointments', requirements: 'As per recommended guidelines/label claim', fee: 2400 }
              ],
              cosmetics: [
                  { code: 'DC.030.001', name: 'Assay of Cosmetics', requirements: 'As per recommended guidelines/label claim', fee: 3500 },
                  { code: 'DC.030.002', name: 'Identification of Cosmetics', requirements: 'As per recommended guidelines/label claim', fee: 3000 },
                  { code: 'DC.030.003', name: 'pH of Cosmetics', requirements: 'As per recommended guidelines/label claim', fee: 2500 }
              ],
              suspected_material: [
                  { code: 'DC.030.025', name: 'Color Test Suspected Material', requirements: 'As per sample submission Policy or UNODC/SWGDRUG Sampling guidelines', fee: 5000 },
                  { code: 'DC.030.026', name: 'Pharmaceutical Identification Suspected Material', requirements: 'As per sample submission Policy or UNODC/SWGDRUG Sampling guidelines', fee: 5500 },
                  { code: 'DC.030.027', name: 'Thin Layer Chromatography Suspected Material', requirements: 'As per sample submission Policy or UNODC/SWGDRUG Sampling guidelines', fee: 6000 }
              ]
          },
          dm: {
              tablets: [
                  { code: 'DM.001.007', name: 'Microbial Enumeration Test', requirements: 'Amount: 100 Tablets, Container: Sealed Blister or Bottle, Preservative: None', fee: 4500 },
                  { code: 'DM.001.008', name: 'Test for specific organism (Escherichia coli, Staphylococcus aureus, Pseudomonas aeruginosa, Candida albicans, bile-tolerant Gram-negative bacteria)', requirements: 'Amount: 100 Tablets, Container: Sealed Blister or Bottle, Preservative: None', fee: 6000 },
                  { code: 'DM.001.019', name: 'Test for Burkholderia Cepacia Complex (BCC)', requirements: 'Amount: 100 Tablets, Container: Sealed Blister or Bottle, Preservative: None', fee: 5500 }
              ],
              capsules: [
                  { code: 'DM.002.004', name: 'Microbial Enumeration Test', requirements: 'Amount: 100 Capsules, Container: Sealed Blister or Bottle, Preservative: None', fee: 4700 },
                  { code: 'DM.002.008', name: 'Test for specific organism (Escherichia coli, Staphylococcus aureus, Pseudomonas aeruginosa, Candida albicans, bile-tolerant Gram-negative bacteria)', requirements: 'Amount: 100 Capsules, Container: Sealed Blister or Bottle, Preservative: None', fee: 6200 },
                  { code: 'DM.002.019', name: 'Test for Burkholderia Cepacia Complex (BCC)', requirements: 'Amount: 100 Capsules, Container: Sealed Blister or Bottle, Preservative: None', fee: 5700 }
              ],
              syrups: [
                  { code: 'DM.005.007', name: 'Microbial Enumeration Test', requirements: 'Amount: 100 mL, Container: Sealed HDPE/glass jar, Preservative: None', fee: 5000 },
                  { code: 'DM.005.008', name: 'Test for specific organism (Escherichia coli, Staphylococcus aureus, Pseudomonas aeruginosa, Candida albicans, bile-tolerant Gram-negative bacteria)', requirements: 'Amount: 100 mL, Container: Sealed HDPE/glass jar, Preservative: None', fee: 6500 },
                  { code: 'DM.005.019', name: 'Test for Burkholderia Cepacia Complex (BCC)', requirements: 'Amount: 100 mL, Container: Sealed HDPE/glass jar, Preservative: None', fee: 6000 }
              ],
              suspensions: [
                  { code: 'DM.006.007', name: 'Microbial Enumeration Test', requirements: 'Amount: 100 mL, Container: Sealed HDPE/glass jar, Preservative: None', fee: 5200 },
                  { code: 'DM.006.008', name: 'Test for specific organism (Escherichia coli, Staphylococcus aureus, Pseudomonas aeruginosa, Candida albicans, bile-tolerant Gram-negative bacteria)', requirements: 'Amount: 100 mL, Container: Sealed HDPE/glass jar, Preservative: None', fee: 6700 },
                  { code: 'DM.006.019', name: 'Test for Burkholderia Cepacia Complex (BCC)', requirements: 'Amount: 100 mL, Container: Sealed HDPE/glass jar, Preservative: None', fee: 6200 }
              ],
              ointments: [
                  { code: 'DM.007.007', name: 'Microbial Enumeration Test', requirements: 'Amount: 50 g, Container: Sealed HDPE/glass jar, Preservative: None', fee: 5500 },
                  { code: 'DM.007.008', name: 'Test for specific organism (Escherichia coli, Staphylococcus aureus, Pseudomonas aeruginosa, Candida albicans, bile-tolerant Gram-negative bacteria)', requirements: 'Amount: 50 g, Container: Sealed HDPE/glass jar, Preservative: None', fee: 7000 },
                  { code: 'DM.007.019', name: 'Test for Burkholderia Cepacia Complex (BCC)', requirements: 'Amount: 50 g, Container: Sealed HDPE/glass jar, Preservative: None', fee: 6500 }
              ],
              cosmetics: [
                  { code: 'DM.031.007', name: 'Microbial Enumeration', requirements: '05 units', fee: 4000 },
                  { code: 'DM.031.008', name: 'Test for specific organism (Escherichia coli, Staphylococcus aureus, Pseudomonas aeruginosa, Candida albicans, bile-tolerant Gram-negative bacteria)', requirements: '05 units', fee: 5500 },
                  { code: 'DM.031.019', name: 'Test for Burkholderia Cepacia Complex (BCC)', requirements: '05 units', fee: 5000 }
              ],
              suspected_material: [
                  { code: 'DM.035.001', name: 'Microbial Identification', requirements: 'As per sample submission Policy or UNODC/SWGDRUG Sampling guidelines', fee: 7000 },
                  { code: 'DM.035.002', name: 'Fungal Identification', requirements: 'As per sample submission Policy or UNODC/SWGDRUG Sampling guidelines', fee: 7500 },
                  { code: 'DM.035.003', name: 'Antimicrobial Susceptibility Testing', requirements: 'As per sample submission Policy or UNODC/SWGDRUG Sampling guidelines', fee: 8000 }
              ]
          }
      }
  }
},
  // Agricultural Lab
  agricultural: {
      name: 'Agricultural',
      subLabs: [
          { id: 'ac', name: 'Agricultural Chemistry' },
          { id: 'am', name: 'Agricultural Microbiology' }
      ],
      sampleCategories: {
          'pesticides': 'Pesticides',
          'fertilizers': 'Fertilizers',
          'seeds': 'Seeds',
          'soil': 'Soil Samples'
      },
      tests: {
          ac: {
              pesticides: [
                  { code: 'AC.001.001', name: 'Determination of pesticide active ingredient by gas chromatography', requirements: '250 ml (liquid)/ 250g (solid)', fee: 5000 },
                  { code: 'AC.001.002', name: 'Determination of pesticide active ingredient by HPLC', requirements: '250 ml (liquid)/ 250g (solid)', fee: 5500 },
                  { code: 'AC.001.005', name: 'Determination of pH of pesticide', requirements: '250 ml (liquid)/ 250g (solid)', fee: 3000 }
              ],
              fertilizers: [
                  { code: 'AC.002.001', name: 'Estimation of nitrogen in fertilizer by Kjeldahl method', requirements: '250 ml (liquid)/ 250g (solid)', fee: 4500 },
                  { code: 'AC.002.002', name: 'Estimation of phosphorus in fertilizer by Vanado Phospho Molybdate Method', requirements: '250 ml (liquid)/ 250g (solid)', fee: 4500 },
                  { code: 'AC.002.003', name: 'Estimation of potassium in fertilizer by flame photometer', requirements: '250 ml (liquid)/ 250g (solid)', fee: 4000 }
              ]
          },
          am: {
              seeds: [
                  { code: 'AM.007.001', name: 'Physical Purity Analysis', requirements: '500g to 1 kg Sterile, airtight containers glass jars or plastic zip bags', fee: 3500 },
                  { code: 'AM.007.002', name: 'Germination Test', requirements: '500g to 1 kg Sterile, airtight containers glass jars or plastic zip bags', fee: 4000 },
                  { code: 'AM.007.003', name: 'Seed Health Testing', requirements: '500g to 1 kg Sterile, airtight containers glass jars or plastic zip bags', fee: 4500 }
              ],
              soil: [
                  { code: 'AM.002.001', name: 'Mango Anthracnose Pathogen Detection', requirements: '5-100g, paper bags', fee: 5000 },
                  { code: 'AM.002.002', name: 'Mango Malformation Pathogen Detection', requirements: '5-100g, paper bags', fee: 5000 },
                  { code: 'AM.002.003', name: 'Citrus canker Pathogen Detection', requirements: '5-100g, paper bags', fee: 5000 }
              ]
          }
      }
  }
};

const initialSenderDetails = { name: '', designation: '', department: '', province: '', division: '', district: '', streetNo: '', area: '', address: '', contactNumber: '', cnic: '', email: '' };
const initialCompanyDetails = { companyName: '', companyContact: '', companyEmail: '', companyAddress: '' };
const initialFocalPersonDetails = { name: '', contactNumber: '', designation: '', email: '' };
const initialDeliveredVia = { method: 'self', name: '', cnic: '', contactNumber: '', streetNo: '', area: '', address: '', companyName: '', companyContact: '', companyAddress: '', parcelTrackingNumber: '', dispatchDate: '', remarks: '' };
const initialPackagingDetails = { packagingType: '', sealCondition: '', packageType: '', noofsamples: '', environmentalconditions: '', labelDetails: '', labelImage: null, opencameraImage: null, packagingNotes: '' };
const initialSample = () => ({
  // Basic Information
  lab: '',
  sampleType: '',
  
  // Seal Condition
  sealCondition: '',
  
  // Memorandum Details
  memorandumNumber: '',
  memorandumDate: '',
  
  // Quantity
  quantityType: 'pack',
  quantityValue: '',
  quantityUnit: '',
  
  // Product Details
  brandName: '',
  manufacturerName: '',
  manufacturerAddress: '',
  manufacturerCountry: '',
  batchNumber: '',
  mfgDate: '',
  expDate: '',
  
  // Importer/Distributor
  importerName: '',
  importerAddress: '',
  distributorName: '',
  distributorAddress: '',
  
  // Registration
  registrationNumber: '',
  registrationDate: '',
  
  // Sample Information
  sampleCollectionDate: '',
  sampleCollectionLocation: '',
  sampleCollectionBy: '',
  sampleCollectionWitness: '',
  sampleCollectionNote: '',
  
  // Physical Properties
  physicalAppearance: '',
  color: '',
  odor: '',
  
  // Storage Conditions
  storageCondition: 'ambient',
  storageTemperature: '',
  storageHumidity: '',
  
  // Barcode/QR
  barcodeNumber: '',
  qrCode: '',
  
  // Offender Details
  offenderName: '',
  offenderFatherName: '',
  offenderCnic: '',
  offenderContact: '',
  offenderAddress: '',
  
  // Additional Information
  specifications: '',
  additionalNote: '',
  
  // Sub-Lab and Category
  subLab: '',
  sampleCategory: '',
  
  // Sample Acceptance
  sampleAccepted: true,
  rejectionReason: '',
  
  // Test Selection
  selectedTests: [],
  testTable: [],
  totalAmount: 0,
  
  // Document References
  documentReferences: [],
  
  // Status
  status: 'draft',
  createdBy: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

function SampleRegistrationForm() {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [testDefinitions, setTestDefinitions] = useState([]);
  const [testCategories, setTestCategories] = useState([]);

  useEffect(() => {
    // Fetch test definitions and categories when component mounts
    const fetchTestData = async () => {
      try {
        const [definitionsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/test-configuration/test-definitions`),
          axios.get(`${API_BASE_URL}/api/test-configuration/test-categories`)
        ]);
        setTestDefinitions(definitionsRes.data);
        setTestCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching test data:', error);
      }
    };
    fetchTestData();
  }, []);
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
      await axios.post(`${API_BASE_URL}/sample-registrations`, data);
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
      <div className="page-title">
        <FontAwesomeIcon icon={faClipboard} />
        <span>Sample Registration Form</span>
        {registrationNumber && (
          <div className="registration-number">
            Registration #: {registrationNumber}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        {/* Registration Type */}
        <div className="form-section">
          <div className="form-section-title">
            <FontAwesomeIcon icon={faBuilding} />
            <span>Registration Type</span>
          </div>
          <div>
            <label className="radio-label">
              <input type="radio" name="registrationType" value="individual" checked={registrationType === 'individual'} onChange={handleRegistrationTypeChange} />
              <FontAwesomeIcon icon={faUser} /> Self / Individual
            </label>
            <label className="radio-label" style={{ marginLeft: 20 }}>
              <input type="radio" name="registrationType" value="panel" checked={registrationType === 'panel'} onChange={handleRegistrationTypeChange} />
              <FontAwesomeIcon icon={faBuilding} /> Panel Company
            </label>
          </div>
          {registrationType === 'panel' && (
            <div className="panel-company-select">
              <select value={panelCompany} onChange={handlePanelCompanyChange} required className="form-control">
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
            <div className="form-section-title">
              <FontAwesomeIcon icon={faUser} />
              <span>Sender Details</span>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Name *</span>
                </label>
                <input type="text" className="form-control" value={senderDetails.name} onChange={e => setSenderDetails({ ...senderDetails, name: e.target.value })} placeholder="Enter full name" required />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faBuilding} />
                  <span>Designation *</span>
                </label>
                <input type="text" className="form-control" value={senderDetails.designation} onChange={e => setSenderDetails({ ...senderDetails, designation: e.target.value })} placeholder="Enter designation" required />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faBuilding} />
                  <span>Department *</span>
                </label>
                <input type="text" className="form-control" value={senderDetails.department} onChange={e => setSenderDetails({ ...senderDetails, department: e.target.value })} placeholder="Enter department" required />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faMapMarker} />
                  <span>Province *</span>
                </label>
                <input type="text" className="form-control" value={senderDetails.province} onChange={e => setSenderDetails({ ...senderDetails, province: e.target.value })} placeholder="Enter province" required />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faMapMarker} />
                  <span>Division *</span>
                </label>
                <input type="text" className="form-control" value={senderDetails.division} onChange={e => setSenderDetails({ ...senderDetails, division: e.target.value })} placeholder="Enter division" required />
              </div>
            </div>
              <div className="form-row">
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faMapMarker} />
                  <span>District *</span>
                </label>
                <input type="text" className="form-control" value={senderDetails.district} onChange={e => setSenderDetails({ ...senderDetails, district: e.target.value })} placeholder="Enter district" required />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faMapMarker} />
                  <span>Street No *</span>
                </label>
                <input type="text" className="form-control" value={senderDetails.streetNo} onChange={e => setSenderDetails({ ...senderDetails, streetNo: e.target.value })} placeholder="Enter street number" required />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faMapMarker} />
                  <span>Area *</span>
                </label>
                <input type="text" className="form-control" value={senderDetails.area} onChange={e => setSenderDetails({ ...senderDetails, area: e.target.value })} placeholder="Enter area" required />
              </div>
              <div className="form-group full-width">
                <label>
                  <FontAwesomeIcon icon={faMapMarker} />
                  <span>Address *</span>
                </label>
                <input type="text" className="form-control" value={senderDetails.address} onChange={e => setSenderDetails({ ...senderDetails, address: e.target.value })} placeholder="Enter complete address" required />
              </div>
            </div>
              <div className="form-row">
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faPhone} />
                  <span>Contact Number *</span>
                </label>
                <input type="tel" className="form-control" value={senderDetails.contactNumber} onChange={e => setSenderDetails({ ...senderDetails, contactNumber: e.target.value })} placeholder="Enter contact number" required />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faUser} />
                  <span>CNIC *</span>
                </label>
                <input type="text" className="form-control" value={senderDetails.cnic} onChange={e => setSenderDetails({ ...senderDetails, cnic: e.target.value })} placeholder="Enter CNIC number" required />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>Email ID</span>
                </label>
                <input type="email" className="form-control" value={senderDetails.email} onChange={e => setSenderDetails({ ...senderDetails, email: e.target.value })} placeholder="Enter email address" />
              </div>
            </div>
          </div>
        ) : (
          <div className="form-section">
            <div className="form-section-title">
              <FontAwesomeIcon icon={faBuilding} />
              <span>Company Details</span>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faBuilding} />
                  <span>Company Name</span>
                </label>
                <input type="text" className="form-control" value={companyDetails.companyName} readOnly />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faPhone} />
                  <span>Company Contact</span>
                </label>
                <input type="text" className="form-control" value={companyDetails.companyContact} readOnly />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>Company Email</span>
                </label>
                <input type="email" className="form-control" value={companyDetails.companyEmail} readOnly />
              </div>
              <div className="form-group full-width">
                <label>
                  <FontAwesomeIcon icon={faMapMarker} />
                  <span>Company Address</span>
                </label>
                <textarea className="form-control" value={companyDetails.companyAddress} rows={2} readOnly />
              </div>
            </div>
              
            <div className="form-section-title" style={{ marginTop: '20px' }}>
              <FontAwesomeIcon icon={faUser} />
              <span>Focal Person Details</span>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Focal Person Name</span>
                </label>
                <input type="text" className="form-control" value={focalPersonDetails.name} readOnly />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faPhone} />
                  <span>Contact Number</span>
                </label>
                <input type="text" className="form-control" value={focalPersonDetails.contactNumber} readOnly />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faBuilding} />
                  <span>Designation</span>
                </label>
                <input type="text" className="form-control" value={focalPersonDetails.designation} readOnly />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>Email</span>
                </label>
                <input type="email" className="form-control" value={focalPersonDetails.email} readOnly />
              </div>
            </div>
          </div>
        )}

        {/* Delivery Method */}
        <div className="form-section">
          <div className="form-section-title">
            <FontAwesomeIcon icon={faTruck} />
            <span>Delivered Via</span>
          </div>
          <div className="form-grid">
            <div className="form-group full-width">
              <div className="delivery-options">
                <label className="radio-label">
                  <input type="radio" name="deliveryMethod" checked={deliveredVia.method === 'self'} onChange={() => handleDeliveryMethodChange('self')} />
                  <FontAwesomeIcon icon={faUser} /> Self
                </label>
                <label className="radio-label">
                  <input type="radio" name="deliveryMethod" checked={deliveredVia.method === 'authorized'} onChange={() => handleDeliveryMethodChange('authorized')} />
                  <FontAwesomeIcon icon={faUserTie} /> Authorized Person
                </label>
                <label className="radio-label">
                  <input type="radio" name="deliveryMethod" checked={deliveredVia.method === 'courier'} onChange={() => handleDeliveryMethodChange('courier')} />
                  <FontAwesomeIcon icon={faTruck} /> Courier Service
                </label>
              </div>
            </div>
          </div>
          {/* Authorized Person Fields */}
          {showAuthorizedFields && (
            <div className="form-grid" style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Name *</span>
                </label>
                <input type="text" className="form-control" value={deliveredVia.name} onChange={e => setDeliveredVia({ ...deliveredVia, name: e.target.value })} placeholder="Enter authorized person name" required />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faIdCard} />
                  <span>CNIC *</span>
                </label>
                <input type="text" className="form-control" value={deliveredVia.cnic} onChange={e => setDeliveredVia({ ...deliveredVia, cnic: e.target.value })} placeholder="Enter CNIC number" required />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faPhone} />
                  <span>Contact Number *</span>
                </label>
                <input type="tel" className="form-control" value={deliveredVia.contactNumber} onChange={e => setDeliveredVia({ ...deliveredVia, contactNumber: e.target.value })} placeholder="Enter contact number" required />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faMapMarker} />
                  <span>Street No *</span>
                </label>
                <input type="text" className="form-control" value={deliveredVia.streetNo} onChange={e => setDeliveredVia({ ...deliveredVia, streetNo: e.target.value })} placeholder="Enter street number" required />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faMapMarker} />
                  <span>Area *</span>
                </label>
                <input type="text" className="form-control" value={deliveredVia.area} onChange={e => setDeliveredVia({ ...deliveredVia, area: e.target.value })} placeholder="Enter area" required />
              </div>
              <div className="form-group full-width">
                <label>
                  <FontAwesomeIcon icon={faMapMarker} />
                  <span>Address *</span>
                </label>
                <input type="text" className="form-control" value={deliveredVia.address} onChange={e => setDeliveredVia({ ...deliveredVia, address: e.target.value })} placeholder="Enter complete address" required />
              </div>
            </div>
          )}
          {/* Courier Fields */}
          {showCourierFields && (
            <div className="form-grid" style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faBuilding} />
                  <span>Company Name *</span>
                </label>
                <input type="text" className="form-control" value={deliveredVia.companyName} onChange={e => setDeliveredVia({ ...deliveredVia, companyName: e.target.value })} placeholder="Enter courier company name" required />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faPhone} />
                  <span>Contact *</span>
                </label>
                <input type="tel" className="form-control" value={deliveredVia.companyContact} onChange={e => setDeliveredVia({ ...deliveredVia, companyContact: e.target.value })} placeholder="Enter company contact" required />
              </div>
              <div className="form-group full-width">
                <label>
                  <FontAwesomeIcon icon={faMapMarker} />
                  <span>Address *</span>
                </label>
                <textarea className="form-control" value={deliveredVia.companyAddress} onChange={e => setDeliveredVia({ ...deliveredVia, companyAddress: e.target.value })} rows={3} placeholder="Enter company address" required />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faBarcode} />
                  <span>Tracking Number *</span>
                </label>
                <input type="text" className="form-control" value={deliveredVia.parcelTrackingNumber} onChange={e => setDeliveredVia({ ...deliveredVia, parcelTrackingNumber: e.target.value })} placeholder="Enter tracking number" required />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faCalendar} />
                  <span>Dispatch Date *</span>
                </label>
                <input type="date" className="form-control" value={deliveredVia.dispatchDate} onChange={e => setDeliveredVia({ ...deliveredVia, dispatchDate: e.target.value })} required />
              </div>
              <div className="form-group full-width">
                <label>
                  <FontAwesomeIcon icon={faComment} />
                  <span>Remarks/Notes</span>
                </label>
                <textarea className="form-control" value={deliveredVia.remarks} onChange={e => setDeliveredVia({ ...deliveredVia, remarks: e.target.value })} rows={3} placeholder="Enter any additional notes" />
              </div>
            </div>
          )}
        </div>

        {/* Packaging Details */}
        <div className="form-section">
          <div className="form-section-title">
            <FontAwesomeIcon icon={faBox} />
            <span>Packaging Details</span>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faBox} />
                <span>Packaging Type *</span>
              </label>
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
          <div className="form-row"></div>
          <div className="form-group"></div>
                <label>No of Samples</label>
                <input type="number" value={packagingDetails.nosamples} onChange={e => setPackagingDetails({ ...packagingDetails, nosamples: e.target.value })} style={{ flex: 1 }} placeholder="Enter no of samples" />
              </div>
          <div className="form-group">
              <label>Environmental Conditions *</label>
              <select value={packagingDetails.environmentalconditions} onChange={e => setPackagingDetails({ ...packagingDetails, environmentalconditions: e.target.value })} required>
                <option value="">-- Select Environmental Condition --</option>
                <option value="ambiant">Ambiant</option>
                <option value="frozen">Frozen</option>
                <option value="protectedfromlight">Protected from light</option>
                <option value="hotserved">Hotserved</option>
                <option value="refrigerated">refrigerated</option>
                <option value="others">Others</option>
                </select>
          <div className="form-row">
            <div className="form-group" style={{ width: '100%' }}>
              <label>Label Details</label>
              <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                <input type="text" value={packagingDetails.labelDetails} onChange={e => setPackagingDetails({ ...packagingDetails, labelDetails: e.target.value })} style={{ flex: 1 }} placeholder="Enter label information" />
                <label className="btn btn-secondary" style={{ margin: 0, whiteSpace: 'nowrap' }}>
                  Attach Image
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLabelImageChange} />
                </label>
                <label className="btn btn-secondary" style={{ margin: 0, whiteSpace: 'nowrap' }}>
                  Open Camera
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
            <div className="form-section-title" style={{ marginBottom: 0 }}>
              <FontAwesomeIcon icon={faVial} />
              <span>Samples Management</span>
            </div>
            <button type="button" className="btn btn-primary" onClick={addSample}>
              <FontAwesomeIcon icon={faPlus} /> Add Sample
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
                    <div className="form-group">
                      <label>memorandumNumber</label>
                      <input type="text" value={sample.sampleDescription} onChange={e => updateSample(idx, 'sampleDescription', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>memorandumDate</label>
                      <input type="date" value={sample.memorandumDate} onChange={e => updateSample(idx, 'memorandumDate', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>quantity Type</label>
                      <input type="text" value={sample.quantityType} onChange={e => updateSample(idx, 'quantityType', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>quantityValue</label>
                      <input type="text" value={sample.quantityValue} onChange={e => updateSample(idx, 'quantityValue', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>quantityUnit</label>
                      <input type="text" value={sample.quantityUnit} onChange={e => updateSample(idx, 'quantityunit', e.target.value)} />
                    </div>
                    </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>brandName</label>
                      <input type="text" value={sample.brandName} onChange={e => updateSample(idx, 'brandName', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>manufacturerName</label>
                      <input type="text" value={sample.manufacturerName} onChange={e => updateSample(idx, 'manufacturerName', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>manufacturerAddress</label>
                      <input type="text" value={sample.manufacturerAddress} onChange={e => updateSample(idx, 'manufactureraddress', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>manufacturerCountry</label>
                      <input type="text" value={sample.manufacturerCountry} onChange={e => updateSample(idx, 'manufacturercountry', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Batch Number</label>
                      <input type="text" value={sample.barcodeNumber} onChange={e => updateSample(idx, 'batchNumber', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Manufacturer Date</label>
                      <input type="date" value={sample.manufacturerDate} onChange={e => updateSample(idx, 'manufacturerDate', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input type="date" value={sample.expiryDate} onChange={e => updateSample(idx, 'expiryDate', e.target.value)} />
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
                      <label>Additional Note</label>
                      <textarea value={sample.additionalNote} onChange={e => updateSample(idx, 'additionalNote', e.target.value)} rows={2} />
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
                      <label>Additional Note</label>
                      <textarea value={sample.additionalNote} onChange={e => updateSample(idx, 'additionalNote', e.target.value)} rows={2} />
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
                  <div className="test-table-container table-responsive">
                    <table className="test-fee-table">
                      <thead>
                        <tr>
                          <th><FontAwesomeIcon icon={faCode} /> Test Code</th>
                          <th><FontAwesomeIcon icon={faFlask} /> Test Name</th>
                          <th><FontAwesomeIcon icon={faMoneyBill} /> Fee (Rs.)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sample.testTable.length === 0 ? (
                          <tr><td colSpan={3} className="text-center text-muted"><FontAwesomeIcon icon={faInfoCircle} /> No tests selected</td></tr>
                        ) : (
                          <>
                            {sample.testTable.map((test) => (
                              <tr key={test.code}>
                                <td><code>{test.code}</code></td>
                                <td>{test.name}</td>
                                <td className="text-right">{test.price.toLocaleString()}</td>
                              </tr>
                            ))}
                            <tr className="font-weight-bold bg-light">
                              <td colSpan={2} className="text-right">Subtotal:</td>
                              <td className="text-right">{sample.totalAmount.toLocaleString()}</td>
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
              await axios.post(`${API_BASE_URL}/registrations/drafts`, {
                registrationNumber: 'PAFDA-25-000001',
                draftData,
              });
              alert('Draft saved successfully!');
            }}
            disabled={submitting}
          >
            <FontAwesomeIcon icon={faSave} /> Save as Draft
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            <FontAwesomeIcon icon={faSave} /> {submitting ? 'Submitting...' : 'Submit Registration'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SampleRegistrationForm;