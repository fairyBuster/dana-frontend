<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="app-header">
        <button class="back-button" @click="goBack" aria-label="Go back">
          <img src="/assets/image/330_224.svg" alt="Back">
        </button>
        <h1 class="header-title">Bind Account</h1>
      </header>
    </section>

    <!-- Account Options -->
    <section id="section-account-options">
      <div class="cards-container">
        <!-- IDR Card -->
        <div class="account-card">
          <div class="card-tag tag-idr">IDR</div>
          <div class="card-content">
            <img src="/assets/image/d85fb29e4e19dd899589dbf989e615ca933f1f52.png" alt="IDR Icon" class="card-icon">
            <div class="card-text">
              <h2 class="card-title">Bind IDR Bank Account</h2>
              <p class="card-desc">Bind your Indonesian bank account to withdraw IDR funds.</p>
            </div>
          </div>
          <button class="btn btn-idr" @click="router.push({ path: '/hn/connect/add', query: { currency_code: 'IDR' } })">Submit New</button>
        </div>

        <!-- USD Card -->
        <div class="account-card">
          <div class="card-tag tag-usdt">USD</div>
          <div class="card-content">
            <img src="/assets/image/65dd62c6e1300473a49c744e825c21008d000875.png" alt="USDT Icon" class="card-icon">
            <div class="card-text">
              <h2 class="card-title">Bind USD Account</h2>
              <p class="card-desc">Bind your USD account to withdraw USD funds.</p>
            </div>
          </div>
          <button class="btn btn-usdt" @click="router.push({ path: '/hn/connect/add', query: { currency_code: 'USD' } })">Submit New</button>
        </div>
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
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 412px;
  min-height: 100vh;
  background-color: #f8f8f8;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

h1, h2, p {
  margin: 0;
}

img {
  max-width: 100%;
  display: block;
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 10px;
  position: relative;
  background-color: #f8f8f8;
}

.back-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  position: absolute;
  left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

/* Account Options */
.cards-container {
  padding: 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.account-card {
  background-color: #ffffff;
  border: 1px solid #f4f4f4;
  border-radius: 5px;
  padding: 36px 16px 16px 16px;
  position: relative;
}

.card-tag {
  position: absolute;
  top: -1px;
  left: -1px;
  padding: 4px 8px;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tag-idr {
  background-color: #1b46f5;
}

.tag-usdt {
  background-color: #1ba27a;
}

.card-content {
  display: flex;
  gap: 14px;
  margin-bottom: 20px;
  align-items: flex-start;
}

.card-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
  flex-shrink: 0;
}

.card-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 2px;
}

.card-title {
  font-size: 16px;
  font-weight: 400;
  color: #000000;
  margin: 0;
}

.card-desc {
  font-size: 12px;
  color: #737373;
  margin: 0;
  line-height: 1.4;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.2s ease;
  font-family: inherit;
}

.btn:hover {
  opacity: 0.9;
}

.btn-idr {
  background-color: #1b46f5;
}

.btn-usdt {
  background-color: #1ba27a;
}
</style>
