import React from "react";
import { useTranslation } from "react-i18next";
import { FiStar } from "react-icons/fi";

const Testimonials: React.FC = () => {
  const { t } = useTranslation();

  const testimonialItems = t("testimonials.items", {
    returnObjects: true,
  }) as Array<{
    name: string;
    role: string;
    content: string;
  }>;

  const defaultTestimonials = [
    {
      name: "Mark Wiens",
      role: "Food Blogger",
      content:
        "Natarsal menghadirkan pengalaman kuliner yang luar biasa! Rendang sapi-nya adalah yang terbaik yang pernah saya cicipi.",
    },
    {
      name: "Gordon Ramsay",
      role: "Koki",
      content:
        "Sebagai seorang chef, saya sangat mengapresiasi kualitas bahan dan teknik memasak yang digunakan di Natarsal.",
    },
    {
      name: "Anthony Bourdain",
      role: "Koki",
      content:
        "Suasana restoran yang elegan dengan cita rasa autentik Nusantara. Saya pasti akan kembali lagi!",
    },
  ];

  const testimonials =
    Array.isArray(testimonialItems) && testimonialItems.length > 0
      ? testimonialItems
      : defaultTestimonials;

  const images = [
    "/images/Mark Wiens.png",
    "/images/Gordon Ramsay.png",
    "/images/Anthony Bourdain.png",
  ];

  return (
    <section className="section-padding bg-natarsal-cream">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block px-4 py-1.5 border border-natarsal-gold/30 rounded-full text-natarsal-gold text-xs tracking-widest uppercase mb-4">
            {t("testimonials.title")}
          </div>
          <h2 className="section-title mb-4">{t("testimonials.subtitle")}</h2>
          <p className="section-subtitle">{t("testimonials.description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-natarsal-cream flex-shrink-0 border-2 border-natarsal-gold/20">
                  <img
                    src={images[index % images.length]}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      const parent = (e.target as HTMLImageElement)
                        .parentElement;
                      if (parent) {
                        parent.style.display = "flex";
                        parent.style.alignItems = "center";
                        parent.style.justifyContent = "center";
                        parent.style.backgroundColor = "#825E2E";
                        parent.style.color = "white";
                        parent.style.fontWeight = "bold";
                        parent.style.fontSize = "1.25rem";
                        parent.textContent = testimonial.name.charAt(0);
                      }
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-natarsal-black">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-natarsal-black/50">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className="text-natarsal-gold fill-natarsal-gold"
                  />
                ))}
              </div>
              <p className="text-natarsal-black/70 text-sm leading-relaxed italic">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
