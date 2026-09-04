// D:/natarsal/natarsal-frontend/src/components/sections/testimonials.tsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FiStar } from "react-icons/fi";
import apiClient from "../../config/api";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  image?: string;
  rating: number;
  order: number;
}

const Testimonials: React.FC = () => {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  // ✅ FIX 1: Ganti NodeJS.Timeout dengan number
  const autoPlayRef = useRef<number | null>(null);

  // Default testimonials (fallback) - 8 items
  const defaultTestimonials: Testimonial[] = [
    {
      id: 1,
      name: "Mark Wiens",
      role: "Food Blogger",
      content:
        "Natarsal delivers an extraordinary culinary experience! The beef rendang is the best I've ever tasted.",
      image: "/images/Mark Wiens.png",
      rating: 5,
      order: 0,
    },
    {
      id: 2,
      name: "Gordon Ramsay",
      role: "Chef",
      content:
        "As a chef, I truly appreciate the quality of ingredients and cooking techniques used at Natarsal.",
      image: "/images/Gordon Ramsay.png",
      rating: 5,
      order: 1,
    },
    {
      id: 3,
      name: "Anthony Bourdain",
      role: "Chef",
      content:
        "Elegant restaurant atmosphere with authentic Nusantara flavors. I will definitely come back!",
      image: "/images/Anthony Bourdain.png",
      rating: 5,
      order: 2,
    },
    {
      id: 4,
      name: "Barack Obama",
      role: "American President",
      content:
        "The best fine dining experience in Bali! The ambiance is perfect for special occasions.",
      image: "/images/barack obama.png",
      rating: 5,
      order: 3,
    },
    {
      id: 5,
      name: "Alain Ducasse",
      role: "Restaurant Owner",
      content:
        "As a fellow restaurateur, I'm impressed by the quality and consistency of Natarsal's dishes.",
      image: "/images/alain ducasse.png",
      rating: 5,
      order: 4,
    },
    {
      id: 6,
      name: "Diana",
      role: "Princess of Wales",
      content:
        "A hidden gem in Denpasar! The fusion of traditional and modern cuisine is brilliant.",
      image: "/images/diana.png",
      rating: 5,
      order: 5,
    },
    {
      id: 7,
      name: "Michael Jackson",
      role: "Musician",
      content:
        "Natarsal successfully elevates Indonesian cuisine to fine dining level. A must-visit!",
      image: "/images/michael jackson.png",
      rating: 5,
      order: 6,
    },
    {
      id: 8,
      name: "Cristiano Ronaldo",
      role: "Footballer",
      content: "Natarsal is a culinary masterpiece! Highly recommended!",
      image: "/images/cristiano ronaldo.png",
      rating: 5,
      order: 7,
    },
  ];

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await apiClient.getTestimonials();
      if (response.success && response.data && response.data.length > 0) {
        setTestimonials(response.data);
      } else {
        setTestimonials(defaultTestimonials);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
      setTestimonials(defaultTestimonials);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image?: string) => {
    if (!image) return "/images/placeholder.jpg";
    if (image.startsWith("http")) return image;
    return image;
  };

  const shiftNext = () => {
    if (isTransitioning || testimonials.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const shiftPrev = () => {
    if (isTransitioning || testimonials.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Auto-slide setiap 1 detik
  useEffect(() => {
    if (testimonials.length === 0 || isDragging) return;
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    // ✅ FIX 1: Gunakan window.setInterval (return number)
    autoPlayRef.current = window.setInterval(() => {
      shiftNext();
    }, 1000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [testimonials.length, currentIndex, isDragging]);

  // ============================================================
  // DRAG / SWIPE HANDLERS
  // ============================================================

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setCurrentX(clientX);
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setCurrentX(clientX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const diff = startX - currentX;
    const threshold = 50;

    if (diff > threshold) {
      shiftNext();
    } else if (diff < -threshold) {
      shiftPrev();
    }

    setStartX(0);
    setCurrentX(0);
  };

  // ============================================================
  // 3D CAROUSEL
  // ============================================================

  const getVisibleIndices = () => {
    const total = testimonials.length;
    const indices: number[] = [];
    for (let diff = -3; diff <= 3; diff++) {
      let index = (currentIndex + diff + total) % total;
      indices.push(index);
    }
    return indices;
  };

  const getCardStyle = (
    index: number,
    isVisible: boolean,
  ): React.CSSProperties => {
    if (!isVisible) {
      return {
        transform: "translateX(999px) scale(0)",
        opacity: 0,
        zIndex: 0,
        // ✅ FIX 2: Gunakan as const untuk pointerEvents
        pointerEvents: "none" as const,
        transition: isDragging
          ? "none"
          : "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        // ✅ FIX 2: Gunakan as const untuk transformStyle
        transformStyle: "preserve-3d" as const,
      };
    }

    let diff = index - currentIndex;
    const total = testimonials.length;

    if (diff > 3) diff -= total;
    if (diff < -3) diff += total;

    const translateX = diff * 155;
    const translateZ = -Math.abs(diff) * 28;
    const rotateY = diff * 7;
    const scale = 1 - Math.abs(diff) * 0.065;
    const opacity = 1 - Math.abs(diff) * 0.11;
    const zIndex = 10 - Math.abs(diff);

    return {
      transform: `
        translateX(${translateX}px) 
        translateZ(${translateZ}px) 
        rotateY(${rotateY}deg) 
        scale(${scale})
      `,
      opacity: opacity,
      zIndex: zIndex,
      // ✅ FIX 2: Gunakan as const untuk pointerEvents
      pointerEvents: (diff === 0 ? "auto" : "none") as const,
      transition: isDragging
        ? "none"
        : "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      cursor: isDragging ? "grabbing" : "grab",
      willChange: "transform, opacity",
      // ✅ FIX 2: Gunakan as const untuk transformStyle
      transformStyle: "preserve-3d" as const,
    };
  };

  if (loading) {
    return (
      <section className="bg-natarsal-cream/20 py-8">
        <div className="container-custom text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-natarsal-gold border-t-transparent"></div>
          <p className="mt-2 text-natarsal-black/60">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const visibleIndices = getVisibleIndices();

  return (
    <section className="bg-natarsal-cream/20 py-8 md:py-12 overflow-hidden select-none">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block px-4 py-1.5 border border-natarsal-gold/30 rounded-full text-natarsal-gold text-xs tracking-widest uppercase mb-4">
            {t("testimonials.title")}
          </div>

          <h2 className="section-title mb-4 text-white">
            {t("testimonials.subtitle")}
          </h2>

          <p className="section-subtitle text-white/80">
            {t("testimonials.description")}
          </p>
        </div>

        <div
          className="relative perspective-1000 overflow-visible"
          style={{ perspective: "1200px" }}
        >
          <div
            className="relative flex items-center justify-center h-[160px] md:h-[200px] touch-pan-y"
            style={{ transformStyle: "preserve-3d" }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            {testimonials.map((testimonial, index) => {
              const isVisible = visibleIndices.includes(index);
              const style = getCardStyle(index, isVisible);

              return (
                <div
                  key={testimonial.id}
                  className={`absolute w-[210px] md:w-[250px] bg-white rounded-2xl shadow-xl p-5 hover:shadow-2xl transition-shadow duration-300 ${
                    !isVisible ? "invisible" : ""
                  }`}
                  style={style}
                >
                  {/* Star Rating */}
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`${
                          i < testimonial.rating
                            ? "text-natarsal-gold fill-natarsal-gold"
                            : "text-gray-300"
                        } text-sm`}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-natarsal-black/70 text-xs md:text-sm leading-relaxed italic line-clamp-3 mb-3">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-natarsal-cream flex-shrink-0 border-2 border-natarsal-gold/20">
                      {testimonial.image ? (
                        <img
                          src={getImageUrl(testimonial.image)}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = "none";
                            const parent = img.parentElement;
                            if (parent) {
                              parent.style.display = "flex";
                              parent.style.alignItems = "center";
                              parent.style.justifyContent = "center";
                              parent.style.backgroundColor = "#825E2E";
                              parent.style.color = "white";
                              parent.style.fontWeight = "bold";
                              parent.style.fontSize = "1rem";
                              parent.textContent = testimonial.name.charAt(0);
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-natarsal-gold text-white font-bold text-base">
                          {testimonial.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-natarsal-black text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-natarsal-black/50">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Indikator Geser (Hint) */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-natarsal-black/20 text-xs flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-4 h-0.5 bg-natarsal-black/20 rounded-full"></span>
              <span className="w-4 h-0.5 bg-natarsal-black/20 rounded-full"></span>
            </span>
          </div>
        </div>

        {/* Counter / Indicator */}
        <div className="text-center mt-4">
          <span className="text-xs text-natarsal-black/40">
            {currentIndex + 1} / {testimonials.length}
          </span>
        </div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1200px;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .touch-pan-y {
          touch-action: pan-y;
        }
        .invisible {
          visibility: hidden;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
