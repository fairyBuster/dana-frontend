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
    title: 'How do I create a HUE account?',
    body: 'To create a HUE account, visit the official HUE platform, complete the registration form, verify your information, and log in using your registered account credentials.',
    open: true,
    category: 'Account',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'Is my HUE account secure?',
    body: 'Yes, HUE uses a secure system and encrypted technologies to help protect user accounts, transactions, and personal information.',
    open: false,
    category: 'Account',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'Can I use multiple HUE accounts?',
    body: 'No, each user is only permitted to maintain one official HUE account. Multiple accounts may result in account restrictions, suspension, or review.',
    open: false,
    category: 'Account',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'What should I do if I forget my account password?',
    body: 'You can use the “Forgot Password” feature on the HUE login page and follow the account recovery instructions provided by the system.',
    open: false,
    category: 'Account',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'How can I check my transaction history?',
    body: 'Members can review deposit records, withdrawal history, operational activity, referral commissions, and account transactions directly through the HUE account dashboard.',
    open: false,
    category: 'Account',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'Does HUE process transactions automatically?',
    body: 'Yes, all deposits, withdrawals, referral rewards, and operational transactions are processed automatically in real-time through the HUE system.',
    open: false,
    category: 'Account',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'What should I do if my transaction has not arrived?',
    body: 'If your transaction has not been received within the expected processing period, please contact official HUE support and provide your transaction details or proof for verification.',
    open: false,
    category: 'Account',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'Can I change my withdrawal wallet or payment account?',
    body: 'Yes, users may update their withdrawal wallet or payment account through the HUE account settings, subject to applicable verification and security requirements.',
    open: false,
    category: 'Account',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'Does HUE provide customer support?',
    body: 'Yes, HUE provides official customer support to assist members with account issues, transaction inquiries, operational activities, and platform-related assistance.',
    open: false,
    category: 'Account',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'What is HUE mining?',
    body: 'HUE mining is a cloud computing and managed resource operation system that allows members to participate in structured digital infrastructure activities through active operational packages on the HUE platform.',
    open: false,
    category: 'Mining',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'How do I start mining on HUE?',
    body: 'To begin using HUE operational services, members must create a HUE account, complete a deposit, activate an operational package, and manage activities directly through the HUE dashboard.',
    open: false,
    category: 'Mining',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'Is the mining system automatic?',
    body: 'Yes, all operational activities, system calculations, and output processing are handled automatically by the official HUE system in real-time.',
    open: false,
    category: 'Mining',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'How often can operational outputs be claimed?',
    body: 'Operational outputs may be claimed once every 24 hours through the HUE platform according to the active operational cycle.',
    open: false,
    category: 'Mining',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'What happens if I do not claim my operational output within 24 hours?',
    body: 'Members are encouraged to claim their operational outputs regularly according to the platform schedule to maintain active participation and avoid missing the available claim period.',
    open: false,
    category: 'Mining',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'Can I monitor my operational activity and outputs?',
    body: 'Yes, all operational activities, daily outputs, claim history, and account records can be monitored directly through the HUE account dashboard.',
    open: false,
    category: 'Mining',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'Does HUE provide referral operational commissions?',
    body: 'Yes, members may receive additional referral-based commissions generated through eligible operational activities within their referral network up to three levels.',
    open: false,
    category: 'Mining',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'Are operational outputs distributed automatically?',
    body: 'Yes, operational outputs are processed automatically according to the active package, operational cycle, and system calculations.',
    open: false,
    category: 'Mining',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'Is HUE mining officially managed by the platform?',
    body: 'Yes, all operational activities, output distributions, and managed infrastructure processes are handled directly through the official HUE platform system.',
    open: false,
    category: 'Mining',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'What payment methods are available for HUE deposits?',
    body: 'HUE supports deposit payments through both IDR and USDT payment channels.',
    open: false,
    category: 'Payments',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'What is the minimum deposit amount for IDR payments?',
    body: 'The minimum deposit amount for IDR payments is Rp51,000.',
    open: false,
    category: 'Payments',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'What is the minimum deposit amount for USDT payments?',
    body: 'The minimum deposit amount for USDT payments is $5 USD.',
    open: false,
    category: 'Payments',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'Are HUE deposit transactions automatic?',
    body: 'Yes, all deposit transactions are processed automatically by the HUE system in real-time.',
    open: false,
    category: 'Payments',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'How long does it take for a deposit to enter my account?',
    body: 'Deposits are credited automatically in real-time after the payment has been successfully completed and confirmed by the system.',
    open: false,
    category: 'Payments',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'What should I do after completing a deposit?',
    body: 'After completing your deposit, please refresh the page and review your HUE account balance through the dashboard.',
    open: false,
    category: 'Payments',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'What happens if my deposit has not arrived?',
    body: 'If your deposit has not been received within the expected processing period, please contact official HUE support and provide your transaction details or proof for verification.',
    open: false,
    category: 'Payments',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'Can deposits below the minimum amount be processed?',
    body: 'No, deposits below the minimum required amount cannot be processed by the HUE system.',
    open: false,
    category: 'Payments',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'Is it safe to deposit through HUE?',
    body: 'Yes, all deposit activities are handled directly through the official HUE platform with automated and secure transaction processing systems.',
    open: false,
    category: 'Payments',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'What is the HUE team system?',
    body: 'The HUE team system is a structured referral network feature that allows members to build teams and receive referral-based commissions generated through eligible network activities.',
    open: false,
    category: 'Team',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'How do I build a team on HUE?',
    body: 'Members can build a team by inviting new users to join HUE using their official referral link or invitation code.',
    open: false,
    category: 'Team',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'How many referral levels are available in the HUE team system?',
    body: 'The HUE referral system provides referral rewards and team commissions up to three referral levels.',
    open: false,
    category: 'Team',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'Can I earn commissions from my team members?',
    body: 'Yes, members may receive commissions from eligible package activations and operational activities generated within their referral network.',
    open: false,
    category: 'Team',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'Is team commission distribution automatic?',
    body: 'Yes, all team commissions and referral rewards are calculated and distributed automatically by the HUE system in real-time.',
    open: false,
    category: 'Team',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'Can I monitor my team activity?',
    body: 'Yes, members can monitor referral members, team structure, commission history, operational records, and network activity directly through the HUE dashboard.',
    open: false,
    category: 'Team',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'Is there a limit to team growth on HUE?',
    body: 'No, HUE allows members to expand their referral network through the official referral system without a fixed team growth limit.',
    open: false,
    category: 'Team',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'What happens if a referral member violates HUE rules?',
    body: 'HUE reserves the right to review, restrict, suspend, or terminate referral rewards associated with accounts involved in fraud, abuse, suspicious activity, or policy violations.',
    open: false,
    category: 'Team',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'Why is building an active team important on HUE?',
    body: 'Building an active team may help members increase referral-based rewards, network activity commissions, and long-term participation opportunities within the HUE ecosystem.',
    open: false,
    category: 'Team',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'What is the HUE VIP program?',
    body: 'The HUE VIP program is a structured membership system designed to provide members with additional platform benefits, enhanced operational features, and access to exclusive participation privileges within the HUE ecosystem.',
    open: false,
    category: 'VIP',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'How can I become a HUE VIP member?',
    body: 'Members may become VIP members by meeting the applicable platform requirements and activating an eligible operational or infrastructure package through HUE.',
    open: false,
    category: 'VIP',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'What benefits do VIP members receive?',
    body: 'VIP members may receive enhanced operational benefits, priority platform support, exclusive rewards, and additional participation features depending on their membership level.',
    open: false,
    category: 'VIP',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'Does VIP membership increase operational output opportunities?',
    body: 'Yes, certain VIP levels may provide enhanced operational efficiency and additional output opportunities based on the active membership tier.',
    open: false,
    category: 'VIP',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'Can VIP members receive higher referral commissions?',
    body: 'Yes, VIP members may qualify for enhanced referral rewards and additional team commission benefits depending on their active VIP level.',
    open: false,
    category: 'VIP',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'Is VIP membership processed automatically?',
    body: 'Yes, VIP activation, membership updates, and related benefits are processed automatically through the official HUE system.',
    open: false,
    category: 'VIP',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'Can I monitor my VIP status on the platform?',
    body: 'Yes, members can monitor their VIP level, membership benefits, operational rewards, and account progress directly through the HUE dashboard.',
    open: false,
    category: 'VIP',
    expandIcon: '/assets/image/4269_485.svg',
    feedback: null
  },
  {
    title: 'Are VIP rewards distributed in real-time?',
    body: 'Yes, VIP-related rewards, operational outputs, and commission distributions are processed automatically in real-time according to HUE system rules.',
    open: false,
    category: 'VIP',
    expandIcon: '/assets/image/4269_504.svg',
    feedback: null
  },
  {
    title: 'Can VIP membership be upgraded?',
    body: 'Yes, members may upgrade their VIP membership level by meeting higher platform requirements and activating eligible operational packages.',
    open: false,
    category: 'VIP',
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
