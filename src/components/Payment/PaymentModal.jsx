import React, { useState } from 'react';
import { X, CreditCard, Tag } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const PaymentModal = ({ isOpen, onClose, course, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [finalAmount, setFinalAmount] = useState(course?.discount_price || course?.price || 0);

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        
        try {
            const response = await api.post('/payments/validate-coupon.php', {
                coupon_code: couponCode,
                course_id: course.id,
                amount: course.discount_price || course.price
            });
            
            setAppliedCoupon(response.data.coupon);
            setFinalAmount(response.data.final_amount);
            toast.success('Coupon applied successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid coupon code');
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setFinalAmount(course.discount_price || course.price);
    };

    const handlePayment = async () => {
        setLoading(true);
        
        try {
            // Create order
            const orderResponse = await api.post('/payments/razorpay.php', {
                action: 'create_order',
                course_id: course.id,
                coupon_code: appliedCoupon?.code || ''
            });

            if (orderResponse.data.free_enrollment) {
                toast.success('Enrolled successfully!');
                onSuccess();
                onClose();
                return;
            }

            // Initialize Razorpay
            const options = {
                key: orderResponse.data.key,
                amount: orderResponse.data.amount * 100,
                currency: orderResponse.data.currency,
                name: 'Career Path Institute',
                description: orderResponse.data.course_title,
                order_id: orderResponse.data.order_id,
                handler: async function (response) {
                    try {
                        // Verify payment
                        await api.post('/payments/razorpay.php', {
                            action: 'verify_payment',
                            payment_id: response.razorpay_payment_id,
                            order_id: response.razorpay_order_id,
                            signature: response.razorpay_signature
                        });
                        
                        toast.success('Payment successful! You are now enrolled.');
                        onSuccess();
                        onClose();
                    } catch (error) {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: 'Student Name',
                    email: 'student@example.com'
                },
                theme: {
                    color: '#2563eb'
                }
            };

            // Mock Razorpay for demo (replace with actual Razorpay)
            if (window.Razorpay) {
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                // Mock payment success for demo
                setTimeout(() => {
                    options.handler({
                        razorpay_payment_id: 'pay_mock_' + Date.now(),
                        razorpay_order_id: orderResponse.data.order_id,
                        razorpay_signature: 'mock_signature'
                    });
                }, 2000);
            }
            
        } catch (error) {
            toast.error('Payment initialization failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Complete Payment</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Course Price:</span>
                        <span>${course.price}</span>
                    </div>
                    {course.discount_price && course.discount_price < course.price && (
                        <div className="flex items-center justify-between text-sm text-green-600">
                            <span>Discounted Price:</span>
                            <span>${course.discount_price}</span>
                        </div>
                    )}
                </div>

                {/* Coupon Section */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Have a coupon code?
                    </label>
                    {!appliedCoupon ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                placeholder="Enter coupon code"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={applyCoupon}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Apply
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                            <div className="flex items-center">
                                <Tag className="w-4 h-4 text-green-600 mr-2" />
                                <span className="text-green-800 font-medium">{appliedCoupon.code}</span>
                                <span className="text-green-600 text-sm ml-2">
                                    ({appliedCoupon.discount_type === 'percentage' 
                                        ? `${appliedCoupon.discount_value}% off` 
                                        : `$${appliedCoupon.discount_value} off`})
                                </span>
                            </div>
                            <button
                                onClick={removeCoupon}
                                className="text-red-600 hover:text-red-800 text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>

                {/* Total Amount */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total Amount:</span>
                        <span className="text-2xl font-bold text-blue-600">
                            {finalAmount === 0 ? 'FREE' : `$${finalAmount}`}
                        </span>
                    </div>
                    {appliedCoupon && (
                        <div className="text-sm text-green-600 mt-1">
                            You saved ${((course.discount_price || course.price) - finalAmount).toFixed(2)}!
                        </div>
                    )}
                </div>

                {/* Payment Button */}
                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    <CreditCard className="w-5 h-5 mr-2" />
                    {loading ? 'Processing...' : (finalAmount === 0 ? 'Enroll for Free' : `Pay $${finalAmount}`)}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                    Secure payment powered by Razorpay
                </p>
            </div>
        </div>
    );
};

export default PaymentModal;