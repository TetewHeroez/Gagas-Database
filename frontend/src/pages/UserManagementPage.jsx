import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom"; // 1. Impor hook untuk mendapatkan data user
import { Plus, Loader2, Users2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/api";
import AddUserModal from "../components/AddUserModal";
import EditUserModal from "../components/EditUserModal";
import ConfirmationModal from "../components/ConfirmationModal";
import Pagination from "../components/Pagination";
import SortableHeader from "../components/SortableHeader";

const UserManagementPage = () => {
  const { userData } = useOutletContext(); // 2. Ambil data pengguna yang sedang login
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State untuk pagination & sorting
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [statusFilter, setStatusFilter] = useState("aktif");

  // State untuk modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [togglingUser, setTogglingUser] = useState(null);

  const fetchUsers = async (pageNumber, size, sort, status) => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({
        pageNumber,
        pageSize: size,
        sortBy: sort.key,
        sortOrder: sort.direction,
        status,
      });
      const { data } = await api.get(`/api/users?${params.toString()}`);
      setUsers(data.users);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError("Gagal memuat data pengguna.");
      toast.error("Gagal memuat data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, pageSize, sortConfig, statusFilter);
  }, [page, pageSize, sortConfig, statusFilter]);

  const handlePageChange = (newPage) => setPage(newPage);
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };
  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
    setPage(1);
  };
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.checked ? "" : "aktif");
    setPage(1);
  };

  const handleUserAdded = () =>
    fetchUsers(page, pageSize, sortConfig, statusFilter);
  const handleUserUpdated = (updatedUser) =>
    setUsers((current) =>
      current.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };
  const openConfirmModal = (user) => {
    setTogglingUser(user);
    setIsConfirmModalOpen(true);
  };

  const handleToggleStatusConfirm = async () => {
    if (!togglingUser) return;
    try {
      const { data } = await api.put(`/api/users/${togglingUser.id}/status`);
      toast.success(data.message);
      fetchUsers(page, pageSize, sortConfig, statusFilter);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengubah status.");
    } finally {
      setIsConfirmModalOpen(false);
      setTogglingUser(null);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      );
    }
    if (error) {
      return <div className="text-center p-8 text-red-500">{error}</div>;
    }
    if (users.length === 0 && !loading) {
      return (
        <div className="text-center py-10 border-2 border-dashed rounded-lg mt-6">
          <Users2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
            Tidak Ada Pengguna
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tidak ada pengguna yang cocok dengan filter saat ini.
          </p>
        </div>
      );
    }
    return (
      <>
        <div className="mt-6 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead>
                  <tr>
                    <SortableHeader
                      field="namaLengkap"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    >
                      Nama Lengkap
                    </SortableHeader>
                    <SortableHeader
                      field="jabatan"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    >
                      Jabatan
                    </SortableHeader>
                    <SortableHeader
                      field="status"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    >
                      Status
                    </SortableHeader>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                    >
                      <span className="sr-only">Aksi</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="py-4 pl-4 pr-3 text-sm sm:pl-0">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.namaLengkap}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {user.jabatan}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === "aktif"
                              ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                              : "bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {user.status === "aktif" ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 space-x-4">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          Edit
                        </button>
                        {/* 3. Tambahkan logika disabled pada tombol */}
                        <button
                          onClick={() => openConfirmModal(user)}
                          disabled={user.id === userData?._id}
                          className={`${
                            user.status === "aktif"
                              ? "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              : "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {user.status === "aktif" ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div>
            <label
              htmlFor="pageSizeSelect"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2"
            >
              Baris per halaman:
            </label>
            <select
              id="pageSizeSelect"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pengelolaan Akun
          </h1>
          <div className="flex items-center gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={statusFilter === ""}
                onChange={handleStatusFilterChange}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Tampilkan nonaktif
              </span>
            </label>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus size={20} className="mr-2" /> Tambah
            </button>
          </div>
        </div>
        {renderContent()}
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={handleUserAdded}
      />
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userToEdit={editingUser}
        onUserUpdated={handleUserUpdated}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleToggleStatusConfirm}
        title={`${
          togglingUser?.status === "aktif" ? "Nonaktifkan" : "Aktifkan"
        } Pengguna`}
        message={`Apakah Anda yakin ingin ${
          togglingUser?.status === "aktif" ? "menonaktifkan" : "mengaktifkan"
        } akun ${togglingUser?.namaLengkap}?`}
        confirmText={
          togglingUser?.status === "aktif" ? "Ya, Nonaktifkan" : "Ya, Aktifkan"
        }
        confirmColor={
          togglingUser?.status === "aktif" ? "bg-red-600" : "bg-green-600"
        }
      />
    </>
  );
};

export default UserManagementPage;
