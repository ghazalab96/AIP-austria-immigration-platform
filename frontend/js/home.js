const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");
const mainContent = document.getElementById("main-content");
const navLinks = document.querySelectorAll(".nav-link");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("show");
  });
}

const pages = {
  home: `
    <section class="hero">
      <div class="hero-overlay">
        <div class="hero-content">
          <h2>Your Path to Studying Abroad Starts Here</h2>
          <div class="accent-line"></div>
          <p>
            We simplify your journey to international education with expert guidance
            and end-to-end support.
          </p>
        </div>
      </div>
    </section>

    <section class="services">
      <div class="service-card">
        <div class="icon-circle blue">📄</div>
        <h3>Student Application</h3>
        <p>Choose the right university and submit your application easily.</p>
        <span class="card-line blue-line"></span>
      </div>

      <div class="service-card">
        <div class="icon-circle green">🌐</div>
        <h3>Student Visa</h3>
        <p>Expert visa guidance to help you apply with confidence.</p>
        <span class="card-line green-line"></span>
      </div>

      <div class="service-card">
        <div class="icon-circle yellow">🏢</div>
        <h3>Dorm & Insurance</h3>
        <p>Find safe accommodation and reliable insurance easily.</p>
        <span class="card-line yellow-line"></span>
      </div>
    </section>
  `,

  universities: `
    <section class="content-page">
      <div class="section-title">
        <h2>Universities</h2>
        <p>Explore study opportunities in Austria.</p>
      </div>

      <div class="university-grid">
        <div class="university-card">
          <h3>University of Vienna</h3>
          <p>One of the largest and oldest universities in Europe.</p>
        </div>

        <div class="university-card">
          <h3>TU Wien</h3>
          <p>Technical university focused on engineering, technology and research.</p>
        </div>

        <div class="university-card">
          <h3>FH Technikum Wien</h3>
          <p>Applied sciences university with career-focused programs.</p>
        </div>
      </div>
    </section>
  `,

  services: `
    <section class="content-page">
      <div class="section-title">
        <h2>Our Services</h2>
        <p>Everything you need for your immigration and study journey.</p>
      </div>

      <div class="university-grid">
        <div class="university-card">
          <h3>Application Support</h3>
          <p>We help you prepare and submit your university application.</p>
        </div>

        <div class="university-card">
          <h3>Visa Guidance</h3>
          <p>Track and manage your visa application process.</p>
        </div>

        <div class="university-card">
          <h3>Accommodation Help</h3>
          <p>Find dormitory and housing options in Austria.</p>
        </div>
      </div>
    </section>
  `,

  faq: `
    <section class="content-page">
      <div class="section-title">
        <h2>FAQ</h2>
        <p>Common questions about applications and visa process.</p>
      </div>

      <div class="faq-list">
        <div class="faq-item">
          <h3>Do I need an account?</h3>
          <p>Yes, you need an account to submit and track your application.</p>
        </div>

        <div class="faq-item">
          <h3>Can I track my application?</h3>
          <p>Yes, your dashboard shows your application status.</p>
        </div>

        <div class="faq-item">
          <h3>Is my data secure?</h3>
          <p>Your account is protected with JWT-based authentication.</p>
        </div>
      </div>
    </section>
  `,

  contact: `
    <section class="content-page">
      <div class="section-title">
        <h2>Contact Us</h2>
        <p>Need help? We are here to support your journey.</p>
      </div>

      <div class="contact-box">
        <p><strong>Email:</strong> support@aip.at</p>
        <p><strong>Location:</strong> Vienna, Austria</p>
        <p><strong>Working Hours:</strong> Monday to Friday, 09:00 - 17:00</p>
      </div>
    </section>
  `
};

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const page = link.dataset.page;

    mainContent.innerHTML = pages[page];

    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");

    navbar.classList.remove("show");
  });
});