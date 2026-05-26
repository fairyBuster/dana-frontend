<template>
  <section id="section-bottom-nav">
    <div class="bottom-nav-wrapper">
      <nav class="bottom-nav">
        <router-link to="/hn/user" class="nav-item" :class="{ active: isActive('/user') }">
          <img
            :src="isActive('/user') ? '/assets/images/user-yellow.png' : '/assets/images/1d78a069d6a76e2ec636e530125cf4db307129e3.png'"
            alt="Akun"
          >
          <span>Akun</span>
        </router-link>

        <router-link to="/network/invite" class="nav-item" :class="{ active: isActive('/network/community') }">
          <img
            :src="isActive('/network/invite') ? '/assets/images/team-yellow.png' : '/assets/images/5b2eccc7619171bb782ad486b942686a17d4b9ce.png'"
            alt="Tim Saya"
          >
          <span>Tim Saya</span>
        </router-link>

        <router-link to="/hn/shop" class="nav-item center-nav-item" aria-label="Dana Proteksi">
          <div class="center-btn-bg">
            <img src="/assets/images/image 68.png" alt="Dana Proteksi">
          </div>
          <span class="center-label">Dana Proteksi</span>
        </router-link>

        <router-link to="/hn/company" class="nav-item" :class="{ active: isActive('/company') }">
          <img
            :src="isActive('/company') ? '/assets/images/company-yellow.png' : '/assets/images/70e90e171ca2d494dec7257a0f52b7dd0d4457b7.png'"
            alt="Perusahaan"
          >
          <span>Perusahaan</span>
        </router-link>

        <router-link to="/hn/home" class="nav-item" :class="{ active: isActive('/home') }">
          <img
            :src="isActive('/home') ? '/assets/images/home-yellow.png' : '/assets/images/image 67.png'"
            alt="Beranda"
          >
          <span>Beranda</span>
        </router-link>
      </nav>
    </div>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const isActive = (basePath) => {
  const p = String(route.path || '')
  const path = p.startsWith('/hn') ? (p.slice('/hn'.length) || '/') : p
  return path === basePath || path.startsWith(`${basePath}/`)
}
</script>

<style scoped>
.bottom-nav-wrapper {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 412px;
  z-index: 100;
}

.bottom-nav {
  background-color: #fefdfd;
  box-shadow: 0px -2px 10px 0px rgba(0, 0, 0, 0.05);
  height: 75px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 10px;
  position: relative;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  width: 65px;
  margin-top: 10px;
}

.nav-item img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  margin-bottom: 4px;
  opacity: 0.4;
  transition: opacity 0.2s;
}

.nav-item span {
  font-size: 10px;
  color: #7d7d7d;
  font-weight: 600;
  transition: color 0.2s;
}

.nav-item:hover img,
.nav-item.active img {
  opacity: 1;
}

.nav-item:hover span,
.nav-item.active span {
  color: #e2c06a;
}

.center-nav-item {
  position: relative;
  margin-top: 10px;
  justify-content: flex-end;
  height: 100%;
  padding-bottom: 18px;
}

.center-btn-bg {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  width: 61px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fbfaf7;
}

.center-btn-bg img {
  width: 100%;
  height: 100%;
  opacity: 1;
  margin-bottom: 0;
}

.center-label {
  margin-top: auto;
}
</style>



