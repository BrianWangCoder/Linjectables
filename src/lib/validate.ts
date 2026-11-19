export type EnquiryErrors = Partial<Record<"name" | "email" | "phone" | "message" | "form", string>>;

/** Shared by the client form and the API route so rules never drift. */
export function validateEnquiry(data: { name: string; email: string; phone: string; message: string }): EnquiryErrors {
  const e: EnquiryErrors = {};
  if (data.name.trim().length < 2 || data.name.length > 120) e.name = "Please enter your name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()) || data.email.length > 200) e.email = "Please enter a valid email";
  const digits = data.phone.replace(/[^\d]/g, "");
  if (digits.length < 7 || digits.length > 15) e.phone = "Please enter a valid mobile number";
  if (data.message.trim().length < 5) e.message = "Please tell us a little about your enquiry";
  if (data.message.length > 4000) e.message = "Please keep your message under 4,000 characters";
  return e;
}
