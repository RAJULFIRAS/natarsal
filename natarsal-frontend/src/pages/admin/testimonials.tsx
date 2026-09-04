import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiLoader,
  FiStar,
} from "react-icons/fi";
import apiClient from "../../config/api";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  image?: string;
  rating: number;
  isActive: boolean;
  order: number;
}

const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    image: "",
    rating: 5,
    order: 0,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await apiClient.getTestimonials();
      if (response.success && response.data) {
        setTestimonials(response.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditing(testimonial);
      setFormData({
        name: testimonial.name,
        role: testimonial.role,
        content: testimonial.content,
        image: testimonial.image || "",
        rating: testimonial.rating,
        order: testimonial.order,
      });
    } else {
      setEditing(null);
      setFormData({
        name: "",
        role: "",
        content: "",
        image: "",
        rating: 5,
        order: testimonials.length,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      let response;
      if (editing) {
        response = await apiClient.updateTestimonial(
          token,
          editing.id,
          formData,
        );
      } else {
        response = await apiClient.createTestimonial(token, formData);
      }

      if (response.success) {
        await fetchTestimonials();
        handleCloseModal();
      } else {
        setError(response.error?.message || "Failed to save");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Yakin ingin menghapus testimonial dari "${name}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const response = await apiClient.deleteTestimonial(token, id);
      if (response.success) {
        await fetchTestimonials();
      } else {
        setError(response.error?.message || "Failed to delete");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      await apiClient.updateTestimonial(token, id, {
        isActive: !currentStatus,
      });
      await fetchTestimonials();
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FiLoader className="animate-spin text-natarsal-gold text-4xl" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-natarsal-white/70">
            Kelola testimonial yang tampil
          </h1>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-natarsal-gold text-white rounded-lg hover:bg-natarsal-black transition-colors"
        >
          <FiPlus size={18} />
          Tambah Testimonial
        </button>
      </div>

      {error && (
        <div className="bg-white border border-red-600 rounded-lg p-4 mb-6 text-red-600">
          {error}
          <button onClick={() => setError(null)} className="ml-2">
            <FiX className="inline" />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-natarsal-cream/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-natarsal-black/60 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-natarsal-black/60 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-natarsal-black/60 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-natarsal-black/60 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-natarsal-black/60 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-natarsal-black/5">
              {testimonials.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-natarsal-black/40"
                  >
                    Belum ada testimonial
                  </td>
                </tr>
              ) : (
                testimonials.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-natarsal-cream/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-natarsal-gold text-white flex items-center justify-center text-sm font-bold">
                          {t.name.charAt(0)}
                        </div>
                        <span className="font-medium text-natarsal-black">
                          {t.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-natarsal-black/60">
                      {t.role}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`${
                              i < t.rating
                                ? "text-natarsal-gold fill-natarsal-gold"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(t.id, t.isActive)}
                        className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          t.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {t.isActive ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(t)}
                          className="p-1.5 bg-natarsal-cream text-natarsal-black rounded-lg hover:bg-natarsal-gold hover:text-white transition-colors"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.name)}
                          className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl font-bold text-natarsal-black">
                {editing ? "Edit Testimonial" : "Tambah Testimonial"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-natarsal-cream rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                  Nama *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                  Role / Pekerjaan *
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                  Testimonial *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={4}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                  URL Foto (opsional)
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-4 py-2 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                  Rating (1-5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="text-2xl transition-colors"
                    >
                      <FiStar
                        className={`${
                          star <= formData.rating
                            ? "text-natarsal-gold fill-natarsal-gold"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3 bg-natarsal-gold text-white rounded-lg font-medium hover:bg-natarsal-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" />
                    Menyimpan...
                  </span>
                ) : editing ? (
                  "Update Testimonial"
                ) : (
                  "Tambah Testimonial"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
