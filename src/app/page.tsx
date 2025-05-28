"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CensusRecord {
  _id: string;
  householdNumber: number;
  familyHeadName: string;
  address: string;
  sitio?: string;
  familyHeadAge: number;
  familyHeadSex: string;
  familyHeadCivilStatus: string;
  householdMembers?: any[];
  contactNumber?: string;
  hasDisabledMember?: string;
  hasSeniorCitizen?: string;
  hasPregnantMember?: string;
  hasSoloParent?: string;
  createdAt: string;
}

export default function CensusIndex() {
  const [censusData, setCensusData] = useState<CensusRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const router = useRouter();

  useEffect(() => {
    fetchCensusData();
  }, []);

  const fetchCensusData = async () => {
    try {
      const response = await fetch("/api/census");
      if (!response.ok) throw new Error("Failed to fetch census data");

      const json = await response.json();
      console.log("API response JSON:", json);

      // Adjust this to your actual API response structure
      if (json.success && Array.isArray(json.data)) {
        setCensusData(json.data);
      } else if (Array.isArray(json)) {
        setCensusData(json);
      } else {
        console.error("Unexpected data format:", json);
        setCensusData([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this census record?")) return;

    try {
      const response = await fetch(`/api/census/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete record");

      setCensusData(censusData.filter((item) => item._id !== id));
      alert("Record deleted successfully!");
    } catch (err) {
      alert("Error deleting record: " + (err as Error).message);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/census/edit/${id}`);
  };

  const filteredData = (censusData || []).filter(
    (record) =>
      record.familyHeadName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.householdNumber?.toString().includes(searchTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) return <div className="loading">Loading census data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="census-index">
      <style jsx>{`
        .census-index {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        /* ... rest of your CSS styles ... */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e0e0e0;
        }
        .header h1 {
          color: #333;
          margin: 0;
        }
        .add-button {
          background-color: #4caf50;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          transition: background-color 0.3s;
        }
        .add-button:hover {
          background-color: #45a049;
        }
        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .search-box {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          width: 300px;
          font-size: 16px;
        }
        .records-count {
          color: #666;
          font-size: 14px;
        }
        .table-container {
          overflow-x: auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .census-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .census-table th,
        .census-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }
        .census-table th {
          background-color: #f8f9fa;
          font-weight: bold;
          color: #333;
          position: sticky;
          top: 0;
          z-index: 1;
        }
        .census-table tr:hover {
          background-color: #f5f5f5;
        }
        .actions {
          display: flex;
          gap: 8px;
        }
        .btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: bold;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s;
        }
        .btn-view {
          background-color: #007bff;
          color: white;
        }
        .btn-view:hover {
          background-color: #0056b3;
        }
        .btn-edit {
          background-color: #ffc107;
          color: #212529;
        }
        .btn-edit:hover {
          background-color: #e0a800;
        }
        .btn-delete {
          background-color: #dc3545;
          color: white;
        }
        .btn-delete:hover {
          background-color: #c82333;
        }
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
          gap: 10px;
        }
        .pagination button {
          padding: 8px 12px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 4px;
        }
        .pagination button:hover:not(:disabled) {
          background-color: #f8f9fa;
        }
        .pagination button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        .pagination .active {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }
        .loading,
        .error {
          text-align: center;
          padding: 40px;
          font-size: 18px;
        }
        .error {
          color: #dc3545;
        }
        .no-data {
          text-align: center;
          padding: 40px;
          color: #666;
        }
        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: bold;
        }
        .status-yes {
          background-color: #d4edda;
          color: #155724;
        }
        .status-no {
          background-color: #f8d7da;
          color: #721c24;
        }
        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
          .controls {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }
          .search-box {
            width: 100%;
          }
          .census-table {
            font-size: 12px;
          }
          .census-table th,
          .census-table td {
            padding: 8px 4px;
          }
        }
      `}</style>

      <div className="header">
        <h1>Census Records</h1>
        <Link href="/census" className="add-button">
          + Add New Record
        </Link>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by household number, family head name, or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-box"
        />
        <div className="records-count">
          Showing {currentItems.length} of {filteredData.length} records
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="no-data">No records found.</div>
      ) : (
        <div className="table-container">
          <table className="census-table">
            <thead>
              <tr>
                <th>Household #</th>
                <th>Family Head</th>
                <th>Address</th>
                <th>Site</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Civil Status</th>
                <th>Disabled?</th>
                <th>Senior Citizen?</th>
                <th>Pregnant?</th>
                <th>Solo Parent?</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((record) => (
                <tr key={record._id}>
                  <td>{record.householdNumber}</td>
                  <td>{record.familyHeadName}</td>
                  <td>{record.address}</td>
                  <td>{record.sitio || "-"}</td>
                  <td>{record.familyHeadAge}</td>
                  <td>{record.familyHeadSex}</td>
                  <td>{record.familyHeadCivilStatus}</td>
                  <td>
                    <span
                      className={
                        record.hasDisabledMember === "Yes"
                          ? "status-badge status-yes"
                          : "status-badge status-no"
                      }
                    >
                      {record.hasDisabledMember || "No"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        record.hasSeniorCitizen === "Yes"
                          ? "status-badge status-yes"
                          : "status-badge status-no"
                      }
                    >
                      {record.hasSeniorCitizen || "No"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        record.hasPregnantMember === "Yes"
                          ? "status-badge status-yes"
                          : "status-badge status-no"
                      }
                    >
                      {record.hasPregnantMember || "No"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        record.hasSoloParent === "Yes"
                          ? "status-badge status-yes"
                          : "status-badge status-no"
                      }
                    >
                      {record.hasSoloParent || "No"}
                    </span>
                  </td>
                  <td className="actions">
                    <Link href={`/census/view/${record._id}`} className="btn btn-view">
                      View
                    </Link>
                    <button
                      onClick={() => handleEdit(record._id)}
                      className="btn btn-edit"
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(record._id)}
                      className="btn btn-delete"
                      type="button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {filteredData.length > itemsPerPage && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            aria-label="First Page"
          >
            {"<<"}
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            {"<"}
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
          >
            {">"}
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last Page"
          >
            {">>"}
          </button>
        </div>
      )}
    </div>
  );
}
