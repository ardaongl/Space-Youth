import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon } from "lucide-react";

interface PostProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostProjectDialog({ open, onOpenChange }: PostProjectDialogProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle the files here
      console.log(e.dataTransfer.files);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <DialogTitle className="text-center flex-1">Post Project</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline">Save as draft</Button>
              <Button>Continue</Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 py-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-center">Name your project</h2>
            <Input
              placeholder="Enter project name"
              className="text-lg py-6"
            />
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 text-muted-foreground">
                <ImageIcon className="w-full h-full" />
              </div>
              <div className="text-center">
                <p className="font-medium">
                  Drag and drop a cover image, or{" "}
                  <Button variant="link" className="px-1">Browse</Button>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Minimum 1600px width recommended. Max file size of 10MB (20MB for videos).
                </p>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• High resolution images (png, jpg, gif)</div>
                <div>• Animated gifs</div>
                <div>• Videos (mp4)</div>
                <div>• Only upload media you own the rights to</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Project Description</h3>
            <Textarea
              placeholder="Provide a detailed explanation of the decision-making process and rationale behind your project. The more descriptive you are, the better!"
              className="min-h-[200px]"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
