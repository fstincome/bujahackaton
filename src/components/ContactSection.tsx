import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Send, Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  message: z.string().trim().min(1, "Message requis").max(2000),
});

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe: typeof errors = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as keyof typeof form;
        fe[k] = i.message;
      });
      setErrors(fe);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setSubmitting(false);
    if (error) {
      toast.error("Échec de l'envoi. Réessayez.");
      return;
    }
    toast.success("Message envoyé. Merci !");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <section id="contact" className="border-t border-border bg-card/30 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <div className="font-mono text-xs uppercase tracking-widest text-primary">// Contact</div>
          <h2 className="mt-3 text-4xl font-bold">Une question ?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Écrivez-nous, l'équipe vous répondra rapidement.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-10 grid gap-4 rounded-xl border border-border bg-background p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Nom</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                maxLength={100}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>
            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                maxLength={255}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              maxLength={2000}
              rows={5}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <a
              href="mailto:info@bitdevsgtga.org"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>info@bitdevsgtga.org</span>
            </a>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
