import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import emailjs from "emailjs-com";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name === "" || email === "" || message === "") {
      setErr(true);
      toast({
        title: t("contact.errorMessage"),
        description: "",
      });
      return;
    }

    setLoading(true);

    const form = document.createElement("form");
    form.setAttribute("action", "");
    form.setAttribute("method", "post");

    const nameInput = document.createElement("input");
    nameInput.setAttribute("type", "hidden");
    nameInput.setAttribute("name", "name");
    nameInput.setAttribute("value", name);
    form.appendChild(nameInput);

    const emailInput = document.createElement("input");
    emailInput.setAttribute("type", "hidden");
    emailInput.setAttribute("name", "email");
    emailInput.setAttribute("value", email);
    form.appendChild(emailInput);

    const messageInput = document.createElement("input");
    messageInput.setAttribute("type", "hidden");
    messageInput.setAttribute("name", "message");
    messageInput.setAttribute("value", message);
    form.appendChild(messageInput);

    document.body.appendChild(form);

    try {
      await emailjs.sendForm(
        "service_yaymv75",
        "template_3fuoy8m",
        form,
        "uk5KAEW_CQLtVLpZY",
      );

      toast({
        title: t("contact.successfulMessage"),
        description: "",
      });
      setName("");
      setEmail("");
      setMessage("");
      setErr(false);
    } catch (error) {
      toast({
        title: t("contact.failedMessage"),
        description: "",
      });
    } finally {
      document.body.removeChild(form);
      setLoading(false);
    }
  };

  const { t } = useTranslation();

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <section
      dir={direction}
      id="contact"
      className="section mx-auto max-w-3xl text-center"
    >
      <h3 className="section-title pb-0">{t("contact.title")}</h3>
      <p className="description pb-6">{t("contact.subtitle")}</p>

      <form onSubmit={handleSubmit} className="space-y-2 bg-transparent">
        <div>
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder={t("contact.nameInput")}
            value={name}
            className={err && !name ? "border-red-500" : ""}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t("contact.emailInput")}
            value={email}
            className={err && !email ? "border-red-500" : ""}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <Textarea
            id="message"
            name="message"
            placeholder={t("contact.messageInput")}
            value={message}
            className={err && !message ? "h-36 border-red-500" : "h-36"}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : t("contact.send")}
        </Button>
      </form>
    </section>
  );
}
