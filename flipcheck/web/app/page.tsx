export default function LandingPage() {
  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="wordmark">
            <span className="dot" />
            flip<em>check</em>
          </a>
          <div className="nav-links">
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a href="#download" className="nav-cta">
              Get the app
            </a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="container">
          <span className="eyebrow">Built for resellers, by resellers</span>
          <h1>
            Snap a tag.
            <br />
            <em>Know what it's worth.</em>
          </h1>
          <p className="lede">
            FlipCheck looks at any thrift find and tells you the real resale price,
            the best platform to list on, and a title that actually sells. Stop
            scrolling sold comps. Start flipping faster.
          </p>
          <div className="cta-row">
            <a className="cta" href="#download">
              Get the app
            </a>
            <a className="cta secondary" href="#how">
              See how it works
            </a>
          </div>
          <div className="social-proof">
            <span>One-tap appraisals</span>
            <span>Platform-aware</span>
            <span>Counterfeit flags</span>
          </div>
        </div>
      </header>

      <section id="how">
        <div className="container">
          <div className="section-head">
            <div className="section-kicker">How it works</div>
            <h2>Three taps. Real money.</h2>
            <p>
              From a tag photo to a ready-to-post listing in under ten seconds.
            </p>
          </div>
          <div className="grid">
            <div className="card">
              <div className="card-num">1</div>
              <h3>Snap</h3>
              <p>
                Point your camera at a tag, label, or the item itself. One photo is
                enough — no forms, no typing, no guessing what to include.
              </p>
            </div>
            <div className="card">
              <div className="card-num">2</div>
              <h3>Appraise</h3>
              <p>
                You get a realistic resale range, a condition read, and the single
                best platform for this exact item. With confidence level and
                counterfeit warnings when they matter.
              </p>
            </div>
            <div className="card">
              <div className="card-num">3</div>
              <h3>List</h3>
              <p>
                Copy the auto-generated title, add your photos, hit post. Titles
                front-load the keywords search engines reward.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <div className="section-kicker">Why flippers use it</div>
            <h2>Less guessing. More flipping.</h2>
          </div>
          <div className="grid">
            <div className="card">
              <h3>No more comp scrolling</h3>
              <p>
                You're not digging through 20 sold listings per item. One tap,
                realistic range, move to the next bin.
              </p>
            </div>
            <div className="card">
              <h3>Platform-aware</h3>
              <p>
                Vintage Levi's? <span className="mark">Depop.</span> Designer handbag?{' '}
                <span className="mark">The RealReal.</span> Pyrex?{' '}
                <span className="mark">Etsy.</span> We pick the one that fits the
                buyer, every time.
              </p>
            </div>
            <div className="card">
              <h3>SEO-ready titles</h3>
              <p>
                Brand, item type, era, key detail — in the order the algorithm wants.
                You paste, the algorithm does the rest.
              </p>
            </div>
            <div className="card">
              <h3>Honest "skip it" calls</h3>
              <p>
                If it's not worth the listing time, we'll say so. We flag likely
                counterfeits on designer items too.
              </p>
            </div>
            <div className="card">
              <h3>Selling tips per item</h3>
              <p>
                Two to four specific tips — what to measure, what to photograph, how
                to price for offers — so your first listing reads like your hundredth.
              </p>
            </div>
            <div className="card">
              <h3>Built faceless-friendly</h3>
              <p>
                No "founder story," no community, no social graph. Just a tool that
                saves you hours per week. Use it, profit, move on.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <div className="section-kicker">What you see</div>
            <h2>Every scan looks like this.</h2>
            <p>A real appraisal, styled for the aisle. Tap and go.</p>
          </div>
          <div className="mock-wrap">
            <div className="phone">
              <div className="phone-screen">
                <div className="phone-label">Estimated resale value</div>
                <div className="phone-price">$65–$110</div>
                <div className="phone-label" style={{ marginTop: 8 }}>
                  High confidence
                </div>

                <div className="phone-card" style={{ marginTop: 8 }}>
                  <div className="phone-label">What it is</div>
                  <strong>Vintage Levi's 501 Denim Jacket</strong>
                  <p>Levi's · Clothing · Condition: Good</p>
                </div>

                <div className="phone-card">
                  <div className="phone-label">List it on</div>
                  <strong>Depop</strong>
                  <p>
                    Depop's Gen Z buyers pay a premium for authentic vintage Levi's,
                    especially with visible tag details.
                  </p>
                </div>

                <div className="phone-card">
                  <div className="phone-label">Suggested title</div>
                  <strong style={{ fontSize: 13, fontWeight: 500 }}>
                    Vintage Levi's 501 Denim Jacket — Medium Wash, Size M, 90s
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing">
        <div className="container">
          <div className="section-head">
            <div className="section-kicker">Pricing</div>
            <h2>One plan. Made back on your first flip.</h2>
          </div>
          <div className="price-card">
            <div className="price-badge">SAVE 67% ANNUALLY</div>
            <div className="price">
              $39<small> /year</small>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 14 }}>
              or $9.99 / month
            </div>
            <ul>
              <li>Unlimited AI appraisals</li>
              <li>Platform recommendations</li>
              <li>Auto-generated listing titles</li>
              <li>Counterfeit & safety warnings</li>
              <li>Scan history on your device</li>
              <li>Cancel anytime in Settings</li>
            </ul>
            <a className="cta" href="#download" style={{ width: '100%' }}>
              Start with 3 free scans
            </a>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 12 }}>
              No sign-up. No credit card. iOS first, Android coming soon.
            </div>
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="container">
          <div className="section-head">
            <div className="section-kicker">FAQ</div>
            <h2>Questions flippers actually ask.</h2>
          </div>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div className="faq-item">
              <h3>How accurate is it?</h3>
              <p>
                FlipCheck nails brand, category, and best-platform on the vast
                majority of common resale items. Condition is a visual best-guess —
                you should still inspect in person. Rare, high-value designer pieces
                should always be authenticated before listing.
              </p>
            </div>
            <div className="faq-item">
              <h3>Does it authenticate items?</h3>
              <p>
                No. It flags items that look suspicious, but for anything over $500
                use a real authentication service like Entrupy or the platform's
                built-in authentication (StockX, The RealReal).
              </p>
            </div>
            <div className="faq-item">
              <h3>Do you store my photos?</h3>
              <p>
                Photos are sent to the appraisal model, not stored. Your scan history
                lives on your device only — uninstall the app, it's gone.
              </p>
            </div>
            <div className="faq-item">
              <h3>Does it work for electronics? Furniture? Collectibles?</h3>
              <p>
                Yes. It routes furniture and heavy items to Facebook Marketplace /
                OfferUp, electronics and collectibles to eBay, and so on. It knows
                where each item sells best.
              </p>
            </div>
            <div className="faq-item">
              <h3>Android?</h3>
              <p>Coming soon. iOS first.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="download" style={{ textAlign: 'center' }}>
        <div className="container">
          <div className="section-head">
            <div className="section-kicker">Ready when you are</div>
            <h2>Your next flip is in your camera roll.</h2>
            <p>
              Download FlipCheck and make it back on the first item you scan. Or
              don't — we'll still be here when the comp scrolling gets old.
            </p>
          </div>
          <div className="cta-row">
            <a className="cta" href="#">
              Download for iOS
            </a>
            <a className="cta secondary" href="#">
              Notify me on Android
            </a>
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-inner">
          <div>
            <a href="/" className="wordmark">
              <span className="dot" />
              flip<em>check</em>
            </a>
            <div style={{ marginTop: 6, fontSize: 12 }}>
              © {new Date().getFullYear()} FlipCheck. Made for flippers.
            </div>
          </div>
          <div className="footer-links">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="mailto:hello@flipcheck.app">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}
