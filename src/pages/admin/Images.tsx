import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Eye, EyeOff, Image as ImageIcon, Copy, GripVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const BUCKET = "site-images";

type GalleryImage = {
  id: string;
  image_path: string;
  label: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
};

function getPublicUrl(path: string) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export default function Images() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"gallery" | "general">("gallery");
  const [generalFiles, setGeneralFiles] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const loadGallery = async () => {
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order");
    if (data) setGalleryImages(data);
  };

  const loadGeneral = async () => {
    const { data } = await supabase.storage.from(BUCKET).list("general", { sortBy: { column: "created_at", order: "desc" } });
    if (data) setGeneralFiles(data.map((f) => `general/${f.name}`));
  };

  useEffect(() => {
    loadGallery();
    loadGeneral();
  }, []);

  const uploadGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(path, file);
      if (uploadErr) {
        toast({ title: "Upload failed", description: uploadErr.message, variant: "destructive" });
        continue;
      }
      const maxOrder = galleryImages.length > 0 ? Math.max(...galleryImages.map((g) => g.sort_order)) : -1;
      await supabase.from("gallery_images").insert({
        image_path: path,
        label: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        sort_order: maxOrder + 1,
      });
    }
    setUploading(false);
    loadGallery();
    if (galleryFileRef.current) galleryFileRef.current.value = "";
    toast({ title: "Uploaded!" });
  };

  const uploadGeneralImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `general/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file);
      if (error) toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    }
    setUploading(false);
    loadGeneral();
    if (fileRef.current) fileRef.current.value = "";
    toast({ title: "Uploaded!" });
  };

  const deleteGalleryImage = async (img: GalleryImage) => {
    await supabase.storage.from(BUCKET).remove([img.image_path]);
    await supabase.from("gallery_images").delete().eq("id", img.id);
    loadGallery();
  };

  const deleteGeneralImage = async (path: string) => {
    await supabase.storage.from(BUCKET).remove([path]);
    loadGeneral();
  };

  const toggleVisibility = async (img: GalleryImage) => {
    await supabase.from("gallery_images").update({ is_visible: !img.is_visible }).eq("id", img.id);
    loadGallery();
  };

  const updateLabel = async (id: string, label: string) => {
    await supabase.from("gallery_images").update({ label }).eq("id", id);
  };

  const copyUrl = (path: string) => {
    navigator.clipboard.writeText(getPublicUrl(path));
    toast({ title: "URL copied!" });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground mb-6">Images</h1>

      <div className="flex gap-2 mb-6">
        <Button variant={tab === "gallery" ? "default" : "outline"} onClick={() => setTab("gallery")} className="font-body">
          Gallery
        </Button>
        <Button variant={tab === "general" ? "default" : "outline"} onClick={() => setTab("general")} className="font-body">
          General Uploads
        </Button>
      </div>

      {tab === "gallery" && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base font-body">Upload Gallery Images</CardTitle>
            </CardHeader>
            <CardContent>
              <input ref={galleryFileRef} type="file" accept="image/*" multiple className="hidden" onChange={uploadGalleryImage} />
              <Button onClick={() => galleryFileRef.current?.click()} disabled={uploading} className="font-body">
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading…" : "Choose Images"}
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((img) => (
              <Card key={img.id} className={`overflow-hidden ${!img.is_visible ? "opacity-60" : ""}`}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={getPublicUrl(img.image_path)} alt={img.label} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-3 space-y-2">
                  <Input
                    defaultValue={img.label}
                    onBlur={(e) => { if (e.target.value !== img.label) updateLabel(img.id, e.target.value); }}
                    placeholder="Label"
                    className="text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch checked={img.is_visible} onCheckedChange={() => toggleVisibility(img)} />
                      <span className="text-xs text-muted-foreground font-body">{img.is_visible ? "Visible" : "Hidden"}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => copyUrl(img.image_path)}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteGalleryImage(img)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {galleryImages.length === 0 && (
            <p className="text-muted-foreground text-center py-8 font-body">No gallery images yet.</p>
          )}
        </>
      )}

      {tab === "general" && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base font-body">Upload Images</CardTitle>
            </CardHeader>
            <CardContent>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={uploadGeneralImage} />
              <Button onClick={() => fileRef.current?.click()} disabled={uploading} className="font-body">
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading…" : "Choose Images"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2 font-body">
                Upload images here and copy URLs to use in any content field.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {generalFiles.map((path) => (
              <Card key={path} className="overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img src={getPublicUrl(path)} alt="" className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-2 flex justify-between">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => copyUrl(path)}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteGeneralImage(path)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {generalFiles.length === 0 && (
            <p className="text-muted-foreground text-center py-8 font-body">No images uploaded yet.</p>
          )}
        </>
      )}
    </div>
  );
}
