import { createRouter, createWebHistory } from 'vue-router'
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
const ReviewIndex = () => import('../views/review/Index.vue')
const ReviewAdd = () => import('../views/review/Add.vue')
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
  },
  {
    path: '/download-app',
    name: 'DownloadApp',
    component: DownloadApp
  },
  {
    path: '/signup/invite/:code(.*)',
    name: 'SignupInvite',
    redirect: (to) => {
      const code = decodeURIComponent(String(to.params.code || ''))
      return { path: '/register', query: { ...to.query, inviteCode: code }, hash: to.hash }
    }
  },
  {
    path: '/register/ref',
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
      
      if (code) return next({ path: '/register', query: { inviteCode: code } })
      return next('/register')
    }
  },
  {
    path: '/register=:code(.*)',
    name: 'RegisterEq',
    beforeEnter: (to, from, next) => {
      const code = decodeURIComponent(String(to.params.code || '').replace(/^\?/, ''))
      if (code) return next({ path: '/register', query: { inviteCode: code } })
      return next('/register')
    }
  },
  {
    path: '/register/invitecode',
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
      if (code) return next({ path: '/register', query: { inviteCode: code } })
      return next('/register')
    }
  },
  {
    path: '/register/:refCode(.*)',
    name: 'PagesRegisterWithReferral',
    redirect: (to) => {
      const code = decodeURIComponent(String(to.params.refCode || ''))
      return { path: '/register', query: { ...to.query, inviteCode: code }, hash: to.hash }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    beforeEnter: (to, from, next) => {
      // Normalize various referral formats to ?inviteCode=code
      let code =
        to.query.inviteCode ||
        to.query.invitationCode ||
        to.query.invitecode ||
        to.query.ref ||
        to.query.code ||
        null
      if (!code) {
        try {
          const fp = to.fullPath || ''
          const matchEq = fp.match(/\/register=([^?&#]+)/)
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
      code = String(code || '').trim() || null
      if (code && String(to.query.inviteCode || '').trim() !== code) {
        const q = { ...(to.query || {}) }
        delete q.ref
        delete q.code
        delete q.invitationCode
        delete q.invitecode
        q.inviteCode = code
        return next({ path: to.path, query: q, hash: to.hash, replace: true })
      }
      return next()
    }
  },
  {
    path: '/login',
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
        return next({ path: '/register', query: { inviteCode: invite } })
      }
      return next()
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms
  },
  {
    path: '/privacy',
    name: 'PrivacyPolicy',
    component: Policy
  },
  {
    path: '/cookie',
    name: 'CookiePolicy',
    component: Cookie
  },
  {
    path: '/media',
    name: 'Media',
    component: Media
  },
  {
    path: '/media/:id',
    name: 'MediaDetails',
    component: MediaDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/career',
    name: 'Career',
    component: Career
  },
  {
    path: '/solution',
    name: 'Solution',
    component: Solution
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'AboutUs',
    component: AboutUs
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/statistic',
    name: 'ProfileStatistic',
    component: ProfileStatistic,
    meta: { requiresAuth: true }
  },
  {
    path: '/dep',
    name: 'Deposit',
    component: Deposit,
    meta: { requiresAuth: true }
  },
  {
    path: '/dep/history',
    name: 'WalletHistory',
    component: DepositRecords,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
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
    path: '/settings/personal-info',
    name: 'PersonalInfo',
    component: PersonalInfo,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/change-password',
    name: 'ChangePassword',
    component: ChangePassword,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/pin-withdraw',
    name: 'PinWithdraw',
    component: PinWithdraw,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/device-info',
    name: 'InfoPerangkat',
    component: InfoPerangkat,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/address',
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
    path: '/task',
    name: 'Missions',
    component: Missions,
    meta: { requiresAuth: true }
  },
  {
    path: '/vp',
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
    path: '/task/user-status',
    name: 'UserStatus',
    component: UserStatus,
    meta: { requiresAuth: true }
  },
  {
    path: '/task/status/instructions',
    name: 'InstructionsStatus',
    component: InstructionsStatus,
    meta: { requiresAuth: true }
  },
  {
    path: '/sign',
    name: 'Attendance',
    component: AttendanceIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/sign/history',
    name: 'AttendanceHistory',
    component: AttendanceTrx,
    meta: { requiresAuth: true }
  },
  {
    path: '/informations/overview',
    name: 'BillingOverview',
    component: Transactions,
    meta: { requiresAuth: true }
  },
  {
    path: '/trx',
    name: 'TransactionsIndex',
    component: Transactions,
    meta: { requiresAuth: true }
  },
  {
    path: '/informations/options',
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
    path: '/commission/history',
    name: 'CommissionHistory',
    component: CommissionTrx,
    meta: { requiresAuth: true }
  },
  {
    path: '/support/platform',
    name: 'Support',
    component: Support,
    meta: { requiresAuth: false }
  },
  {
    path: '/support',
    name: 'SupportIndex',
    component: SupportIndex,
    meta: { requiresAuth: false }
  },
  {
    path: '/support/bot',
    name: 'Bot',
    component: Bot,
    meta: { requiresAuth: true }
  },
  {
    path: '/support/help',
    name: 'SupportHelp',
    component: Help,
    meta: { requiresAuth: true }
  },
  {
    path: '/help',
    name: 'Help',
    component: Help,
    meta: { requiresAuth: false }
  },
  {
    path: '/team/1',
    name: 'Teams',
    component: Teams,
    meta: { requiresAuth: true }
  },
  {
    path: '/team/2',
    name: 'Teams2',
    component: Teams2,
    meta: { requiresAuth: true }
  },
  {
    path: '/team/3',
    name: 'Teams3',
    component: Teams3,
    meta: { requiresAuth: true }
  },
  {
    path: '/team',
    name: 'TeamIndex',
    component: TeamIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/review',
    name: 'ReviewIndex',
    component: ReviewIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/review/add',
    name: 'ReviewAdd',
    component: ReviewAdd,
    meta: { requiresAuth: true }
  },
  {
    path: '/news',
    name: 'NewsIndex',
    component: NewsIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/news/:id',
    name: 'NewsDetails',
    component: NewsDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'ProductIndex',
    component: ProductIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'ProductHistory',
    component: ProductTransactions,
    meta: { requiresAuth: true }
  },
  {
    path: '/products/:id',
    name: 'ProductDetails',
    component: ProductDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/portfolio',
    name: 'ActiveProduct',
    component: InvestmentsActive,
    meta: { requiresAuth: true }
  },
  {
    path: '/portfolio/:id',
    name: 'ActiveProductDetails',
    component: InvestmentDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/portfolio/history',
    name: 'InvestmentHistory',
    component: InvestmentTransactions,
    meta: { requiresAuth: true }
  },
  {
    path: '/connect',
    name: 'BankIndex',
    component: BankIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/connect/add',
    name: 'BankAdd',
    component: BankAdd,
    meta: { requiresAuth: true }
  },
  {
    path: '/connect/edit',
    name: 'BankEdit',
    component: BankEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/share',
    name: 'ShareIndex',
    component: ShareIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/flow',
    name: 'WithdrawCreate',
    component: WithdrawCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/flow/history',
    name: 'SettlementHistory',
    component: WithdrawRecords,
    meta: { requiresAuth: true }
  },
  {
    path: '/rewards',
    name: 'VoucherIndex',
    component: VoucherIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/rewards/history',
    name: 'VoucherHistory',
    component: VoucherTrx,
    meta: { requiresAuth: true }
  },
  {
    path: '/bonus/history',
    name: 'PointHistory',
    component: PointHistory,
    meta: { requiresAuth: true }
  },
  {
    path: '/bonus',
    name: 'PointExchange',
    component: PointExchange,
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: NotificationIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/company/security',
    name: 'Security',
    component: Security,
    meta: { requiresAuth: true }
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: Ranking,
    meta: { requiresAuth: true }
  },
  {
    path: '/rules',
    name: 'Rules',
    component: HowToUse,
    meta: { requiresAuth: true }
  },
  { path: '/me', redirect: '/profile' },
  { path: '/me/statistic', redirect: '/profile/statistic' },
  { path: '/deposit', redirect: '/dep' },
  { path: '/deposit/history', redirect: '/dep/history' },
  { path: '/missions', redirect: '/task' },
  { path: '/missions/user-status', redirect: '/task/user-status' },
  { path: '/missions/status/instructions', redirect: '/task/status/instructions' },
  { path: '/svip', redirect: '/vp' },
  { path: '/attendance', redirect: '/sign' },
  { path: '/attendance/history', redirect: '/sign/history' },
  { path: '/billing/overview', redirect: '/informations/overview' },
  { path: '/billing/options', redirect: '/informations/options' },
  { path: '/transactions', redirect: '/trx' },
  { path: '/bank', redirect: '/connect' },
  { path: '/bank/add', redirect: '/connect/add' },
  { path: '/bank/edit', redirect: '/connect/edit' },
  { path: '/invite', redirect: '/share' },
  { path: '/withdraw', redirect: '/flow' },
  { path: '/withdraw/history', redirect: '/flow/history' },
  { path: '/index/download-app', redirect: '/download-app' },
  { path: '/index/access', redirect: '/login' },
  {
    path: '/index/register/ref',
    redirect: (to) => ({ path: '/register/ref', query: to.query, hash: to.hash })
  },
  {
    path: '/index/register=:code(.*)',
    redirect: (to) => ({ path: `/register=${encodeURIComponent(String(to.params.code || ''))}`, query: to.query, hash: to.hash })
  },
  {
    path: '/index/register/invitecode',
    redirect: (to) => ({ path: '/register/invitecode', query: to.query, hash: to.hash })
  },
  {
    path: '/index/register/:refCode(.*)',
    redirect: (to) => ({ path: `/register/${to.params.refCode || ''}`, query: to.query, hash: to.hash })
  },
  { path: '/index/register', redirect: '/register' },
  { path: '/index/forgot-password', redirect: '/forgot-password' },
  { path: '/index/terms', redirect: '/terms' },
  { path: '/index/privacy', redirect: '/privacy' },
  { path: '/index/cookie', redirect: '/cookie' },
  { path: '/index/media', redirect: '/media' },
  { path: '/index/media/:id', redirect: (to) => ({ path: `/media/${to.params.id}`, query: to.query, hash: to.hash }) },
  { path: '/index/career', redirect: '/career' },
  { path: '/index/solution', redirect: '/solution' },
  { path: '/index/active', redirect: '/dashboard' },
  { path: '/index/about', redirect: '/about' },
  { path: '/index/account', redirect: '/profile' },
  { path: '/balance/recharge', redirect: '/dep' },
  { path: '/history/recharge', redirect: '/dep/history' },
  { path: '/index/settings', redirect: '/settings' },
  { path: '/index/settings/personal-info', redirect: '/settings/personal-info' },
  { path: '/index/settings/change-password', redirect: '/settings/change-password' },
  { path: '/index/settings/pin-withdraw', redirect: '/settings/pin-withdraw' },
  { path: '/index/settings/device-info', redirect: '/settings/device-info' },
  { path: '/index/settings/address', redirect: '/settings/address' },
  { path: '/index/missions', redirect: '/task' },
  { path: '/benefits/premium', redirect: '/vp' },
  { path: '/index/missions/user-status', redirect: '/task/user-status' },
  { path: '/index/missions/status/instructions', redirect: '/task/status/instructions' },
  { path: '/index/attendance', redirect: '/sign' },
  { path: '/history/attendance', redirect: '/sign/history' },
  { path: '/index/billing/overview', redirect: '/informations/overview' },
  { path: '/history/transaction', redirect: '/trx' },
  { path: '/index/billing/options', redirect: '/informations/options' },
  { path: '/history/teams', redirect: '/commission/history' },
  { path: '/index/support/platform', redirect: '/support/platform' },
  { path: '/index/support', redirect: '/support' },
  { path: '/index/support/bot', redirect: '/support/bot' },
  { path: '/index/support/help', redirect: '/support/help' },
  { path: '/index/help', redirect: '/help' },
  { path: '/invite/team/level/1', redirect: '/team/1' },
  { path: '/invite/team/level/2', redirect: '/team/2' },
  { path: '/invite/team/level/3', redirect: '/team/3' },
  { path: '/invite/team', redirect: '/team' },
  { path: '/team/level/:level(1|2|3)', redirect: (to) => ({ path: `/team/${to.params.level}`, query: to.query, hash: to.hash }) },
  { path: '/index/news', redirect: '/news' },
  { path: '/index/news/:id', redirect: (to) => ({ path: `/news/${to.params.id}`, query: to.query, hash: to.hash }) },
  { path: '/index/products', redirect: '/products' },
  { path: '/history/order', redirect: '/orders' },
  { path: '/index/products/:id', redirect: (to) => ({ path: `/products/${to.params.id}`, query: to.query, hash: to.hash }) },
  { path: '/index/panel', redirect: '/portfolio' },
  { path: '/index/panel/history', redirect: '/portfolio/history' },
  { path: '/index/panel/:id', redirect: (to) => ({ path: `/portfolio/${to.params.id}`, query: to.query, hash: to.hash }) },
  { path: '/history/records', redirect: '/portfolio/history' },
  { path: '/assets/bind', redirect: '/connect' },
  { path: '/assets/bind/add', redirect: '/connect/add' },
  { path: '/assets/bind/edit', redirect: '/connect/edit' },
  { path: '/invite/invite', redirect: '/share' },
  { path: '/assets/release', redirect: '/flow' },
  { path: '/history/release', redirect: '/flow/history' },
  { path: '/index/rewards', redirect: '/rewards' },
  { path: '/history/rewards', redirect: '/rewards/history' },
  { path: '/history/bonus', redirect: '/bonus/history' },
  { path: '/index/bonus', redirect: '/bonus' },
  { path: '/index/notifications', redirect: '/notifications' },
  { path: '/index/company/security', redirect: '/company/security' },
  { path: '/index/ranking', redirect: '/ranking' },
  { path: '/index/rules', redirect: '/rules' },
  { path: '/auth/register', redirect: '/register' },
  { path: '/auth/register/:refCode(.*)', redirect: (to) => ({ path: `/register/${to.params.refCode || ''}`, query: to.query, hash: to.hash }) }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global auth guard
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta && record.meta.requiresAuth)
  const token = localStorage.getItem('auth_token')
  const sessionOk = localStorage.getItem('session_authenticated') === 'true'

  const publicRoutes = [
    '/',
    '/download-app',
    '/login',
    '/register',
    '/forgot-password',
    '/terms',
    '/privacy',
    '/cookie',
    '/media',
    '/career',
    '/solution',
    '/about',
    '/help',
    '/support'
  ]
  const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))

  if (requiresAuth && !token) {
    if (sessionOk) {
      try {
        await authAPI.getAccountInfo()
        return next()
      } catch (_) {
        localStorage.removeItem('session_authenticated')
        return next('/login?session_expired=true')
      }
    }
    if (!isPublicRoute) {
      return next('/login')
    }
  }

  next()
})

export default router
