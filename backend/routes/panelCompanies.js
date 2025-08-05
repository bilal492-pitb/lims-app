const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'lims_db'
});

// Create a new panel company
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      companyName,
      status,
      address,
      contactNumber,
      email,
      focalPersonName,
      designation,
      focalContactNumber,
      focalEmail,
      contractStartDate,
      contractEndDate
    } = req.body;

    // Generate company ID
    const [rows] = await connection.query(
      'SELECT company_id FROM panel_companies ORDER BY id DESC LIMIT 1'
    );

    let companyId = 'PC-001';
    if (rows.length > 0) {
      const lastId = parseInt(rows[0].company_id.split('-')[1]);
      companyId = `PC-${String(lastId + 1).padStart(3, '0')}`;
    }

    const [result] = await connection.query(
      'INSERT INTO panel_companies (company_id, company_name, status, address, contact_number, email, focal_person_name, designation, focal_contact_number, focal_email, contract_start_date, contract_end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [companyId, companyName, status, address, contactNumber, email, focalPersonName, designation, focalContactNumber, focalEmail, contractStartDate, contractEndDate]
    );

    res.status(201).json({ message: 'Panel company created successfully', companyId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

// Get all panel companies
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM panel_companies ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get panel company statistics
router.get('/statistics', async (req, res) => {
  try {
    const [totalResult] = await pool.query('SELECT COUNT(*) as total FROM panel_companies');
    const [activeResult] = await pool.query("SELECT COUNT(*) as active FROM panel_companies WHERE status = 'Active'");
    const [inactiveResult] = await pool.query("SELECT COUNT(*) as inactive FROM panel_companies WHERE status = 'Inactive'");
    const [outstandingResult] = await pool.query('SELECT SUM(outstanding) as total_outstanding FROM panel_companies');

    res.json({
      total: totalResult[0].total,
      active: activeResult[0].active,
      inactive: inactiveResult[0].inactive,
      outstanding: outstandingResult[0].total_outstanding || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single panel company
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM panel_companies WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Panel company not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update panel company
router.put('/:id', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      companyName,
      status,
      address,
      contactNumber,
      email,
      focalPersonName,
      designation,
      focalContactNumber,
      focalEmail,
      contractStartDate,
      contractEndDate
    } = req.body;

    const [result] = await connection.query(
      'UPDATE panel_companies SET company_name = ?, status = ?, address = ?, contact_number = ?, email = ?, focal_person_name = ?, designation = ?, focal_contact_number = ?, focal_email = ?, contract_start_date = ?, contract_end_date = ? WHERE id = ?',
      [companyName, status, address, contactNumber, email, focalPersonName, designation, focalContactNumber, focalEmail, contractStartDate, contractEndDate, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Panel company not found' });
    }

    res.json({ message: 'Panel company updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

// Delete panel company
router.delete('/:id', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query('DELETE FROM panel_companies WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Panel company not found' });
    }

    res.json({ message: 'Panel company deleted successfully' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        message: 'Cannot delete panel company as it has associated invoices'
      });
    }
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;