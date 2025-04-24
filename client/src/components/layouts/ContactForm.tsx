"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import emailjs from "emailjs-com";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/utils/api";
import { SendIcon } from "lucide-react";

// EmailJS configuration
const EMAIL_SERVICE_ID = "service_yaymv75";
const EMAIL_TEMPLATE_ID = "template_3fuoy8m";
const EMAIL_USER_ID = "uk5KAEW_CQLtVLpZY";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = "required";
    if (!formData.email.trim()) newErrors.email = "required";
    if (!formData.subject.trim()) newErrors.subject = "required";
    if (!formData.message.trim()) newErrors.message = "required";

    // Basic email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: t("contact.errorMessage"),
        description: "",
      });
      return;
    }

    setLoading(true);

    try {
      // Send email via EmailJS (as a fallback)
      // await emailjs.send(
      //   EMAIL_SERVICE_ID,
      //   EMAIL_TEMPLATE_ID,
      //   {
      //     name: formData.name,
      //     email: formData.email,
      //     subject: formData.subject,
      //     message: formData.message,
      //   },
      //   EMAIL_USER_ID,
      // );

      // Also store the message in the database through our API
      await api.post("/contacts", {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      toast({
        title: t("contact.successfulMessage"),
        description: "",
      });

      // Reset form after successful submission
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: t("contact.failedMessage"),
        description: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border border-[var(--border)]">
      <div className="p-6 sm:p-10">
        <h3 className="text-3xl font-semibold text-[var(--headline)]">
          {t("contact.title")}
        </h3>
        <p className="mt-4 text-base text-[var(--paragraph)]">
          {t("contact.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="space-y-6">
            <Input
              id="name"
              name="name"
              type="text"
              placeholder={t("contact.nameInput")}
              value={formData.name}
              className={errors.name ? "border-red-500" : ""}
              onChange={handleChange}
              aria-invalid={!!errors.name}
            />

            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("contact.emailInput")}
              value={formData.email}
              className={errors.email ? "border-red-500" : ""}
              onChange={handleChange}
              aria-invalid={!!errors.email}
            />

            <Input
              id="subject"
              name="subject"
              type="text"
              placeholder={t("contact.subjectInput") || "Subject"}
              value={formData.subject}
              className={errors.subject ? "border-red-500" : ""}
              onChange={handleChange}
              aria-invalid={!!errors.subject}
            />

            <Textarea
              id="message"
              name="message"
              placeholder={t("contact.messageInput")}
              value={formData.message}
              className={`min-h-[180px] ${errors.message ? "border-red-500" : ""}`}
              onChange={handleChange}
              aria-invalid={!!errors.message}
            />

            <div>
              <Button
                className="w-full sm:w-auto"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="-ml-1 mr-2 h-4 w-4 animate-spin text-[var(--headline)]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("contact.sending")}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <SendIcon className="mr-2 h-4 w-4" />
                    {t("contact.send")}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default ContactForm;
