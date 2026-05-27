import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_EMAIL = "advaxe.mucatcha@gmail.com";

/** Public: returns just the registration count for the landing page. */
export const getPublicRegistrationCount = createServerFn({ method: "GET" }).handler(async () => {
  const { count, error } = await supabaseAdmin
    .from("registrations")
    .select("*", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  return { count: count ?? 0 };
});

/** Idempotent: ensures the single allowlisted admin account exists. */
export const ensureAdminAccount = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({
    email: z.string().email(),
    password: z.string().min(8).max(72),
  }).parse(input))
  .handler(async ({ data }) => {
    if (data.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      throw new Error("Email non autorisé.");
    }
    // Check if user already exists
    const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
    if (listErr) throw new Error(listErr.message);
    const existing = list.users.find((u) => u.email?.toLowerCase() === data.email.toLowerCase());
    if (existing) return { created: false };

    const { error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error) throw new Error(error.message);
    return { created: true };
  });
