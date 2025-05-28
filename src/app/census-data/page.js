"use client";
import { useState, useEffect } from 'react';

export default function CensusData() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/census');
      const result = await response.json();
      if (result.success) {
        setRecords(result.data);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-black mb-8">Census Records</h1>
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record._id} className="bg-white text-black p-6 rounded-lg shadow">
              <h3 className="text-xl text-black font-semibold mb-2">
                Household #{record.householdNumber}
              </h3>
              <p><strong>Family Head:</strong> {record.familyHeadName}</p>
              <p><strong>Address:</strong> {record.address}, {record.barangay}</p>
              <p><strong>Members:</strong> {record.householdMembers.length + 1}</p>
              <p><strong>Submitted:</strong> {new Date(record.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}