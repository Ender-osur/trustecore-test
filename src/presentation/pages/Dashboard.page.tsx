"use client";

import {
  FileUp,
  FileCheck,
  HardDrive,
  Info,
  LayoutDashboard,
} from "lucide-react";
import FileUploadForm from "@/src/presentation/components/FileUploadForm.component";
import {
  MAX_FILES,
  MAX_TOTAL_SIZE,
} from "@/src/lib/constants/drag-drop-restrictions.constante";

const MAX_SIZE_MB = MAX_TOTAL_SIZE / (1024 * 1024);

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Documentos
              </h1>
              <p className="text-sm text-muted-foreground">
                Sube y gestiona tus documentos de identidad
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <FileUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Máx. archivos
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  {MAX_FILES}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <HardDrive className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Máx. tamaño total
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  {MAX_SIZE_MB} MB
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <FileCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Formato aceptado
                </p>
                <p className="text-2xl font-semibold text-foreground">PDF</p>
              </div>
            </div>
          </div>
        </section>

        {/* Instructions */}
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">
                Cómo subir documentos
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Arrastra los archivos o haz clic para seleccionarlos</li>
                <li>
                  Asigna un tipo de documento a cada archivo (cédula, pasaporte,
                  etc.)
                </li>
                <li>Espera a que termine la subida antes de enviar</li>
                <li>Puedes cancelar una subida en curso con el botón ✕</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Upload form */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <FileUploadForm />
        </section>
      </main>
    </div>
  );
}
