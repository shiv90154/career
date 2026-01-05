import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award, Users, TrendingUp, Clock,
  BookOpen, Target, Shield, Globe,
  CheckCircle, Star, Heart, ArrowRight,
  GraduationCap, Medal, Brain, Users2,
  Calendar, MapPin, Phone, Mail,
  ChevronRight, Trophy, Sparkles, ShieldCheck,
  BarChart, Clock3, Video, Headphones,
  Quote, ThumbsUp, Target as TargetIcon,
  Eye, Zap, Lightbulb
} from 'lucide-react';

const About = () => {
  const stats = [
    { icon : <Users size={20} />, value: '5000+', label: 'Successful Students', color: 'from-blue-600 to-blue-800' },
    { icon: <Award size={20} />, value: '100+', label: 'Selections in 2023', color: 'from-yellow-500 to-yellow-600' },
    { icon: <BookOpen size={20} />, value: '50+', label: 'Expert Courses', color: 'from-red-600 to-red-700' },
    { icon: <TrendingUp size={20} />, value: '95%', label: 'Satisfied Rate', color: 'from-green-600 to-green-700' },
  ];

  const values = [
    {
      icon: <Target size={40} />,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from course design to student support.',
      color: 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20'
    },
    {
      icon: <Heart size={40} />,
      title: 'Student Success',
      description: 'Our success is measured by the success of our students in achieving their goals.',
      color: 'bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20'
    },
    {
      icon: <Shield size={40} />,
      title: 'Integrity',
      description: 'We maintain the highest standards of integrity and transparency in all our operations.',
      color: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20'
    },
    {
      icon: <Globe size={40} />,
      title: 'Innovation',
      description: 'We continuously innovate our teaching methods and course materials.',
      color: 'bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20'
    }
  ];

  const teamMembers = [
    {
      name: 'Dr. Rajesh Sharma',
      role: 'Founder & Director',
      bio: '15+ years of experience in competitive exam coaching. Former civil servant.',
      expertise: ['UPSC', 'HPPSC', 'General Studies'],
      experience: '15+ Years',
      image: '/team/rajesh.jpg'
    },
    {
      name: 'Ms. Priya Singh',
      role: 'Academic Head',
      bio: 'Expert in Mathematics and Reasoning. 10+ years of teaching experience.',
      expertise: ['Quantitative Aptitude', 'Logical Reasoning', 'Banking Exams'],
      experience: '10+ Years',
      image: '/team/priya.jpg'
    },
    {
      name: 'Mr. Amit Kumar',
      role: 'English Faculty',
      bio: 'Specialized in English Grammar and Comprehension. Published author.',
      expertise: ['English Language', 'Vocabulary', 'Reading Comprehension'],
      experience: '12+ Years',
      image: '/team/amit.jpg'
    },
    {
      name: 'Ms. Neha Verma',
      role: 'Student Support Head',
      bio: 'Dedicated to providing exceptional student support and career guidance.',
      expertise: ['Career Counseling', 'Student Mentorship', 'Exam Strategy'],
      experience: '8+ Years',
      image: '/team/neha.jpg'
    }
  ];

  const testimonials = [
    {
      name: 'Rohit Kumar',
      course: 'Patwari Exam 2023',
      result: 'Rank 12',
      text: 'Career Path Institute transformed my preparation strategy. The structured approach and regular tests helped me crack the exam in my first attempt.',
      avatar: 'RK',
      placement: 'Himachal Pradesh Revenue Department',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      course: 'SSC CGL',
      result: 'Selected',
      text: 'The faculty\'s dedication and comprehensive study materials made all the difference. I highly recommend CPI to all serious aspirants.',
      avatar: 'PS',
      placement: 'Income Tax Department',
      rating: 5
    },
    {
      name: 'Amit Singh',
      course: 'Banking Exams',
      result: 'PO Selected',
      text: 'The mock tests were exactly like the actual exam. The detailed analysis helped me improve my score significantly.',
      avatar: 'AS',
      placement: 'State Bank of India',
      rating: 5
    }
  ];

  const methodology = [
    { step: '01', title: 'Structured Curriculum', desc: 'Comprehensive topic coverage with exam pattern focus', icon: <BookOpen size={24} /> },
    { step: '02', title: 'Concept Clarity', desc: 'Interactive video lectures for strong fundamentals', icon: <Lightbulb size={24} /> },
    { step: '03', title: 'Regular Practice', desc: 'Daily quizzes and weekly tests for reinforcement', icon: <TargetIcon size={24} /> },
    { step: '04', title: 'Performance Analysis', desc: 'Detailed feedback and personalized improvement plans', icon: <BarChart size={24} /> },
    { step: '05', title: 'Exam Simulation', desc: 'Full-length mock tests replicating actual conditions', icon: <Clock3 size={24} /> }
  ];

  const features = [
    { icon: <Video size={32} />, title: 'HD Video Lectures', desc: 'Crystal clear lectures by expert faculty' },
    { icon: <Headphones size={32} />, title: '24/7 Doubt Support', desc: 'Round-the-clock assistance for students' },
    { icon: <Brain size={32} />, title: 'Smart Learning', desc: 'AI-powered personalized learning paths' },
    { icon: <Medal size={32} />, title: 'Guaranteed Success', desc: 'Proven methodology with high success rate' },
    { icon: <GraduationCap size={32} />, title: 'Expert Faculty', desc: 'Learn from experienced educators' },
    { icon: <Zap size={32} />, title: 'Fast-track Learning', desc: 'Accelerated programs for quick results' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative container mx-auto px-4 pt-10 pb-20 md:pt-16 md:pb-28 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-full text-sm font-semibold">
                  <Sparkles size={16} />
                  <span>Established 2010</span>
                </span>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  About
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
                    Career Path Institute
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 leading-relaxed">
                  Empowering aspirants to achieve their dream government jobs through 
                  quality education, expert guidance, and comprehensive preparation.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4  border border-white/10">
                    <div className="flex items-center space-x-3 ">
                      <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
                        {stat.icon}
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white ">{stat.value}</div>
                        <div className="text-sm text-gray-300">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  to="/courses"
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transform hover:-translate-y-1 transition-all duration-300"
                >
                  <span>Explore Our Courses</span>
                  <ArrowRight size={20} />
                </Link>
                <Link 
                  to="/contact"
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  <span>Visit Our Center</span>
                  <MapPin size={20} />
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/about-hero.jpg" 
                  alt="Career Path Institute Campus" 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                
                {/* Floating Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                      <ShieldCheck size={32} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">Govt. Recognized</h4>
                      <p className="text-gray-300">Registered with Himachal Pradesh Government</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
              Our Journey
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transforming Dreams Into
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">
                {" "}Reality Since 2010
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From a small coaching center to Himachal's premier competitive exam institute
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Career Path Institute was born from a simple observation: most competitive 
                  exam aspirants in Himachal Pradesh lacked access to quality, structured 
                  coaching that addressed their specific needs.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  What started as a small coaching center in Shimla has now transformed into 
                  a premier institute serving thousands of students across North India. Our 
                  journey has been guided by a commitment to excellence and a deep 
                  understanding of what it takes to succeed in competitive exams.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  Today, we combine traditional teaching wisdom with modern technology to 
                  create a learning experience that is effective, engaging, and accessible 
                  to everyone.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="font-medium text-gray-900">Founded in 2010</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="font-medium text-gray-900">1000+ Selections</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="font-medium text-gray-900">Online Platform 2018</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="font-medium text-gray-900">50+ Expert Faculty</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/story-image.jpg" 
                  alt="Our Institute Campus" 
                  className="w-full h-96 object-cover"
                />
              </div>
              
              {/* Floating Experience Badge */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-yellow-500 to-yellow-600 text-gray-900 p-8 rounded-2xl shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl font-bold">13+</div>
                  <div className="text-sm font-semibold uppercase">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="relative bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-2xl p-8 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6">
                  <Target size={32} className="text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                
                <p className="text-gray-300 leading-relaxed mb-6">
                  To provide accessible, high-quality education that empowers every 
                  aspirant to achieve their dream government job through innovative 
                  teaching methods and comprehensive support.
                </p>
                
                <div className="flex items-center text-yellow-400 font-medium">
                  <span>Learn More</span>
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-8 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6">
                  <Globe size={32} className="text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                
                <p className="text-gray-300 leading-relaxed mb-6">
                  To become the most trusted and effective competitive exam preparation 
                  institute in North India, transforming lives through education and 
                  creating successful civil servants.
                </p>
                
                <div className="flex items-center text-yellow-400 font-medium">
                  <span>Our Goals</span>
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-4">
              Our Core Principles
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Values That Define
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-900">
                {" "}Our Excellence
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className={`${value.color} rounded-2xl p-8 border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center mb-6 text-white">
                  {value.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold mb-4">
              Meet Our Experts
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Learn From
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                {" "}Industry Experts
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experienced educators and mentors dedicated to your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                    <div className="text-4xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold rounded-full">
                      {member.experience}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </h3>
                  
                  <p className="text-sm text-yellow-600 font-semibold mb-3">
                    {member.role}
                  </p>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {member.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Methodology */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
              Proven Methodology
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                {" "}5-Step Success Formula
              </span>
            </h2>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500 to-yellow-600 transform -translate-x-1/2"></div>

            <div className="space-y-8 lg:space-y-0">
              {methodology.map((step, index) => (
                <div 
                  key={index}
                  className={`relative lg:flex items-center ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Step Content */}
                  <div className={`lg:w-1/2 ${
                    index % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12'
                  }`}>
                    <div className={`bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 ${
                      index % 2 === 0 ? 'lg:mr-8' : 'lg:ml-8'
                    }`}>
                      <div className="flex items-center space-x-4 lg:space-x-0 ${
                        index % 2 === 0 ? 'lg:flex-row-reverse lg:space-x-reverse' : ''
                      }">
                        <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                          {step.step}
                        </div>
                        <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : ''}`}>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {step.title}
                          </h3>
                          <p className="text-gray-600">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step Number Circle */}
                  <div className="hidden lg:block absolute left-1/2 w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full border-4 border-white shadow-lg transform -translate-x-1/2 flex items-center justify-center text-white font-bold">
                    {step.icon}
                  </div>

                  {/* Empty Div for spacing */}
                  <div className="lg:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold mb-4">
              Student Success
            </span>
            <h2 className="text-4xl font-bold text-white mb-4">
              Success Stories That
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
                {" "}Inspire Us
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-gray-900 text-xl font-bold">
                    {testimonial.avatar}
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-white">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.course}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                      {testimonial.result}
                    </span>
                  </div>
                </div>
                
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 text-yellow-500/20" size={32} />
                  <p className="text-gray-300 italic pl-6">
                    "{testimonial.text}"
                  </p>
                </div>
                
                <div className="border-t border-gray-700 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <div className="text-sm text-gray-400">
                      Placed at {testimonial.placement}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold mb-4">
              Our Advantages
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-700">
                {" "}Career Path Institute?
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-yellow-500 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 text-white">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-yellow-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Institute Info */}
          <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-yellow-400 mb-2">13+</div>
                <div className="text-lg font-semibold">Years of Trust</div>
                <p className="text-gray-300 mt-2">Established in 2010</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-yellow-400 mb-2">5000+</div>
                <div className="text-lg font-semibold">Happy Students</div>
                <p className="text-gray-300 mt-2">Across North India</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-yellow-400 mb-2">100%</div>
                <div className="text-lg font-semibold">Focus on Success</div>
                <p className="text-gray-300 mt-2">Your success is our priority</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Trophy size={40} className="text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start Your Success
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
                Journey With Us Today
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of successful candidates who trusted Career Path Institute 
              for their competitive exam preparation
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/courses"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300"
              >
                <span>Explore Courses</span>
                <ArrowRight size={20} />
              </Link>
              
              <Link 
                to="/contact"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <span>Contact Admissions</span>
                <Phone size={20} />
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">Free</div>
                <div className="text-gray-300">Demo Class Available</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">Easy</div>
                <div className="text-gray-300">EMI Options Available</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-300">Admissions Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;