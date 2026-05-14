<template>
  <div class="policy-container">
    <section id="section-header" class="mobile-container">
      <header class="top-nav">
        <button type="button" class="back-btn" aria-label="Go back" @click="goBack">
          <img src="/assets/image/4026_575.svg" alt="Back Icon">
        </button>
        <h1 class="page-title">Privacy Policy</h1>
      </header>
    </section>

    <section id="section-content" class="mobile-container">
      <h2 class="main-heading">PRIVACY POLICY (HUE)</h2>
      <div class="policy-text-block">
        <p>1. Introduction<br>
        HUE (Hybrid Unified Edge) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform and services.</p>

        <p>2. Information We Collect<br>
        We may collect the following information:</p>
        <ul>
          <li>Personal information (such as email address and phone number)</li>
          <li>Account-related data (username, account activity, and system logs)</li>
          <li>Technical data (IP address, browser information, device type, and access information)</li>
        </ul>

        <p>3. How We Use Your Information<br>
        Your information may be used to:</p>
        <ul>
          <li>Provide, maintain, and improve HUE services</li>
          <li>Enhance system performance and user experience</li>
          <li>Ensure platform security and prevent unauthorized activities</li>
          <li>Communicate important updates, notifications, or operational information</li>
        </ul>

        <p>4. Data Protection<br>
        We implement appropriate administrative and technical security measures to protect your data from unauthorized access, misuse, alteration, or disclosure. However, no online system or transmission method can be guaranteed to be completely secure, and users are encouraged to maintain the security of their own accounts and devices.</p>

        <p>5. Data Sharing<br>
        HUE does not sell, trade, or share your personal information with third parties, except:</p>
        <ul>
          <li>When required by applicable laws or regulations</li>
          <li>To protect system integrity, platform security, or prevent fraud and abuse</li>
          <li>When necessary for operational or compliance purposes</li>
        </ul>

        <p>6. Cookies and Tracking Technologies<br>
        We may use cookies and similar technologies to:</p>
        <ul>
          <li>Improve platform functionality and performance</li>
          <li>Analyze usage patterns and operational metrics</li>
          <li>Enhance overall user experience</li>
        </ul>
        <p>Users may manage browser cookie settings independently through their device or browser preferences.</p>

        <p>7. User Responsibility<br>
        Users are responsible for:</p>
        <ul>
          <li>Keeping account credentials and authentication information secure</li>
          <li>Ensuring the accuracy of submitted personal information</li>
          <li>Maintaining the confidentiality of account access</li>
        </ul>

        <p>8. Data Retention<br>
        We retain user information only for as long as necessary to provide services, maintain operational integrity, comply with legal obligations, and resolve disputes when required.</p>

        <p>9. No Affiliation<br>
        HUE operates independently and is not affiliated with, endorsed by, or associated with any third-party organizations, institutions, or companies unless explicitly stated.</p>

        <p>10. Updates to This Policy<br>
        We may update or modify this Privacy Policy from time to time. Continued use of HUE services following any updates constitutes acceptance of the revised policy.</p>

        <p>11. Contact<br>
        If you have any questions regarding this Privacy Policy or your personal data, please contact the HUE support team.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
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
.policy-container {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

.mobile-container {
  width: 100%;
  max-width: 100%;
  background-color: #ffffff;
}

/* Header Section */
#section-header {
  padding: 19px 15px 0 15px;
}

.top-nav {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  justify-content: center;
}

.back-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.back-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.page-title {
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin: 0;
  line-height: 1.2;
  text-align: center;
  max-width: 100%;
}

.back-btn {
  position: absolute;
  left: 0;
}

/* Content Section */
#section-content {
  padding: 20px 25px 40px 25px;
  flex-grow: 1;
}

.main-heading {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 15px 0;
}

.policy-text-block {
  font-size: 15px;
  line-height: 1.5;
  color: #000000;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.policy-list {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  line-height: 1.5;
}

.policy-item {
  margin: 0 0 14px 0;
}

.policy-title {
  font-size: 12px;
  font-weight: 700;
  margin: 0 0 6px 0;
  line-height: 1.3;
}

.policy-text {
  font-size: 12px;
  line-height: 1.5;
  color: #000000;
  margin: 0 0 8px 0;
}

.policy-bullets {
  margin: 0 0 8px 0;
  padding-left: 18px;
  font-size: 12px;
  line-height: 1.5;
}

.policy-bullets li {
  margin: 0 0 6px 0;
}
</style>
