<template>
  <section id="section-bottom-nav">
    <nav class="bottom-nav-container">
      <router-link to="/dashboard" class="nav-item" :class="{ active: isActive('/dashboard') }">
        <img
          src="/assets/image/ffe25a591934a7a193bade6d431223b8869d2cde.png"
          alt="Home"
          class="nav-icon"
          :class="{ 'opacity-low': !isActive('/dashboard') }"
        >
        <span class="nav-text">Home</span>
      </router-link>

      <router-link to="/about" class="nav-item" :class="{ active: isActive('/about') }">
        <img
          src="/assets/image/3cb24173dc41742eccf595898ca2eed035661785.png"
          alt="About Us"
          class="nav-icon"
          :class="{ 'opacity-low': !isActive('/about') }"
        >
        <span class="nav-text">About Us</span>
      </router-link>

      <router-link to="/profile" class="nav-item" :class="{ active: isActive('/profile') }">
        <img
          src="/assets/image/48b8a39f7811095779bfc9811422446819d34f1b.png"
          alt="Mine"
          class="nav-icon"
          :class="{ 'opacity-low': !isActive('/profile') }"
        >
        <span class="nav-text">Mine</span>
      </router-link>

      <router-link to="/products" class="nav-item" :class="{ active: isActive('/products') }">
        <img
          src="/assets/image/fd891e27e827c0f21ddb395edbc24cfd61c092dc.png"
          alt="Shop"
          class="nav-icon"
          :class="{ 'opacity-low': !isActive('/products') }"
        >
        <span class="nav-text">Shop</span>
      </router-link>
    </nav>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const isActive = (basePath) => {
  const p = String(route.path || '')
  return p === basePath || p.startsWith(`${basePath}/`)
}
</script>

<style scoped>
#section-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 412px;
  z-index: 100;
}

.bottom-nav-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 48px;
  background-color: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #000000;
  width: 25%;
  gap: 4px;
}

.nav-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.nav-icon.opacity-low {
  opacity: 0.2;
}

.nav-text {
  font-size: 10px;
  line-height: 1;
}

.nav-item.active .nav-text {
  font-weight: 700;
}
</style>



