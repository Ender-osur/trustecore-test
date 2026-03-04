export type DocumentTag =
  | 'cédula de ciudadanía'
  | 'registro civil'
  | 'tarjeta de identidad'
  | 'cédula de extranjería'
  | 'pasaporte'
  | 'pasaporte de extranjería';

export type UploadStatus = 'uploading' | 'done' | 'error';

export interface FileUploadItem {
  id: string;
  file: File;
  tag: DocumentTag | '';
  status: UploadStatus;
  progress: number;
  createdAt: Date;
  createdBy: string;
  abortController?: AbortController;
}

export interface FileUploadFormValues {
  files: FileUploadItem[];
}
