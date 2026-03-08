import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Moon, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSubmitReferral } from "../hooks/useQueries";

const REFERRAL_KEY = "wotwm_referral_submitted";

const REFERRAL_OPTIONS = [
  { value: "Google / AI", label: "Google / AI", icon: "🔍" },
  { value: "YouTube", label: "YouTube", icon: "▶️" },
  {
    value: "Social Media (Instagram, X, etc.)",
    label: "Social Media",
    icon: "📱",
  },
  {
    value: "Friend / Word of Mouth",
    label: "Friend / Word of Mouth",
    icon: "🗣️",
  },
  { value: "Reddit", label: "Reddit", icon: "👾" },
  { value: "TikTok", label: "TikTok", icon: "🎵" },
  { value: "Other", label: "Other", icon: "✨" },
];

export function ReferralPopup() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const [otherText, setOtherText] = useState("");
  const [otherError, setOtherError] = useState(false);
  const submitReferral = useSubmitReferral();

  useEffect(() => {
    const stored = localStorage.getItem(REFERRAL_KEY);
    if (stored) return;

    const timer = setTimeout(() => {
      setOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    localStorage.setItem(REFERRAL_KEY, "skipped");
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!selected) return;

    if (selected === "Other" && !otherText.trim()) {
      setOtherError(true);
      return;
    }

    try {
      await submitReferral.mutateAsync({
        source: selected,
        otherText: selected === "Other" ? otherText.trim() : undefined,
      });
      localStorage.setItem(REFERRAL_KEY, "1");
      setOpen(false);
      toast.success("Thanks for letting us know!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleSelect = (value: string) => {
    setSelected(value);
    setOtherError(false);
    if (value !== "Other") setOtherText("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleSkip();
      }}
    >
      <DialogContent
        className="referral-dialog max-w-md w-full p-0 border-0 overflow-hidden"
        data-ocid="referral.dialog"
        aria-describedby="referral-description"
      >
        {/* Decorative top glow */}
        <div className="referral-dialog-glow" aria-hidden="true" />

        {/* Close button */}
        <button
          type="button"
          onClick={handleSkip}
          className="referral-close-btn"
          aria-label="Skip"
          data-ocid="referral.close_button"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-6 pt-8 pb-7">
          <DialogHeader>
            {/* Moon icon */}
            <div className="flex justify-center mb-4">
              <div className="referral-icon-ring">
                <Moon className="w-6 h-6 referral-accent-icon" />
              </div>
            </div>

            <DialogTitle className="referral-title text-center text-xl font-bold mb-1">
              How did you find us?
            </DialogTitle>
            <p
              id="referral-description"
              className="referral-subtitle text-center text-sm mb-5"
            >
              Help us understand where our community comes from 🌙
            </p>
          </DialogHeader>

          {/* Options grid */}
          <div
            className="grid grid-cols-2 gap-2 mb-4"
            aria-label="How did you find us?"
          >
            {REFERRAL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={selected === opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`referral-option-btn ${selected === opt.value ? "referral-option-active" : ""}`}
                data-ocid={`referral.${opt.value.toLowerCase().replace(/[^a-z0-9]/g, "_")}.toggle`}
              >
                <span className="text-base">{opt.icon}</span>
                <span className="text-sm font-medium leading-tight">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>

          {/* "Other" expand */}
          <AnimatePresence>
            {selected === "Other" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mb-4"
              >
                <div className="pt-1">
                  <input
                    type="text"
                    placeholder="Please specify…"
                    value={otherText}
                    onChange={(e) => {
                      setOtherText(e.target.value);
                      setOtherError(false);
                    }}
                    className={`referral-other-input w-full ${otherError ? "referral-other-input-error" : ""}`}
                    maxLength={200}
                    data-ocid="referral.other.input"
                  />
                  {otherError && (
                    <p
                      className="referral-error-text text-xs mt-1"
                      data-ocid="referral.other.error_state"
                    >
                      Please tell us how you found us.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleSkip}
              className="referral-skip-btn flex-1"
              data-ocid="referral.skip.button"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selected || submitReferral.isPending}
              className="referral-submit-btn flex-1"
              data-ocid="referral.submit_button"
            >
              {submitReferral.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Submit
                </span>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
