import { Users, Target, Award, BookOpen, Globe, Heart } from "lucide-react";

const About = () => {
  const stats = [
    { label: "Students Enrolled", value: "2,500+", icon: Users },
    { label: "Courses Available", value: "150+", icon: BookOpen },
    { label: "Expert Instructors", value: "25+", icon: Award },
    { label: "Years of Excellence", value: "10+", icon: Globe },
  ];

  const team = [
    {
      name: "Rajesh Sharma",
      role: "Director & Founder",
      image: "/api/placeholder/300/300",
      bio: "Educational leader with 15+ years of experience in competitive exam preparation and career guidance.",
    },
    {
      name: "Priya Verma",
      role: "Academic Head",
      image: "/api/placeholder/300/300",
      bio: "Expert in curriculum development for government job preparation and skill enhancement programs.",
    },
    {
      name: "Amit Kumar",
      role: "Technology Director",
      image: "/api/placeholder/300/300",
      bio: "Tech professional focused on creating innovative learning solutions for students.",
    },
    {
      name: "Sunita Devi",
      role: "Student Counselor",
      image: "/api/placeholder/300/300",
      bio: "Dedicated to guiding students towards successful career paths and academic excellence.",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Excellence",
      description:
        "We strive for the highest quality in everything we do, from course content to student support.",
    },
    {
      icon: Heart,
      title: "Accessibility",
      description:
        "Education should be available to everyone, regardless of background or circumstances.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "We believe in the power of learning together and supporting each other's growth.",
    },
    {
      icon: Award,
      title: "Innovation",
      description:
        "We continuously evolve our platform to provide the best learning experience.",
    },
  ];

  return (
    <div className="min-h-screen bg-light-grey">
      {/* Hero Section */}
      <div className="gradient-primary text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Career Pathway Shimla
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Empowering students in Himachal Pradesh with quality education and
              career development opportunities
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-heading mb-2">
                  {stat.value}
                </div>
                <div className="text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-light-grey">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-heading mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-body mb-6">
                At Career Pathway Shimla, we believe that quality education
                should be accessible to everyone in Himachal Pradesh. Our
                mission is to provide world-class learning experiences that help
                students advance their careers and achieve their professional
                goals in government and private sectors.
              </p>
              <p className="text-lg text-body mb-6">
                Located in the heart of Shimla, we specialize in competitive
                exam preparation, skill development, and career guidance. Our
                comprehensive courses combine theoretical knowledge with
                practical skills, ensuring our students are job-ready and
                competitive in today's market.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-heading">
                    Certified Learning
                  </h3>
                  <p className="text-muted">
                    Industry-recognized certificates upon completion
                  </p>
                </div>
              </div>
            </div>
            <div>
              <img
                src="/api/placeholder/600/400"
                alt="Students learning at Career Pathway Shimla"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-heading mb-4">Our Values</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              These core values guide everything we do and shape the learning
              experience we provide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-heading mb-3">
                  {value.title}
                </h3>
                <p className="text-body">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-light-grey">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-heading mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Our dedicated team of educators and industry experts work together
              to create exceptional learning experiences for students in
              Himachal Pradesh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-heading mb-1">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-body text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of students who have already transformed their careers
            with Career Pathway Shimla
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/courses" className="btn-accent px-8 py-3">
              Browse Courses
            </a>
            <a href="/register" className="btn-outline-accent px-8 py-3">
              Sign Up Free
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
