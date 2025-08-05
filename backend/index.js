const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const sampleRegistrationRoutes = require('./routes/sampleRegistration');
const panelCompaniesRoutes = require('./routes/panelCompanies');
const invoicesRoutes = require('./routes/invoices');
const eruInchargeRoutes = require('./routes/eruIncharge');
const testConfigurationRoutes = require('./routes/testConfiguration');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'lims_db'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL Database');
});

// Routes
app.use('/api/sample-registrations', sampleRegistrationRoutes);
app.use('/api/panel-companies', panelCompaniesRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/eru-incharge', eruInchargeRoutes);
app.use('/api/test-configuration', testConfigurationRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});