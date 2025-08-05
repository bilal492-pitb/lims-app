const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'lims_db'
});

// Generate invoice number
async function generateInvoiceNumber(type) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const currentYear = new Date().getFullYear();
    const prefix = type === 'Invoice' ? 'INV' : type === 'Reminder' ? 'REM' : 'NOT';
    
    const [rows] = await connection.query(
      'SELECT document_id FROM invoices WHERE document_id LIKE ? ORDER BY id DESC LIMIT 1',
      [`${prefix}-${currentYear}-%`]
    );

    let sequenceNumber = 1;
    if (rows.length > 0) {
      const lastNumber = parseInt(rows[0].document_id.split('-')[2]);
      sequenceNumber = lastNumber + 1;
    }

    const documentId = `${prefix}-${currentYear}-${String(sequenceNumber).padStart(3, '0')}`;
    await connection.commit();
    return documentId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Create a new invoice
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      documentType,
      panelCompany,
      period,
      paymentDueDate,
      fromDate,
      toDate,
      additionalNotes
    } = req.body;

    // Generate document ID
    const documentId = await generateInvoiceNumber(documentType);

    // Calculate total amount from sample registrations
    const [samples] = await connection.query(
      'SELECT SUM(grand_total) as total FROM sample_registrations WHERE panel_company = ? AND created_at BETWEEN ? AND ?',
      [panelCompany, fromDate, toDate]
    );

    const amount = samples[0].total || 0;

    const [result] = await connection.query(
      'INSERT INTO invoices (document_id, document_type, panel_company, period, payment_due_date, from_date, to_date, amount, additional_notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [documentId, documentType, panelCompany, period, paymentDueDate, fromDate, toDate, amount, additionalNotes, 'Pending']
    );

    res.status(201).json({ message: 'Invoice created successfully', documentId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT i.*, pc.company_name as company 
       FROM invoices i 
       LEFT JOIN panel_companies pc ON i.panel_company = pc.id 
       ORDER BY i.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single invoice
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT i.*, pc.company_name as company 
       FROM invoices i 
       LEFT JOIN panel_companies pc ON i.panel_company = pc.id 
       WHERE i.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update invoice status
router.put('/:id/status', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { status } = req.body;

    const [result] = await connection.query(
      'UPDATE invoices SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({ message: 'Invoice status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;