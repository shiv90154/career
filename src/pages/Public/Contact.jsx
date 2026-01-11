import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Facebook, Instagram, Globe } from 'lucide-react';
import { toast } from 'react-toastify';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate form submission
        setTimeout(() => {
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setLoading(false);
        }, 1000);
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Us',
            details: 'info@thecareespath.com',
            description: 'Send us an email anytime for inquiries!'
        },
        {
            icon: Phone,
            title: 'Call Us',
            details: '+91-98052 91450',
            description: 'Available for admissions and support'
        },
        {
            icon: MapPin,
            title: 'Visit Us',
            details: 'D D Tower Building, Opposite Jubbal House (Jubble House), Above Homeopathic Clinic, Sanjauli, Shimla - 171006, Himachal Pradesh',
            description: 'Come visit our institute in Shimla'
        },
        {
            icon: Clock,
            title: 'Working Hours',
            details: 'Monday - Saturday: 9:00 AM - 6:00 PM',
            description: 'Sunday: Closed'
        }
    ];

    const socialLinks = [
        {
            icon: Facebook,
            title: 'Facebook',
            handle: 'Careerpoint.sml',
            url: 'https://facebook.com/Careerpoint.sml',
            description: 'Follow us for updates and admissions'
        },
        {
            icon: Instagram,
            title: 'Instagram',
            handle: '@careerpoint_shimla',
            url: '#',
            description: 'Latest updates and student success stories'
        },
        {
            icon: Globe,
            title: 'Website',
            handle: 'www.thecareerspathway.com',
            url: 'https://www.thecareerspathway.com/',
            description: 'Visit our official website'
        }
    ];

    const faqs = [
        {
            question: 'How do I enroll in a course?',
            answer: 'Simply browse our course catalog, select the course you want, and click "Enroll Now". You can pay securely online and start learning immediately.'
        },
        {
            question: 'Do you offer certificates?',
            answer: 'Yes! Upon successful completion of a course, you\'ll receive a certificate that you can share on LinkedIn and add to your resume.'
        },
        {
            question: 'What are the payment options?',
            answer: 'We accept online payments through Razorpay, including credit/debit cards, UPI, net banking, and digital wallets.'
        },
        {
            question: 'Do you provide placement assistance?',
            answer: 'Yes, we provide career guidance and placement assistance to help our students find suitable job opportunities after course completion.'
        },
        {
            question: 'Are there any offline classes?',
            answer: 'Yes, we conduct offline classes at our Shimla center. We also offer online classes for students who cannot attend in person.'
        }
    ];

    return (
        <div className="min-h-screen bg-light-grey">
            {/* Hero Section */}
            <div className="gradient-primary text-white">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Get in Touch
                        </h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Have questions about our courses or admissions? We'd love to hear from you. 
                            Contact Career Pathway Shimla today!
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="card">
                        <h2 className="text-2xl font-bold text-heading mb-6">Send us a Message</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="form-label">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="Your full name"
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="email" className="form-label">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="subject" className="form-label">
                                    Subject
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                >
                                    <option value="">Select a subject</option>
                                    <option value="Course Inquiry">Course Inquiry</option>
                                    <option value="Admission Process">Admission Process</option>
                                    <option value="Fee Structure">Fee Structure</option>
                                    <option value="Placement Assistance">Placement Assistance</option>
                                    <option value="Technical Support">Technical Support</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="message" className="form-label">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="6"
                                    className="form-input"
                                    placeholder="Tell us more about your inquiry..."
                                />
                            </div>
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-heading mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                {contactInfo.map((info, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <info.icon className="w-6 h-6 text-primary" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-heading">{info.title}</h3>
                                            <p className="text-body font-medium">{info.details}</p>
                                            <p className="text-muted text-sm">{info.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="card-accent">
                            <h3 className="text-xl font-bold text-primary mb-4">Connect With Us</h3>
                            <div className="space-y-4">
                                {socialLinks.map((social, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                                <social.icon className="w-5 h-5 text-primary" />
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="font-semibold text-primary">{social.title}</h4>
                                            <a 
                                                href={social.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-primary hover:text-primary-light font-medium"
                                            >
                                                {social.handle}
                                            </a>
                                            <p className="text-primary/80 text-sm">{social.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="card">
                            <h3 className="text-xl font-bold text-heading mb-4">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="border-b border-primary/10 pb-4 last:border-b-0">
                                        <h4 className="font-semibold text-heading mb-2">{faq.question}</h4>
                                        <p className="text-body text-sm">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="card-primary">
                            <h3 className="text-lg font-semibold text-heading mb-4">Quick Links</h3>
                            <div className="space-y-2">
                                <a href="/courses" className="block text-primary hover:text-primary-light transition-colors">
                                    Browse All Courses
                                </a>
                                <a href="/tests" className="block text-primary hover:text-primary-light transition-colors">
                                    Practice Tests
                                </a>
                                <a href="/current-affairs" className="block text-primary hover:text-primary-light transition-colors">
                                    Current Affairs
                                </a>
                                <a href="/about" className="block text-primary hover:text-primary-light transition-colors">
                                    About Career Pathway Shimla
                                </a>
                                <a href="/register" className="block text-primary hover:text-primary-light transition-colors">
                                    Create Free Account
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="bg-primary/5 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-heading mb-4">Find Us</h2>
                        <p className="text-body">Located in the heart of Shimla, Himachal Pradesh</p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-xl font-semibold text-heading mb-4">Our Location</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <MapPin className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-heading">Career Pathway Shimla</p>
                                            <p className="text-body">D D Tower Building</p>
                                            <p className="text-body">Opposite Jubbal House (Jubble House)</p>
                                            <p className="text-body">Above Homeopathic Clinic</p>
                                            <p className="text-body">Sanjauli, Shimla - 171006</p>
                                            <p className="text-body">Himachal Pradesh, India</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <Phone className="w-5 h-5 text-primary mr-3" />
                                        <div>
                                            <p className="text-body">+91-98052 91450</p>
                                            <p className="text-body">9805291450</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <Mail className="w-5 h-5 text-primary mr-3" />
                                        <p className="text-body">info@thecareespath.com</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-primary/5 rounded-lg p-6 text-center">
                                <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                                <p className="text-body mb-4">Interactive map integration available</p>
                                <p className="text-sm text-muted">
                                    Visit us at our Shimla location for in-person consultations and course guidance
                                </p>
                                <button className="btn-primary mt-4">
                                    Get Directions
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;