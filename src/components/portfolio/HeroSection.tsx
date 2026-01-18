const HeroSection = () => {
  return (
    <section className="animate-fade-up delay-100">
      {/* Greeting */}
      <p className="text-muted-foreground text-lg mb-4">👋 Olá</p>
      
      {/* Main Headline */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2">
        Eu sou Matheus Castelo,
      </h1>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
        Founder da NoCode StartUp
      </h2>
      
      {/* Pitch */}
      <p className="text-lg text-muted-foreground mt-6 max-w-2xl leading-relaxed">
        Criador do Maior Ecossistema de NoCode IA do Brasil. Domine as habilidades do futuro sem precisar aprender a programar.
      </p>

      {/* Stats */}
      <div className="stats-grid mt-10">
        <div className="stat-item">
          <p className="stat-number">110k+</p>
          <p className="stat-label">Inscritos no YouTube</p>
        </div>
        <div className="stat-item">
          <p className="stat-number">9k+</p>
          <p className="stat-label">Alunos Formados</p>
        </div>
        <div className="stat-item">
          <p className="stat-number">3+</p>
          <p className="stat-label">Anos de Experiência</p>
        </div>
        <div className="stat-item">
          <p className="stat-number">2x</p>
          <p className="stat-label">Embaixador Oficial</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
