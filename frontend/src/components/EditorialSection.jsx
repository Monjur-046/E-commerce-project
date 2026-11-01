
function EditorialSection() {
  return (
    <section className="editorial-section section-pad" id="about">
      <div className="editorial-image">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85"
          alt="Timeless wardrobe collection"
        />
      </div>

      <div className="editorial-copy">
        <p className="eyebrow">A MORE CONSIDERED WAY TO SHOP</p>

        <h2>Good design is never just about looks.</h2>

        <p>
          We believe the things you choose should feel right,
          work beautifully, and fit naturally into your everyday
          life. Less noise. Better choices.
        </p>

        <a className="button button-dark" href="#products">
          Discover our approach <span>↗</span>
        </a>
      </div>
    </section>
  );
}

export default EditorialSection;
