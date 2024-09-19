import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath';
import { ThreeCircles } from 'react-loader-spinner';

const AddFirm = () => {
  const [firmName, setFirmName] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState([]);
  const [region, setRegion] = useState([]);
  const [offer, setOffer] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); 
  const [successMessage, setSuccessMessage] = useState(null); 

  
  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setCategory(category.includes(value) ? category.filter(item => item !== value) : [...category, value]);
  };

  
  const handleRegionChange = (event) => {
    const value = event.target.value;
    setRegion(region.includes(value) ? region.filter(item => item !== value) : [...region, value]);
  };

  
  const handleImageUpload = (event) => {
    const selectedImage = event.target.files[0];
    setFile(selectedImage);
  };

  
  const validateForm = () => {
    if (!firmName || !area || !offer || !file || category.length === 0 || region.length === 0) {
      setErrorMessage('Please fill all required fields.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  
  const handleFirmSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; 

    setLoading(true);
    setSuccessMessage(null); 

    try {
      const loginToken = localStorage.getItem('loginToken');
      if (!loginToken) {
        setErrorMessage('User not authenticated.');
        return;
      }

      const formData = new FormData();
      formData.append('firmName', firmName);
      formData.append('area', area);
      formData.append('offer', offer);
      formData.append('image', file);
      category.forEach((value) => formData.append('category', value));
      region.forEach((value) => formData.append('region', value));

      const response = await fetch(`${API_URL}/firm/add-firm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${loginToken}`, 
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Reset the form and show success message
        setFirmName('');
        setArea('');
        setCategory([]);
        setRegion([]);
        setOffer('');
        setFile(null);
        alert('Firm added successfully!');
        const firmId = data.firmId;
        const vendorFirmName = data.vendorFirmName;
        localStorage.setItem('firmId', firmId);
        localStorage.setItem('firmName', vendorFirmName);
      } else if (data.message === 'vendor can have only one firm') {
        setErrorMessage('Firm Exists. Only one firm can be added.');
      } else {
        setErrorMessage('Failed to add Firm.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while adding the Firm.');
      console.error('Error adding firm:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="firmSection">
      {loading && (
        <div className="loaderSection">
          <ThreeCircles
            visible={loading}
            height={100}
            width={100}
            color="#4fa94d"
            ariaLabel="three-circles-loading"
          />
        </div>
      )}

      {!loading && (
        <form className="tableForm" onSubmit={handleFirmSubmit}>
          <h3>Add Firm</h3>
          {errorMessage && <div className="errorMessage">{errorMessage}</div>}
          {successMessage && <div className="successMessage">{successMessage}</div>}
          <label>Firm Name</label>
          <input type="text" name="firmName" value={firmName} onChange={(e) => setFirmName(e.target.value)} />

          <label>Area</label>
          <input type="text" name="area" value={area} onChange={(e) => setArea(e.target.value)} />

          <div className="checkInp">
            <label>Category</label>
            <div className="inputsContainer">
              <div className="checboxContainer">
                <label>Veg</label>
                <input type="checkbox" checked={category.includes('veg')} value="veg" onChange={handleCategoryChange} />
              </div>
              <div className="checboxContainer">
                <label>Non-Veg</label>
                <input type="checkbox" checked={category.includes('non-veg')} value="non-veg" onChange={handleCategoryChange} />
              </div>
            </div>
          </div>

          <label>Offer</label>
          <input type="text" name="offer" value={offer} onChange={(e) => setOffer(e.target.value)} />

          <div className="checkInp">
            <label>Region</label>
            <div className="inputsContainer">
              <div className="regBoxContainer">
                <label>South Indian</label>
                <input type="checkbox" value="south-indian" checked={region.includes('south-indian')} onChange={handleRegionChange} />
              </div>
              <div className="regBoxContainer">
                <label>North Indian</label>
                <input type="checkbox" value="north-indian" checked={region.includes('north-indian')} onChange={handleRegionChange} />
              </div>
              <div className="regBoxContainer">
                <label>Chinese</label>
                <input type="checkbox" value="chinese" checked={region.includes('chinese')} onChange={handleRegionChange} />
              </div>
              <div className="regBoxContainer">
                <label>Bakery</label>
                <input type="checkbox" value="bakery" checked={region.includes('bakery')} onChange={handleRegionChange} />
              </div>
            </div>
          </div>

          <label>Firm Image</label>
          <input type="file" onChange={handleImageUpload} />

          <div className="btnSubmit">
            <button type="submit">Submit</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddFirm;
