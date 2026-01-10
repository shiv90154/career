import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    filterMaterials();
  }, [searchTerm, selectedType, materials]);

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

 const fetchMaterials = async () => {
  try {
    setLoading(true);

    const response = await axios.get('/api/student/materials');

    console.log('MATERIALS API RESPONSE:', response.data);

    // ✅ Normalize response → ALWAYS array
    const data =
      Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.materials)
        ? response.data.materials
        : Array.isArray(response.data.data)
        ? response.data.data
        : [];

    setMaterials(data);
    setFilteredMaterials(data);
  } catch (err) {
    console.error(err);
    showNotification('Failed to load materials', 'error');
    setMaterials([]);
    setFilteredMaterials([]);
  } finally {
    setLoading(false);
  }
};


 const filterMaterials = () => {
  if (!Array.isArray(materials)) {
    setFilteredMaterials([]);
    return;
  }

  let filtered = [...materials];

  if (searchTerm) {
    filtered = filtered.filter(material =>
      material.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedType !== 'all') {
    filtered = filtered.filter(material => material.type === selectedType);
  }

  setFilteredMaterials(filtered);
};



  const downloadMaterial = async (materialId, fileName) => {
    try {
      const response = await axios.get(`/api/student/materials/${materialId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showNotification('Download started', 'success');
    } catch (err) {
      showNotification('Failed to download file', 'error');
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return (
          <div className="text-red-500">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'video':
        return (
          <div className="text-blue-500">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'document':
        return (
          <div className="text-green-500">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="text-yellow-500">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </div>
        );
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          notification.type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'
        } border`}>
          {notification.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">My Materials</h2>
        <div className="text-gray-600">
          {filteredMaterials.length} materials available
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="document">Document</option>
              <option value="presentation">Presentation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="w-16 h-16 text-gray-400 mx-auto mb-4">
            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No materials found
          </h3>
          <p className="text-gray-500">
            {searchTerm || selectedType !== 'all' 
              ? 'Try changing your search criteria' 
              : 'Materials will appear here once assigned by your instructor'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{Array.isArray(filteredMaterials) && filteredMaterials.map((material) => (
            <div key={material.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-gray-100 rounded-lg mr-4">
                      {getFileIcon(material.type)}
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {material.type.toUpperCase()}
                        </span>
                        {material.subject && (
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800">
                            {material.subject}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadMaterial(material.id, material.file_name)}
                    className="text-gray-400 hover:text-blue-600"
                    title="Download"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
                
                <h3 className="font-semibold text-gray-800 text-lg mb-2">
                  {material.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {material.description}
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 pt-4 border-t gap-2">
                  <div className="flex items-center">
                    <span className="mr-4">
                      Size: {formatFileSize(material.file_size)}
                    </span>
                    <span>
                      Added: {new Date(material.uploaded_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {material.file_extension}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMaterials;