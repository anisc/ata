// frontend/src/components/Census.jsx
import React, { useState } from 'react';
import './Census.css';

function Census() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    age: '',
    sex: '',
    workStatus: '',
    tunisianCity: '',
    isFamily: false,
    familyMembers: [],
    occupation: '',
    settlingYear: '', // New field
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFamilyMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.familyMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData({ ...formData, familyMembers: updatedMembers });
  };

  const addFamilyMember = () => {
    setFormData({
      ...formData,
      familyMembers: [...formData.familyMembers, { age: '', sex: '', name: '' }],
    });
  };

  const removeFamilyMember = (index) => {
    const updatedMembers = [...formData.familyMembers];
    updatedMembers.splice(index, 1);
    setFormData({ ...formData, familyMembers: updatedMembers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setIsSuccess(true);
        setFormData({
          name: '',
          email: '',
          location: '',
          age: '',
          sex: '',
          workStatus: '',
          tunisianCity: '',
          isFamily: false,
          familyMembers: [],
          occupation: '',
          settlingYear: '', // Reset new field
        });
        localStorage.setItem('hasCompletedCensus', 'true');
      } else {
        setMessage(data.message || 'Error adding member.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('An error occurred. Please try again.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="container">
      <section className="census py-3">
        <h1 className="mb-2 text-center">Census</h1>

        <section className="benefits mb-3">
          <h2 className="mb-2">Information</h2>
          <ul>
            <li>Be part of the community</li>
            <li>Help us build a strong community</li>
          </ul>
        </section>

        <section className="stats mb-3">
          <h2 className="mb-2">Community Statistics</h2>
          <p>Statistics will go here...</p>
        </section>

        <section className="registration">
          <h2 className="mb-2">Registration</h2>
          <form onSubmit={handleSubmit} className="census-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location (City in Alberta):</label>
              <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="age">Age:</label>
              <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="sex">Sex:</label>
              <select id="sex" name="sex" value={formData.sex} onChange={handleChange} required>
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="workStatus">Work Status:</label>
              <select id="workStatus" name="workStatus" value={formData.workStatus} onChange={handleChange} required>
                <option value="">Select...</option>
                <option value="Work Permit">Work Permit</option>
                <option value="PR">Permanent Resident</option>
                <option value="Canadian Citizen">Canadian Citizen</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="tunisianCity">City in Tunisia:</label>
              <input type="text" id="tunisianCity" name="tunisianCity" value={formData.tunisianCity} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="isFamily">Are you registering as a family?</label>
              <input type="checkbox" id="isFamily" name="isFamily" checked={formData.isFamily} onChange={handleChange} />
            </div>

            {formData.isFamily && (
              <div className="family-members">
                <h3>Family Members</h3>
                {formData.familyMembers.map((member, index) => (
                  <div key={index} className="family-member">
                    <h4>Member {index + 1}</h4>
                    <div className="form-group">
                      <label htmlFor={`memberName${index}`}>Name:</label>
                      <input
                        type="text"
                        id={`memberName${index}`}
                        name={`memberName${index}`}
                        value={member.name}
                        onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`memberAge${index}`}>Age:</label>
                      <input
                        type="number"
                        id={`memberAge${index}`}
                        name={`memberAge${index}`}
                        value={member.age}
                        onChange={(e) => handleFamilyMemberChange(index, 'age', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`memberSex${index}`}>Sex:</label>
                      <select
                        id={`memberSex${index}`}
                        name={`memberSex${index}`}
                        value={member.sex}
                        onChange={(e) => handleFamilyMemberChange(index, 'sex', e.target.value)}
                      >
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <button type="button" onClick={() => removeFamilyMember(index)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addFamilyMember}>
                  Add Family Member
                </button>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="occupation">Occupation (Optional):</label>
              <input type="text" id="occupation" name="occupation" value={formData.occupation} onChange={handleChange} />
            </div>

            {/* New Field: Year of Settling in Alberta */}
            <div className="form-group">
              <label htmlFor="settlingYear">Year of Settling in Alberta:</label>
              <input
                type="number"
                id="settlingYear"
                name="settlingYear"
                value={formData.settlingYear}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit">Register</button>
          </form>
          {message && <p className={`message ${isSuccess ? 'success' : 'error'}`}>{message}</p>}
        </section>
      </section>
    </div>
  );
}

export default Census;
