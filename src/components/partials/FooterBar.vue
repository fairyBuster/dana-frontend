<template>
  <section id="section-bottom-nav">
    <nav class="bottom-nav">
      <div class="nav-item" :class="{ active: isActive('/pages/account/panel') }" @click="router.push('/pages/account/panel')">
        <div class="icon-wrapper">
          <img src="/assets/image/d56aca2083a09ff34d12d9cf341c588683af035f.png" alt="Rumah" :class="{ 'nav-icon-dim': !isActive('/pages/account/panel') }">
        </div>
        <span class="nav-label" :class="{ 'active-label': isActive('/pages/account/panel') }">Rumah</span>
      </div>
      
      <div class="nav-item" :class="{ active: isActive('/pages/account/products') }" @click="router.push('/pages/account/products')">
        <div class="icon-wrapper">
          <img src="/assets/image/524d5e19298878513e5869c47babe8ab56edd3a9.png" alt="Toko" :class="{ 'nav-icon-dim': !isActive('/pages/account/products') }">
        </div>
        <span class="nav-label" :class="{ 'active-label': isActive('/pages/account/products') }">Toko</span>
      </div>
      
      <div class="nav-item" :class="{ active: isActive('/pages/account/active') }" @click="router.push('/pages/account/active')">
        <div class="icon-wrapper">
          <img src="/assets/image/setting_6317567 1.png" alt="Aktivitas" :class="{ 'nav-icon-dim': !isActive('/pages/account/active') }">
        </div>
        <span class="nav-label" :class="{ 'active-label': isActive('/pages/account/active') }">Beranda</span>
      </div>
      
      <div class="nav-item" :class="{ active: isActive('/pages/account/account') }" @click="router.push('/pages/account/account')">
        <div class="icon-wrapper">
          <img src="/assets/image/crown_6318135 1.png" alt="Saya" :class="{ 'nav-icon-dim': !isActive('/pages/account/account') }">
        </div>
        <span class="nav-label" :class="{ 'active-label': isActive('/pages/account/account') }">Saya</span>
      </div>
    </nav>
  </section>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

const isActive = (path) => route.path === path || route.path.startsWith(`${path}/`)
</script>

<style scoped>
.list-footer {
  text-align: center;
  color: #a1a1a1;
  font-size: 12px;
  margin: 30px 0;
}

.brand-footer {
  margin-top: 40px;
  border-top: 1px solid rgba(116, 106, 154, 0.3);
  padding-top: 20px;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.footer-logo {
  height: 20px;
  width: auto;
}

.copyright {
  font-size: 10px;
  color: white;
}

.tagline {
  font-size: 10px;
  color: #c4c4c4;
  margin: 0;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 412px;
  height: 63px;
  background: linear-gradient(180deg, #0f0b2e 0%, #2b1b6f 100%);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
  box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255,255,255,0.05);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
}

.icon-wrapper {
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-wrapper img {
  max-width: 100%;
  max-height: 100%;
  display: block;
}

.nav-icon-dim {
  opacity: 0.5;
}

.nav-label {
  font-size: 10px;
  color: #c4c4c4;
}

.active-label {
  color: #ffffff;
}
</style>
