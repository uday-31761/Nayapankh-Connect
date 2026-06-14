const galleryImages = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
];

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen, Users, Award, MapPin, Target,
  Sparkles, Star, ArrowRight, ShieldCheck, Heart, Sparkle
} from 'lucide-react';

const stats = [
  { value: "500+", label: "Volunteers Engaged", icon: Users, color: "text-ngo-400" },
  { value: "50+", label: "Impact Events Done", icon: Award, color: "text-gold-400" },
  { value: "1000+", label: "Students Impacted", icon: BookOpen, color: "text-emerald-400" },
  { value: "20+", label: "Cities Reached", icon: MapPin, color: "text-sky-400" },
];

const programs = [
  {
    title: "Education For All",
    description:
      "Supporting underprivileged students through educational resources, mentoring, and learning opportunities.",
    icon: BookOpen,
    color: "from-ngo-600 to-emerald-500",
  },

  {
    title: "Youth Empowerment",
    description:
      "Developing leadership, communication, and career skills among students and young professionals.",
    icon: Target,
    color: "from-emerald-600 to-teal-500",
  },

  {
    title: "Skill Development",
    description:
      "Providing workshops, internships, technical training, and professional development opportunities.",
    icon: Sparkles,
    color: "from-gold-600 to-yellow-500",
  },

  {
    title: "Social Awareness",
    description:
      "Conducting awareness campaigns focused on education, health, environment, and social responsibility.",
    icon: Heart,
    color: "from-red-600 to-rose-500",
  },
];

const benefits = [
  { title: "Certificate of Completion", desc: "Recognized certificate validating your hours, efforts, and projects.", icon: Award },
  { title: "Letter of Recommendation", desc: "Personalized recommendation letter from foundation leaders for high performers.", icon: ShieldCheck },
  { title: "Professional Networking", desc: "Connect with like-minded changemakers, corporate partners, and social activists.", icon: Users },
  { title: "Leadership Roles", desc: "Get promoted to lead city batches, drive operations, and manage registrations.", icon: Target },
];

<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
  <div className="glass-card rounded-3xl p-10 border border-slate-800">

    <h2 className="text-3xl font-bold text-white mb-8 text-center">
      Why NayePankh Foundation?
    </h2>

    <div className="grid md:grid-cols-3 gap-8">

      <div>
        <h3 className="text-ngo-400 font-bold text-lg mb-3">
          Student Driven
        </h3>
        <p className="text-slate-400">
          Created to help students gain practical experience,
          leadership skills, and social impact exposure.
        </p>
      </div>

      <div>
        <h3 className="text-gold-400 font-bold text-lg mb-3">
          Community Focused
        </h3>
        <p className="text-slate-400">
          Working on education, awareness campaigns,
          and community welfare initiatives.
        </p>
      </div>

      <div>
        <h3 className="text-emerald-400 font-bold text-lg mb-3">
          Career Growth
        </h3>
        <p className="text-slate-400">
          Volunteers receive certificates,
          recommendations, networking,
          and leadership opportunities.
        </p>
      </div>

    </div>
  </div>
</section>

const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Summer Batch Lead",
    story: "NayePankh changed how I view community work. I started as a teaching volunteer and within a year was managing 50 volunteers. It built real confidence in me.",
  },
  {
    name: "Sneha Patel",
    role: "Education Coordinator",
    story: "The structural layout of NayePankh Connect makes updates so easy! The portal helps us focus more on teaching children rather than filling spreadsheets.",
  },
  {
    name: "Rohit Verma",
    role: "Admin & Operations",
    story: "Volunteering here is extremely structured. We create batches, manage volunteer logs, and see reports. It's like running an actual tech-empowered operation.",
  },
];

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden pt-20">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-ngo-950/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-gold-950/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ngo-950/60 border border-ngo-850 text-ngo-400 text-sm font-semibold mb-6 shadow-inner"
        >
          <Sparkle size={14} className="animate-spin-slow text-gold-400" />
          <span>Empowering Volunteers, Building Future Leaders.</span>
        </motion.div>

        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 max-w-4xl"
        >
          Transform Your Compassion Into <br />
          <span className="gradient-text">Impactful Leadership</span>
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed"
        >
          Join NayePankh Connect to support educational initiatives, lead local batches, coordinate social drives, and grow as a future community leader.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/login?tab=register" className="btn-gradient px-8 py-4 rounded-2xl text-base flex items-center gap-2 group">
            <span>Become a Volunteer</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login" className="btn-outline px-8 py-4 rounded-2xl text-base font-medium">
            Login to Portal
          </Link>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="border-y border-slate-900 bg-slate-950/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, i) => (
              <motion.div variants={itemVariants} key={i} className="flex flex-col items-center">
                <div className="p-3 bg-slate-900/60 rounded-xl mb-4 border border-slate-800">
                  <stat.icon className={`${stat.color}`} size={24} />
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{stat.value}</h3>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Impact Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-ngo-500 font-bold uppercase tracking-wider">
            Our Impact
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Volunteers Creating Change
          </h2>

          <p className="text-slate-400 mt-4">
            Education drives, community outreach programs, awareness campaigns,
            and youth empowerment activities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryImages.map((img, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.04 }}
              className="overflow-hidden rounded-3xl border border-slate-800"
            >
              <img
                src={img}
                alt="NayePankh Activity"
                className="w-full h-64 object-cover"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* About NayePankh Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-ngo-500 font-bold tracking-wider text-sm uppercase">Our Compass</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-6">
              Empowering Society, one step at a time.
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              NayePankh Foundation is a student-led NGO dedicated to
              education, youth empowerment, skill development,
              social awareness, and community impact initiatives
              across India.

              The foundation works with students, volunteers,
              educators, and professionals to create opportunities
              for learning, leadership, and meaningful social change.
              Through educational drives, awareness campaigns,
              community service programs, and volunteer initiatives,
              NayePankh aims to build a more inclusive and empowered society.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-ngo-950/80 border border-ngo-800 rounded-xl flex items-center justify-center text-ngo-400">
                  <Target size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Our Mission</h4>
                  <p className="text-slate-400 text-sm">To design sustainable learning environments and provide professional tools to the youth, creating a pathway out of generational poverty.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gold-950/80 border border-gold-800 rounded-xl flex items-center justify-center text-gold-400">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Our Vision</h4>
                  <p className="text-slate-400 text-sm">A highly educated, self-sustaining society led by capable community leaders who lift others as they rise.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-ngo-600 to-gold-600 rounded-3xl blur-2xl opacity-20 transform -rotate-3 scale-95"></div>
            <div className="glass-card p-8 rounded-3xl border border-slate-800/80 relative flex flex-col justify-center min-h-[350px]">
              <span className="text-4xl mb-4">🌍</span>
              <h3 className="text-2xl font-bold text-white mb-4">Our Real-world Impact</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                By mobilizing students from various universities as volunteers, NayePankh bridges the gap between urban resources and village communities. Volunteers experience grassroot challenges, shaping them into empathetic future leaders.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-ngo-600/20 border border-ngo-500/30 flex items-center justify-center">
                  <Star size={16} className="text-ngo-400 fill-ngo-400" />
                </div>
                <span className="font-semibold text-slate-300">Registered NGO under Govt. of India</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="bg-slate-900/30 border-y border-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-ngo-500 font-bold tracking-wider text-sm uppercase">Focus Areas</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">Our Ongoing Programs</h2>
            <p className="text-slate-400">Discover the domains where NayePankh works. As a volunteer, you can choose to contribute to any of these fields based on your interests.</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {programs.map((prog, i) => (
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                key={i}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/40 transition-colors"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${prog.color} flex items-center justify-center text-white mb-5`}>
                    <prog.icon size={20} />
                  </div>
                  <h3 className="font-bold text-lg text-white mb-3">{prog.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{prog.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold-500 font-bold tracking-wider text-sm uppercase">What's In It For You</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">Volunteer Benefits</h2>
          <p className="text-slate-400">Giving back to the community also means growing as a professional. Here is what we offer to validate and support your journey.</p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {benefits.map((benefit, i) => (
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              key={i}
              className="glass-card p-6 rounded-2xl flex items-start gap-4 border border-slate-800/80"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-gold-400 shadow-md">
                <benefit.icon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1.5 text-base">{benefit.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-slate-900/20 border-t border-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-ngo-500 font-bold tracking-wider text-sm uppercase">Voices of Change</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">Volunteer Stories</h2>
            <p className="text-slate-400">Hear from our volunteers who lead campaigns, coordinate batches, and manage drives.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={i}
                className="glass-card p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between"
              >
                <p className="text-slate-350 text-sm italic leading-relaxed mb-6">
                  "{t.story}"
                </p>
                <div className="flex items-center gap-3 border-t border-slate-900 pt-4">
                  <div className="w-10 h-10 rounded-full bg-ngo-950 border border-ngo-800 flex items-center justify-center font-bold text-ngo-400 text-sm">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Call-To-Action */}
      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="grid md:grid-cols-3 gap-8">

            <div>
              <h3 className="text-xl font-bold gradient-text mb-2">
                NayePankh Connect
              </h3>

              <p className="text-slate-400 text-sm">
                Empowering volunteers, building communities,
                and creating meaningful social impact.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">
                Quick Links
              </h4>

              <ul className="space-y-2 text-slate-400 text-sm">
                <li>About Us</li>
                <li>Programs</li>
                <li>Volunteer Portal</li>
                <li>Contact</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">
                Technology Stack
              </h4>

              <p className="text-slate-400 text-sm">
                React • Spring Boot • Supabase • JWT • Tailwind CSS
              </p>
            </div>

          </div>

          <div className="border-t border-slate-800 mt-8 pt-6 text-center">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} NayePankh Connect. All Rights Reserved to Uday Kiran Vura.
            </p>

            <p className="text-slate-600 text-xs mt-2">
              Developed for NayePankh Foundation Volunteer Management System
            </p>
          </div>

        </div>
      </footer>
    </div>


  );
}
