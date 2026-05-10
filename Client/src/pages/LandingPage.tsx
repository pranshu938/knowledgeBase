// src/pages/LandingPage.tsx
import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div className="landing">
      {/* HERO SECTION – same as before */}
      <section className="hero" id="home">
        <div className="hero-text">
          <p className="eyebrow">AI-powered personal knowledge base</p>
          <h1>
            Search your own brain.
            <span className="hero-highlight">
              {" "}
              Chat with your notes & PDFs.
            </span>
          </h1>
          <p>
            Upload notes, documents and PDFs – then ask AI questions that are
            answered only from your knowledge. Built for developers, students
            and professionals who don&apos;t want to lose their learnings.
          </p>
          <div className="hero-actions">
            <a href="#features" className="btn btn-primary">
              Explore features
            </a>
            <a href="#how-it-works" className="btn btn-ghost">
              See how it works
            </a>
          </div>
          <p className="hero-footnote">
            No public training. Your data stays private to your account.
          </p>
        </div>

        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-card-header">Chat with your notes</div>
            <div className="hero-card-body">
              <div className="hero-chat-bubble user">
                “Explain my DP notes in simple words…”
              </div>
              <div className="hero-chat-bubble ai">
                “Your notes say DP is about breaking problems into overlapping
                subproblems. Let&apos;s start with a small example…”
              </div>
              <div className="hero-chat-bubble user">
                “Make 5 flashcards for revision.”
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION – with icons + soft background band */}
      <section className="section section--alt" id="features">
        <div className="section-header">
          <span className="badge">Why KnowledgeBase AI?</span>
          <h2>Turn scattered notes into a system.</h2>
          <p className="section-subtitle">
            Capture everything once. Find it instantly. Let AI do the heavy
            lifting when you revise.
          </p>
        </div>

        <div className="grid-3">
          <FeatureCard
            emoji="📚"
            title="Centralize your knowledge"
            text="Write notes or upload PDFs, docs and articles. Organize them into spaces for DSA, React, job prep and more."
          />
          <FeatureCard
            emoji="🤖"
            title="Chat with your own data"
            text="Ask questions like ChatGPT, but answers come only from your notes and documents – never the public internet."
          />
          <FeatureCard
            emoji="⚡️"
            title="Revise smarter"
            text="Generate summaries, flashcards and revision checklists from your existing content with one click."
          />
        </div>
      </section>

      {/* HOW IT WORKS – timeline style */}
      <section className="section" id="how-it-works">
        <div className="section-header section-header--center">
          <span className="badge badge-outline">How it works</span>
          <h2>From raw notes to clear understanding.</h2>
          <p className="section-subtitle">
            A simple three-step flow designed for busy developers and learners.
          </p>
        </div>

        <div className="steps steps--timeline">
          <Step
            number="01"
            title="Upload & write"
            text="Create spaces, write notes and upload PDFs or docs you want to learn from."
          />
          <Step
            number="02"
            title="Ask anything"
            text="Use the AI chat to ask questions. It reads only your content to craft answers."
          />
          <Step
            number="03"
            title="Revise & track"
            text="Use summaries, flashcards and analytics to revise topics and track progress."
          />
        </div>
      </section>

      {/* PRICING / CTA – two cards, one highlighted */}
      <section className="section section--alt" id="pricing">
        <div className="section-header section-header--center">
          <span className="badge">Pricing</span>
          <h2>Start free. Grow as your knowledge grows.</h2>
          <p className="section-subtitle">
            Perfect for personal learning now, with room to scale if you ever
            need more.
          </p>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Free</h3>
            <p className="pricing-tagline">For focused personal learning.</p>
            <ul>
              <li>Up to 100 notes</li>
              <li>Up to 10 PDFs</li>
              <li>Basic AI Q&amp;A</li>
              <li>Personal spaces &amp; tags</li>
            </ul>
            <button className="btn btn-outline-full">Get started free</button>
          </div>

          <div className="pricing-card pricing-card--highlight">
            <div className="pricing-badge">Coming soon</div>
            <h3>Pro</h3>
            <p className="pricing-tagline">
              For power users and serious interview prep.
            </p>
            <ul>
              <li>Unlimited notes &amp; docs</li>
              <li>Advanced AI summaries &amp; flashcards</li>
              <li>Priority processing &amp; backups</li>
              <li>Export to PDF / Anki</li>
            </ul>
            <button className="btn btn-primary-full">Join waitlist</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <p>© {new Date().getFullYear()} KnowledgeBase AI. Built by you.</p>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  emoji: string;
  title: string;
  text: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ emoji, title, text }) => {
  return (
    <div className="feature-card">
      <div className="feature-card-icon">{emoji}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
};

interface StepProps {
  number: string;
  title: string;
  text: string;
}

const Step: React.FC<StepProps> = ({ number, title, text }) => {
  return (
    <div className="step">
      <div className="step-number">{number}</div>
      <div className="step-body">
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default LandingPage;
