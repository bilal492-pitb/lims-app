import React, { useState } from 'react';
import './SampleModal.css';

const SampleModal = ({ onClose, onAddSample }) => {
  const [sampleType, setSampleType] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);
  const tests = [
    { testName: 'Moisture Content', price: 500 },
    { testName: 'Protein Analysis', price: 1000 },
    { testName: 'Fat Content', price: 800 },
    // Add more tests as needed
  ];

  const handleTestChange = (test) => {
    setSelectedTests(prev => {
      if (prev.includes(test)) {
        return prev.filter(t => t !== test);
      }
      return [...prev, test];
    });
  };

  const totalPrice = selectedTests.reduce((sum, test) => sum + test.price, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sampleType || selectedTests.length === 0) {
      alert('Please select sample type and at least one test.');
      return;
    }
    onAddSample({ sampleType, tests: selectedTests, totalPrice });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add Sample</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Sample Type *</label>
            <input
              type="text"
              value={sampleType}
              onChange={(e) => setSampleType(e.target.value)}
              required
            />
          </div>
          <div>
            <h4>Select Tests</h4>
            {tests.map((test, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  checked={selectedTests.includes(test)}
                  onChange={() => handleTestChange(test)}
                />
                <label>{test.testName} (Rs. {test.price})</label>
              </div>
            ))}
          </div>
          <p>Total Price: Rs. {totalPrice}</p>
          <div className="modal-actions">
            <button type="submit">Add Sample</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SampleModal;