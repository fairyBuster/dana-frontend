<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <button class="back-button" @click="goBack" aria-label="Go back">
          <img src="/assets/images/18_146.svg" alt="Back Icon">
        </button>
        <h1 class="page-title">Riwayat transaksi</h1>
      </header>
    </section>

    <!-- List -->
    <section id="section-list">
      <nav class="transaction-list">
        <a href="#" class="list-item" @click.prevent="goToProfitHistory">
          <img src="/assets/images/cde3277fa2769528c9be71b8b0840666c070bbdb.png" alt="Riwayat keuntungan" class="item-icon">
          <span class="item-text">Riwayat keuntungan</span>
        </a>
        <a href="#" class="list-item" @click.prevent="goToDepositHistory">
          <img src="/assets/images/cde3277fa2769528c9be71b8b0840666c070bbdb.png" alt="Riwayat isi ulang" class="item-icon">
          <span class="item-text">Riwayat isi ulang</span>
        </a>
        <a href="#" class="list-item" @click.prevent="goToWithdrawHistory">
          <img src="/assets/images/cde3277fa2769528c9be71b8b0840666c070bbdb.png" alt="Riwayat penarikan" class="item-icon">
          <span class="item-text">Riwayat penarikan</span>
        </a>
        <a href="#" class="list-item" @click.prevent="goToCommissionHistory">
          <img src="/assets/images/cde3277fa2769528c9be71b8b0840666c070bbdb.png" alt="Riwayat komisi undangan" class="item-icon">
          <span class="item-text">Riwayat komisi undangan</span>
        </a>
        <a href="#" class="list-item" @click.prevent="goToPurchaseHistory">
          <img src="/assets/images/cde3277fa2769528c9be71b8b0840666c070bbdb.png" alt="Riwayat pembelian aset" class="item-icon">
          <span class="item-text">Riwayat pembelian aset</span>
        </a>
        <a href="#" class="list-item" @click.prevent="goToOtherHistory">
          <img src="/assets/images/cde3277fa2769528c9be71b8b0840666c070bbdb.png" alt="Riwayat lainnya" class="item-icon">
          <span class="item-text">Riwayat lainnya</span>
        </a>
      </nav>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goToProfitHistory = () => {
  router.push('/portfolio/history')
}

const goToDepositHistory = () => {
  router.push('/dep/history')
}

const goToWithdrawHistory = () => {
  router.push('/flow/history')
}

const goToCommissionHistory = () => {
  router.push('/commission/history')
}

const goToPurchaseHistory = () => {
  router.push('/orders')
}

const goToOtherHistory = () => {
  router.push('/trx')
}
</script>

<style scoped>
.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  background-color: #f8f8f8;
  min-height: 100vh;
  margin: 0 auto;
  position: relative;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

a {
  text-decoration: none;
}

/* Header */
#section-header {
  width: 100%;
}

.header {
  height: 80px;
  position: relative;
  width: 100%;
}

.back-button {
  position: absolute;
  left: 7px;
  top: 21px;
  width: 41px;
  height: 41px;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.back-button:active {
  opacity: 0.6;
}

.back-button img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.page-title {
  position: absolute;
  left: 0;
  right: 0;
  top: 31px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  pointer-events: none;
}

/* List */
#section-list {
  width: 100%;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 0 13px 20px 13px;
  margin: 0;
}

.list-item {
  display: flex;
  align-items: center;
  background-color: #eeeeee;
  border-radius: 20px;
  height: 62px;
  padding: 0 14px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.list-item:active {
  background-color: #e0e0e0;
  transform: scale(0.99);
}

.item-icon {
  width: 32px;
  height: 30px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-text {
  margin-left: 13px;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
}
</style>


