<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <button class="back-btn" @click="goBack" aria-label="Go back">
          <img src="/assets/image/4269_456.svg" alt="">
        </button>
        <h1 class="page-title">Help Center</h1>
      </header>
    </section>

    <!-- Hero -->
    <section id="section-hero">
      <div class="hero-container">
        <img src="/assets/image/5e14ff5b2eb99011022fe6ee82ef5ee0ead09875.png" alt="How can we help you?" class="hero-image">
      </div>
    </section>

    <!-- Tabs -->
    <section id="section-tabs">
      <nav class="tabs-nav" aria-label="Help categories">
        <button
          v-for="(tab, i) in tabs"
          :key="i"
          class="tab"
          :class="{ active: activeTab === i }"
          @click="activeTab = i"
        >
          {{ tab }}
        </button>
      </nav>
    </section>

    <!-- FAQ -->
    <section id="section-faq">
      <div class="faq-list">
        <article
          v-for="(item, index) in filteredFaqItems"
          :key="index"
          class="faq-item"
          :class="{ expanded: item.open }"
        >
          <header class="faq-header" @click="toggleItem(index)">
            <h3 class="faq-title">{{ item.title }}</h3>
            <button class="toggle-btn" :aria-label="item.open ? 'Collapse answer' : 'Expand answer'">
              <img v-if="item.open" src="/assets/image/4269_489.svg" alt="">
              <img v-else :src="item.expandIcon || '/assets/image/4269_485.svg'" alt="">
            </button>
          </header>
          <div v-if="item.open" class="faq-body">
            <p class="faq-content">{{ item.body }}</p>
            <hr class="faq-divider">
            <div class="faq-feedback">
              <span v-if="item.feedback" class="feedback-text thanks">Thank you for your feedback!</span>
              <template v-else>
                <span class="feedback-text">Was this helpful?</span>
                <div class="feedback-actions">
                  <button class="icon-btn" aria-label="Yes, this was helpful" @click.stop="giveFeedback(index, 'helpful')">
                    <img src="/assets/image/4269_497.svg" alt="">
                  </button>
                  <button class="icon-btn" aria-label="No, this was not helpful" @click.stop="giveFeedback(index, 'not_helpful')">
                    <img src="/assets/image/4269_499.svg" alt="">
                  </button>
                </div>
              </template>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref(0)

const tabs = ['Account', 'Mining', 'Payments', 'Team', 'VIP']

const faqItems = ref([
  {
    title: 'What is AVR Mining?',
    body: 'AVR Mining is a digital platform for asset management and investment activities, designed to be easy to use, safe, and efficient in one application.',
    open: true,
    category: 'Account',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'How do I register on AVR Mining?',
    body: 'You can register by filling in your username, active phone number, email, and invitation code. Make sure the data used is valid for the verification process.',
    open: false,
    category: 'Account',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'Can I have more than one account?',
    body: 'No. Each user is only allowed to have one account to maintain security and fairness in the system.',
    open: false,
    category: 'Account',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'How do I make a deposit?',
    body: 'Go to the Deposit menu, select the payment method, then follow the available instructions until the transaction is successful.',
    open: false,
    category: 'Payments',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'What is the minimum withdrawal amount?',
    body: 'The minimum withdrawal is subject to the current terms and conditions. Please check the withdrawal page for the latest information.',
    open: false,
    category: 'Payments',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'How long does the withdrawal process take?',
    body: 'Withdrawals made today will be processed and credited to the user\'s account by the next business day at the latest.',
    open: false,
    category: 'Payments',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'Is the profit fixed every day?',
    body: 'Profits may vary each day according to system conditions and the running period.',
    open: false,
    category: 'Mining',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'Can I withdraw funds before the contract period ends?',
    body: 'Withdrawals can be made in accordance with the applicable terms in the system. Some products have specific periods.',
    open: false,
    category: 'Mining',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'Is it safe to use AVR Mining?',
    body: 'AVR Mining uses a multi-layered security system with data encryption and active SSL to maintain the security of user information.',
    open: false,
    category: 'Account',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'What if I forget my password?',
    body: 'Use the Forgot Password feature on the login page and follow the account recovery steps.',
    open: false,
    category: 'Account',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'Can I invite friends?',
    body: 'Yes, users can invite new members using the invitation code available in their respective accounts.',
    open: false,
    category: 'Team',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'What if there is a problem with my account?',
    body: 'Please contact customer service through the General Services menu or the official contacts available on the platform.',
    open: false,
    category: 'Account',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'Does AVR Mining have additional fees?',
    body: 'Some services such as fund withdrawals have administrative fees according to the applicable terms.',
    open: false,
    category: 'Payments',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'How do I view transaction history?',
    body: 'You can view all activities through the Transaction History menu in the application.',
    open: false,
    category: 'Payments',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'Need further help?',
    body: 'If you need further assistance, please contact the AVR Mining support team through the official contacts available.',
    open: false,
    category: 'Account',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  }
])

const filteredFaqItems = computed(() => {
  const category = tabs[activeTab.value]
  return faqItems.value.filter((item) => item.category === category)
})

const goBack = () => {
  router.go(-1)
}

const toggleItem = (index) => {
  const filtered = filteredFaqItems.value
  const originalItem = filtered[index]
  const originalIndex = faqItems.value.indexOf(originalItem)
  faqItems.value[originalIndex].open = !faqItems.value[originalIndex].open
}

const giveFeedback = (index, type) => {
  const filtered = filteredFaqItems.value
  const originalItem = filtered[index]
  const originalIndex = faqItems.value.indexOf(originalItem)
  if (originalIndex !== -1) {
    faqItems.value[originalIndex].feedback = type
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-container {
  font-family: 'Inter', sans-serif;
  background-color: #f8f8f8;
  margin: 0 auto;
  max-width: 412px;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

button {
  font-family: inherit;
}

/* Header */
#section-header .header {
  display: flex;
  align-items: center;
  padding: 14px 19px;
  position: relative;
  height: 50px;
}

#section-header .back-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  z-index: 10;
}

#section-header .back-btn img {
  width: 20px;
  height: 20px;
}

#section-header .page-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  margin: 0;
  pointer-events: none;
}

/* Hero */
#section-hero .hero-container {
  padding: 25px 10px 0;
  display: flex;
  justify-content: center;
}

#section-hero .hero-image {
  width: 100%;
  max-width: 391px;
  height: auto;
  aspect-ratio: 391 / 187;
  border-radius: 10px;
  object-fit: cover;
  display: block;
}

/* Tabs */
#section-tabs .tabs-nav {
  display: flex;
  align-items: center;
  padding: 20px 15px;
  gap: 24px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

#section-tabs .tabs-nav::-webkit-scrollbar {
  display: none;
}

#section-tabs .tab {
  background: none;
  border: none;
  font-size: 14px;
  color: #737373;
  cursor: pointer;
  white-space: nowrap;
  padding: 6px 0;
}

#section-tabs .tab.active {
  background: linear-gradient(180deg, #4085e1 0%, #2757b7 100%);
  color: #ffffff;
  padding: 6px 18px;
  border-radius: 10px;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.25);
  font-weight: 600;
}

/* FAQ */
#section-faq {
  padding: 0 13px 40px;
}

#section-faq .faq-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

#section-faq .faq-item {
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 18px 19px;
}

#section-faq .faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

#section-faq .faq-title {
  font-size: 14px;
  font-weight: 600;
  color: #151515;
  margin: 0;
}

#section-faq .faq-item.expanded .faq-title {
  color: #2757b7;
}

#section-faq .toggle-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

#section-faq .toggle-btn img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

#section-faq .faq-item.expanded .toggle-btn img {
  width: 20px;
  height: 20px;
}

#section-faq .faq-body {
  margin-top: 16px;
}

#section-faq .faq-content {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  margin: 0;
  line-height: 1.4;
}

#section-faq .faq-divider {
  border: none;
  border-top: 1px dashed rgba(0, 0, 0, 0.2);
  margin: 16px 0;
}

#section-faq .faq-feedback {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#section-faq .feedback-text {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
}

#section-faq .feedback-text.thanks {
  color: #2757b7;
  font-weight: 600;
  width: 100%;
  text-align: center;
}

#section-faq .feedback-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

#section-faq .icon-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

#section-faq .icon-btn img {
  width: 16px;
  height: 16px;
}
</style>
