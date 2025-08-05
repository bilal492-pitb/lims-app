const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'lims_db'
});

// Test Definitions
router.post('/definitions', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      testName,
      testCode,
      category,
      type,
      method,
      equipment,
      turnaroundTime,
      price,
      status
    } = req.body;

    const [result] = await connection.query(
      `INSERT INTO test_definitions (
        test_name, test_code, category_id, test_type,
        method, equipment, turnaround_time, price, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [testName, testCode, category, type, method, equipment, turnaroundTime, price, status || 'Active']
    );

    res.status(201).json({
      message: 'Test definition created successfully',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

router.get('/definitions', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT td.*, tc.category_name 
       FROM test_definitions td 
       LEFT JOIN test_categories tc ON td.category_id = tc.id 
       ORDER BY td.test_name`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Test Categories
router.post('/categories', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      categoryName,
      description,
      departmentType,
      status
    } = req.body;

    const [result] = await connection.query(
      'INSERT INTO test_categories (category_name, description, department_type, status) VALUES (?, ?, ?, ?)',
      [categoryName, description, departmentType, status || 'Active']
    );

    res.status(201).json({
      message: 'Test category created successfully',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM test_categories ORDER BY category_name');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Test Parameters
router.post('/parameters', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      testId,
      parameterName,
      unit,
      method,
      normalRange,
      criticalRange,
      remarks
    } = req.body;

    const [result] = await connection.query(
      `INSERT INTO test_parameters (
        test_id, parameter_name, unit, method,
        normal_range, critical_range, remarks
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [testId, parameterName, unit, method, normalRange, criticalRange, remarks]
    );

    res.status(201).json({
      message: 'Test parameter created successfully',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

router.get('/parameters', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT tp.*, td.test_name 
       FROM test_parameters tp 
       LEFT JOIN test_definitions td ON tp.test_id = td.id 
       ORDER BY td.test_name, tp.parameter_name`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reference Ranges
router.post('/reference-ranges', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      parameterId,
      ageGroup,
      gender,
      minValue,
      maxValue,
      unit,
      interpretation
    } = req.body;

    const [result] = await connection.query(
      `INSERT INTO reference_ranges (
        parameter_id, age_group, gender, min_value,
        max_value, unit, interpretation
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [parameterId, ageGroup, gender, minValue, maxValue, unit, interpretation]
    );

    res.status(201).json({
      message: 'Reference range created successfully',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

router.get('/reference-ranges', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT rr.*, tp.parameter_name, td.test_name 
       FROM reference_ranges rr 
       LEFT JOIN test_parameters tp ON rr.parameter_id = tp.id 
       LEFT JOIN test_definitions td ON tp.test_id = td.id 
       ORDER BY td.test_name, tp.parameter_name, rr.age_group`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;