// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    pwd: 0,
    soloParent: 0,
    seniorCitizen: 0,
    pregnant: 0,
    households: 0,
    incomeDistribution: [],
    educationDistribution: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await fetch("/api/census/stats");
        if (!res.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await res.json();
        setStats({
          pwd: data.pwd || 0,
          soloParent: data.soloParent || 0,
          seniorCitizen: data.seniorCitizen || 0,
          pregnant: data.pregnant || 0,
          households: data.households || 0,
          incomeDistribution: data.incomeDistribution || [],
          educationDistribution: data.educationDistribution || [],
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  // Safe number formatting function
  const formatNumber = (num) => {
    return (num || 0).toLocaleString();
  };

  const chartData = [
    { name: "PWD", count: stats.pwd || 0 },
    { name: "Solo Parent", count: stats.soloParent || 0 },
    { name: "Senior Citizen", count: stats.seniorCitizen || 0 },
    { name: "Pregnant", count: stats.pregnant || 0 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading census data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Census Dashboard
          </h1>
          <p className="text-gray-600">
            Overview of community demographics and statistics
          </p>
        </div>

        {/* Total Households - Featured Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Total Households</h2>
                <p className="text-blue-100">Registered in the census</p>
              </div>
              <div className="text-right">
                <p className="text-5xl font-bold">{formatNumber(stats.households)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Demographics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.pwd)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">PWD</h3>
            <p className="text-gray-600 text-sm">Persons with Disabilities</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <div className="w-6 h-6 bg-green-600 rounded"></div>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.soloParent)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Solo Parent</h3>
            <p className="text-gray-600 text-sm">Single parent households</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <div className="w-6 h-6 bg-purple-600 rounded"></div>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.seniorCitizen)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Senior Citizen</h3>
            <p className="text-gray-600 text-sm">Ages 60 and above</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pink-100 rounded-lg">
                <div className="w-6 h-6 bg-pink-600 rounded"></div>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.pregnant)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Pregnant</h3>
            <p className="text-gray-600 text-sm">Expecting mothers</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-8">
          {/* Demographics Bar Chart */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Demographics Overview
              </h2>
              <p className="text-gray-600">
                Visual representation of community demographics
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis 
                    allowDecimals={false} 
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Income Distribution Chart */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Monthly Income Distribution
              </h2>
              <p className="text-gray-600">
                Household income ranges across the community
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={stats.incomeDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="income" 
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis 
                    allowDecimals={false} 
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Education Distribution Chart */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Educational Attainment Distribution
              </h2>
              <p className="text-gray-600">
                Education levels within the community
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={stats.educationDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="education" 
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis 
                    allowDecimals={false} 
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}