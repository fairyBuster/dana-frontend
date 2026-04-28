<template>
  <div class="index-container">
    <!-- Header Section -->
    <section id="section-header" class="header-section">
      <div class="container">
        <h1 class="title">Selamat datang di TRIVEX!</h1>
        <p class="subtitle">TRIVEX adalah platform transaksi digital yang aman, transparan dan mudah digunakan untuk membantu Anda mengelola aset dan meraih pelulang terbaik setiap hari.</p>
        <div class="trust-row" aria-label="Keunggulan TRIVEX">
          <div class="trust-item">
            <svg class="trust-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 2l7 4v6c0 5-3.5 9.2-7 10-3.5-.8-7-5-7-10V6l7-4z"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linejoin="round"
              />
            </svg>
            <span class="trust-text">Aman & Terpercaya</span>
          </div>
          <div class="trust-item">
            <svg class="trust-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10z"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M12 6v6l4 2"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="trust-text">Cepat & Efisien</span>
          </div>
          <div class="trust-item">
            <svg class="trust-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M5 9v10M12 5v14M19 12v7"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <span class="trust-text">Mudah Digunakan</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Actions Section -->
    <section id="section-actions" class="actions-section">
      <div class="container">
        <p class="prompt">Silakan pilih untuk melanjutkan</p>

        <div class="card">
          <div class="card-content">
            <p class="card-text">Saya adalah pengguna baru! Saya ingin menjadi pengguna TRIVEX!</p>
            <router-link to="/register" class="btn-primary">Buat akun</router-link>
          </div>
          <div class="card-image-wrapper">
            <img src="/assets/images/3ac255d5c6533888be0b453286e8c59c5d0e1e9e.png" alt="TRIVEX Logo" class="card-logo">
          </div>
        </div>

        <div class="card">
          <div class="card-content">
            <p class="card-text">Saya sudah punya akun! Saya ingin masuk ke akun pengguna.</p>
            <router-link to="/login" class="btn-primary">Login ke TRIVEX</router-link>
          </div>
          <div class="card-image-wrapper">
            <img src="/assets/images/3ac255d5c6533888be0b453286e8c59c5d0e1e9e.png" alt="TRIVEX Logo" class="card-logo">
            <div class="badge">User</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <section id="section-footer" class="footer-section">
      <div class="container">
        <p class="footer-text">Pastikan Anda telah membaca keseluruhan Syarat dan Ketentuan,<br>Kebijakan Privasi sebelum melanjutkan aktivitas.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
// Index page - no complex logic needed
</script>

<style scoped>
.index-container {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f8f8f8;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

/* Header Section */
.header-section {
  padding-top: 80px;
  padding-bottom: 40px;
  width: 100%;
}

.header-section .container {
  max-width: 412px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
}

.header-section .title {
  color: #000000;
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 16px 0;
  line-height: 1.3;
}

.header-section .subtitle {
  color: #000000;
  font-size: 12px;
  line-height: 1.6;
  margin: 0;
  padding: 0 8px;
}

.trust-row {
  width: 100%;
  margin-top: 18px;
  background: transparent;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;

}

.trust-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
  padding: 5px 1px;
  color: rgba(0, 0, 0, 0.75);
  font-size: 10px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
}

.trust-item + .trust-item {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
}

.trust-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* Actions Section */
.actions-section {
  padding-bottom: 40px;
  width: 100%;
}

.actions-section .container {
  max-width: 412px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.actions-section .prompt {
  color: #000000;
  font-size: 13px;
  margin: 0 0 24px 0;
  text-align: center;
  font-weight: 500;
}

.actions-section .card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 24px 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.actions-section .card-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  min-width: 0;
  padding-right: 16px;
}

.actions-section .card-text {
  color: #000000;
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
  font-weight: 600;
}

.actions-section .btn-primary {
  background-color: #004138;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
  font-family: inherit;
  text-decoration: none;
  transition: background-color 0.2s ease;
  display: inline-block;
}

.actions-section .btn-primary:hover {
  background-color: #002b25;
}

.actions-section .card-image-wrapper {
  position: relative;
  width: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  margin-left: 12px;
}

.actions-section .card-logo {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.actions-section .badge {
  position: absolute;
  bottom: -20px;
  right: 5;
  background-color: #004d43;
  color: #ffffff;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Footer Section */
.footer-section {
  padding-bottom: 60px;
  width: 100%;
}

.footer-section .container {
  max-width: 412px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
}

.footer-section .footer-text {
  color: #1a1a1a;
  font-size: 10px;
  line-height: 1.6;
  margin: 0;
  mix-blend-mode: plus-darker;
  opacity: 0.8;
}
</style>


