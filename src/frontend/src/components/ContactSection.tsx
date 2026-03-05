import { Loader2, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Topics } from "../backend";
import { useSubmitContactRequest } from "../hooks/useQueries";
import { SectionHeader } from "./SectionHeader";

const SLATE_ACCENT = "oklch(0.65 0.14 230)";
const SLATE_BG = "oklch(0.14 0.04 230)";
const SLATE_CARD = "oklch(0.18 0.04 230)";
const SLATE_INPUT_BG = "oklch(0.11 0.03 230)";

export function ContactSection() {
  const [formData, setFormData] = useState({
    email: "",
    message: "",
    topic: Topics.generalInquiries,
  });
  const [errors, setErrors] = useState<{ email?: string; message?: string }>(
    {},
  );

  const submitMutation = useSubmitContactRequest();

  const validateForm = () => {
    const newErrors: { email?: string; message?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (formData.message.length > 1000) {
      newErrors.message = "Message must not exceed 1000 characters";
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
        topic: formData.topic,
      });

      toast.success("Message sent successfully!", {
        description:
          "Thank you for contacting us. We will get back to you soon.",
      });

      // Clear form on success
      setFormData({
        email: "",
        message: "",
        topic: Topics.generalInquiries,
      });
      setErrors({});
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error("Failed to send message", {
        description: err.message ?? "Please try again later.",
      });
    }
  };

  return (
    <section
      id="contact"
      data-ocid="contact.section"
      className="py-20"
      style={{ backgroundColor: SLATE_BG }}
    >
      <div className="container mx-auto px-4">
        <SectionHeader title="Contact Us" accentColor={SLATE_ACCENT} />
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-lg p-8"
            style={{
              backgroundColor: SLATE_CARD,
              border: `2px solid ${SLATE_ACCENT}30`,
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 font-semibold mb-2"
                  style={{ color: "oklch(0.92 0.01 85)" }}
                >
                  <Mail size={20} style={{ color: SLATE_ACCENT }} />
                  Email
                </label>
                <input
                  data-ocid="contact.input"
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email)
                      setErrors({ ...errors, email: undefined });
                  }}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none transition-colors"
                  style={{
                    backgroundColor: SLATE_INPUT_BG,
                    border: errors.email
                      ? "2px solid oklch(0.62 0.20 20)"
                      : `2px solid ${SLATE_ACCENT}35`,
                    color: "oklch(0.92 0.01 85)",
                  }}
                  onFocus={(e) => {
                    if (!errors.email) {
                      (e.currentTarget as HTMLInputElement).style.border =
                        `2px solid ${SLATE_ACCENT}`;
                      (e.currentTarget as HTMLInputElement).style.boxShadow =
                        `0 0 0 3px ${SLATE_ACCENT}20`;
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.email) {
                      (e.currentTarget as HTMLInputElement).style.border =
                        `2px solid ${SLATE_ACCENT}35`;
                      (e.currentTarget as HTMLInputElement).style.boxShadow =
                        "none";
                    }
                  }}
                  placeholder="your.email@example.com"
                  disabled={submitMutation.isPending}
                />
                {errors.email && (
                  <p
                    data-ocid="contact.email.error_state"
                    className="mt-1 text-sm"
                    style={{ color: "oklch(0.72 0.18 20)" }}
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="topic"
                  className="flex items-center gap-2 font-semibold mb-2"
                  style={{ color: "oklch(0.92 0.01 85)" }}
                >
                  <MessageSquare size={20} style={{ color: SLATE_ACCENT }} />
                  Topic
                </label>
                <select
                  data-ocid="contact.select"
                  id="topic"
                  value={formData.topic}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      topic: e.target.value as Topics,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg focus:outline-none transition-colors"
                  style={{
                    backgroundColor: SLATE_INPUT_BG,
                    border: `2px solid ${SLATE_ACCENT}35`,
                    color: "oklch(0.92 0.01 85)",
                  }}
                  disabled={submitMutation.isPending}
                >
                  <option value={Topics.generalInquiries}>
                    General Inquiries
                  </option>
                  <option value={Topics.businessPartnerships}>
                    Business Partnerships
                  </option>
                  <option value={Topics.advertisingInquiries}>
                    Advertising Inquiries
                  </option>
                  <option value={Topics.interviewRequests}>
                    Interview Requests
                  </option>
                  <option value={Topics.eventOrWorkshopProposals}>
                    Event or Workshop Proposals
                  </option>
                  <option value={Topics.publishingSubmissions}>
                    Publishing Submissions
                  </option>
                  <option value={Topics.challengesAndBounties}>
                    Challenges and Bounties
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="flex items-center gap-2 font-semibold mb-2"
                  style={{ color: "oklch(0.92 0.01 85)" }}
                >
                  <MessageSquare size={20} style={{ color: SLATE_ACCENT }} />
                  Message
                </label>
                <textarea
                  data-ocid="contact.textarea"
                  id="message"
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message)
                      setErrors({ ...errors, message: undefined });
                  }}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none transition-colors resize-none"
                  style={{
                    backgroundColor: SLATE_INPUT_BG,
                    border: errors.message
                      ? "2px solid oklch(0.62 0.20 20)"
                      : `2px solid ${SLATE_ACCENT}35`,
                    color: "oklch(0.92 0.01 85)",
                  }}
                  placeholder="Your message... (10-1000 characters)"
                  disabled={submitMutation.isPending}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.message ? (
                    <p
                      data-ocid="contact.message.error_state"
                      className="text-sm"
                      style={{ color: "oklch(0.72 0.18 20)" }}
                    >
                      {errors.message}
                    </p>
                  ) : (
                    <p
                      className="text-sm"
                      style={{ color: "oklch(0.50 0.04 230)" }}
                    >
                      {formData.message.length}/1000 characters
                    </p>
                  )}
                </div>
              </div>

              <button
                data-ocid="contact.submit_button"
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full px-8 py-4 font-bold text-lg rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  backgroundColor: SLATE_ACCENT,
                  color: "oklch(0.98 0.005 85)",
                }}
                onMouseEnter={(e) => {
                  if (!submitMutation.isPending) {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "oklch(0.72 0.16 230)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    SLATE_ACCENT;
                }}
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Sending...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
