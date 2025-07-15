const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lims_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    console.log('Attempting to connect as root user...');
    
    // Try connecting as root user
    const rootDb = mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: 'root',
      password: '',
      database: process.env.DB_NAME || 'lims_db'
    });
    
    rootDb.connect((rootErr) => {
      if (rootErr) {
        console.error('Failed to connect as root user:', rootErr);
        console.log('Please check your MySQL credentials in the .env file');
        process.exit(1);
      } else {
        console.log('Connected to MySQL Database as root');
        // Create the user if it doesn't exist
        rootDb.query(`
          CREATE USER IF NOT EXISTS 'lims_user'@'localhost' IDENTIFIED BY 'root';
          GRANT ALL PRIVILEGES ON lims_db.* TO 'lims_user'@'localhost';
          FLUSH PRIVILEGES;
        `, (grantErr) => {
          if (grantErr) {
            console.error('Error granting privileges:', grantErr);
            process.exit(1);
          } else {
            console.log('Created and granted privileges to lims_user');
            process.exit(0);
          }
        });
      }
    });
  } else {
    console.log('Connected to MySQL Database');
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

// Basic route
app.get('/', (req, res) => res.send('LIMS Backend Running'));

// Mount routes
const sampleRegistrationRoutes = require('./routes/sampleRegistration');
app.use('/api/registrations', sampleRegistrationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));