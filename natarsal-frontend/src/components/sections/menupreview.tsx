// D:/natarsal/natarsal-frontend/src/components/sections/menupreview.tsx
import { useEffect, useState } from "react";
import apiClient, { MenuItem } from "../../config/api";

// ✅ Helper untuk image URL
const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return "/images/placeholder.jpg";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  if (imagePath.startsWith("/uploads/")) {
    const baseUrl =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:3001";
    return `${baseUrl}${imagePath}`;
  }

  return "/images/placeholder.jpg";
};

export default function MenuPreview() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiClient.getMenus();

        if (response.success && response.data) {
          setMenus(response.data);
        } else {
          setError(response.error?.message || "Failed to load menu");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        console.error("MenuPreview error:", err);
      } finally {
        // ✅ Delay kecil untuk menghindari blink
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };

    fetchMenus();
  }, []);

  const handleImageError = (menuId: number) => {
    setImageErrors((prev) => ({ ...prev, [menuId]: true }));
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-natarsal-gold border-t-transparent"></div>
        <p className="mt-2 text-gray-500">Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (menus.length === 0) {
    return <div className="text-center py-8">No menu items available</div>;
  }

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-6">Our Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="w-full h-48 rounded-lg mb-3 overflow-hidden bg-gray-100">
              <img
                src={
                  imageErrors[menu.id]
                    ? "/images/placeholder.jpg"
                    : getImageUrl(menu.image)
                }
                alt={menu.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => handleImageError(menu.id)}
              />
            </div>
            <h3 className="text-lg font-semibold">{menu.name}</h3>
            <p className="text-gray-600 text-sm">{menu.description}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="font-bold text-lg">
                Rp {menu.price.toLocaleString()}
              </span>
              {menu.isAvailable ? (
                <span className="text-green-600 text-sm">✅ Available</span>
              ) : (
                <span className="text-red-600 text-sm">❌ Unavailable</span>
              )}
            </div>
            {menu.category && (
              <span className="text-xs text-gray-500 mt-1 block">
                {menu.category.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
