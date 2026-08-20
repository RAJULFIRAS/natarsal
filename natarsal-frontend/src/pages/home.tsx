import React from "react";
import Layout from "../components/layout/layout";
import Hero from "../components/sections/hero";
import About from "../components/sections/about";
import MenuPreview from "../components/sections/menupreview";
import Testimonials from "../components/sections/testimonials";
import ReservationCTA from "../components/sections/reservationcta";

const Home: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <About />
      <MenuPreview />
      <Testimonials />
      <ReservationCTA />
    </Layout>
  );
};

export default Home;
