import { useRef } from "react";
import toast from "react-hot-toast";
import UndoToast from "../components/UndoToast";
import api from "../api/api"; // <-- 1. Impor instance api

export const useUndo = (
  items,
  setItems,
  itemName,
  deleteUrlPrefix // Ini sekarang akan menjadi path relatif, cth: '/api/users'
) => {
  const deleteTimeoutRef = useRef(null);

  const handleUndo = (itemToRestore) => {
    // ... (logika undo tidak berubah) ...
    clearTimeout(deleteTimeoutRef.current);
    setItems((current) =>
      [...current, itemToRestore].sort((a, b) =>
        (a.namaLengkap || a.judul).localeCompare(b.namaLengkap || b.judul)
      )
    );
    toast.dismiss();
    toast.success(`Aksi penghapusan ${itemName} dibatalkan.`);
  };

  const triggerDelete = (itemToDelete) => {
    // ... (logika optimis UI tidak berubah) ...
    setItems((current) =>
      current.filter((item) => item.id !== itemToDelete.id)
    );
    toast(
      (t) => (
        <UndoToast
          message={`${itemName} "${
            itemToDelete.namaLengkap || itemToDelete.judul
          }" dihapus.`}
          onUndo={() => handleUndo(itemToDelete)}
        />
      ),
      { duration: 7000, style: { minWidth: "380px" } }
    );

    deleteTimeoutRef.current = setTimeout(() => {
      const performDelete = async () => {
        try {
          // 2. Gunakan 'api' dan path relatif
          await api.delete(`${deleteUrlPrefix}/${itemToDelete.id}`);
        } catch (error) {
          console.error(`Gagal menghapus ${itemName} permanen:`, error);
          toast.error(`Gagal menghapus ${itemName} dari server.`);
          setItems((current) =>
            [...current, itemToDelete].sort((a, b) =>
              (a.namaLengkap || a.judul).localeCompare(b.namaLengkap || b.judul)
            )
          );
        }
      };
      performDelete();
    }, 7000);
  };

  return triggerDelete;
};
