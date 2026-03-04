export type FileState = "ide" | "uploading" | "done" | "error";

export type FileDescriptorBase = {
  id: string;
  name: string;
  size: number;
  type: string;
  state: FileState;
};

export type FileDescriptor =
  | (FileDescriptorBase & { state: "ide" })
  | (FileDescriptorBase & { state: "uploading"; progress: number })
  | (FileDescriptorBase & { state: "done" })
  | (FileDescriptorBase & { state: "error" });