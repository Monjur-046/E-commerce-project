
function Newsletter() {
  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Newsletter signup will be connected later!");
  };

  return (
    <section className="newsletter-section">
      <p className="eyebrow">A NOTE FROM US</p>
      <h2>Good things, occasionally.</h2>

      <p>
        New arrivals, thoughtful edits, and a little inspiration.
      </p>

      <form className="newsletter-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>

        <input
          id="newsletter-email"
          type="email"
          placeholder="Your email address"
          required
        />

        <button type="submit">Subscribe ↗</button>
      </form>
    </section>
  );
}

export default Newsletter;
