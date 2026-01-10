import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  PlayCircle,
  Award,
  Users,
  Clock,
  Star,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Shield,
  BookOpen,
  Calendar,
  Target,
  BarChart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Hero slider images
  const heroSlides = [
    {
      id: 1,
      image: "/Images/home.png",
      alt: "Students at Career Path Institute"
    },
    {
      id: 2,
      image: "public/Images/about2.jpg",
      alt: "Classroom learning environment"
  
    },
    {
      id: 3,
      image: "public/Images/slider3.jpg",
      alt: "Study group discussion"
    },
    {
      id: 4,
      image: "public/Images/slider-4.png",
      alt: "Online learning platform"
    },
    {
      id: 5,
      image: "public/Images/slider5.png",
      alt: "Online learning platform"
    },
    {
      id: 6,
      image: "public/Images/slider6.png",
      alt: "Online learning platform"
    }
  ];

  useEffect(() => {
    fetchHomeData();
    
    // Auto slide functionality
    let slideInterval;
    if (isAutoPlaying) {
      slideInterval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    
    return () => {
      if (slideInterval) clearInterval(slideInterval);
    };
  }, [isAutoPlaying, currentSlide]);

  const fetchHomeData = async () => {
    try {
      const [coursesRes, statsRes, testimonialsRes] = await Promise.all([
        api.get("/public/courses?featured=true&limit=6"),
        api.get("/public/stats"),
        api.get("/public/testimonials"),
      ]);

      setFeaturedCourses(coursesRes.data);
      setStats(statsRes.data);
      setTestimonials(testimonialsRes.data);
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  // Mock stats if API fails
  const defaultStats = {
    total_students: "5000+",
    total_courses: "25+",
    success_rate: "85%",
    years_experience: "8+",
    faculty_count: "50+",
    placement_rate: "92%",
  };

  const features = [
    {
      icon: <PlayCircle size={32} />,
      title: "Expert Video Lectures",
      description:
        "HD video lectures by IIT/IIM alumni with interactive teaching methods",
      color: "from-blue-600 to-blue-800",
    },
    {
      icon: <Award size={32} />,
      title: "Comprehensive Study Material",
      description:
        "Curated materials, practice questions, and mock tests updated regularly",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: <Users size={32} />,
      title: "Live Doubt Sessions",
      description: "Daily live classes and personal doubt-clearing sessions",
      color: "from-red-600 to-red-700",
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Performance Tracking",
      description:
        "Detailed analytics and progress tracking with AI-powered insights",
      color: "from-green-600 to-green-700",
    },
    {
      icon: <BookOpen size={32} />,
      title: "E-Library Access",
      description: "Access to 500+ digital books and research papers",
      color: "from-purple-600 to-purple-700",
    },
    {
      icon: <Shield size={32} />,
      title: "100% Refund Policy",
      description: "Money-back guarantee if not selected in final exam",
      color: "from-pink-600 to-pink-700",
    },
  ];

  const achievements = [
    { number: "5000+", label: "Students Placed", icon: <Award /> },
    { number: "25+", label: "Courses Offered", icon: <BookOpen /> },
    { number: "85%", label: "Success Rate", icon: <Target /> },
    { number: "8+", label: "Years Experience", icon: <Calendar /> },
    { number: "50+", label: "Expert Faculty", icon: <Users /> },
    { number: "92%", label: "Satisfaction Rate", icon: <Star /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="relative container mx-auto px-4 pt-10 pb-20 md:pt-16 md:pb-28 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold">
                  <Shield size={16} />
                  <span>Himachal's #1 Coaching Institute</span>
                </div>

                <h1 className="text-xl md:text-5xl lg:text-5xl font-bold leading-tight">
                  Achieve Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
                    Dream Government Job
                  </span>
                  with Career Path Institute
                </h1>

                <p className="text-xl text-gray-300 leading-relaxed ">
                  Premier coaching institute in Shimla for Patwari, SSC,
                  Banking, Railway, and Teaching exam preparation. Join
                  thousands of successful candidates.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {achievements.slice(0, 3).map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-2 border border-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg">
                        {achievement.icon}
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">
                          {achievement.number}
                        </div>
                        <div className="text-sm text-gray-300">
                          {achievement.label}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl"
                >
                  <span>Explore Courses</span>
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  <span>Free Demo Class</span>
                  <PlayCircle size={20} />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center space-x-6 pt-8">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle size={20} className="text-green-400" />
                  </div>
                  <span className="text-sm">Verified Results</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Shield size={20} className="text-blue-400" />
                  </div>
                  <span className="text-sm">Govt. Recognized</span>
                </div>
              </div>
            </div>

            {/* Hero Image Slider */}
            <div className="relative mb-60">
              <div className="relative rounded overflow-hidden shadow-2xl">
                {/* Slider Container */}
                <div className="relative h-64 sm:h-80 md:h-96 lg:h-400px] w-full ">
                  {heroSlides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-1000  ${
                        index === currentSlide
                          ? "opacity-100 z-10"
                          : "opacity-0 z-0"
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className="w-full h-full object-fill object-contain"
                        loading="lazy"
                      />
                    </div>
                  ))}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent z-20"></div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full transition-all duration-300 group"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft 
                      size={24} 
                      className="text-white group-hover:scale-110 transition-transform" 
                    />
                  </button>
                  
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full transition-all duration-300 group"
                    aria-label="Next slide"
                  >
                    <ChevronRight 
                      size={24} 
                      className="text-white group-hover:scale-110 transition-transform" 
                    />
                  </button>

                  {/* Slide Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
                    {heroSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-100 ${
                          index === currentSlide
                            ? "w-8 bg-yellow-500"
                            : "bg-white/60 hover:bg-white"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Floating Stats Card */}
                <div className="mt-7 bottom-6 left-6 right-6 bg-white/8 backdrop-blur-sm rounded-xl p-2  border-white/20 z-30 ">
                  <div className="flex items-center justify-center gap-10">
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">94%</div>
                      <div className="text-sm text-gray-300">
                        Selection Rate
                      </div>
                    </div>
                    <div className="h-8 w-px bg-white/30"></div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">24/7</div>
                      <div className="text-sm text-gray-300">Doubt Support</div>
                    </div>
                    <div className="h-8 w-px bg-white/30"></div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">1000+</div>
                      <div className="text-sm text-gray-300">Mock Tests</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-12 text-gray-50"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </section>

      {/* Rest of your existing code remains the same */}
      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-12 -mt-1">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {achievement.number}
                </div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gray-300">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-4">
              Most Popular Courses
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transform Your Career With Our
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">
                {" "}
                Expert-Led Courses
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive courses designed by industry experts to help you ace
              competitive exams
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
                >
                  <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={course.thumbnail || "/default-course.jpg"}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold rounded-full">
                        Featured
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="px-3 py-1 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        {course.category || "General Studies"}
                      </span>
                      <div className="flex items-center text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="ml-1 text-sm font-semibold">4.9</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
                      {course.title}
                    </h3>

                    <p className="text-gray-600 mb-6 line-clamp-2">
                      {course.short_description}
                    </p>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-500">
                          <Clock size={16} className="mr-1" />
                          <span className="text-sm">
                            {course.duration_days} days
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Users size={16} className="mr-1" />
                          <span className="text-sm">
                            {course.enrollment_count}+
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        {course.discount_price ? (
                          <>
                            <div className="text-2xl font-bold text-gray-900">
                              ₹{course.discount_price}
                            </div>
                            <div className="text-sm text-gray-500 line-through">
                              ₹{course.price}
                            </div>
                          </>
                        ) : (
                          <div className="text-2xl font-bold text-gray-900">
                            ₹{course.price}
                          </div>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/courses/${course.id}`}
                      className="block w-full py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-xl text-center hover:from-gray-800 hover:to-gray-900 transition-all duration-300 group-hover:shadow-lg"
                    >
                      View Course Details
                      <ArrowRight
                        className="inline ml-2 group-hover:translate-x-1 transition-transform"
                        size={16}
                      />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/courses"
              className="inline-flex items-center space-x-2 px-8 py-4 border-2 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
              <span>View All Courses</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-300 to-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
              Our Differentiators
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                {" "}
                Career Path Institute
              </span>{" "}
              is Your Best Choice
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We combine traditional teaching excellence with modern technology
              for unparalleled results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} mb-6 flex items-center justify-center text-white`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-600 mb-6">{feature.description}</p>

                <div className="flex items-center text-blue-600 font-medium">
                  <span>Learn More</span>
                  <ArrowRight
                    size={16}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Achievement Banner */}
          <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-yellow-400 mb-2">
                  8+
                </div>
                <div className="text-lg font-semibold">Years of Excellence</div>
                <p className="text-gray-300 mt-2">
                  Trusted by thousands of students
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-yellow-400 mb-2">
                  50+
                </div>
                <div className="text-lg font-semibold">Expert Faculty</div>
                <p className="text-gray-300 mt-2">
                  IIT/IIM alumni with 10+ years experience
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-yellow-400 mb-2">
                  100%
                </div>
                <div className="text-lg font-semibold">Result-Oriented</div>
                <p className="text-gray-300 mt-2">
                  Proven track record of success
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold mb-4">
              Student Success Stories
            </span>
            <h2 className="text-4xl font-bold text-white mb-4">
              Hear From Our
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
                {" "}
                Successful Students
              </span>
            </h2>
          </div>

          {testimonials.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <MessageCircle size={24} className="text-gray-900" />
                </div>

                <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-2xl font-bold text-gray-900">
                      {testimonials[currentTestimonial]?.student_initials ||
                        "JS"}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="text-xl italic text-gray-200 mb-6">
                      "
                      {testimonials[currentTestimonial]?.message ||
                        "Career Path Institute transformed my preparation. The faculty and study material are exceptional."}
                      "
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-white">
                        {testimonials[currentTestimonial]?.student_name ||
                          "John Smith"}
                      </h4>
                      <p className="text-gray-400">
                        {testimonials[currentTestimonial]?.course_name ||
                          "Patwari Exam 2023"}
                      </p>

                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={
                              i <
                              (testimonials[currentTestimonial]?.rating || 5)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-600"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-700">
                  <button
                    onClick={prevTestimonial}
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentTestimonial
                            ? "w-8 bg-yellow-500"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextTestimonial}
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800"></div>
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
                Government Job Journey?
              </span>
            </h2>

            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of successful candidates. Get personalized
              guidance, expert mentorship, and comprehensive preparation
              material.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300"
              >
                <span>Enroll Now</span>
                <ArrowRight size={20} />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <span>Book Free Demo</span>
                <Calendar size={20} />
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">Free</div>
                <div className="text-gray-300">Demo Class</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">
                  Flexible
                </div>
                <div className="text-gray-300">Payment Plans</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-300">Doubt Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;