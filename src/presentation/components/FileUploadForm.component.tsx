"use client";

import { Formik, Form } from "formik";
import { Upload, Trash2, X, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DocumentTag } from "@/src/lib/types/file-upload";
import { useFileUploadForm } from "@/src/presentation/hooks/useFileUploadForm.hook";
import { MAX_FILES } from "@/src/lib/constants/drag-drop-restrictions.constante";
import { DOCUMENT_TAGS } from "@/src/lib/constants/document-tags.constant";

export default function FileUploadForm() {
  const {
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
  } = useFileUploadForm();

  return (
    <Formik
      initialValues={initialValues}
      validate={validateForm}
      onSubmit={handleSubmit}
    >
      {({ values, errors, setFieldValue, isSubmitting, isValid }) => (
        <Form className="w-full max-w-7xl mx-auto p-6 space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">File Upload</h1>

            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => handleDrop(e, setFieldValue, values.files)}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) =>
                  handleFiles(e.target.files, setFieldValue, values.files)
                }
                accept=".pdf"
              />

              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>

                <div className="space-y-2">
                  <p className="text-base font-medium text-gray-700">
                    Drag and drop your files here or{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="text-primary hover:underline"
                    >
                      click to select them
                    </button>
                  </p>
                  <p className="text-sm text-gray-500">Accepted files: pdf</p>
                  <p className="text-sm text-gray-500">
                    Max files allowed: {MAX_FILES}
                  </p>
                </div>
              </div>
            </div>

            {errors.files && (
              <Alert variant="destructive">
                <AlertDescription>{errors.files as string}</AlertDescription>
              </Alert>
            )}

            {values.files.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Options</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Mime Type</TableHead>
                      <TableHead className="w-64">
                        Tags <span className="text-red-500">*</span>
                      </TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Created By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {values.files.map((fileItem) => (
                      <TableRow key={fileItem.id}>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDeleteFile(
                                fileItem.id,
                                setFieldValue,
                                values.files
                              )
                            }
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-primary">
                              {fileItem.file.name}
                            </p>
                            {fileItem.status === "uploading" && (
                              <div className="space-y-1">
                                <Progress value={fileItem.progress} />
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">
                                    Uploading... {Math.round(fileItem.progress)}
                                    %
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleCancelUpload(
                                        fileItem.id,
                                        setFieldValue,
                                        values.files
                                      )
                                    }
                                    className="h-6 px-2 text-xs"
                                  >
                                    <X className="w-3 h-3 mr-1" />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}
                            {fileItem.status === "done" && (
                              <span className="text-xs text-green-600 font-medium">
                                ✓ Upload complete
                              </span>
                            )}
                            {fileItem.status === "error" && (
                              <span className="text-xs text-red-600 font-medium">
                                ✗ Upload failed
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {fileItem.file.type || "application/pdf"}
                          </span>
                        </TableCell>

                        <TableCell>
                          <Select
                            value={fileItem.tag}
                            onValueChange={(value) =>
                              handleTagChange(
                                fileItem.id,
                                value as DocumentTag,
                                setFieldValue,
                                values.files
                              )
                            }
                            disabled={fileItem.status === "uploading"}
                          >
                            <SelectTrigger
                              className={`w-full ${
                                !fileItem.tag ? "border-red-300" : ""
                              }`}
                            >
                              <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                              {DOCUMENT_TAGS.map((tag) => (
                                <SelectItem key={tag} value={tag}>
                                  {tag}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {formatDate(fileItem.createdAt)}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            {fileItem.createdBy}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || !isValid || values.files.length === 0}
                className="px-8"
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
