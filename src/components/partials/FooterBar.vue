<template>
  <section id="section-bottom-nav">
    <nav class="bottom-nav">
      <div class="nav-item" @click="router.push('/dashboard')">
        <img src="/assets/images/9bd968cf4388b3b4f98768e90ff8dd48cf3495e2.png" alt="Beranda">
        <span>Beranda</span>
      </div>

      <div class="nav-item" @click="router.push('/products')">
        <img src="/assets/images/207e560f180b76b0854064260f96e2253a2ed528.png" alt="Aset">
        <span>Aset</span>
      </div>

      <div class="nav-item" @click="router.push('/team')">
        <img src="/assets/images/9bb433d49093e2d7e23e42971f557a6232bb765a.png" alt="Tim saya">
        <span>Tim saya</span>
      </div>

      <div class="nav-item" @click="router.push('/review')">
        <img src="/assets/images/30491638758f2796ab4abfc3db533d56fea87fe8.png" alt="Ulasan">
        <span>Ulasan</span>
      </div>

      <div class="nav-item" @click="router.push('/profile')">
        <img src="/assets/images/c2181bb9dc191a06e4c3fa49d8e6808c026ef06c.png" alt="Akun">
        <span>Akun</span>
      </div>
    </nav>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
#section-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 412px;
  background-color: #ffffff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 1000;
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  padding: 12px 0 16px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  text-decoration: none;
}

.nav-item img {
  width: 20px;
  height: 20px;
}

.nav-item span {
  font-size: 10px;
  color: #004d43;
  font-weight: 700;
}
</style>


