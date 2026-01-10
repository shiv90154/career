import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  Calendar,
  CreditCard,
  RefreshCw,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import axios from "axios";


const exportCSV = () => {
  if (!payments.length) return;

  const headers = [
    "Order ID",
    "Student",
    "Email",
    "Course",
    "Amount",
    "Status",
    "Payment Method",
    "Transaction ID",
    "Date"
  ];

  const rows = payments.map(p => [
    p.order_id,
    p.student_name,
    p.student_email,
    p.course_name,
    p.amount,
    p.status,
    p.payment_method,
    p.transaction_id,
    formatDate(p.created_at)
  ]);

  const csv = [headers, ...rows]
    .map(r => r.join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "payments.csv";
  a.click();
};


const ManagePayments = () => {
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // 模拟支付数据
  const mockPayments = [
    {
      id: 1,
      order_id: "ORDER_1700000000",
      student_name: "John Doe",
      student_email: "john@example.com",
      course_name: "Patwari Complete Preparation",
      amount: 999,
      currency: "INR",
      status: "success",
      payment_method: "Credit Card",
      transaction_id: "TXN_001",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:35:00Z"
    },
    {
      id: 2,
      order_id: "ORDER_1700001000",
      student_name: "Jane Smith",
      student_email: "jane@example.com",
      course_name: "SSC CGL Tier 1",
      amount: 1499,
      currency: "INR",
      status: "pending",
      payment_method: "Net Banking",
      transaction_id: "TXN_002",
      created_at: "2024-01-14T14:20:00Z",
      updated_at: "2024-01-14T14:20:00Z"
    },
    {
      id: 3,
      order_id: "ORDER_1700002000",
      student_name: "Bob Johnson",
      student_email: "bob@example.com",
      course_name: "Bank PO Prelims",
      amount: 1999,
      currency: "INR",
      status: "failed",
      payment_method: "UPI",
      transaction_id: "TXN_003",
      created_at: "2024-01-13T09:15:00Z",
      updated_at: "2024-01-13T09:20:00Z"
    },
    {
      id: 4,
      order_id: "ORDER_1700003000",
      student_name: "Alice Brown",
      student_email: "alice@example.com",
      course_name: "Patwari Complete Preparation",
      amount: 999,
      currency: "INR",
      status: "success",
      payment_method: "Debit Card",
      transaction_id: "TXN_004",
      created_at: "2024-01-12T16:45:00Z",
      updated_at: "2024-01-12T16:50:00Z"
    },
    {
      id: 5,
      order_id: "ORDER_1700004000",
      student_name: "Charlie Wilson",
      student_email: "charlie@example.com",
      course_name: "SSC CGL Tier 1",
      amount: 1499,
      currency: "INR",
      status: "refunded",
      payment_method: "Credit Card",
      transaction_id: "TXN_005",
      created_at: "2024-01-11T11:30:00Z",
      updated_at: "2024-01-11T12:00:00Z"
    }
  ];

  // 创建不带授权头的 axios 实例
const apiWithoutAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost/career-path-api/api",
  headers: {
    "Content-Type": "application/json",
  },
});




  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 在实际应用中，这里应该调用获取支付列表的API
      // const response = await apiWithoutAuth.get("/admin/payments/manage.php");
      // setPayments(response.data);
      
      // 暂时使用模拟数据
      setPayments(mockPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      alert("Error loading payments data");
      // 如果API失败，使用模拟数据
      setPayments(mockPayments);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async () => {
    try {
      // 创建新订单
      const response = await apiWithoutAuth.get("/admin/payments/create-order.php");
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const verifyPayment = async (paymentData) => {
    try {
      // 验证支付
      const response = await apiWithoutAuth.post("/admin/payments/verify-payment.php", paymentData);
      return response.data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  };

  const handleProcessTestPayment = async () => {
    try {
      setProcessingPayment(true);
      
      // 1. 创建订单
      const orderData = await createOrder();
      alert(`Order created: ${orderData.order_id}\nAmount: ${orderData.amount} ${orderData.currency}`);
      
      // 2. 模拟支付成功
      const paymentData = {
        order_id: orderData.order_id,
        razorpay_payment_id: `pay_${Date.now()}`,
        razorpay_signature: `sig_${Date.now()}`
      };
      
      // 3. 验证支付
      const verificationResult = await verifyPayment(paymentData);
      
      if (verificationResult.status === "success") {
        alert("Payment processed successfully!");
        // 刷新支付列表
        fetchPayments();
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Error processing payment. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const handleRefund = async (paymentId) => {
    if (!window.confirm("Are you sure you want to process a refund for this payment?")) {
      return;
    }

    try {
      // 模拟退款处理
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 在实际应用中，这里应该调用退款API
      // await apiWithoutAuth.post(`/admin/payments/refund.php`, { payment_id: paymentId });
      
      alert("Refund processed successfully!");
      fetchPayments();
    } catch (error) {
      console.error("Error processing refund:", error);
      alert("Error processing refund");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      success: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      failed: { color: "bg-red-100 text-red-800", icon: XCircle },
      refunded: { color: "bg-blue-100 text-blue-800", icon: RefreshCw }
    };

    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", icon: AlertCircle };
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => {
    const methodIcons = {
      'Credit Card': CreditCard,
      'Debit Card': CreditCard,
      'Net Banking': DollarSign,
      'UPI': DollarSign,
      'Wallet': DollarSign
    };

    const IconComponent = methodIcons[method] || DollarSign;
    return <IconComponent className="w-4 h-4 mr-2" />;
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.course_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || payment.status === filterStatus;
    
    const matchesDate = !filterDate || 
      new Date(payment.created_at).toDateString() === new Date(filterDate).toDateString();

    return matchesSearch && matchesStatus && matchesDate;
  });

  // 计算统计信息
  const stats = {
    total: payments.length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    successful: payments.filter(p => p.status === 'success').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    refunded: payments.filter(p => p.status === 'refunded').length
  };

  if (loading && payments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
              <p className="text-gray-600 mt-2">Manage and track all payment transactions</p>
            </div>

            <button
              onClick={handleProcessTestPayment}
              disabled={processingPayment}
              className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {processingPayment ? (
                <LoadingSpinner small light />
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Process Test Payment
                </>
              )}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Payments</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Total amount: {formatCurrency(stats.totalAmount)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Successful</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.successful}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {((stats.successful / stats.total) * 100 || 0).toFixed(1)}% success rate
              </p>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Awaiting completion</p>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Failed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Requires attention</p>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Refunded</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.refunded}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Processed refunds</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Payments
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                    placeholder="Search by Order ID, Student, Course..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                >
                  <option value="">All Status</option>
                  <option value="success">Successful</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={fetchPayments}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("");
                  setFilterDate("");
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </button>
              <button
  onClick={exportCSV}
  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
>
  <Download className="w-4 h-4 mr-2" />
  Export CSV
</button>
            </div>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">All Payments</h2>
                <p className="text-gray-600 mt-1">
                  {filteredPayments.length} payment(s) found
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Showing {Math.min(filteredPayments.length, 10)} of {filteredPayments.length}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No payments found</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course & Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.slice(0, 10).map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.order_id}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            <div className="flex items-center">
                              <CreditCard className="w-4 h-4 mr-2" />
                              {payment.payment_method}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {formatDate(payment.created_at)}
                          </div>
                          {payment.transaction_id && (
                            <div className="text-xs text-gray-500 mt-1">
                              TXN: {payment.transaction_id}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-blue-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {payment.student_name}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {payment.student_email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.course_name}
                          </div>
                          <div className="text-lg font-bold text-gray-900 mt-1">
                            {formatCurrency(payment.amount, payment.currency)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {getStatusBadge(payment.status)}
                          <div className="text-xs text-gray-500">
                            Updated: {formatDate(payment.updated_at)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(payment)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {payment.status === 'success' && (
                            <button
                              onClick={() => handleRefund(payment.id)}
                              className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded transition-colors duration-200"
                              title="Process Refund"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors duration-200"
                            title="Generate Receipt"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Payment Details
                  </h2>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Information */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Order Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-blue-600">Order ID</label>
                      <p className="font-medium">{selectedPayment.order_id}</p>
                    </div>
                    <div>
                      <label className="text-sm text-blue-600">Transaction ID</label>
                      <p className="font-medium">{selectedPayment.transaction_id}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-3">Payment Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-500">Amount</label>
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Status</label>
                        <div className="mt-1">
                          {getStatusBadge(selectedPayment.status)}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Payment Method</label>
                        <p className="flex items-center">
                          {getPaymentMethodIcon(selectedPayment.payment_method)}
                          {selectedPayment.payment_method}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-3">Timestamps</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-500">Created At</label>
                        <p className="text-sm">{formatDate(selectedPayment.created_at)}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Updated At</label>
                        <p className="text-sm">{formatDate(selectedPayment.updated_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Information */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Student Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">Name</label>
                        <p className="font-medium">{selectedPayment.student_name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Email</label>
                        <p className="font-medium">{selectedPayment.student_email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Information */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Course Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div>
                      <label className="text-sm text-gray-500">Course Name</label>
                      <p className="font-medium">{selectedPayment.course_name}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Close
                  </button>
                  {selectedPayment.status === 'success' && (
                    <button
                      onClick={() => {
                        handleRefund(selectedPayment.id);
                        setShowDetailsModal(false);
                      }}
                      className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
                    >
                      Process Refund
                    </button>
                  )}
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePayments;