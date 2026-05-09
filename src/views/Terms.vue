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
          <h2 class="main-title">TERMS OF SERVICE (AVR)</h2>
          <div class="terms-text">{{ termsText }}</div>
        </main>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => {
  router.go(-1)
}

const termsText = `1. Acceptance of Terms
By accessing or using AVR (Autonomous Virtual Resource), you agree to be bound by these Terms of Service. If you do not agree, you must discontinue use of the platform.

2. Service Overview
AVR provides an AI-driven automated system designed for digital resource management and optimization. All system processes, outputs, and performance are generated dynamically based on internal algorithms and real-time operational conditions.

3. Eligibility
You must be at least 18 years old and have the legal capacity to use this platform. By using AVR, you confirm that you meet these requirements.

4. Account Registration
Users are required to:
  Provide accurate and up-to-date information
  Maintain the confidentiality of account credentials
  Be fully responsible for all activities under their account
AVR is not responsible for unauthorized access due to user negligence.

5. User Conduct
You agree not to:
  Engage in phishing, fraud, or deceptive practices
  Exploit, hack, or disrupt system operations
  Use the platform for unlawful or unauthorized purposes
  Create multiple or fake accounts for manipulation
AVR enforces a strict zero-tolerance policy for violations.

6. Risk Disclosure
AVR operates as an AI-based automated system. Performance and outputs may vary and are not guaranteed. Users acknowledge that all actions and decisions are made at their own discretion and risk.

7. System Integrity
We are committed to maintaining a secure and compliant platform. AVR reserves the right to monitor activity and take necessary actions to protect system integrity.

8. No Affiliation
AVR operates independently and is not affiliated with, endorsed by, or associated with any third-party companies or organizations.

9. Limitation of Liability
AVR shall not be held liable for:
  Variations in system performance or outputs
  User decisions or misuse of the platform
  External factors beyond system control
All services are provided "as is" without warranties.

10. Account Suspension & Termination
We reserve the right to suspend or terminate accounts that:
  Violate these Terms
  Engage in suspicious or harmful activities
  Pose risks to platform security

11. Modifications
AVR may update these Terms at any time. Continued use of the platform constitutes acceptance of any changes.

12. Governing Terms
These Terms are governed by applicable laws and regulations. Users agree to comply with all relevant legal requirements.

13. Contact
For questions or support, please contact the AVR support team.`
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
