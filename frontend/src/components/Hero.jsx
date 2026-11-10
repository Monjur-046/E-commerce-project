
function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <p className="eyebrow">THE EVERYDAY EDIT — 2026</p>

        <h1>
          Less, but
          <br />
          <em>better.</em>
        </h1>

        <p className="hero-description">
          Discover everyday essentials designed with intention,
          made for your style, and chosen to last.
        </p>

        <div className="hero-actions">
          <a className="button button-dark" href="#products">
            Explore collection <span>↗</span>
          </a>

          <a className="text-link" href="#about">
            Our philosophy
          </a>
        </div>

        <div className="hero-note">
          <span className="note-line" />
          CONSIDERED DESIGN. TIMELESS STYLE.
        </div>
      </div>

      <div className="hero-visual">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=90"
          alt="Curated fashion store interior"
        />

        <div className="image-caption">
          <span>THE NEW STANDARD</span>
          <span>01 / 04</span>
        </div>

        <div className="floating-note">
          <span className="floating-dot" />
          Curated for everyday living
        </div>
      </div>
    </section>
  );
}

export default Hero;
