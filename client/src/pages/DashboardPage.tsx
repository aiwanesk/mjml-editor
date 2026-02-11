import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TemplateGrid } from "@/components/dashboard/TemplateGrid";
import { ImportZone } from "@/components/dashboard/ImportZone";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { DeleteConfirmModal } from "@/components/dashboard/DeleteConfirmModal";
import { Button } from "@/components/shared/Button";
import { Spinner } from "@/components/shared/Spinner";
import { useTemplates } from "@/hooks/useTemplates";
import { useOnboarding } from "@/hooks/useOnboarding";
import { GuidedTour } from "@/components/onboarding/GuidedTour";
import { templateApi } from "@/services/templateApi";
import { useNavigate } from "react-router-dom";

const DEFAULT_MJML = {
  tagName: "mjml",
  children: [
    {
      tagName: "mj-head",
      children: [
        {
          tagName: "mj-attributes",
          children: [
            {
              tagName: "mj-all",
              attributes: { "font-family": "Arial, sans-serif" },
            },
          ],
        },
      ],
    },
    {
      tagName: "mj-body",
      children: [
        {
          tagName: "mj-section",
          attributes: { "background-color": "#ffffff" },
          children: [
            {
              tagName: "mj-column",
              children: [
                {
                  tagName: "mj-text",
                  attributes: {
                    "font-size": "24px",
                    "font-weight": "bold",
                    align: "center",
                  },
                  content: "Nouveau template",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export function DashboardPage() {
  const { templates, loading, uploadTemplate, deleteTemplate } = useTemplates();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const { showTour, completeTour } = useOnboarding();
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!search) return templates;
    const q = search.toLowerCase();
    return templates.filter((t) => t.name.toLowerCase().includes(q));
  }, [templates, search]);

  const handleImport = async (file: File) => {
    try {
      const template = await uploadTemplate(file);
      toast.success(`Template "${template.name}" importé avec succès`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'import");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTemplate(deleteTarget.id);
      toast.success("Template supprimé");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  };

  const handleCreateNew = async () => {
    try {
      const template = await templateApi.create("Sans titre", DEFAULT_MJML);
      navigate(`/editor/${template.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la création");
    }
  };

  return (
    <AppShell showHelp onHelpClick={() => window.location.reload()}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mes templates</h1>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4" />
            Nouveau
          </Button>
        </div>

        <div className="mb-6" data-tour="import">
          <ImportZone onImport={handleImport} />
        </div>

        <div className="mb-6 max-w-md">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : (
          <div data-tour="grid">
            <TemplateGrid
              templates={filtered}
              onDelete={(id) => {
                const t = templates.find((t) => t.id === id);
                if (t) setDeleteTarget({ id: t.id, name: t.name });
              }}
            />
          </div>
        )}
      </div>

      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        templateName={deleteTarget?.name || ""}
      />

      {showTour && <GuidedTour onComplete={completeTour} />}
    </AppShell>
  );
}
