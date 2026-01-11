import React, { useState, useEffect } from 'react';
import { Download, FileText, Play, Image, ExternalLink, Archive, Search, Filter } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const MyMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({ types: [], courses: [] });

    useEffect(() => {
        fetchMaterials();
    }, [currentPage, searchTerm, selectedType, selectedCourse]);

    const fetchMaterials = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                limit: 20,
                ...(searchTerm && { search: searchTerm }),
                ...(selectedType && { type: selectedType }),
                ...(selectedCourse && { course_id: selectedCourse })
            });

            const response = await api.get(`/student/materials.php?${params}`);
            setMaterials(response.data.materials || []);
            setPagination(response.data.pagination || {});
            setFilters(response.data.filters || { types: [], courses: [] });
        } catch (error) {
            toast.error('Failed to fetch materials');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (material) => {
        try {
            if (material.is_premium && !material.has_access) {
                toast.error('This is a premium material. Please upgrade your subscription.');
                return;
            }

            // Track download
            await api.post(`/student/materials/${material.id}/download.php`);
            
            // Trigger download
            if (material.download_url) {
                window.open(material.download_url, '_blank');
            } else if (material.file_path) {
                window.open(`/materials/${material.file_path}`, '_blank');
            }
            
            // Update download count
            setMaterials(prev => prev.map(m => 
                m.id === material.id 
                    ? { ...m, download_count: m.download_count + 1 }
                    : m
            ));
            
            toast.success('Download started');
        } catch (error) {
            toast.error('Failed to download material');
        }
    };

    const getFileIcon = (type) => {
        const icons = {
            pdf: FileText,
            doc: FileText,
            video: Play,
            audio: Play,
            image: Image,
            link: ExternalLink,
            zip: Archive,
            ppt: FileText
        };
        
        return icons[type] || FileText;
    };

    const getFileTypeColor = (type) => {
        const colors = {
            pdf: 'text-red-600',
            doc: 'text-blue-600',
            video: 'text-purple-600',
            audio: 'text-green-600',
            image: 'text-yellow-600',
            link: 'text-indigo-600',
            zip: 'text-gray-600',
            ppt: 'text-orange-600'
        };
        
        return colors[type] || 'text-gray-600';
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedType('');
        setSelectedCourse('');
        setCurrentPage(1);
    };

    const MaterialCard = ({ material }) => {
        const IconComponent = getFileIcon(material.type);
        
        return (
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-gray-100 ${getFileTypeColor(material.type)}`}>
                            <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {material.title}
                            </h3>
                            {material.description && (
                                <p className="text-gray-600 text-sm line-clamp-2">
                                    {material.description}
                                </p>
                            )}
                        </div>
                    </div>
                    {material.is_premium && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Premium
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                        {material.course_title && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {material.course_title}
                            </span>
                        )}
                        {material.lesson_title && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {material.lesson_title}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        {material.file_size_formatted && (
                            <span>{material.file_size_formatted}</span>
                        )}
                        <span>•</span>
                        <span>{material.download_count} downloads</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                        Added {material.created_at_formatted}
                    </div>
                    <button
                        onClick={() => handleDownload(material)}
                        disabled={material.is_premium && !material.has_access}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            material.is_premium && !material.has_access
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {material.type === 'link' ? 'Open Link' : 'Download'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Materials</h1>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search materials..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Types</option>
                            {filters.types.map((type) => (
                                <option key={type} value={type}>
                                    {type.toUpperCase()}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Courses</option>
                            {filters.courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* Materials Grid */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {materials.map((material) => (
                            <MaterialCard key={material.id} material={material} />
                        ))}
                    </div>

                    {materials.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <div className="text-gray-500 mb-4">No materials found</div>
                            <button
                                onClick={clearFilters}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Clear filters and try again
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.total_pages > 1 && (
                        <div className="flex justify-center">
                            <nav className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                
                                {[...Array(Math.min(5, pagination.total_pages))].map((_, index) => {
                                    const page = index + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-2 border rounded-md ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(pagination.total_pages, prev + 1))}
                                    disabled={currentPage === pagination.total_pages}
                                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyMaterials;