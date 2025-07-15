const mongoose = require('mongoose');

const SampleRegistrationSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true },
  registrationType: { type: String, enum: ['Self / Individual', 'Panel Company'], required: true },
  panelCompany: { type: String },
  senderDetails: {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    province: { type: String, required: true },
    division: { type: String, required: true },
    district: { type: String, required: true },
    streetNo: { type: String, required: true },
    area: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    cnic: { type: String, required: true },
    email: { type: String },
  },
  companyDetails: {
    companyName: { type: String },
    companyContact: { type: String },
    companyEmail: { type: String },
    companyAddress: { type: String },
  },
  focalPersonDetails: {
    name: { type: String },
    contactNumber: { type: String },
    designation: { type: String },
    email: { type: String },
  },
  deliveredVia: {
    method: { type: String, enum: ['Self', 'Authorized Person', 'Courier Service'], required: true },
    name: { type: String },
    cnic: { type: String },
    contactNumber: { type: String },
    streetNo: { type: String },
    area: { type: String },
    address: { type: String },
    companyName: { type: String },
    companyContact: { type: String },
    companyAddress: { type: String },
    parcelTrackingNumber: { type: String },
    dispatchDate: { type: Date },
    remarks: { type: String },
  },
  packagingDetails: {
    packagingType: { type: String, required: true },
    sealCondition: { type: String, required: true },
    packageType: { type: String, required: true },
    labelDetails: { type: String },
    packagingNotes: { type: String },
  },
  samples: [{
    sampleType: { type: String, required: true },
    tests: [{ testName: String, price: Number }],
    totalPrice: { type: Number, default: 0 },
  }],
  grandTotal: { type: Number, default: 0 },
});

module.exports = mongoose.model('SampleRegistration', SampleRegistrationSchema);