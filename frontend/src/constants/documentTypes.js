import {
  Book,
  FileText,
  ClipboardList,
  Truck,
  Users,
  Search,
  FileSignature,
  FileClock,
  PencilRuler,
  ClipboardCheck,
  FilePlus2,
  BookOpenCheck,
  Mailbox,
  Send,
} from "lucide-react";

// Daftar sederhana untuk dropdown
export const documentTypesList = [
  "Berita Acara",
  "Notul",
  "Kontrak",
  "Surat Masuk",
  "Surat Keluar",
  "Hasil Survey",
  "Analisa Calon Pelanggan",
  "SOP",
  "Surat Jalan",
  "Drawing",
  "Checklist",
  "Form",
  "Instruksi Kerja",
];

// Daftar lengkap dengan ikon untuk halaman utama dokumen
export const documentTypesDetails = [
  {
    name: "Berita Acara",
    icon: ClipboardList,
    color: "text-green-500",
    slug: "Berita Acara",
  },
  { name: "Notul", icon: Book, color: "text-orange-500", slug: "Notul" },
  {
    name: "Kontrak",
    icon: FileSignature,
    color: "text-pink-500",
    slug: "Kontrak",
  },
  {
    name: "Surat Masuk",
    icon: Mailbox,
    color: "text-purple-500",
    slug: "Surat Masuk",
  },
  {
    name: "Surat Keluar",
    icon: Send,
    color: "text-sky-500",
    slug: "Surat Keluar",
  },
  {
    name: "Hasil Survey",
    icon: Search,
    color: "text-yellow-500",
    slug: "Hasil Survey",
  },
  {
    name: "Analisa Calon Pelanggan",
    icon: Users,
    color: "text-teal-500",
    slug: "Analisa Calon Pelanggan",
  },
  { name: "SOP", icon: FileClock, color: "text-red-500", slug: "SOP" },
  {
    name: "Surat Jalan",
    icon: Truck,
    color: "text-blue-500",
    slug: "Surat Jalan",
  },
  {
    name: "Drawing",
    icon: PencilRuler,
    color: "text-indigo-500",
    slug: "Drawing",
  },
  {
    name: "Checklist",
    icon: ClipboardCheck,
    color: "text-lime-500",
    slug: "Checklist",
  },
  { name: "Form", icon: FilePlus2, color: "text-cyan-500", slug: "Form" },
  {
    name: "Instruksi Kerja",
    icon: BookOpenCheck,
    color: "text-amber-500",
    slug: "Instruksi Kerja",
  },
];

export const initialDocumentState = {
  judul: "",
  jenisDokumen: "", // Akan diisi secara dinamis
  nomorSurat: "",
  tanggalDokumen: "",
  namaPT: "",
  perihal: "",
  hardCopyLocation: "",
};
