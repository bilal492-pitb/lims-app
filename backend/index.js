const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config();

// First, let's try to connect as root to set up everything
const rootDb = mysql.createConnection({
  host: 'localhost',  // Explicitly use localhost
  user: 'root',
  password: 'root',   // Explicit password
  database: 'lims_db'
});

// ... rest of the code ...

// Now connect as lims_user
const db = mysql.createConnection({
  host: 'localhost',  // Explicitly use localhost
  user: 'lims_user',
  password: 'root',   // Explicit password
  database: 'lims_db'
});

rootDb.connect((rootErr) => {
  if (rootErr) {
    console.error('Failed to connect as root user:', rootErr);
    console.log('Attempting to connect as lims_user...');
    
    // If root connection fails, try with lims_user
    const db = mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: 'lims_user',
      password: process.env.DB_PASSWORD || 'root', // Use consistent password
      database: process.env.DB_NAME || 'lims_db'
    });

    db.connect((err) => {
      if (err) {
        console.error('Failed to connect as lims_user:', err);
        console.log('Please run the following commands in MySQL:');
        console.log('CREATE DATABASE IF NOT EXISTS lims_db;');
        console.log("CREATE USER 'lims_user'@'localhost' IDENTIFIED BY 'root';");
        console.log("GRANT ALL PRIVILEGES ON lims_db.* TO 'lims_user'@'localhost';");
        console.log('FLUSH PRIVILEGES;');
        process.exit(1);
      } else {
        console.log('Connected to MySQL Database as lims_user');
        // Create table if it doesn't exist
        db.query(`
          CREATE TABLE IF NOT EXISTS sample_registrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            registration_number VARCHAR(255) NOT NULL UNIQUE,
            registration_type ENUM('Self / Individual', 'Panel Company') NOT NULL,
            panel_company VARCHAR(255),
            sender_details JSON,
            company_details JSON,
            focal_person_details JSON,
            delivered_via JSON,
            packaging_details JSON,
            samples JSON,
            grand_total DECIMAL(10, 2) DEFAULT 0.00
          )
        `, (err) => {
          if (err) throw err;
          console.log('Table created or already exists');
        });
      }
    });
  } else {
    console.log('Connected to MySQL Database as root');
    
    // Create database
    rootDb.query('CREATE DATABASE IF NOT EXISTS lims_db', (err) => {
      if (err) throw err;
      
      // Use database
      rootDb.query('USE lims_db', (err) => {
        if (err) throw err;
        
        // Create user
        rootDb.query("CREATE USER IF NOT EXISTS 'lims_user'@'localhost' IDENTIFIED BY 'root'", (err) => {
          if (err) throw err;
          
          // Grant privileges
          rootDb.query("GRANT ALL PRIVILEGES ON lims_db.* TO 'lims_user'@'localhost'", (err) => {
            if (err) throw err;
            
            // Flush privileges
            rootDb.query('FLUSH PRIVILEGES', (err) => {
              if (err) throw err;
              
              console.log('Created and granted privileges to lims_user');
              
              // Now connect as lims_user
              const db = mysql.createConnection({
                host: process.env.DB_HOST || 'localhost',
                user: 'lims_user',
                password: process.env.DB_PASSWORD || 'root', // Consistent password
                database: process.env.DB_NAME || 'lims_db'
              });

              db.connect((err) => {
                if (err) {
                  console.error('Failed to connect as lims_user after setup:', err);
                  process.exit(1);
                }
                console.log('Connected to MySQL Database as lims_user');
                // Create table if it doesn't exist
                db.query(`
                  CREATE TABLE IF NOT EXISTS sample_registrations (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    registration_number VARCHAR(255) NOT NULL UNIQUE,
                    registration_type ENUM('Self / Individual', 'Panel Company') NOT NULL,
                    panel_company VARCHAR(255),
                    sender_details JSON,
                    company_details JSON,
                    focal_person_details JSON,
                    delivered_via JSON,
                    packaging_details JSON,
                    samples JSON,
                    grand_total DECIMAL(10, 2) DEFAULT 0.00
                  )
                `, (err) => {
                  if (err) throw err;
                  console.log('Table created or already exists');
                });
              });
            });
          });
        });
      });
    });
  }
});