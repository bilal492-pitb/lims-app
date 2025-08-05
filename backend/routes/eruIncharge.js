const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'lims_db'
});

// Get all sample registrations for ERU Incharge
router.get('/samples', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT sr.*, pc.company_name as panel_company_name 
       FROM sample_registrations sr 
       LEFT JOIN panel_companies pc ON sr.panel_company = pc.id 
       WHERE sr.status = 'Pending' 
       ORDER BY sr.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve samples
router.post('/samples/approve', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { sampleIds, handedOverTo } = req.body;

    if (!Array.isArray(sampleIds) || sampleIds.length === 0) {
      return res.status(400).json({ message: 'No samples selected for approval' });
    }

    await connection.beginTransaction();

    // Update sample status and add handed over information
    const [result] = await connection.query(
      `UPDATE sample_registrations 
       SET status = 'Approved', 
           handed_over_to = ?,
           handed_over_date = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP 
       WHERE id IN (?) AND status = 'Pending'`,
      [handedOverTo, sampleIds]
    );

    await connection.commit();

    res.json({
      message: 'Samples approved successfully',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

// Reject samples
router.post('/samples/reject', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { sampleIds, rejectionReason } = req.body;

    if (!Array.isArray(sampleIds) || sampleIds.length === 0) {
      return res.status(400).json({ message: 'No samples selected for rejection' });
    }

    await connection.beginTransaction();

    // Update sample status and add rejection reason
    const [result] = await connection.query(
      `UPDATE sample_registrations 
       SET status = 'Rejected', 
           rejection_reason = ?,
           rejection_date = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP 
       WHERE id IN (?) AND status = 'Pending'`,
      [rejectionReason, sampleIds]
    );

    await connection.commit();

    res.json({
      message: 'Samples rejected successfully',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

// Get sample details
router.get('/samples/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT sr.*, pc.company_name as panel_company_name 
       FROM sample_registrations sr 
       LEFT JOIN panel_companies pc ON sr.panel_company = pc.id 
       WHERE sr.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Sample not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;