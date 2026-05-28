import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Msg = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export function ContactMessagesAdmin() {
  const [rows, setRows] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setRows(data as Msg[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      toast.error("Suppression impossible");
      return;
    }
    setRows((r) => r.filter((m) => m.id !== id));
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Messages de contact ({rows.length})
        </h3>
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Chargement…
          </div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Aucun message pour l'instant.
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.map((m) => (
              <li key={m.id} className="rounded-lg border border-border bg-background p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{m.name}</div>
                    <a
                      href={`mailto:${m.email}`}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Mail className="h-3 w-3" /> {m.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      {new Date(m.created_at).toLocaleString("fr-FR")}
                    </span>
                    <button
                      onClick={() => remove(m.id)}
                      aria-label="Supprimer"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{m.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
