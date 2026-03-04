"use client";

import { useCallback, useRef, useState } from "react";
import type { FormikHelpers } from "formik";
import type {
  DocumentTag,
  FileUploadFormValues,
  FileUploadItem,
  UploadStatus,
} from "@/src/lib/types/file-upload";
import { DOCUMENT_TAGS as DOCUMENT_TAGS_CONSTANT } from "@/src/lib/constants/document-tags.constant";
import { MAX_FILES, MAX_TOTAL_SIZE } from "@/src/lib/constants/drag-drop-restrictions.constante";


export const DOCUMENT_TAGS: DocumentTag[] = DOCUMENT_TAGS_CONSTANT;


type SetFieldValue = FormikHelpers<FileUploadFormValues>["setFieldValue"];

export function useFileUploadForm() {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialValues: FileUploadFormValues = {
    files: [],
  };

  const validateForm = useCallback((values: FileUploadFormValues) => {
    const errors: Partial<Record<keyof FileUploadFormValues, string>> = {};

    if (values.files.length === 0) {
      errors.files = "Debe subir al menos 1 archivo";
    }

    if (values.files.length > MAX_FILES) {
      errors.files = `Máximo ${MAX_FILES} archivos permitidos`;
    }

    const totalSize = values.files.reduce(
      (sum, item) => sum + item.file.size,
      0
    );
    if (totalSize > MAX_TOTAL_SIZE) {
      errors.files = "El tamaño total de los archivos excede 5MB";
    }

    const hasInvalidTags = values.files.some((file) => !file.tag);
    if (hasInvalidTags) {
      errors.files = "Todos los archivos deben tener un tag seleccionado";
    }

    const hasUploadingFiles = values.files.some(
      (file) => file.status === "uploading"
    );
    if (hasUploadingFiles) {
      errors.files = "Espere a que todos los archivos terminen de subir";
    }

    const hasErrorFiles = values.files.some((file) => file.status === "error");
    if (hasErrorFiles) {
      errors.files =
        "Algunos archivos tienen errores. Elimínelos antes de enviar";
    }

    return errors;
  }, []);

  const simulateUpload = useCallback(
    (
      fileId: string,
      setFieldValue: SetFieldValue,
      files: FileUploadItem[]
    ) => {
      const abortController = new AbortController();

      const fileIndex = files.findIndex((f) => f.id === fileId);
      if (fileIndex === -1) return;

      files[fileIndex].abortController = abortController;
      setFieldValue("files", [...files]);

      let progress = 0;
      const interval = setInterval(() => {
        if (abortController.signal.aborted) {
          clearInterval(interval);
          return;
        }

        progress += Math.random() * 15;

        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          const shouldError = Math.random() < 0.15;
          const newStatus: UploadStatus = shouldError ? "error" : "done";

          const updatedFiles = files.map((f) =>
            f.id === fileId ? { ...f, progress: 100, status: newStatus } : f
          );
          setFieldValue("files", updatedFiles);
        } else {
          const updatedFiles = files.map((f) =>
            f.id === fileId ? { ...f, progress: Math.min(progress, 99) } : f
          );
          setFieldValue("files", updatedFiles);
        }
      }, 300);

      return () => clearInterval(interval);
    },
    []
  );

  const handleFiles = useCallback(
    (
      newFiles: FileList | null,
      setFieldValue: SetFieldValue,
      currentFiles: FileUploadItem[]
    ) => {
      if (!newFiles) return;

      const filesArray = Array.from(newFiles);
      const currentUser = "User Test 4";

      const uploadItems: FileUploadItem[] = filesArray.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        tag: "",
        status: "uploading" as UploadStatus,
        progress: 0,
        createdAt: new Date(),
        createdBy: currentUser,
      }));

      const updatedFiles = [...currentFiles, ...uploadItems];
      setFieldValue("files", updatedFiles);

      uploadItems.forEach((item) => {
        simulateUpload(item.id, setFieldValue, updatedFiles);
      });
    },
    [simulateUpload]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (
      e: React.DragEvent,
      setFieldValue: SetFieldValue,
      currentFiles: FileUploadItem[]
    ) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files, setFieldValue, currentFiles);
      }
    },
    [handleFiles]
  );

  const handleDeleteFile = useCallback(
    (
      fileId: string,
      setFieldValue: SetFieldValue,
      files: FileUploadItem[]
    ) => {
      const fileToDelete = files.find((f) => f.id === fileId);
      if (fileToDelete?.abortController) {
        fileToDelete.abortController.abort();
      }

      const updatedFiles = files.filter((f) => f.id !== fileId);
      setFieldValue("files", updatedFiles);
    },
    []
  );

  const handleCancelUpload = useCallback(
    (
      fileId: string,
      setFieldValue: SetFieldValue,
      files: FileUploadItem[]
    ) => {
      const file = files.find((f) => f.id === fileId);
      if (file?.abortController) {
        file.abortController.abort();
      }

      const updatedFiles = files.map((f) =>
        f.id === fileId
          ? { ...f, status: "error" as UploadStatus, progress: 0 }
          : f
      );
      setFieldValue("files", updatedFiles);
    },
    []
  );

  const handleTagChange = useCallback(
    (
      fileId: string,
      tag: DocumentTag,
      setFieldValue: SetFieldValue,
      files: FileUploadItem[]
    ) => {
      const updatedFiles = files.map((f) =>
        f.id === fileId ? { ...f, tag } : f
      );
      setFieldValue("files", updatedFiles);
    },
    []
  );

  const handleSubmit = useCallback(
    (
      values: FileUploadFormValues,
      { setSubmitting }: FormikHelpers<FileUploadFormValues>
    ) => {
      console.log("Formulario enviado:", values);
      alert("¡Archivos enviados exitosamente!");
      setSubmitting(false);
    },
    []
  );

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  return {
    dragActive,
    fileInputRef,
    initialValues,
    validateForm,
    handleFiles,
    handleDrag,
    handleDrop,
    handleDeleteFile,
    handleCancelUpload,
    handleTagChange,
    handleSubmit,
    formatDate,
  };
}
