// D:/natarsal/natarsal-frontend/src/pages/admin/menu.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiImage,
  FiCheck,
  FiLoader,
  FiSearch,
} from "react-icons/fi";
import apiClient, { MenuItem as ApiMenuItem, Category } from "../../config/api";

// ✅ Gunakan tipe dari api.ts, jangan definisikan ulang
type MenuItem = ApiMenuItem;

// ✅ Category sudah di-export dari api.ts

const AdminMenu: React.FC = () => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all",
  );

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    isAvailable: true,
    isRecommended: false,
    isSpicy: false,
    isVegetarian: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Helper untuk image URL
  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return null;
    const baseUrl =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:3000";
    return `${baseUrl}${imagePath}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const [menusRes, categoriesRes] = await Promise.all([
        apiClient.getMenus(),
        apiClient.getCategories(),
      ]);

      if (menusRes.success && menusRes.data) {
        setMenus(menusRes.data);
      }
      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (menu?: MenuItem) => {
    if (menu) {
      setEditingMenu(menu);
      setFormData({
        name: menu.name,
        description: menu.description || "",
        price: String(menu.price),
        categoryId: String(menu.categoryId),
        isAvailable: menu.isAvailable,
        isRecommended: menu.isRecommended || false,
        isSpicy: menu.isSpicy || false,
        isVegetarian: menu.isVegetarian || false,
      });
      if (menu.image) {
        setImagePreview(menu.image);
      }
    } else {
      setEditingMenu(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        isAvailable: true,
        isRecommended: false,
        isSpicy: false,
        isVegetarian: false,
      });
      setImagePreview(null);
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMenu(null);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // D:/natarsal/natarsal-frontend/src/pages/admin/menu.tsx
  // ... di bagian handleSubmit ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      // ✅ Validasi sebelum submit
      if (!formData.name.trim()) {
        setError("Nama menu wajib diisi");
        setFormLoading(false);
        return;
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        setError("Harga harus lebih dari 0");
        setFormLoading(false);
        return;
      }
      if (!formData.categoryId) {
        setError("Kategori wajib dipilih");
        setFormLoading(false);
        return;
      }

      const formDataToSend = new FormData();

      // ✅ Append semua field dengan benar
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("description", formData.description?.trim() || "");
      formDataToSend.append("price", String(parseFloat(formData.price)));
      formDataToSend.append(
        "categoryId",
        String(parseInt(formData.categoryId)),
      );
      formDataToSend.append("isAvailable", String(formData.isAvailable));
      formDataToSend.append("isRecommended", String(formData.isRecommended));
      formDataToSend.append("isSpicy", String(formData.isSpicy));
      formDataToSend.append("isVegetarian", String(formData.isVegetarian));

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      // ✅ Debug: Log form data
      console.log("📝 Submitting menu:");
      for (const [key, value] of formDataToSend.entries()) {
        console.log(
          `  ${key}:`,
          value instanceof File ? `File: ${value.name}` : value,
        );
      }

      let response;
      if (editingMenu) {
        response = await apiClient.updateMenu(
          token,
          editingMenu.id,
          formDataToSend,
        );
      } else {
        response = await apiClient.createMenu(token, formDataToSend);
      }

      if (response.success) {
        await fetchData();
        handleCloseModal();
        // ✅ Reset form
        setFormData({
          name: "",
          description: "",
          price: "",
          categoryId: "",
          isAvailable: true,
          isRecommended: false,
          isSpicy: false,
          isVegetarian: false,
        });
        setImageFile(null);
        setImagePreview(null);
      } else {
        setError(response.error?.message || "Failed to save menu");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      console.error("Submit error:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Yakin ingin menghapus menu "${name}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const response = await apiClient.deleteMenu(token, id);
      if (response.success) {
        await fetchData();
      } else {
        setError(response.error?.message || "Failed to delete menu");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const filteredMenus = menus.filter((menu) => {
    const matchesSearch =
      menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || menu.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <h1 className="font-display text-2xl font-bold text-natarsal-black">
            Manajemen Menu
          </h1>
          <p className="text-natarsal-black/60 text-sm">
            Kelola daftar menu restoran
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-natarsal-gold text-white rounded-lg hover:bg-natarsal-black transition-colors"
        >
          <FiPlus size={18} />
          Tambah Menu
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-600">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-400 hover:text-red-600"
          >
            <FiX className="inline" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-natarsal-black/40" />
            <input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value === "all" ? "all" : Number(e.target.value),
              )
            }
            className="px-4 py-2 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all bg-white"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMenus.length === 0 ? (
          <div className="col-span-full text-center py-12 text-natarsal-black/40">
            Tidak ada menu yang ditemukan
          </div>
        ) : (
          filteredMenus.map((menu) => (
            <div
              key={menu.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-natarsal-cream relative">
                {menu.image ? (
                  <img
                    src={getImageUrl(menu.image) || "/images/placeholder.jpg"}
                    alt={menu.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/placeholder.jpg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-natarsal-black/20">
                    <FiImage size={48} />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {menu.isRecommended && (
                    <span className="bg-natarsal-gold text-white text-xs px-2 py-0.5 rounded">
                      ⭐
                    </span>
                  )}
                  {menu.isSpicy && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                      🌶️
                    </span>
                  )}
                  {menu.isVegetarian && (
                    <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                      🌿
                    </span>
                  )}
                  {!menu.isAvailable && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                      Tidak Tersedia
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-natarsal-black">
                      {menu.name}
                    </h3>
                    <p className="text-sm text-natarsal-black/60 line-clamp-2">
                      {menu.description || "Tidak ada deskripsi"}
                    </p>
                    <p className="text-xs text-natarsal-black/40 mt-1">
                      {menu.category?.name || "Tanpa Kategori"}
                    </p>
                  </div>
                  <span className="font-bold text-natarsal-gold">
                    Rp {menu.price.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleOpenModal(menu)}
                    className="flex-1 px-3 py-1.5 bg-natarsal-cream text-natarsal-black rounded-lg hover:bg-natarsal-gold hover:text-white transition-colors text-sm flex items-center justify-center gap-1"
                  >
                    <FiEdit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(menu.id, menu.name)}
                    className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl font-bold text-natarsal-black">
                {editingMenu ? "Edit Menu" : "Tambah Menu"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-natarsal-cream rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                  Nama Menu *
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

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all resize-none"
                />
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                    Harga *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                    min="0"
                    className="w-full px-4 py-2 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all bg-white"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                  Gambar
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-natarsal-cream rounded-lg overflow-hidden flex-shrink-0">
                    {imagePreview ? (
                      <img
                        src={
                          imagePreview.startsWith("http")
                            ? imagePreview
                            : getImageUrl(imagePreview) || imagePreview
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/images/placeholder.jpg";
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
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 text-sm text-natarsal-black/70">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isAvailable: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-natarsal-gold focus:ring-natarsal-gold"
                  />
                  Tersedia
                </label>
                <label className="flex items-center gap-2 text-sm text-natarsal-black/70">
                  <input
                    type="checkbox"
                    checked={formData.isRecommended}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isRecommended: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-natarsal-gold focus:ring-natarsal-gold"
                  />
                  Rekomendasi ⭐
                </label>
                <label className="flex items-center gap-2 text-sm text-natarsal-black/70">
                  <input
                    type="checkbox"
                    checked={formData.isSpicy}
                    onChange={(e) =>
                      setFormData({ ...formData, isSpicy: e.target.checked })
                    }
                    className="w-4 h-4 text-natarsal-gold focus:ring-natarsal-gold"
                  />
                  Pedas 🌶️
                </label>
                <label className="flex items-center gap-2 text-sm text-natarsal-black/70">
                  <input
                    type="checkbox"
                    checked={formData.isVegetarian}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isVegetarian: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-natarsal-gold focus:ring-natarsal-gold"
                  />
                  Vegetarian 🌿
                </label>
              </div>

              {/* Submit */}
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
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FiCheck />
                    {editingMenu ? "Update Menu" : "Tambah Menu"}
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
