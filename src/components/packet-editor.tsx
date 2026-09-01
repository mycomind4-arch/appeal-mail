import { useState } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, RotateCw, Trash2, FileText, Image as ImageIcon } from "lucide-react";

export type PacketPageOp = { partId: string; sourcePageIndex: number; rotation: number; removed?: boolean };
export type PacketEditorFile = { id: string; file: File; kind: "source" | "supporting" };

interface Item { id: string; label: string; partId: string; pageIndex: number; rotation: number; fileId: string; }

interface Props {
  draft: string;
  onDraftChange: (value: string) => void;
  sourceFile: File;
  onAssemble: (draft: string, files: PacketEditorFile[], ops: PacketPageOp[]) => Promise<void>;
  busy?: boolean;
}

function SortableItem({ item, onRotate, onRemove, removed }: { item: Item; onRotate: () => void; onRemove: () => void; removed: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  return <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: removed ? 0.45 : 1 }} className="flex items-center gap-3 rounded-lg border border-rule bg-paper p-3">
    <button {...attributes} {...listeners} aria-label={`Drag ${item.label}`} className="cursor-grab p-1 text-muted-foreground"><GripVertical size={18} /></button>
    <div className="flex h-16 w-12 items-center justify-center rounded border border-rule bg-paper-deep">{item.fileId ? <FileText size={18} /> : <ImageIcon size={18} />}</div>
    <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{item.label}</div><div className="text-xs text-muted-foreground">Page {item.pageIndex + 1}{item.rotation ? ` · ${item.rotation}°` : ""}</div></div>
    <button type="button" onClick={onRotate} disabled={removed} className="rounded-md border border-rule p-2 text-muted-foreground hover:text-foreground disabled:opacity-40" title="Rotate 90 degrees"><RotateCw size={16} /></button>
    <button type="button" onClick={onRemove} className="rounded-md border border-rule p-2 text-muted-foreground hover:text-red-600" title={removed ? "Restore page" : "Remove page"}><Trash2 size={16} /></button>
  </div>;
}

export function PacketEditor({ draft, onDraftChange, sourceFile, onAssemble, busy = false }: Props) {
  const sourceId = "source-0";
  const [supporting, setSupporting] = useState<PacketEditorFile[]>([]);
  const [order, setOrder] = useState<Item[]>([{ id: sourceId, label: sourceFile.name, partId: sourceId, pageIndex: 0, rotation: 0, fileId: sourceId }]);
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string | null>(null);

  function addSupporting(files: FileList | null) {
    if (!files) return;
    const additions = Array.from(files).map((file, index) => {
      const id = `support-${Date.now()}-${index}`;
      return { file, id, kind: "supporting" as const };
    });
    setSupporting((current) => [...current, ...additions]);
    setOrder((current) => [...current, ...additions.map((item) => ({ id: `${item.id}:0`, label: item.file.name, partId: item.id, pageIndex: 0, rotation: 0, fileId: item.id }))]);
  }

  function dragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrder((items) => { const oldIndex = items.findIndex((item) => item.id === active.id); const newIndex = items.findIndex((item) => item.id === over.id); return arrayMove(items, oldIndex, newIndex); });
  }

  async function assemble() {
    const files: PacketEditorFile[] = [{ id: sourceId, file: sourceFile, kind: "source" }, ...supporting];
    const ops = order.map((item) => ({ partId: item.partId, sourcePageIndex: item.pageIndex, rotation: item.rotation, removed: removed.has(item.id) }));
    try { setMessage(null); await onAssemble(draft, files, ops); setMessage("Final packet assembled and locked."); } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to assemble packet."); }
  }

  return <section className="space-y-6">
    <div className="rounded-xl border border-rule bg-paper p-6">
      <div className="flex items-center justify-between gap-4"><div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Final review</div><h3 className="mt-1 font-serif text-2xl">Edit the letter and arrange the packet</h3><p className="mt-2 text-sm text-muted-foreground">Changes are recorded before the final packet is locked and sent for approval.</p></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-foreground px-4 py-2 text-sm"><Plus size={15} /> Add document<input type="file" accept="application/pdf,image/png,image/jpeg" multiple className="sr-only" onChange={(e) => addSupporting(e.target.files)} /></label></div>
      <textarea value={draft} onChange={(e) => onDraftChange(e.target.value)} className="mt-6 min-h-[300px] w-full rounded-lg border border-rule bg-paper-deep p-4 text-sm leading-7 outline-none" aria-label="Final appeal draft" />
    </div>
    <div className="rounded-xl border border-rule bg-paper p-6">
      <div className="flex items-center justify-between"><div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Packet pages</div><p className="mt-1 text-sm text-muted-foreground">Drag pages into the order you want. Rotate or remove before locking.</p></div><div className="text-xs text-muted-foreground">{order.filter((item) => !removed.has(item.id)).length} active</div></div>
      <div className="mt-5"><DndContext collisionDetection={closestCenter} onDragEnd={dragEnd}><SortableContext items={order.map((item) => item.id)} strategy={verticalListSortingStrategy}><div className="space-y-2">{order.map((item) => <SortableItem key={item.id} item={item} removed={removed.has(item.id)} onRotate={() => setOrder((items) => items.map((x) => x.id === item.id ? { ...x, rotation: (x.rotation + 90) % 360 } : x))} onRemove={() => setRemoved((current) => { const next = new Set(current); if (next.has(item.id)) next.delete(item.id); else next.add(item.id); return next; })} />)}</div></SortableContext></DndContext></div>
    </div>
    <div className="flex items-center justify-between gap-3"><div className="text-xs text-muted-foreground">Final assembly creates a locked, hashed document stored with your case.</div><button type="button" onClick={assemble} disabled={busy || !draft.trim()} className="rounded-full bg-foreground px-5 py-3 text-sm text-background disabled:opacity-40">{busy ? "Assembling packet…" : "Build & lock final packet"}</button></div>
    {message && <p className="text-sm text-muted-foreground">{message}</p>}
  </section>;
}
