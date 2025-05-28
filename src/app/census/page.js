"use client";
import React, { useState, useRef } from 'react';
import { User, Home, Users, Briefcase, GraduationCap, Heart, Phone, MapPin } from 'lucide-react';


export default function BarangayCensusForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const memberIdCounter = useRef(0);
  const [formData, setFormData] = useState({
    // Household Information
    householdNumber: '',
    address: '',
    sitio: '',
    barangay: '',
    municipality: '',
    province: '',
    
    // Family Head Information
    familyHeadName: '',
    familyHeadAge: '',
    familyHeadSex: '',
    familyHeadCivilStatus: '',
    familyHeadOccupation: '',
    familyHeadIncome: '',
    familyHeadEducation: '',
    familyHeadReligion: '',
    familyHeadSector: '',
    
    // Household Members
    householdMembers: [],
    
    // Housing Information
    houseType: '',
    roofMaterial: '',
    wallMaterial: '',
    floorMaterial: '',
    waterSource: '',
    toiletFacility: '',
    electricitySource: '',
    cookingFuel: '',
    
    // Contact Information
    contactNumber: '',
    emergencyContact: '',
    
    // Additional Information
    hasDisabledMember: '',
    hasSeniorCitizen: '',
    hasPregnantMember: '',
    hasSoloParent: '',
    additionalNotes: ''
  });

  const [newMember, setNewMember] = useState({
    name: '',
    relationship: '',
    age: '',
    sex: '',
    civilStatus: '',
    occupation: '',
    education: '',
    monthlyIncome: '',
    sector: ''
  });

  const totalSteps = 5;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMemberChange = (field, value) => {
    setNewMember(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addMember = () => {
    if (newMember.name && newMember.relationship && newMember.age) {
      memberIdCounter.current += 1;
      setFormData(prev => ({
        ...prev,
        householdMembers: [...prev.householdMembers, { ...newMember, id: memberIdCounter.current }]
      }));
      setNewMember({
        name: '',
        relationship: '',
        age: '',
        sex: '',
        civilStatus: '',
        occupation: '',
        education: '',
        monthlyIncome: ''
      });
    }
  };

  const removeMember = (id) => {
    setFormData(prev => ({
      ...prev,
      householdMembers: prev.householdMembers.filter(member => member.id !== id)
    }));
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Show loading state
      const submitButton = e.target.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Saving...';
      submitButton.disabled = true;
      
      const response = await fetch('/api/census', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Census form submitted successfully! Data has been saved to the database.');
        // Reset form
        setFormData({
          householdNumber: '',
          address: '',
          sitio: '',
          barangay: '',
          municipality: '',
          province: '',
          familyHeadName: '',
          familyHeadAge: '',
          familyHeadSex: '',
          familyHeadCivilStatus: '',
          familyHeadOccupation: '',
          familyHeadIncome: '',
          familyHeadEducation: '',
          familyHeadReligion: '',
          familyHeadSector: '',
          householdMembers: [],
          houseType: '',
          roofMaterial: '',
          wallMaterial: '',
          floorMaterial: '',
          waterSource: '',
          toiletFacility: '',
          electricitySource: '',
          cookingFuel: '',
          contactNumber: '',
          emergencyContact: '',
          hasDisabledMember: '',
          hasSeniorCitizen: '',
          hasPregnantMember: '',
          hasSoloParent: '',
          additionalNotes: ''
        });
        setCurrentStep(1);
      } else {
        throw new Error(result.error || 'Failed to save census data');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error saving census form: ' + error.message);
    } finally {
      // Reset button state
      const submitButton = e.target.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Household Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Household Number *
                </label>
                <input
                  type="text"
                  value={formData.householdNumber || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 bg-gray-100 text-black rounded-md focus:outline-none cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Sitio/Purok
                </label>
                <input
                  type="text"
                  value={formData.sitio}
                  onChange={(e) => handleInputChange('sitio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Complete Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Family Head Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.familyHeadName}
                  onChange={(e) => handleInputChange('familyHeadName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  value={formData.familyHeadAge}
                  onChange={(e) => handleInputChange('familyHeadAge', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Sex *
                </label>
                <select
                  value={formData.familyHeadSex}
                  onChange={(e) => handleInputChange('familyHeadSex', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Civil Status *
                </label>
                <select
                  value={formData.familyHeadCivilStatus}
                  onChange={(e) => handleInputChange('familyHeadCivilStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                  <option value="Live-in">Live-in</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Occupation
                </label>
                <select
                  value={formData.familyHeadOccupation}
                  onChange={(e) => handleInputChange('familyHeadOccupation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Occupation</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Fisherman">Fisherman</option>
                  <option value="Laborer">Laborer</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Tricycle Driver">Tricycle Driver</option>
                  <option value="Construction Worker">Construction Worker</option>
                  <option value="Government Employee">Government Employee</option>
                  <option value="Private Employee">Private Employee</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Student">Student</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="Other">Other (please specify)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Monthly Income
                </label>
                <select
                  value={formData.familyHeadIncome}
                  onChange={(e) => handleInputChange('familyHeadIncome', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Range</option>
                  <option value="Below ₱5,000">Below ₱5,000</option>
                  <option value="₱5,000 - ₱10,000">₱5,000 - ₱10,000</option>
                  <option value="₱10,001 - ₱20,000">₱10,001 - ₱20,000</option>
                  <option value="₱20,001 - ₱30,000">₱20,001 - ₱30,000</option>
                  <option value="₱30,001 - ₱50,000">₱30,001 - ₱50,000</option>
                  <option value="Above ₱50,000">Above ₱50,000</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Highest Educational Attainment
                </label>
                <select
                  value={formData.familyHeadEducation}
                  onChange={(e) => handleInputChange('familyHeadEducation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="No formal education">No formal education</option>
                  <option value="Elementary level">Elementary level</option>
                  <option value="Elementary graduate">Elementary graduate</option>
                  <option value="High school level">High school level</option>
                  <option value="High school graduate">High school graduate</option>
                  <option value="College level">College level</option>
                  <option value="College graduate">College graduate</option>
                  <option value="Post graduate">Post graduate</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Sector
                </label>
                <select
                  value={formData.familyHeadSector}
                  onChange={(e) => handleInputChange('familyHeadSector', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Regular">Regular</option>
                  <option value="PWD">PWD</option>
                  <option value="Senior Citizen">Senior Citizen</option>
                  <option value="Solo Parent">Solo Parent</option>
                  <option value="Pregnant">Pregnant</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Religion
                </label>
                <input
                  type="text"
                  value={formData.familyHeadReligion}
                  onChange={(e) => handleInputChange('familyHeadReligion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Household Members</h2>
            </div>
            
            {/* Add New Member Form */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-4">Add Household Member</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => handleMemberChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Relationship to Head *
                  </label>
                  <select
                    value={newMember.relationship}
                    onChange={(e) => handleMemberChange('relationship', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Grandchild">Grandchild</option>
                    <option value="Other relative">Other relative</option>
                    <option value="Non-relative">Non-relative</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={newMember.age}
                    onChange={(e) => handleMemberChange('age', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Sex
                  </label>
                  <select
                    value={newMember.sex}
                    onChange={(e) => handleMemberChange('sex', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Civil Status
                  </label>
                  <select
                    value={newMember.civilStatus}
                    onChange={(e) => handleMemberChange('civilStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                    <option value="Live-in">Live-in</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={newMember.occupation}
                    onChange={(e) => handleMemberChange('occupation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Sector
                  </label>
                  <select
                    value={newMember.sector}
                    onChange={(e) => handleMemberChange('sector', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="Regular">Regular</option>
                    <option value="PWD">PWD</option>
                    <option value="Senior Citizen">Senior Citizen</option>
                    <option value="Solo Parent">Solo Parent</option>
                    <option value="Pregnant">Pregnant</option>
                  </select>
                </div>
              
              <button
                type="button"
                onClick={addMember}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Add Member
              </button>
            </div>
            
            {/* Members List */}
            {formData.householdMembers.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Household Members ({formData.householdMembers.length})</h3>
                <div className="space-y-3">
                  {formData.householdMembers.map((member) => (
                    <div key={member.id} className="bg-white border border-gray-200 text-black p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-600">
                          {member.relationship} • Age {member.age} • {member.sex}
                        </div>
                        {member.occupation && (
                          <div className="text-sm text-gray-600">
                            Occupation: {member.occupation}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Home className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Housing Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Type of House
                </label>
                <select
                  value={formData.houseType}
                  onChange={(e) => handleInputChange('houseType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Single detached">Single detached</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Multi-unit residential">Multi-unit residential</option>
                  <option value="Commercial/residential">Commercial/residential</option>
                  <option value="Institutional living quarter">Institutional living quarter</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Roof Material
                </label>
                <select
                  value={formData.roofMaterial}
                  onChange={(e) => handleInputChange('roofMaterial', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Galvanized iron/Aluminum">Galvanized iron/Aluminum</option>
                  <option value="Tile/Clay tile">Tile/Clay tile</option>
                  <option value="Concrete">Concrete</option>
                  <option value="Wood">Wood</option>
                  <option value="Cogon/Nipa/Anahaw">Cogon/Nipa/Anahaw</option>
                  <option value="Asbestos">Asbestos</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Wall Material
                </label>
                <select
                  value={formData.wallMaterial}
                  onChange={(e) => handleInputChange('wallMaterial', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Concrete/Brick/Stone">Concrete/Brick/Stone</option>
                  <option value="Wood">Wood</option>
                  <option value="Galvanized iron/Aluminum">Galvanized iron/Aluminum</option>
                  <option value="Bamboo">Bamboo</option>
                  <option value="Cogon/Nipa/Anahaw">Cogon/Nipa/Anahaw</option>
                  <option value="Mixed materials">Mixed materials</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Floor Material
                </label>
                <select
                  value={formData.floorMaterial}
                  onChange={(e) => handleInputChange('floorMaterial', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Marble/Granite">Marble/Granite</option>
                  <option value="Tiles/Ceramics">Tiles/Ceramics</option>
                  <option value="Cement">Cement</option>
                  <option value="Wood">Wood</option>
                  <option value="Bamboo">Bamboo</option>
                  <option value="Earth/Sand">Earth/Sand</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Water Source
                </label>
                <select
                  value={formData.waterSource}
                  onChange={(e) => handleInputChange('waterSource', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Piped water inside">Piped water inside</option>
                  <option value="Piped water outside">Piped water outside</option>
                  <option value="Deep well">Deep well</option>
                  <option value="Shallow well">Shallow well</option>
                  <option value="Spring/River/Lake">Spring/River/Lake</option>
                  <option value="Rainwater">Rainwater</option>
                  <option value="Peddler">Peddler</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Toilet Facility
                </label>
                <select
                  value={formData.toiletFacility}
                  onChange={(e) => handleInputChange('toiletFacility', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Water sealed, used exclusively">Water sealed, used exclusively</option>
                  <option value="Water sealed, shared">Water sealed, shared</option>
                  <option value="Closed pit">Closed pit</option>
                  <option value="Open pit">Open pit</option>
                  <option value="Other">Other</option>
                  <option value="None">None</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Electricity Source
                </label>
                <select
                  value={formData.electricitySource}
                  onChange={(e) => handleInputChange('electricitySource', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Electricity from private utility">Electricity from private utility</option>
                  <option value="Electricity from NAPOCOR">Electricity from NAPOCOR</option>
                  <option value="Generator">Generator</option>
                  <option value="Solar panel">Solar panel</option>
                  <option value="Battery">Battery</option>
                  <option value="Kerosene lamp">Kerosene lamp</option>
                  <option value="Candle">Candle</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Cooking Fuel
                </label>
                <select
                  value={formData.cookingFuel}
                  onChange={(e) => handleInputChange('cookingFuel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Liquefied petroleum gas">Liquefied petroleum gas</option>
                  <option value="Kerosene">Kerosene</option>
                  <option value="Charcoal">Charcoal</option>
                  <option value="Wood">Wood</option>
                  <option value="Coconut husk">Coconut husk</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Phone className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Contact & Additional Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Special Categories</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Has disabled member?
                  </label>
                  <select
                    value={formData.hasDisabledMember}
                    onChange={(e) => handleInputChange('hasDisabledMember', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Has senior citizen?
                  </label>
                  <select
                    value={formData.hasSeniorCitizen}
                    onChange={(e) => handleInputChange('hasSeniorCitizen', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Has pregnant member?
                  </label>
                  <select
                    value={formData.hasPregnantMember}
                    onChange={(e) => handleInputChange('hasPregnantMember', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Has solo parent?
                  </label>
                  <select
                    value={formData.hasSoloParent}
                    onChange={(e) => handleInputChange('hasSoloParent', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional information about the household..."
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Barangay Census Form
            </h1>
            <p className="text-gray-600">
              Complete household information and demographics survey
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm text-gray-600">{currentStep} of {totalSteps}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  currentStep === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                Previous
              </button>

              {currentStep === totalSteps ? (
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                >
                  Submit Census Form
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>

  );
}