import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080D1B]">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <main>
        <Hero />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
