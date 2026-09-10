import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiStar } from "react-icons/fi";
import apiClient, { MenuItem, getImageUrl } from "../../config/api";

export default function MenuPreview() {
  const { t } = useTranslation();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
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

  const displayMenus = menus.slice(0, 6);

  return (
    <section className="section-padding bg-natarsal-cream/20">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block px-4 py-1.5 border border-natarsal-gold rounded-full text-natarsal-gold text-xs tracking-widest uppercase mb-4">
            {t("menu.title")}
          </div>

          <h2 className="section-title mb-4 text-white">
            {t("menu.subtitle")}
          </h2>

          <p className="section-subtitle text-white/80">
            {t("menu.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMenus.map((item) => {
            const imageUrl = getImageUrl(item.image);
            const hasError = imageErrors[item.id];
            const isHovered = hoveredItem === String(item.id);

            return (
              <div
                key={item.id}
                className="relative w-full aspect-[3/2] overflow-hidden cursor-default bg-natarsal-cream rounded-xl"
                onMouseEnter={() => setHoveredItem(String(item.id))}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <img
                  src={hasError ? "/images/placeholder.jpg" : imageUrl}
                  alt={item.name}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    isHovered
                      ? "grayscale brightness-50"
                      : "grayscale-0 brightness-100"
                  }`}
                  loading="lazy"
                  onError={() => handleImageError(item.id)}
                />

                <div
                  className={`absolute inset-0 bg-black/50 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    {item.name}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed line-clamp-3 max-w-xs">
                    {item.description}
                  </p>
                  <p className="text-natarsal-gold font-bold text-lg mt-2">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>
                </div>

                {item.isRecommended && (
                  <span className="absolute top-3 left-3 bg-natarsal-gold text-white text-xs font-medium px-2 py-1 rounded-sm flex items-center gap-1 z-10">
                    <FiStar className="fill-current text-[10px]" />
                    {t("menu.recommended")}
                  </span>
                )}

                <div className="absolute bottom-3 right-3 flex gap-1 z-10">
                  {item.isSpicy && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                      spicy
                    </span>
                  )}
                  {item.isVegetarian && (
                    <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                      vegetarian
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <a
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3 bg-natarsal-gold text-white rounded-lg hover:bg-natarsal-black transition-colors"
          >
            {t("menu.viewAll")}
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
