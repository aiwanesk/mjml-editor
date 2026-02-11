import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { AppShell } from "@/components/layout/AppShell";
import { EditorLayout } from "@/components/editor/EditorLayout";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { PreviewPanel } from "@/components/editor/PreviewPanel";
import { PropertyPanel } from "@/components/editor/PropertyPanel";
import { WidgetSidebar } from "@/components/editor/WidgetSidebar";
import { BlockOverlay } from "@/components/editor/BlockOverlay";
import { Spinner } from "@/components/shared/Spinner";
import type { PreviewFrameHandle } from "@/components/editor/PreviewFrame";
import { useTemplate } from "@/hooks/useTemplate";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { useEditorSelection } from "@/hooks/useEditorSelection";
import { useMjmlPreview } from "@/hooks/useMjmlPreview";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { assignNodeIds } from "@/lib/node-id";
import { updateNodeById, removeNodeById, getBodyNode, insertNodeAt } from "@/lib/mjml-utils";
import { createWidgetNode } from "@/lib/widget-defaults";
import type { MjmlNode } from "@/types/mjml";

export function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { template, loading, error } = useTemplate(id);
  const [activeWidgetId, setActiveWidgetId] = useState<string | null>(null);
  const previewRef = useRef<PreviewFrameHandle>(null);

  const { current: ast, pushState, undo, redo, canUndo, canRedo } = useUndoRedo(null);
  const { selectedNodeId, hoveredNodeId, selectNode, hoverNode } = useEditorSelection();

  // compileAst is only updated on structural changes → triggers server recompile
  const [compileAst, setCompileAst] = useState<MjmlNode | null>(null);
  const { html, compiling } = useMjmlPreview(compileAst);

  const { status: saveStatus, save } = useAutoSave(id, ast);
  useUnsavedChanges(saveStatus);

  // Initialize AST from template
  useEffect(() => {
    if (template && !ast) {
      const withIds = assignNodeIds(template.mjmlJson);
      pushState(withIds);
      setCompileAst(withIds);
    }
  }, [template]);

  // Text-only content update: patches iframe DOM instantly, no recompile
  const handleUpdateContent = useCallback(
    (nodeId: string, content: string) => {
      if (!ast) return;
      const newAst = updateNodeById(ast, nodeId, (n) => ({ ...n, content }));
      pushState(newAst);
      // Instant DOM patch in the iframe — zero flicker
      previewRef.current?.patchContent(nodeId, content);
    },
    [ast, pushState]
  );

  // Structural change: add/remove widgets → triggers full recompile
  const pushStructural = useCallback(
    (newAst: MjmlNode) => {
      pushState(newAst);
      setCompileAst(newAst);
    },
    [pushState]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      if (!ast) return;
      const newAst = removeNodeById(ast, nodeId);
      pushStructural(newAst);
      selectNode(null);
      toast.success("Élément supprimé");
    },
    [ast, pushStructural, selectNode]
  );

  const handleInsertWidget = useCallback(
    (index: number, widgetId: string) => {
      if (!ast) return;
      const newNode = createWidgetNode(widgetId);
      if (!newNode) return;

      const bodyNode = getBodyNode(ast);
      if (!bodyNode || !bodyNode["data-node-id"]) return;

      const isStructure = newNode.tagName === "mj-section";
      if (isStructure) {
        const newAst = insertNodeAt(ast, bodyNode["data-node-id"], index, newNode);
        pushStructural(newAst);
      } else {
        const wrapperNode = assignNodeIds({
          tagName: "mj-section",
          attributes: { "background-color": "#ffffff" },
          children: [
            {
              tagName: "mj-column",
              children: [newNode],
            },
          ],
        });
        const newAst = insertNodeAt(ast, bodyNode["data-node-id"], index, wrapperNode);
        pushStructural(newAst);
      }
      toast.success("Widget ajouté");
    },
    [ast, pushStructural]
  );

  // Handle Delete key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedNodeId && !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName)) {
        handleDeleteNode(selectedNodeId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId, handleDeleteNode]);

  // Undo/redo are structural — they may change structure, so recompile
  const handleUndo = useCallback(() => {
    undo();
    // compileAst will be stale, schedule recompile from the new ast after undo
    setTimeout(() => {
      // The new current is set by undo synchronously
    }, 0);
  }, [undo]);

  const handleRedo = useCallback(() => {
    redo();
  }, [redo]);

  // Sync compileAst when undo/redo changes ast structurally
  useEffect(() => {
    if (ast && compileAst && JSON.stringify(ast) !== JSON.stringify(compileAst)) {
      // Check if it's a structural diff (not just text content)
      // Simple heuristic: if the AST stringified with contents stripped differs, recompile
      const stripContent = (n: MjmlNode): unknown => ({
        t: n.tagName,
        a: n.attributes,
        id: n["data-node-id"],
        c: n.children?.map(stripContent),
      });
      const structA = JSON.stringify(stripContent(ast));
      const structC = JSON.stringify(stripContent(compileAst));
      if (structA !== structC) {
        setCompileAst(ast);
      }
    }
  }, [ast]);

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.type === "widget") {
      setActiveWidgetId(data.widgetId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveWidgetId(null);
    const data = event.active.data.current;
    if (!data || data.type !== "widget" || !ast) return;

    const newNode = createWidgetNode(data.widgetId);
    if (!newNode) return;

    const bodyNode = getBodyNode(ast);
    if (!bodyNode || !bodyNode["data-node-id"]) return;

    const index = bodyNode.children?.length || 0;

    const isStructure = ["mj-section"].includes(newNode.tagName);
    if (isStructure) {
      const newAst = insertNodeAt(ast, bodyNode["data-node-id"], index, newNode);
      pushStructural(newAst);
    } else {
      const wrapperNode = assignNodeIds({
        tagName: "mj-section",
        attributes: { "background-color": "#ffffff" },
        children: [
          {
            tagName: "mj-column",
            children: [newNode],
          },
        ],
      });
      const newAst = insertNodeAt(ast, bodyNode["data-node-id"], index, wrapperNode);
      pushStructural(newAst);
    }

    toast.success("Widget ajouté");
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[calc(100vh-49px)]">
          <Spinner size="lg" />
        </div>
      </AppShell>
    );
  }

  if (error || !template) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-49px)] gap-4">
          <p className="text-red-500">{error || "Template non trouvé"}</p>
          <button
            onClick={() => navigate("/")}
            className="text-indigo-500 hover:underline"
          >
            Retour au dashboard
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <EditorLayout
          toolbar={
            <EditorToolbar
              templateName={template.name}
              templateId={template.id}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onSave={save}
              saveStatus={saveStatus}
            />
          }
          widgetPanel={<WidgetSidebar />}
          preview={
            <PreviewPanel
              ref={previewRef}
              html={html}
              compiling={compiling}
              selectedNodeId={selectedNodeId}
              hoveredNodeId={hoveredNodeId}
              onSelectNode={selectNode}
              onHoverNode={hoverNode}
            />
          }
          propertyPanel={
            ast ? (
              <PropertyPanel
                ast={ast}
                selectedNodeId={selectedNodeId}
                onSelectNode={selectNode}
                onUpdateContent={handleUpdateContent}
                onDeleteNode={handleDeleteNode}
                onInsertWidget={handleInsertWidget}
              />
            ) : (
              <div className="p-6 text-sm text-gray-500">Chargement...</div>
            )
          }
        />
        <BlockOverlay activeWidgetId={activeWidgetId} />
      </DndContext>
    </AppShell>
  );
}
