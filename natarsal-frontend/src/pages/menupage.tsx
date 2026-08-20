import React, { useState, useEffect } from "react";
import Layout from "../components/layout/layout";
import { useTranslation } from "react-i18next";
import { FiSearch, FiStar, FiLoader } from "react-icons/fi";
import api from "../config/api";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category?: { name: string; slug: string };
  image?: string;
  isRecommended: boolean;
  isSpicy: boolean;
  isVegetarian: boolean;
  isAvailable: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const MenuPage: React.FC = () => {
  const { t } = useTranslation();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [menusRes, categoriesRes] = await Promise.all([
          api.getMenus(),
          api.getCategories(),
        ]);

        if (menusRes.success) {
          const menusWithStringId = menusRes.data.map((item: any) => ({
            ...item,
            id: String(item.id),
            categoryId: String(item.categoryId),
          }));
          setMenus(menusWithStringId);
        }

        if (categoriesRes.success) {
          const categoriesWithStringId = categoriesRes.data.map(
            (item: any) => ({
              ...item,
              id: String(item.id),
            }),
          );
          setCategories(categoriesWithStringId);
        }
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = menus.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.categoryId === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.isAvailable;
  });

  const getImagePath = (imageName?: string) => {
    if (!imageName) return "/images/placeholder.jpg";
    return `/produckimage/${imageName}`;
  };

  if (loading) {
    return (
      <Layout>
        <section className="min-h-screen pt-20 bg-natarsal-cream/20 flex items-center justify-center">
          <div className="text-center">
            <FiLoader className="animate-spin text-natarsal-gold text-4xl mx-auto mb-4" />
            <p className="text-natarsal-black/60">Loading menu...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <section className="min-h-screen pt-20 bg-natarsal-cream/20 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">sorry</div>
            <p className="text-red-500 mb-2">Failed to load menu</p>
            <p className="text-natarsal-black/60 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 btn-primary"
            >
              Try Again
            </button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="min-h-screen pt-20 bg-natarsal-cream/20">
        <div className="container-custom py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block px-4 py-1.5 border border-natarsal-gold rounded-full text-natarsal-gold text-xs tracking-widest uppercase mb-4">
              {t("menu.title")}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              {t("menu.subtitle")}
            </h1>
            <p className="text-lg md:text-xl text-natarsal-gold max-w-2xl mx-auto">
              {t("menu.description")}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-natarsal-black/40" />
              <input
                type="text"
                placeholder={t("menu.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all bg-white"
                aria-label={t("menu.search")}
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === "all"
                    ? "bg-natarsal-gold text-white shadow-md"
                    : "bg-white text-natarsal-black/60 hover:bg-natarsal-cream hover:text-natarsal-black"
                }`}
              >
                {t("menu.categories.all")}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? "bg-natarsal-gold text-white shadow-md"
                      : "bg-white text-natarsal-black/60 hover:bg-natarsal-cream hover:text-natarsal-black"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-natarsal-black/60 text-lg">
                {t("menu.noResults")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const imagePath = getImagePath(item.image);
                const isHovered = hoveredItem === item.id;

                return (
                  <div
                    key={item.id}
                    className="relative w-full aspect-[3/2] overflow-hidden cursor-default bg-natarsal-cream rounded-xl"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <img
                      src={imagePath}
                      alt={item.name}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        isHovered
                          ? "grayscale brightness-50"
                          : "grayscale-0 brightness-100"
                      }`}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/placeholder.jpg";
                      }}
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
                          🌶️
                        </span>
                      )}
                      {item.isVegetarian && (
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                          🌿
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MenuPage;
