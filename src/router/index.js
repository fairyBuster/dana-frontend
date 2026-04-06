import { createRouter, createWebHashHistory } from 'vue-router'
import { authAPI } from '../services/api'

// Code Splitting (Dynamic Imports)
const Register = () => import('../views/auth/Register.vue')
const Login = () => import('../views/auth/Login.vue')
const ForgotPassword = () => import('../views/auth/ForgotPassword.vue')
const Terms = () => import('../views/Terms.vue')
const Policy = () => import('../views/Policy.vue')
const Cookie = () => import('../views/Cookie.vue')
const Career = () => import('../views/Career.vue')
const Media = () => import('../views/Media.vue')
const MediaDetails = () => import('../views/media/Details.vue')
const Solution = () => import('../views/Solution.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const Index = () => import('../views/Index.vue')
const AboutUs = () => import('../views/about/about-us.vue')
const Profile = () => import('../views/profile/Profile.vue')
const ProfileStatistic = () => import('../views/profile/Statistic.vue')
const Deposit = () => import('../views/deposits/Deposit.vue')
const DepositRecords = () => import('../views/deposits/Deposit-trx.vue')
const Settings = () => import('../views/settings/Index.vue')
const Language = () => import('../views/settings/Language.vue')
const Currency = () => import('../views/settings/Currency.vue')
const PersonalInfo = () => import('../views/settings/PersonalInfo.vue')
const ChangePassword = () => import('../views/settings/ChangePassword.vue')
const PinWithdraw = () => import('../views/settings/PinWithdraw.vue')
const InfoPerangkat = () => import('../views/settings/Info-perangkat.vue')
const AvatarSettings = () => import('../views/settings/Avatar.vue')
const SettingsAddress = () => import('../views/settings/Address.vue')
const Missions = () => import('../views/missions/Index.vue')
const MissionsSvip = () => import('../views/missions/Svip.vue')
const MissionsInstructions = () => import('../views/missions/Instructions.vue')
const MissionsInstructionsSvip = () => import('../views/missions/InstructionsSvip.vue')
const UserStatus = () => import('../views/missions/UserStatus.vue')
const InstructionsStatus = () => import('../views/missions/InstructionsStatus.vue')
const Transactions = () => import('../views/transactions/Index.vue')
const TransactionChoose = () => import('../views/transactions/Choose.vue')
const Commission = () => import('../views/commission/Index.vue')
const CommissionTrx = () => import('../views/commission/Trx.vue')
const Support = () => import('../views/support/Support.vue')
const SupportIndex = () => import('../views/support/Index.vue')
const Help = () => import('../views/support/Help.vue')
const Bot = () => import('../views/support/Bot.vue')
const Teams = () => import('../views/team/Teams.vue')
const Teams2 = () => import('../views/team/Teams2.vue')
const Teams3 = () => import('../views/team/Teams3.vue')
const TeamIndex = () => import('../views/team/Index.vue')
const NewsIndex = () => import('../views/news/Index.vue')
const NewsDetails = () => import('../views/news/Details.vue')
const ProductIndex = () => import('../views/product/Index.vue')
const ProductTransactions = () => import('../views/product/Transactions.vue')
const ProductDetails = () => import('../views/product/Details.vue')
const InvestmentsActive = () => import('../views/investments/Active.vue')
const InvestmentTransactions = () => import('../views/investments/Transactions.vue')
const InvestmentDetails = () => import('../views/investments/Details.vue')
const BankIndex = () => import('../views/bank/Index.vue')
const BankAdd = () => import('../views/bank/Add.vue')
const BankEdit = () => import('../views/bank/Edit.vue')
const ShareIndex = () => import('../views/share/Index.vue')
const WithdrawCreate = () => import('../views/withdraw/Create.vue')
const WithdrawRecords = () => import('../views/withdraw/Withdraw-trx.vue')
const HowToUse = () => import('../views/document/How-to-use.vue')
const Security = () => import('../views/company/Security.vue')
const Ranking = () => import('../views/global/Ranking.vue')
const AttendanceIndex = () => import('../views/attendance/Index.vue')
const AttendanceTrx = () => import('../views/attendance/Attendance-trx.vue')
const VoucherIndex = () => import('../views/voucher/Index.vue')
const VoucherTrx = () => import('../views/voucher/Voucher-trx.vue')
const PointHistory = () => import('../views/point/Poin-trx.vue')
const PointExchange = () => import('../views/point/Index.vue')
const NotificationIndex = () => import('../views/notification/Index.vue')
const DownloadApp = () => import('../views/DownloadApp.vue')

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    beforeEnter: (to, from, next) => {
      // Check for referral code
      try {
        const params = new URLSearchParams(window.location.search || '')
        const v = params.get('v')
        if (v) {
          next({ path: '/pages/account/register', query: { ref: v } })
          return
        }
      } catch (_) {}
      next()
    }
  },
  {
    path: '/pages/account/download-app',
    name: 'DownloadApp',
    component: DownloadApp
  },
  {
    path: '/pages/account/register/ref',
    name: 'ReferralRegisterRef',
    beforeEnter: (to, from, next) => {
      // Handle /register/ref?={code}
      let code = null
      try {
        // Check for empty key query param (e.g. ?={code})
        const search = window.location.search
        if (search && search.includes('?=')) {
          code = search.split('?=')[1]
        } else if (to.query && Object.keys(to.query).some(k => k === '' || k === null)) {
           // Some routers might parse ?=code as key="" value="code"
           code = to.query[''] || to.query[null]
        }
        
        if (code) {
           // Clean up code if it contains extra params or hash
           code = decodeURIComponent(code.split('&')[0].split('#')[0])
        }
      } catch (_) {}
      
      if (code) return next({ path: '/pages/account/register', query: { ref: code } })
      return next('/pages/account/register')
    }
  },
  {
    path: '/pages/account/register=:code(.*)',
    name: 'RegisterEq',
    beforeEnter: (to, from, next) => {
      const code = decodeURIComponent(String(to.params.code || '').replace(/^\?/, ''))
      if (code) return next({ path: '/pages/account/register', query: { ref: code } })
      return next('/pages/account/register')
    }
  },
  {
    path: '/pages/account/register/invitecode',
    name: 'ReferralRedirect',
    beforeEnter: (to, from, next) => {
      let code = to.query.ref || to.query.code || null
      if (!code) {
        try {
          const qp = to.fullPath.split('?')[1] || ''
          if (qp) {
            if (qp.startsWith('=')) {
              code = decodeURIComponent(qp.slice(1)) || null
            } else {
              const first = qp.split('&')[0]
              const parts = first.split('=')
              code = decodeURIComponent(parts[1] || parts[0] || '') || null
            }
          }
        } catch (_) {}
      }
      if (code) return next({ path: '/pages/account/register', query: { ref: code } })
      return next('/pages/account/register')
    }
  },
  {
    path: '/pages/auth/register',
    name: 'RegisterAuth',
    component: Register
  },
  {
    path: '/pages/auth/register/:refCode(.*)',
    name: 'RegisterAuthWithReferral',
    component: Register
  },
  {
    path: '/pages/account/register/:refCode(.*)',
    name: 'PagesRegisterWithReferral',
    component: Register
  },
  {
    path: '/pages/account/register',
    name: 'Register',
    component: Register,
    beforeEnter: (to, from, next) => {
      // Normalize various referral formats to ?ref=code
      let code =
        to.query.ref ||
        to.query.invitationCode ||
        to.query.inviteCode ||
        to.query.invitecode ||
        to.query.code ||
        null
      if (!code) {
        try {
          const fp = to.fullPath || ''
          const matchEq = fp.match(/\/pages\/account\/register=([^?&#]+)/)
          if (matchEq && matchEq[1]) {
            code = decodeURIComponent(matchEq[1])
          }
          if (!code) {
            const qp = fp.split('?')[1] || ''
            if (qp && !qp.includes('=')) {
              code = decodeURIComponent(qp)
            } else if (qp) {
              const first = qp.split('&')[0]
              const parts = first.split('=')
              code = decodeURIComponent(parts[1] || parts[0] || '')
            }
          }
        } catch (_) {}
      }
      if (code && to.query.ref !== code) {
        return next({ path: to.path, query: { ...to.query, ref: code }, replace: true })
      }
      return next()
    }
  },
  {
    path: '/pages/account/access',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      const type = to.query.type
      const invite =
        to.query.invitationCode ||
        to.query.inviteCode ||
        to.query.invitecode ||
        to.query.ref ||
        to.query.code ||
        null
      if (type === 'register' && invite) {
        return next({ path: '/pages/account/register', query: { ref: invite } })
      }
      return next()
    }
  },
  {
    path: '/pages/account/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/pages/account/terms',
    name: 'Terms',
    component: Terms
  },
  {
    path: '/pages/account/privacy',
    name: 'PrivacyPolicy',
    component: Policy
  },
  {
    path: '/pages/account/cookie',
    name: 'CookiePolicy',
    component: Cookie
  },
  {
    path: '/pages/account/media',
    name: 'Media',
    component: Media
  },
  {
    path: '/pages/account/media/:id',
    name: 'MediaDetails',
    component: MediaDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/career',
    name: 'Career',
    component: Career
  },
  {
    path: '/pages/account/solution',
    name: 'Solution',
    component: Solution
  },
  {
    path: '/pages/account/active',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/about',
    name: 'AboutUs',
    component: AboutUs
  },
  {
    path: '/pages/account/account',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/profile/statistic',
  //   name: 'ProfileStatistic',
  //   component: ProfileStatistic,
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/pages/balance/recharge',
    name: 'Deposit',
    component: Deposit,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/history/recharge',
    name: 'WalletHistory',
    component: DepositRecords,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/settings/language',
  //   name: 'Language',
  //   component: Language,
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/settings/currency',
  //   name: 'Currency',
  //   component: Currency,
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/pages/account/settings/personal-info',
    name: 'PersonalInfo',
    component: PersonalInfo,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/settings/change-password',
    name: 'ChangePassword',
    component: ChangePassword,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/settings/pin-withdraw',
    name: 'PinWithdraw',
    component: PinWithdraw,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/settings/device-info',
    name: 'InfoPerangkat',
    component: InfoPerangkat,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/settings/address',
    name: 'SettingsAddress',
    component: SettingsAddress,
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/settings/avatar',
  //   name: 'AvatarSettings',
  //   component: AvatarSettings,
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/pages/account/missions',
    name: 'Missions',
    component: Missions,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/benefits/premium',
    name: 'MissionsSvip',
    component: MissionsSvip,
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/index/missions/instructions',
  //   name: 'MissionsInstructions',
  //   component: MissionsInstructions,
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/index/missions/svip/instructions',
  //   name: 'MissionsInstructionsSvip',
  //   component: MissionsInstructionsSvip,
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/pages/account/missions/user-status',
    name: 'UserStatus',
    component: UserStatus,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/missions/status/instructions',
    name: 'InstructionsStatus',
    component: InstructionsStatus,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/attendance',
    name: 'Attendance',
    component: AttendanceIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/history/attendance',
    name: 'AttendanceHistory',
    component: AttendanceTrx,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/billing/overview',
    name: 'BillingOverview',
    component: Transactions,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/history/transaction',
    name: 'TransactionsIndex',
    component: Transactions,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/billing/options',
    name: 'BillingOptions',
    component: TransactionChoose,
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/commission',
  //   name: 'Commission',
  //   component: Commission,
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/pages/history/teams',
    name: 'CommissionHistory',
    component: CommissionTrx,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/support/platform',
    name: 'Support',
    component: Support,
    meta: { requiresAuth: false }
  },
  {
    path: '/pages/account/support',
    name: 'SupportIndex',
    component: SupportIndex,
    meta: { requiresAuth: false }
  },
  {
    path: '/pages/account/support/bot',
    name: 'Bot',
    component: Bot,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/support/help',
    name: 'SupportHelp',
    component: Help,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/help',
    name: 'Help',
    component: Help,
    meta: { requiresAuth: false }
  },
  {
    path: '/pages/invite/team/level/1',
    name: 'Teams',
    component: Teams,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/invite/team/level/2',
    name: 'Teams2',
    component: Teams2,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/invite/team/level/3',
    name: 'Teams3',
    component: Teams3,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/invite/team',
    name: 'TeamIndex',
    component: TeamIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/news',
    name: 'NewsIndex',
    component: NewsIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/news/:id',
    name: 'NewsDetails',
    component: NewsDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/products',
    name: 'ProductIndex',
    component: ProductIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/history/order',
    name: 'ProductHistory',
    component: ProductTransactions,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/products/:id',
    name: 'ProductDetails',
    component: ProductDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/panel',
    name: 'ActiveProduct',
    component: InvestmentsActive,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/panel/:id',
    name: 'ActiveProductDetails',
    component: InvestmentDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/panel/history',
    name: 'InvestmentHistory',
    component: InvestmentTransactions,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/history/records',
    name: 'InvestmentTransactions',
    component: InvestmentTransactions,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/assets/bind',
    name: 'BankIndex',
    component: BankIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/assets/bind/add',
    name: 'BankAdd',
    component: BankAdd,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/assets/bind/edit',
    name: 'BankEdit',
    component: BankEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/invite/invite',
    name: 'ShareIndex',
    component: ShareIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/assets/release',
    name: 'WithdrawCreate',
    component: WithdrawCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/history/release',
    name: 'SettlementHistory',
    component: WithdrawRecords,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/rewards',
    name: 'VoucherIndex',
    component: VoucherIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/history/rewards',
    name: 'VoucherHistory',
    component: VoucherTrx,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/history/bonus',
    name: 'PointHistory',
    component: PointHistory,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/bonus',
    name: 'PointExchange',
    component: PointExchange,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/notifications',
    name: 'Notifications',
    component: NotificationIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/company/security',
    name: 'Security',
    component: Security,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/ranking',
    name: 'Ranking',
    component: Ranking,
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/account/rules',
    name: 'Rules',
    component: HowToUse,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Global auth guard
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta && record.meta.requiresAuth)
  const token = localStorage.getItem('auth_token')
  const sessionOk = localStorage.getItem('session_authenticated') === 'true'

  const publicRoutes = [
    '/pages/account/access',
    '/pages/account/register',
    '/pages/account/forgot-password',
    '/pages/account/terms',
    '/pages/account/privacy',
    '/pages/account/cookie',
    '/pages/account/media',
    '/pages/account/career',
    '/pages/account/solution',
    '/pages/account/help'
  ]
  const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))

  if (requiresAuth && !token) {
    if (sessionOk) {
      try {
        await authAPI.getAccountInfo()
        return next()
      } catch (_) {
        localStorage.removeItem('session_authenticated')
        return next('/pages/account/access?session_expired=true')
      }
    }
    if (!isPublicRoute) {
      return next('/pages/account/access')
    }
  }

  next()
})

export default router
