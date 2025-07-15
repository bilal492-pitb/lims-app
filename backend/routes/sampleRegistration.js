const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lims_db'
});

// Create a new sample registration
router.post('/', (req, res) => {
  const { registrationNumber, registrationType, panelCompany, senderDetails, companyDetails, focalPersonDetails, deliveredVia, packagingDetails, samples, grandTotal } = req.body;
  const query = 'INSERT INTO sample_registrations (registration_number, registration_type, panel_company, sender_details, company_details, focal_person_details, delivered_via, packaging_details, samples, grand_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [registrationNumber, registrationType, panelCompany, JSON.stringify(senderDetails), JSON.stringify(companyDetails), JSON.stringify(focalPersonDetails), JSON.stringify(deliveredVia), JSON.stringify(packagingDetails), JSON.stringify(samples), grandTotal], (err, result) => {
    if (err) return res.status(400).json({ message: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// Get all registrations
router.get('/', (req, res) => {
  db.query('SELECT * FROM sample_registrations', (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results.map(row => ({
      ...row,
      sender_details: JSON.parse(row.sender_details),
      company_details: JSON.parse(row.company_details),
      focal_person_details: JSON.parse(row.focal_person_details),
      delivered_via: JSON.parse(row.delivered_via),
      packaging_details: JSON.parse(row.packaging_details),
      samples: JSON.parse(row.samples)
    })));
  });
});

module.exports = router;