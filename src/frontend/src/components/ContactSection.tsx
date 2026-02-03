import { useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { Mail, User, MessageSquare, Loader2 } from 'lucide-react';
import { useSubmitContactRequest } from '../hooks/useQueries';
import { Topics } from '../backend';
import { toast } from 'sonner';

export function ContactSection() {
  const [formData, setFormData] = useState({
    email: '',
    message: '',
    topic: Topics.generalInquiries
  });
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});

  const submitMutation = useSubmitContactRequest();

  const validateForm = () => {
    const newErrors: { email?: string; message?: string } = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Message must not exceed 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await submitMutation.mutateAsync({
        email: formData.email.trim(),
        message: formData.message.trim(),
        topic: formData.topic
      });
      
      toast.success('Message sent successfully!', {
        description: 'Thank you for contacting us. We will get back to you soon.'
      });
      
      // Clear form on success
      setFormData({
        email: '',
        message: '',
        topic: Topics.generalInquiries
      });
      setErrors({});
    } catch (error: any) {
      toast.error('Failed to send message', {
        description: error.message || 'Please try again later.'
      });
    }
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader title="Contact Us" />
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border-2 border-foreground/20 rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="flex items-center gap-2 text-foreground font-semibold mb-2">
                  <Mail size={20} />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`w-full px-4 py-3 bg-background border-2 rounded-lg focus:outline-none transition-colors text-foreground ${
                    errors.email ? 'border-destructive focus:border-destructive' : 'border-foreground/20 focus:border-accent'
                  }`}
                  placeholder="your.email@example.com"
                  disabled={submitMutation.isPending}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="topic" className="flex items-center gap-2 text-foreground font-semibold mb-2">
                  <MessageSquare size={20} />
                  Topic
                </label>
                <select
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value as Topics })}
                  className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-lg focus:border-accent focus:outline-none transition-colors text-foreground"
                  disabled={submitMutation.isPending}
                >
                  <option value={Topics.generalInquiries}>General Inquiries</option>
                  <option value={Topics.businessPartnerships}>Business Partnerships</option>
                  <option value={Topics.advertisingInquiries}>Advertising Inquiries</option>
                  <option value={Topics.interviewRequests}>Interview Requests</option>
                  <option value={Topics.eventOrWorkshopProposals}>Event or Workshop Proposals</option>
                  <option value={Topics.publishingSubmissions}>Publishing Submissions</option>
                  <option value={Topics.challengesAndBounties}>Challenges and Bounties</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="flex items-center gap-2 text-foreground font-semibold mb-2">
                  <MessageSquare size={20} />
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: undefined });
                  }}
                  rows={6}
                  className={`w-full px-4 py-3 bg-background border-2 rounded-lg focus:outline-none transition-colors text-foreground resize-none ${
                    errors.message ? 'border-destructive focus:border-destructive' : 'border-foreground/20 focus:border-accent'
                  }`}
                  placeholder="Your message... (10-1000 characters)"
                  disabled={submitMutation.isPending}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.message ? (
                    <p className="text-sm text-destructive">{errors.message}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {formData.message.length}/1000 characters
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full px-8 py-4 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Sending...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
