const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root'
});

const createDatabase = `CREATE DATABASE IF NOT EXISTS lims_db`;

const createSampleRegistrationsTable = `
  CREATE TABLE IF NOT EXISTS sample_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(255) UNIQUE NOT NULL,
    registration_type VARCHAR(50) NOT NULL,
    panel_company VARCHAR(255),
    sender_details JSON,
    company_details JSON,
    focal_person_details JSON,
    delivered_via JSON,
    packaging_details JSON,
    samples JSON,
    grand_total DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'Pending',
    payment_status VARCHAR(20) DEFAULT 'Not Paid',
    amount_received DECIMAL(10,2) DEFAULT 0.00,
    payment_date DATE,
    transaction_id VARCHAR(255),
    payment_remarks TEXT,
    eru_incharge_approval VARCHAR(20) DEFAULT 'Pending',
    eru_approval_date TIMESTAMP,
    eru_remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const createPanelCompaniesTable = `
  CREATE TABLE IF NOT EXISTS panel_companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id VARCHAR(10) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    address TEXT,
    contact_number VARCHAR(20),
    email VARCHAR(255),
    focal_person_name VARCHAR(255),
    designation VARCHAR(100),
    focal_contact_number VARCHAR(20),
    focal_email VARCHAR(255),
    contract_start_date DATE,
    contract_end_date DATE,
    outstanding DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

const createInvoicesTable = `
  CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_id VARCHAR(20) UNIQUE NOT NULL,
    document_type VARCHAR(20) NOT NULL,
    panel_company INT NOT NULL,
    period VARCHAR(7) NOT NULL,
    payment_due_date DATE NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    additional_notes TEXT,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (panel_company) REFERENCES panel_companies(id)
  )
`;

const createTestCategoriesTable = `
  CREATE TABLE IF NOT EXISTS test_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    description TEXT,
    department_type ENUM('Food', 'Agriculture', 'Drug') NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

const createTestDefinitionsTable = `
  CREATE TABLE IF NOT EXISTS test_definitions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_name VARCHAR(255) NOT NULL,
    test_code VARCHAR(50) UNIQUE NOT NULL,
    category_id INT NOT NULL,
    test_type ENUM('Microbiological', 'Biochemical') NOT NULL,
    method TEXT,
    equipment VARCHAR(255),
    turnaround_time VARCHAR(50),
    price DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES test_categories(id)
  )
`;

const createTestParametersTable = `
  CREATE TABLE IF NOT EXISTS test_parameters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    parameter_name VARCHAR(255) NOT NULL,
    unit VARCHAR(50),
    method TEXT,
    normal_range VARCHAR(100),
    critical_range VARCHAR(100),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES test_definitions(id)
  )
`;

const createReferenceRangesTable = `
  CREATE TABLE IF NOT EXISTS reference_ranges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parameter_id INT NOT NULL,
    age_group VARCHAR(50),
    gender ENUM('Male', 'Female', 'Both') DEFAULT 'Both',
    min_value DECIMAL(10,4),
    max_value DECIMAL(10,4),
    unit VARCHAR(50),
    interpretation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parameter_id) REFERENCES test_parameters(id)
  )
`;

const createDraftsTable = `
  CREATE TABLE IF NOT EXISTS drafts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(255) UNIQUE NOT NULL,
    draft_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

// Create database and tables
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL server');

  // Create database
  db.query(createDatabase, (err) => {
    if (err) throw err;
    console.log('Database created');

    // Switch to lims_db
    db.query('USE lims_db', (err) => {
      if (err) throw err;
      console.log('Using lims_db');

      // Create tables
      db.query(createSampleRegistrationsTable, (err) => {
        if (err) throw err;
        console.log('Sample registrations table created');

        db.query(createPanelCompaniesTable, (err) => {
          if (err) throw err;
          console.log('Panel companies table created');

          db.query(createInvoicesTable, (err) => {
            if (err) throw err;
            console.log('Invoices table created');

            db.query(createTestCategoriesTable, (err) => {
              if (err) throw err;
              console.log('Test categories table created');

              db.query(createTestDefinitionsTable, (err) => {
                if (err) throw err;
                console.log('Test definitions table created');

                db.query(createTestParametersTable, (err) => {
                  if (err) throw err;
                  console.log('Test parameters table created');

                  db.query(createReferenceRangesTable, (err) => {
                    if (err) throw err;
                    console.log('Reference ranges table created');

                    db.query(createDraftsTable, (err) => {
                      if (err) throw err;
                      console.log('Drafts table created');
                      db.end();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});