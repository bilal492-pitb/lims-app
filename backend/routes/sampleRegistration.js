const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'lims_db'
});

// Generate registration number
async function generateRegistrationNumber() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Get current year's last registration number
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const [rows] = await connection.query(
      'SELECT registration_number FROM sample_registrations WHERE registration_number LIKE ? ORDER BY id DESC LIMIT 1',
      [`PAFDA-${currentYear}-%`]
    );

    let sequenceNumber = 1;
    if (rows.length > 0) {
      const lastNumber = parseInt(rows[0].registration_number.split('-')[2]);
      sequenceNumber = lastNumber + 1;
    }

    const registrationNumber = `PAFDA-${currentYear}-${String(sequenceNumber).padStart(6, '0')}`;
    await connection.commit();
    return registrationNumber;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Create a new sample registration
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const registrationNumber = await generateRegistrationNumber();
    const { registrationType, panelCompany, senderDetails, companyDetails, focalPersonDetails, deliveredVia, packagingDetails, samples, grandTotal } = req.body;
    
    const [result] = await connection.query(
      'INSERT INTO sample_registrations (registration_number, registration_type, panel_company, sender_details, company_details, focal_person_details, delivered_via, packaging_details, samples, grand_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [registrationNumber, registrationType, panelCompany, JSON.stringify(senderDetails), JSON.stringify(companyDetails), JSON.stringify(focalPersonDetails), JSON.stringify(deliveredVia), JSON.stringify(packagingDetails), JSON.stringify(samples), grandTotal]
    );

    res.status(201).json({ message: 'Sample registration created successfully', registrationNumber });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

// Get all sample registrations
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sample_registrations ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single sample registration
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sample_registrations WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Sample registration not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update sample registration
router.put('/:id', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { registrationType, panelCompany, senderDetails, companyDetails, focalPersonDetails, deliveredVia, packagingDetails, samples, grandTotal } = req.body;
    
    const [result] = await connection.query(
      'UPDATE sample_registrations SET registration_type = ?, panel_company = ?, sender_details = ?, company_details = ?, focal_person_details = ?, delivered_via = ?, packaging_details = ?, samples = ?, grand_total = ? WHERE id = ?',
      [registrationType, panelCompany, JSON.stringify(senderDetails), JSON.stringify(companyDetails), JSON.stringify(focalPersonDetails), JSON.stringify(deliveredVia), JSON.stringify(packagingDetails), JSON.stringify(samples), grandTotal, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sample registration not found' });
    }

    res.json({ message: 'Sample registration updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

// Update payment status
router.put('/:id/payment', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { payment_status, amount_received, payment_date, transaction_id, payment_remarks } = req.body;
    
    const [result] = await connection.query(
      'UPDATE sample_registrations SET payment_status = ?, amount_received = ?, payment_date = ?, transaction_id = ?, payment_remarks = ? WHERE id = ?',
      [payment_status, amount_received, payment_date, transaction_id, payment_remarks, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sample registration not found' });
    }

    res.json({ message: 'Payment status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;