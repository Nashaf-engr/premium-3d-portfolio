import { useState } from 'react';
import SectionHeader from './SectionHeader';
import CardLayout from './CardLayout';
import {
  FaWhatsapp,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
  FaUser,
  FaCommentDots,
} from 'react-icons/fa';
import { LuSend } from 'react-icons/lu';

export default function Contact({ onShowToast }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      if (onShowToast) {
        onShowToast('error', 'Incomplete form', 'Please fill in your name, email, and message before sending.');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://formsubmit.co/ajax/nashafeng32@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'New Portfolio Inquiry',
          message: formData.message,
          _subject: 'New portfolio message from website',
          _template: 'table',
          _replyto: formData.email,
          _url: window.location.href
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setFormData({ name: '', email: '', subject: '', message: '' });
      if (onShowToast) {
        onShowToast('success', 'Message sent', 'Thanks for reaching out! Your message has been sent successfully.');
      }
    } catch {
      if (onShowToast) {
        onShowToast('error', 'Message not sent', 'Something went wrong. Please check your network or try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialChannels = [
    { icon: <FaWhatsapp />, url: 'https://wa.me/94720243581?text=Hello%20Naseef%2C%20I%20visited%20your%20portfolio.', label: 'WhatsApp' },
    { icon: <FaLinkedinIn />, url: 'https://www.linkedin.com/in/naseef-sharaf-mfa-291293346/', label: 'LinkedIn' },
    { icon: <FaGithub />, url: 'https://github.com/Nashaf-engr', label: 'GitHub' },
    { icon: <FaInstagram />, url: 'https://www.instagram.com/itz.ur.nx_shx_f', label: 'Instagram' },
  ];

  return (
    <section id="contact" className="relative w-full py-6 sm:py-8">
      <SectionHeader title="Contact Information" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        {/* Top 2 Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardLayout>
            <div className="card-base p-6 md:p-8 space-y-3">
              <span className="text-xs font-mono text-accent uppercase tracking-widest block">
                Location
              </span>
              <div className="space-y-2 text-sm text-light-gray font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Country:</span>
                  <span className="text-snow">Sri Lanka</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Institution:</span>
                  <span className="text-snow">University of Peradeniya</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Field:</span>
                  <span className="text-snow">Computer Engineering</span>
                </div>
              </div>
            </div>
          </CardLayout>

          <CardLayout>
            <div className="card-base p-6 md:p-8 space-y-3">
              <span className="text-xs font-mono text-accent uppercase tracking-widest block">
                Direct Channels
              </span>
              <div className="space-y-2 text-sm text-light-gray font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Email:</span>
                  <a href="mailto:nashafeng32@gmail.com" className="text-snow hover:text-accent transition-colors">
                    nashafeng32@gmail.com
                  </a>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>WhatsApp:</span>
                  <a href="https://wa.me/94720243581" target="_blank" rel="noreferrer" className="text-snow hover:text-accent transition-colors">
                    +94 72 024 3581
                  </a>
                </div>
                <div className="flex justify-between py-1">
                  <span>Availability:</span>
                  <span className="text-accent font-semibold">Open for Collaboration</span>
                </div>
              </div>
            </div>
          </CardLayout>
        </div>

        {/* Social Media Links Bar */}
        <div className="card-base p-6 flex items-center justify-around border border-white/5">
          {socialChannels.map((platform, idx) => (
            <a
              key={idx}
              href={platform.url}
              target="_blank"
              rel="noreferrer"
              aria-label={platform.label}
              className="text-2xl text-snow hover:text-accent hover:scale-125 transition-all duration-300 flex items-center gap-2"
            >
              {platform.icon}
              <span className="text-xs font-mono hidden sm:inline text-light-gray hover:text-accent">
                {platform.label}
              </span>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <div className="card-base p-6 md:p-8 border border-white/5">
          <h3 className="font-display font-bold text-xl text-snow mb-2">
            Get In Touch
          </h3>
          <p className="text-xs sm:text-sm text-light-gray mb-6">
            Have a project, idea, or inquiry? Leave a message below and I will get back to you promptly.
          </p>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative focus-icon">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-light-gray icon-label transition-colors">
                  <FaUser className="text-sm" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field pl-10"
                />
              </div>

              <div className="relative focus-icon">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-light-gray icon-label transition-colors">
                  <FaEnvelope className="text-sm" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div className="relative focus-icon">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-light-gray icon-label transition-colors">
                <FaCommentDots className="text-sm" />
              </div>
              <input
                type="text"
                placeholder="Subject / Project Title"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="input-field pl-10"
              />
            </div>

            <div className="relative focus-icon">
              <textarea
                required
                rows="5"
                placeholder="Your Message..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="input-field resize-none p-3.5"
              />
            </div>

            {/* Honeypot for spam protection */}
            <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <LuSend className="text-sm" />
              {isSubmitting ? 'Sending Message...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
