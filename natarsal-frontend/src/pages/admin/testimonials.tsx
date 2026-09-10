import React, { useState, useEffect, useRef } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiLoader,
  FiStar,
  FiImage,
} from "react-icons/fi";
import apiClient, { getImageUrl } from "../../config/api";

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

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
    order: 0,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
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
        rating: testimonial.rating,
        order: testimonial.order,
      });
      if (testimonial.image) {
        setImagePreview(testimonial.image);
      } else {
        setImagePreview(null);
      }
    } else {
      setEditing(null);
      setFormData({
        name: "",
        role: "",
        content: "",
        rating: 5,
        order: testimonials.length,
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File terlalu besar. Maksimal 5MB.");
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError(
          "Tipe file tidak diizinkan. Gunakan JPEG, PNG, WEBP, atau GIF.",
        );
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated");
        setFormLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("role", formData.role.trim());
      formDataToSend.append("content", formData.content.trim());
      formDataToSend.append("rating", String(formData.rating));
      formDataToSend.append("order", String(formData.order));

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      console.log("Submitting testimonial:");
      for (const [key, value] of formDataToSend.entries()) {
        console.log(
          `  ${key}:`,
          value instanceof File ? `File: ${value.name}` : value,
        );
      }

      let response;
      if (editing) {
        response = await apiClient.updateTestimonial(
          token,
          editing.id,
          formDataToSend,
        );
      } else {
        response = await apiClient.createTestimonial(token, formDataToSend);
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
      if (!token) {
        setError("Not authenticated");
        return;
      }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FiLoader className="animate-spin text-natarsal-gold text-4xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-natarsal-white/70">
            Kelola testimonial yang tampil
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Total {testimonials.length} testimonial
          </p>
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
        <div className="bg-white border border-red-600 rounded-lg p-4 mb-6 text-red-600 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="hover:text-red-800">
            <FiX size={18} />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-natarsal-cream/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-natarsal-black/60 uppercase tracking-wider">
                  Foto
                </th>
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
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-natarsal-cream flex-shrink-0">
                        {t.image ? (
                          <img
                            src={getImageUrl(t.image)}
                            alt={t.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/images/placeholder.png";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-natarsal-gold text-white font-bold">
                            {t.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-natarsal-black">
                        {t.name}
                      </span>
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(t)}
                          className="p-1.5 bg-natarsal-gold text-natarsal-white rounded-lg hover:bg-natarsal-black hover:text-white transition-colors"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.name)}
                          className="p-1.5 bg-white text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
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
                  Foto (opsional)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-natarsal-cream rounded-lg overflow-hidden flex-shrink-0">
                    {imagePreview ? (
                      <img
                        src={
                          imagePreview.startsWith("data:") ||
                          imagePreview.startsWith("http")
                            ? imagePreview
                            : getImageUrl(imagePreview)
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/images/placeholder.png";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-natarsal-black/20">
                        <FiImage size={24} />
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1 text-sm text-natarsal-black/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-natarsal-cream file:text-natarsal-black hover:file:bg-natarsal-gold hover:file:text-white transition-colors"
                  />
                </div>
                <p className="text-xs text-natarsal-black/40 mt-1">
                  Maks 5MB. Format: JPEG, PNG, WEBP, GIF
                </p>
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

export default Testimonials;
