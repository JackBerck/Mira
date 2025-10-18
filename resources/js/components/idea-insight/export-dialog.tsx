/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import useSWRMutation from "swr/mutation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { IdeaInsight } from '@/types'
import { router } from "@inertiajs/react"
import getCsrfToken from '@/utils/get-csrf-token'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  transcript: IdeaInsight[] // UBAH dari ChatMsg ke IdeaInsight
}

type DraftForum = {
  title: string
  category: string
  summary: string
  content: string
  tags: string[]
}

type DraftCollab = {
  title: string
  problem: string
  goals: string[]
  roles: { name: string; skills: string[]; time: string }[]
  timeline: string
  links: string[]
  forumId?: string
}

async function doExport(url: string, { arg }: { arg: any }) {
  const csrfToken = getCsrfToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  if (csrfToken) {
    headers["X-CSRF-TOKEN"] = csrfToken;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    credentials: "same-origin",
    body: JSON.stringify(arg),
  })

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Export error:', errorText);
    throw new Error("Gagal membuat draft")
  }

  return (await res.json()) as { id: string; type: "forum" | "collab"; data: any }
}

export default function ExportDialog({ open, onOpenChange, transcript }: Props) {
  const [forum, setForum] = useState<DraftForum>({
    title: "",
    category: "Kreatif",
    summary: "",
    content: "",
    tags: [],
  })

  const [collab, setCollab] = useState<DraftCollab>({
    title: "",
    problem: "",
    goals: [],
    roles: [],
    timeline: "",
    links: [],
  })

  const [isAutoFilling, setIsAutoFilling] = useState<{ forum: boolean; collab: boolean }>({
    forum: false,
    collab: false,
  })

  const { trigger: triggerForum, isMutating: isForum } = useSWRMutation("/api/think/export", doExport)
  const { trigger: triggerCollab, isMutating: isCollab } = useSWRMutation("/api/think/export", doExport)

  async function autoFill(type: "forum" | "collab") {
    setIsAutoFilling(prev => ({ ...prev, [type]: true }))

    try {
      const csrfToken = getCsrfToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Accept": "application/json",
      };

      if (csrfToken) {
        headers["X-CSRF-TOKEN"] = csrfToken;
      }

      // PERBAIKI: Konversi IdeaInsight ke format yang diharapkan controller
      const transcriptFormatted = transcript.map(msg => ({
        message: msg.message,
        isAiGenerated: msg.is_ai_generated
      }));

      const payload = { type, transcript: transcriptFormatted }
      const res = await fetch("/api/think/export", {
        method: "POST",
        headers,
        credentials: "same-origin",
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Auto-fill error:', errorText);
        throw new Error("Gagal mengisi otomatis")
      }

      const data = await res.json()
      if (type === "forum") setForum(data.data)
      else setCollab(data.data)
    } catch (error) {
      console.error("Auto-fill error:", error)
    } finally {
      setIsAutoFilling(prev => ({ ...prev, [type]: false }))
    }
  }

  async function exportForum() {
    try {
      const transcriptFormatted = transcript.map(msg => ({
        message: msg.message,
        isAiGenerated: msg.is_ai_generated
      }));

      const { id } = await triggerForum({
        type: "forum",
        transcript: transcriptFormatted,
        current: forum,
      })
      onOpenChange(false)
      router.visit(`/beranda/forum/buat?draftId=${id}`)
    } catch (error) {
      console.error("Export forum error:", error)
    }
  }

  async function exportCollab() {
    try {
      const transcriptFormatted = transcript.map(msg => ({
        message: msg.message,
        isAiGenerated: msg.is_ai_generated
      }));

      const { id } = await triggerCollab({
        type: "collab",
        transcript: transcriptFormatted,
        current: collab,
      })
      onOpenChange(false)
      router.visit(`/beranda/kolaborasi/buat?draftId=${id}`)
    } catch (error) {
      console.error("Export collab error:", error)
    }
  }

  // ... rest of component remains the same
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ekspor dari Chat</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Ubah percakapan menjadi draft Forum atau Kolaborasi. Anda bisa sunting sebelum mengekspor.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="forum">
          <TabsList className="mb-3 grid w-full grid-cols-2">
            <TabsTrigger value="forum">Forum</TabsTrigger>
            <TabsTrigger value="collab">Kolaborasi</TabsTrigger>
          </TabsList>

          <TabsContent value="forum" className="space-y-3">
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => autoFill("forum")}
                disabled={isAutoFilling.forum}
              >
                {isAutoFilling.forum ? "Mengisi..." : "Isi Otomatis"}
              </Button>
            </div>

            <div className="space-y-3">
              <Input
                placeholder="Judul"
                value={forum.title}
                onChange={(e) => setForum({ ...forum, title: e.target.value })}
              />
              <Input
                placeholder="Kategori (Teknologi, Sosial, Kreatif, Lingkungan)"
                value={forum.category}
                onChange={(e) => setForum({ ...forum, category: e.target.value })}
              />
              <Textarea
                placeholder="Ringkasan singkat"
                value={forum.summary}
                onChange={(e) => setForum({ ...forum, summary: e.target.value })}
                rows={3}
              />
              <Textarea
                placeholder="Konten"
                className="min-h-32"
                value={forum.content}
                onChange={(e) => setForum({ ...forum, content: e.target.value })}
                rows={6}
              />
              <Input
                placeholder="Tag (pisahkan dengan koma)"
                value={forum.tags.join(", ")}
                onChange={(e) =>
                  setForum({
                    ...forum,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={exportForum}
                disabled={isForum || !forum.title.trim() || !forum.content.trim()}
              >
                {isForum ? "Mengekspor..." : "Ekspor ke Forum"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="collab" className="space-y-3">
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => autoFill("collab")}
                disabled={isAutoFilling.collab}
              >
                {isAutoFilling.collab ? "Mengisi..." : "Isi Otomatis"}
              </Button>
            </div>

            <div className="space-y-3">
              <Input
                placeholder="Judul Kolaborasi"
                value={collab.title}
                onChange={(e) => setCollab({ ...collab, title: e.target.value })}
              />
              <Textarea
                placeholder="Masalah yang ingin dipecahkan"
                value={collab.problem}
                onChange={(e) => setCollab({ ...collab, problem: e.target.value })}
                rows={4}
              />
              <Textarea
                placeholder="Tujuan (pisahkan dengan baris baru)"
                value={collab.goals.join("\n")}
                onChange={(e) =>
                  setCollab({
                    ...collab,
                    goals: e.target.value
                      .split("\n")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                rows={3}
              />
              <Textarea
                placeholder="Peran & skill (format: Nama Peran | skill1;skill2 | waktu per minggu)"
                value={collab.roles.map((r) => `${r.name} | ${r.skills.join(";")} | ${r.time}`).join("\n")}
                onChange={(e) =>
                  setCollab({
                    ...collab,
                    roles: e.target.value
                      .split("\n")
                      .map((l) => l.trim())
                      .filter(Boolean)
                      .map((l) => {
                        const [name, s, time] = l.split("|").map((x) => x.trim())
                        return {
                          name: name || "",
                          skills: (s || "")
                            .split(";")
                            .map((x) => x.trim())
                            .filter(Boolean),
                          time: time || "",
                        }
                      }),
                  })
                }
                rows={3}
              />
              <Input
                placeholder="Timeline (misal: 8 minggu: riset → prototipe → uji coba)"
                value={collab.timeline}
                onChange={(e) => setCollab({ ...collab, timeline: e.target.value })}
              />
              <Input
                placeholder="Link referensi (pisahkan dengan koma)"
                value={collab.links.join(", ")}
                onChange={(e) =>
                  setCollab({
                    ...collab,
                    links: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={exportCollab}
                disabled={isCollab || !collab.title.trim() || !collab.problem.trim()}
              >
                {isCollab ? "Mengekspor..." : "Ekspor ke Kolaborasi"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
