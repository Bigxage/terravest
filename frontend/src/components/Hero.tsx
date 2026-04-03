export default function Hero() {
  return (
    <section className="relative text-center py-28 px-6">
      {/* glow background */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent blur-3xl opacity-30" />

      <h2 className="relative text-5xl md:text-7xl font-bold leading-tight">
        Own Real Estate
        <br />
        <span className="text-accent">Without Borders</span>
      </h2>

      <p className="relative mt-6 text-gray-400 max-w-xl mx-auto">
        TerraVest empowers you to invest in verified real-world properties
        from anywhere in the world on Solana.
      </p>

      <div className="relative mt-10 flex justify-center gap-4">
        <button className="bg-accent text-black px-6 py-3 rounded-lg font-semibold hover:opacity-80">
          Explore Properties
        </button>

        <button className="border border-gray-700 px-6 py-3 rounded-lg text-gray-300 hover:bg-gray-800">
          Learn More
        </button>
      </div>
    </section>
  );
}