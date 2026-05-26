<!-- <template>
  <div class="solution-page">

    <section id="section-header" class="header-section">
      <header class="header-content">
        <a href="#" class="back-btn" aria-label="Go back" @click.prevent="goBack">
          <img src="/assets/image/4026_541.svg" alt="Back Arrow">
        </a>
        <h1 class="header-title">Customer Agreement</h1>
      </header>
    </section>

    <section id="section-agreement" class="agreement-section">
      <div class="agreement-container">
        <h2 class="agreement-main-title">DANA PROTEKSI CUSTOMER AGREEMENT</h2>
        <div class="agreement-text">
          <p>1. Introduction<br>
          Welcome to Dana Proteksi. By accessing or using Dana Proteksi services, you agree to comply with and be bound by this Customer Agreement. If you do not agree, please do not use this platform.</p>

          <p>2. Service Description<br>
          Dana Proteksi provides a cloud computing and digital infrastructure system designed for resource management, distributed computing, and operational optimization. All system operations, outputs, and performance are processed automatically based on internal systems and real-time operational conditions.</p>

          <p>3. User Responsibilities<br>
          By using Dana Proteksi, you agree that:</p>
          <ul>
            <li>You provide accurate and valid information during registration</li>
            <li>You are responsible for maintaining the security of your account</li>
            <li>You will not misuse the platform in any form</li>
            <li>You understand that all activities performed through your account are your responsibility</li>
          </ul>

          <p>4. Risk Acknowledgement<br>
          You acknowledge that:</p>
          <ul>
            <li>System performance and operational outputs may vary and are not guaranteed</li>
            <li>Results are influenced by real-time system and infrastructure conditions</li>
            <li>You are solely responsible for your decisions when using the platform</li>
          </ul>

          <p>5. Prohibited Activities<br>
          Users are strictly prohibited from:</p>
          <ul>
            <li>Engaging in phishing, fraud, or deceptive activities</li>
            <li>Attempting to exploit, hack, or abuse the system</li>
            <li>Using the platform for unauthorized or illegal purposes</li>
            <li>Creating multiple accounts for manipulation or misuse</li>
          </ul>
          <p>Dana Proteksi enforces a zero-tolerance policy toward such activities.</p>

          <p>6. System Integrity & Compliance<br>
          Dana Proteksi is committed to maintaining a secure, transparent, and compliant environment. We reserve the right to monitor, restrict, suspend, or terminate accounts that violate our policies or compromise platform integrity.</p>

          <p>7. No Affiliation<br>
          Dana Proteksi operates independently and is not affiliated with, endorsed by, or associated with any external companies, organizations, financial institutions, or third-party entities.</p>

          <p>8. Limitation of Liability<br>
          <p>Dana Proteksi shall not be held liable for:</p>
          <ul>
            <li>Any loss resulting from system variability or operational interruptions</li>
            <li>User decisions or misuse of the platform</li>
            <li>External factors beyond system control</li>
          </ul>
          <p>All services are provided "as is" without guarantees of specific performance or results.</p>

          <p>9. Account Suspension & Termination<br>
          Dana Proteksi reserves the right to suspend or terminate any account that:</p>
          <ul>
            <li>Violates this agreement</li>
            <li>Engages in suspicious, abusive, or harmful activities</li>
            <li>Poses a risk to platform security or operational integrity</li>
          </ul>

          <p>10. Changes to Terms<br>
          Dana Proteksi may update or modify this agreement at any time. Continued use of the platform constitutes acceptance of the updated terms.</p>

          <p>11. Contact<br>
          If you have any questions regarding this agreement, please contact the Dana Proteksi support team.</p>
        </div>
      </div>
    </section>
  </div>
</template> -->

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.solution-page {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #f5f5f5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

/* Header Section */
.header-section {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 19px 15px 10px 15px;
}

.header-content {
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.back-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #000000;
  line-height: 21px;
  text-align: center;
  max-width: 100%;
}

.back-btn {
  position: absolute;
  left: 0;
}

/* Agreement Section */
.agreement-section {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 11px 19px 40px 19px;
  min-height: calc(100vh - 50px);
}

.agreement-main-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 7px 0;
  line-height: 30px;
}

.agreement-text {
  font-size: 15px;
  color: #000000;
  line-height: 1.5;
  padding-left: 3px;
}

.agreement-text p {
  margin: 0 0 14px 0;
}

.agreement-text ul {
  margin: -10px 0 14px 0;
  padding-left: 18px;
}

.agreement-text li {
  margin-bottom: 2px;
}
</style>
