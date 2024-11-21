import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  document.title = "0827CS211034";

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        throw new Error('Invalid data format');
      }

      const formData = new FormData();
      formData.append('data', JSON.stringify(parsedInput.data));
      if (file) {
        formData.append('file', file);
      }

      const res = await axios.post('https://bajaj-backend-eetm.onrender.com/bfhl', formData);
      setResponse(res.data);
      setError('');
      console.log(res.data);
    } catch (err) {
      setError('Invalid JSON format');
      console.error('Error fetching data:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    setSelectedFilters(prev =>
      checked ? [...prev, value] : prev.filter(filter => filter !== value)
    );
  };

  const renderResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, file_details, highest_lowercase, has_prime } = response;
    const filteredData = {
      Numbers: `Numbers: ${numbers.join(', ')}. Contains Prime: ${has_prime ? 'Yes' : 'No'}`,
      Alphabets: `Alphabets: ${alphabets.join(', ')}. Highest Lowercase: ${highest_lowercase}`,
      'File Details': file_details ? `MIME Type: ${file_details.mime_type}, Size: ${file_details.size_kb.toFixed(2)} KB` : 'No file uploaded'
    };

    return selectedFilters.map(filter => (
      <div key={filter}>
        <h3>{filter}</h3>
        <p>{filteredData[filter]}</p>
      </div>
    ));
  };

  return (
    <div className="App">
      <h1>Bajaj Finserv Health Dev Challenge</h1>
      <textarea
        rows="10"
        cols="50"
        value={jsonInput}
        onChange={handleInputChange}
        placeholder='Enter JSON data here'
      />
      <br />
      <input type="file" onChange={handleFileChange} />
      <br />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <h2>Filters</h2>
        <label>
          <input
            type="checkbox"
            value="Numbers"
            onChange={handleFilterChange}
          />
          Numbers
        </label>
        <label>
          <input
            type="checkbox"
            value="Alphabets"
            onChange={handleFilterChange}
          />
          Alphabets
        </label>
        <label>
          <input
            type="checkbox"
            value="File Details"
            onChange={handleFilterChange}
          />
          File Details
        </label>
      </div>
      <div>
        <h2>Response</h2>
        {renderResponse()}
      </div>
    </div>
  );
}

export default App;