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
      <h2 class="main-heading">PRIVACY POLICY (AVR)</h2>
      <div class="policy-text-block">{{ policyText }}</div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => {
  router.go(-1)
}

const policyText = `1. Introduction
 AVR (Autonomous Virtual Resource) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
 
2. Information We Collect
 We may collect the following information: 
  Personal information (such as email address and phone number)
  Account-related data (username, activity logs)
  Technical data (IP address, device type, browser information)

3. How We Use Your Information
 Your information is used to: 
  Provide and maintain AVR services
  Improve system performance and user experience
  Ensure platform security and prevent unauthorized activities
  Communicate important updates or notifications

4. Data Protection
 We implement appropriate security measures to protect your data from unauthorized access, alteration, or misuse. However, no system is completely secure, and users should take steps to protect their own accounts. 

5. Data Sharing
 AVR does not sell, trade, or share your personal information with third parties, except: 
  When required by law or regulation
  To protect system integrity and prevent fraud or abuse

6. Cookies and Tracking
 We may use cookies or similar technologies to enhance user experience, analyze usage, and improve platform functionality. 

7. User Responsibility
 Users are responsible for: 
  Keeping their login credentials secure
  Ensuring the accuracy of their personal information

8. Data Retention
 We retain user data only for as long as necessary to provide services and comply with legal obligations. 

9. No Affiliation
 AVR operates independently and is not affiliated with any third-party organizations or companies. 

10. Updates to This Policy
 We may update this Privacy Policy from time to time. Continued use of AVR services means you accept any changes. 

11. Contact
 If you have questions about this Privacy Policy, please contact the AVR support team.`
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
