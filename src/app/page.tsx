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
  <div className="max-w-7xl mx-auto p-5 font-sans bg-white text-gray-800 min-h-screen">
    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-2 border-gray-200 pb-5">
      <h1 className="text-3xl font-semibold text-gray-900">Census Records</h1>
      <Link
        href="/census"
        className="mt-4 md:mt-0 inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300"
      >
        + Add New Record
      </Link>
    </div>

    {/* Controls */}
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <input
        type="text"
        placeholder="Search by household number, family head name, or address..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <div className="text-gray-600 text-sm">
        Showing {currentItems.length} of {filteredData.length} records
      </div>
    </div>

    {/* No data message */}
    {filteredData.length === 0 ? (
      <div className="text-center py-20 text-gray-500 text-lg">No records found.</div>
    ) : (
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {[
                "Household #",
                "Family Head",
                "Address",
                "Site",
                "Age",
                "Sex",
                "Civil Status",
                "Disabled?",
                "Senior Citizen?",
                "Pregnant?",
                "Solo Parent?",
                "Actions",
              ].map((header) => (
                <th key={header} className="px-4 py-3 font-semibold border-b border-gray-300">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((record) => (
              <tr
                key={record._id}
                className="hover:bg-gray-50 border-b border-gray-200"
              >
                <td className="px-4 py-3">{record.householdNumber}</td>
                <td className="px-4 py-3">{record.familyHeadName}</td>
                <td className="px-4 py-3">{record.address}</td>
                <td className="px-4 py-3">{record.sitio || "-"}</td>
                <td className="px-4 py-3">{record.familyHeadAge}</td>
                <td className="px-4 py-3">{record.familyHeadSex}</td>
                <td className="px-4 py-3">{record.familyHeadCivilStatus}</td>

                {["hasDisabledMember", "hasSeniorCitizen", "hasPregnantMember", "hasSoloParent"].map(
                  (field) => {
                    const val = record[field] || "No";
                    const isYes = val === "Yes";
                    return (
                      <td key={field} className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            isYes
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {val}
                        </span>
                      </td>
                    );
                  }
                )}

                <td className="px-4 py-3 flex gap-2">
                  <Link
                    href={`/census/view/${record._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleEdit(record._id)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-xs font-semibold px-3 py-1 rounded"
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(record._id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded"
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

    {/* Pagination */}
    {filteredData.length > itemsPerPage && (
      <div className="flex justify-center items-center mt-6 gap-3">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          aria-label="First Page"
          className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          {"<<"}
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          aria-label="Previous Page"
          className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          {"<"}
        </button>

        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
          className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          {">"}
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last Page"
          className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          {">>"}
        </button>
      </div>
    )}
  </div>
);
