// name this page.tsx inside contact folder
'use client';

import React, { useState, useEffect, useRef } from 'react';

interface FormData {
  name: string;
  phone: string;
  email: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

interface FieldState {
  touched: boolean;
  focused: boolean;
}

const validateEmail = (email: string): string | undefined => {
  if (!email) return "Email is required";
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return "Enter a valid email address";
};

const validatePhone = (phone: string): string | undefined => {
  if (!phone) return "Phone number is required";
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length < 10) return "Enter a valid 10-digit phone number";
  if (digitsOnly.length > 11) return "Phone number is too long";
};

const validateName = (name: string): string | undefined => {
  if (!name.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
};

const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [fieldState, setFieldState] = useState<Record<keyof FormData, FieldState>>({
    name: { touched: false, focused: false },
    phone: { touched: false, focused: false },
    email: { touched: false, focused: false },
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  const getError = (field: keyof FormData): string | undefined => {
    if (!fieldState[field].touched) return undefined;
    return errors[field];
  };

  const validate = (data: FormData): FormErrors => ({
    name: validateName(data.name),
    phone: validatePhone(data.phone),
    email: validateEmail(data.email),
  });

  const handleChange = (field: keyof FormData, value: string) => {
    const newValue = field === "phone" ? formatPhone(value) : value;
    const newData = { ...formData, [field]: newValue };
    setFormData(newData);
    if (fieldState[field].touched) setErrors(validate(newData));
  };

  const handleBlur = (field: keyof FormData) => {
    setFieldState((prev) => ({ ...prev, [field]: { ...prev[field], touched: true, focused: false } }));
    setErrors(validate(formData));
  };

  const handleFocus = (field: keyof FormData) => {
    setFieldState((prev) => ({ ...prev, [field]: { ...prev[field], focused: true } }));
  };

  const handleSubmit = async () => {
    const allTouched = {
      name: { touched: true, focused: false },
      phone: { touched: true, focused: false },
      email: { touched: true, focused: false },
    };
    setFieldState(allTouched);
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ name: "", phone: "", email: "" });
    setErrors({});
    setFieldState({
      name: { touched: false, focused: false },
      phone: { touched: false, focused: false },
      email: { touched: false, focused: false },
    });
    setSubmitted(false);
  };

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const fields: {
    key: keyof FormData;
    label: string;
    type: string;
    placeholder: string;
    autocomplete: string;
  }[] = [
    { key: "name", label: "Full Name", type: "text", placeholder: "Jane Smith", autocomplete: "name" },
    { key: "phone", label: "Phone Number", type: "tel", placeholder: "(555) 000-0000", autocomplete: "tel" },
    { key: "email", label: "Email Address", type: "email", placeholder: "jane@example.com", autocomplete: "email" },
  ];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">

      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Have a question or want to connect with a local professional? Fill out
          the form below and well get back to you within one business day.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Contact Form */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-800">Contact Us</h2>

          {submitted ? (
            <div
              ref={successRef}
              tabIndex={-1}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center outline-none"
            >
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-400 flex items-center justify-center mx-auto mb-4 text-green-600 text-xl">
                ✓
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Thank you!</h3>
              <p className="text-gray-600 text-sm mb-4">
                Your information has been received. Well be in touch soon.
              </p>
              <div className="text-left space-y-2 mb-4">
                {[["Name", formData.name], ["Phone", formData.phone], ["Email", formData.email]].map(
                  ([label, value]) => (
                    <div key={label} className="flex justify-between text-sm border-b border-gray-100 pb-1">
                      <span className="text-gray-500 font-medium">{label}</span>
                      <span className="text-gray-800">{value}</span>
                    </div>
                  )
                )}
              </div>
              <button
                onClick={handleReset}
                className="text-sm text-blue-800 font-medium border border-gray-200 rounded-lg px-4 py-2 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                Submit Another
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field) => {
                const error = getError(field.key);
                const isValid =
                  fieldState[field.key].touched &&
                  !errors[field.key] &&
                  formData[field.key].length > 0;

                return (
                  <div key={field.key}>
                    <label
                      htmlFor={field.key}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        id={field.key}
                        type={field.type}
                        autoComplete={field.autocomplete}
                        placeholder={field.placeholder}
                        value={formData[field.key]}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        onBlur={() => handleBlur(field.key)}
                        onFocus={() => handleFocus(field.key)}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${field.key}-error` : undefined}
                        className={[
                          "w-full px-3 py-2 text-sm text-gray-900 rounded-lg border bg-white",
                          "outline-none transition-all",
                          error
                            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            : isValid
                            ? "border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100",
                        ].join(" ")}
                        style={{ paddingRight: isValid ? "2rem" : undefined }}
                      />
                      {isValid && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm pointer-events-none">
                          ✓
                        </span>
                      )}
                    </div>
                    {error && (
                      <p
                        id={`${field.key}-error`}
                        role="alert"
                        className="mt-1 text-xs text-red-500 flex items-center gap-1"
                      >
                        <span aria-hidden="true">⚠</span> {error}
                      </p>
                    )}
                  </div>
                );
              })}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                aria-busy={submitting}
                className="w-full mt-2 py-2.5 px-4 bg-blue-800 hover:bg-blue-900 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>
          )}
        </section>

        {/* Info Card — mirrors the Tech Stack card from About */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">What to Expect</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
              A response within one business day
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-teal-500 rounded-full mr-2 flex-shrink-0"></span>
              Connection to the right local professional
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-2 flex-shrink-0"></span>
              Your information is never sold or shared
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 flex-shrink-0"></span>
              Friendly, personalized support
            </li>
          </ul>
        </section>

      </div>

      {/* Footer — matches About page footer exactly */}
      <footer className="mt-20 pt-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500 italic">
          Developed for CIS-107: Web Database Development at Diablo Valley College.
        </p>
      </footer>

    </div>
  );
}
