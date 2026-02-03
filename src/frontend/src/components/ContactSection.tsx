import { useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { Mail, User, MessageSquare } from 'lucide-react';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader title="Contact Us" />
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border-2 border-foreground/20 rounded-lg p-8">
            <div className="mb-6 p-4 bg-accent/10 border-l-4 border-accent rounded">
              <p className="text-foreground font-medium">
                📧 Contact form coming soon! We're working on connecting this feature.
              </p>
            </div>

            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="flex items-center gap-2 text-foreground font-semibold mb-2">
                  <User size={20} />
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-lg focus:border-accent focus:outline-none transition-colors text-foreground"
                  placeholder="Your name"
                  disabled
                />
              </div>

              <div>
                <label htmlFor="email" className="flex items-center gap-2 text-foreground font-semibold mb-2">
                  <Mail size={20} />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-lg focus:border-accent focus:outline-none transition-colors text-foreground"
                  placeholder="your.email@example.com"
                  disabled
                />
              </div>

              <div>
                <label htmlFor="message" className="flex items-center gap-2 text-foreground font-semibold mb-2">
                  <MessageSquare size={20} />
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-lg focus:border-accent focus:outline-none transition-colors text-foreground resize-none"
                  placeholder="Your message..."
                  disabled
                />
              </div>

              <button
                type="button"
                disabled
                className="w-full px-8 py-4 bg-foreground/20 text-foreground/50 font-bold text-lg rounded-lg cursor-not-allowed"
              >
                Submit (Coming Soon)
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
