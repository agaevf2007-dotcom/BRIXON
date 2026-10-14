"use client";

import { Button } from "@/components/Button";
import { useLocale } from "@/context/LocaleContext";
import { useToast } from "@/context/ToastContext";
import { useState } from "react";

type Errors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+0-9()\-\s]{7,}$/;

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { pushToast } = useToast();
  const { t } = useLocale();

  const validate = () => {
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = t("contacts.errName");
    if (!emailPattern.test(values.email)) next.email = t("contacts.errEmail");
    if (values.phone && !phonePattern.test(values.phone)) next.phone = t("contacts.errPhone");
    if (values.message.trim().length < 10) next.message = t("contacts.errMessage");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSent(true);
      pushToast({ title: t("contacts.sentToast"), description: t("contacts.sentHint"), tone: "success" });
    }, 700);
  };

  if (sent) {
    return (
      <div className="rounded-[2rem] bg-white p-8 md:p-10">
        <p className="text-3xl tracking-tight">{t("contacts.thanks")}</p>
        <p className="mt-3 text-muted">{t("contacts.thanksText")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-[2rem] bg-white p-6 md:p-10">
      <Field
        label={t("contacts.name")}
        id="contact-name"
        value={values.name}
        error={errors.name}
        onChange={(value) => setValues((current) => ({ ...current, name: value }))}
      />
      <Field
        label={t("contacts.email")}
        id="contact-email"
        type="email"
        value={values.email}
        error={errors.email}
        onChange={(value) => setValues((current) => ({ ...current, email: value }))}
      />
      <Field
        label={t("contacts.phone")}
        id="contact-phone"
        value={values.phone}
        error={errors.phone}
        optionalLabel={t("contacts.optional")}
        onChange={(value) => setValues((current) => ({ ...current, phone: value }))}
      />
      <Field
        label={t("contacts.message")}
        id="contact-message"
        value={values.message}
        error={errors.message}
        textarea
        onChange={(value) => setValues((current) => ({ ...current, message: value }))}
      />
      <Button type="submit" loading={loading} className="mt-4 w-full sm:w-auto">
        {t("contacts.send")}
      </Button>
    </form>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  error,
  type = "text",
  textarea,
  optionalLabel,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  textarea?: boolean;
  optionalLabel?: string;
}) {
  const classes =
    "mt-2 w-full rounded-2xl border border-ink/10 bg-canvas px-4 py-3 outline-none transition-colors focus:border-accent";

  return (
    <div className="mb-5">
      <label htmlFor={id} className="text-sm">
        {label} {optionalLabel ? <span className="text-muted">({optionalLabel})</span> : null}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={5}
          className={classes}
          aria-invalid={Boolean(error)}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={classes}
          aria-invalid={Boolean(error)}
        />
      )}
      {error ? <p className="mt-1 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
