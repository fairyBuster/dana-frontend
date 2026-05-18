<template>
  <div class="terms-container">
    <section id="section-terms-of-service">
      <div class="app-container">
        <header class="header">
          <button type="button" class="back-button" aria-label="Go back" @click="goBack">
            <img src="/assets/image/4026_567.svg" alt="Back" width="20" height="20">
          </button>
          <h1 class="header-title">Terms of Service</h1>
        </header>

        <main class="main-content">
          <h2 class="main-title">TERMS OF SERVICE (HUE)</h2>
          <div class="terms-text">
            <p>1. Acceptance of Terms<br>
            By accessing or using HUE (Hybrid Unified Edge), you agree to be bound by these Terms of Service. If you do not agree, you must discontinue use of the platform.</p>

            <p>2. Service Overview<br>
            HUE provides a cloud computing and digital infrastructure system designed for resource management, distributed computing, and operational optimization. All system processes, outputs, and performance are generated dynamically based on internal systems and real-time operational conditions.</p>

            <p>3. Eligibility<br>
            You must be at least 18 years old and have the legal capacity to use this platform. By using HUE, you confirm that you meet these requirements.</p>

            <p>4. Account Registration<br>
            Users are required to:</p>
            <ul>
              <li>Provide accurate and up-to-date information</li>
              <li>Maintain the confidentiality of account credentials</li>
              <li>Be fully responsible for all activities under their account</li>
            </ul>
            <p>HUE is not responsible for unauthorized access resulting from user negligence or compromised credentials.</p>

            <p>5. User Conduct<br>
            You agree not to:</p>
            <ul>
              <li>Engage in phishing, fraud, or deceptive practices</li>
              <li>Exploit, hack, abuse, or disrupt system operations</li>
              <li>Use the platform for unlawful or unauthorized purposes</li>
              <li>Create multiple or fake accounts for manipulation or misuse</li>
            </ul>
            <p>HUE enforces a strict zero-tolerance policy toward violations of platform rules and security standards.</p>

            <p>6. Risk Disclosure<br>
            HUE operates as a cloud-based automated infrastructure system. Operational outputs and system performance may vary depending on real-time conditions and are not guaranteed. Users acknowledge that all decisions and activities are performed at their own discretion and risk.</p>

            <p>7. System Integrity<br>
            We are committed to maintaining a secure, transparent, and compliant platform environment. HUE reserves the right to monitor platform activity and take necessary actions to protect operational integrity and system security.</p>

            <p>8. No Affiliation<br>
            HUE operates independently and is not affiliated with, endorsed by, or associated with any third-party companies, organizations, or financial institutions unless explicitly stated.</p>

            <p>9. Limitation of Liability<br>
            HUE shall not be held liable for:</p>
            <ul>
              <li>Variations in system performance or operational outputs</li>
              <li>User decisions or misuse of the platform</li>
              <li>External factors beyond system control</li>
            </ul>
            <p>All services are provided "as is" without warranties or guarantees of specific results.</p>

            <p>10. Account Suspension & Termination<br>
            We reserve the right to suspend or terminate accounts that:</p>
            <ul>
              <li>Violate these Terms</li>
              <li>Engage in suspicious, harmful, or abusive activities</li>
              <li>Pose risks to platform security, operations, or integrity</li>
            </ul>

            <p>11. Modifications<br>
            HUE may update or modify these Terms at any time. Continued use of the platform constitutes acceptance of any revised terms and policies.</p>

            <p>12. Governing Terms<br>
            These Terms are governed by applicable laws and regulations. Users agree to comply with all relevant legal and regulatory requirements within their jurisdiction.</p>

            <p>13. Contact<br>
            For questions, assistance, or support, please contact the HUE support team.</p>
          </div>
        </main>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  try {
    if (window.history.length > 1) {
      router.back()
      return
    }
  } catch (_) {
  }

  const token = String(localStorage.getItem('auth_token') || '').trim()
  router.push(token ? '/hn/user' : '/hn/console')
}

const handleScroll = () => {
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.terms-container {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

#section-terms-of-service {
  width: 100%;
  display: flex;
  justify-content: center;
}

.app-container {
  width: 100%;
  max-width: 100%;
  background-color: #ffffff;
  min-height: 100vh;
  color: #000000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  padding: 19px 15px;
  position: relative;
  justify-content: center;
}

.back-button {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #000000;
  line-height: 1.2;
  text-align: center;
  max-width: 100%;
}

.back-button {
  position: absolute;
  left: 15px;
}

.main-content {
  padding: 11px 22px 40px 22px;
  flex-grow: 1;
}

.main-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 13px 0;
  line-height: 1.2;
}

.terms-text {
  font-size: 15px;
  line-height: 1.5;
  white-space: pre-wrap;
  color: #000000;
}

.terms-list {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  line-height: 1.5;
}

.term-item {
  margin: 0 0 14px 0;
}

.term-title {
  font-size: 12px;
  font-weight: 700;
  margin: 0 0 6px 0;
  line-height: 1.3;
}

.term-text {
  font-size: 12px;
  line-height: 1.5;
  color: #000000;
  margin: 0 0 8px 0;
}

.term-bullets {
  margin: 0 0 8px 0;
  padding-left: 18px;
  font-size: 12px;
  line-height: 1.5;
}

.term-bullets li {
  margin: 0 0 6px 0;
}
</style>
