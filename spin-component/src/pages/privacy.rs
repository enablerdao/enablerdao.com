pub fn render() -> String {
    r#"<section class="section">
  <div class="container">
    <div class="page-header">
      <h1 class="page-title prompt">$ privacy --policy</h1>
      <p class="page-subtitle">EnablerDAO Privacy Policy</p>
    </div>

    <div class="terminal-box">
      <h3>What We Collect</h3>
      <table class="data-table">
        <tbody>
          <tr><td>Newsletter</td><td>Email address</td></tr>
          <tr><td>Fan Club</td><td>Email address</td></tr>
          <tr><td>Ideas</td><td>Submission content, optional nickname</td></tr>
          <tr><td>Feedback</td><td>Feedback content</td></tr>
          <tr><td>Q&amp;A</td><td>Question content, optional nickname</td></tr>
        </tbody>
      </table>
    </div>

    <div class="terminal-box">
      <h3>How We Use Your Data</h3>
      <ul style="color: var(--fg); line-height: 1.8; padding-left: 20px;">
        <li>Newsletter and Fan Club emails are used solely to send updates and announcements.</li>
        <li>Ideas and feedback submissions are used to improve our products and services.</li>
        <li>We do <strong>NOT</strong> sell, rent, or share your personal data with third parties.</li>
        <li>We do <strong>NOT</strong> use third-party tracking, analytics, or advertising scripts.</li>
      </ul>
    </div>

    <div class="terminal-box">
      <h3>Data Storage</h3>
      <p style="color: var(--fg); line-height: 1.8;">
        All data is stored in our Spin KV store on Fly.io infrastructure in the Tokyo (nrt) region.
        We do not transfer data to third-party services for storage or processing.
      </p>
    </div>

    <div class="terminal-box">
      <h3>Data Retention</h3>
      <p style="color: var(--fg); line-height: 1.8;">
        We retain your data for as long as your account or subscription is active, or as needed
        to provide services. You may request deletion of your data at any time by contacting us.
      </p>
    </div>

    <div class="terminal-box">
      <h3>Your Rights</h3>
      <ul style="color: var(--fg); line-height: 1.8; padding-left: 20px;">
        <li>Access: You may request a copy of the data we hold about you.</li>
        <li>Deletion: You may request that we delete your personal data.</li>
        <li>Correction: You may request corrections to inaccurate data.</li>
        <li>Opt-out: You may unsubscribe from newsletters at any time.</li>
      </ul>
    </div>

    <div class="terminal-box">
      <h3>Contact</h3>
      <p style="color: var(--fg); line-height: 1.8;">
        For privacy-related inquiries or data requests, please contact us at
        <a href="mailto:info@enablerdao.com" style="color: var(--green);">info@enablerdao.com</a>.
      </p>
    </div>

    <p style="color: var(--dim); font-size: 13px; margin-top: 24px;">Last updated: March 2026</p>
  </div>
</section>"#
        .to_string()
}
