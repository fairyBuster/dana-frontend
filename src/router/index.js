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

const PAGES_PREFIX = '/hn'

const toPagesPath = (path) => {
  const p = String(path || '')
  if (!p) return PAGES_PREFIX
  if (p === '/') return PAGES_PREFIX
  if (p.startsWith(PAGES_PREFIX + '/')) return p
  if (p.startsWith('/')) return `${PAGES_PREFIX}${p}`
  return `${PAGES_PREFIX}/${p}`
}

const rawRoutes = [
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
      return { path: '/network', query: { ...to.query, inviteCode: code }, hash: to.hash }
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
      
      if (code) return next({ path: '/network', query: { inviteCode: code } })
      return next('/network')
    }
  },
  {
    path: '/network=:code(.*)',
    name: 'RegisterEq',
    beforeEnter: (to, from, next) => {
      const code = decodeURIComponent(String(to.params.code || '').replace(/^\?/, ''))
      if (code) return next({ path: '/network', query: { inviteCode: code } })
      return next('/network')
    }
  },
  {
    path: '/network/invitecode',
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
      if (code) return next({ path: '/network', query: { inviteCode: code } })
      return next('/network')
    }
  },
  {
    path: '/network/:refCode(.*)',
    name: 'PagesRegisterWithReferral',
    redirect: (to) => {
      const code = decodeURIComponent(String(to.params.refCode || ''))
      return { path: '/network', query: { ...to.query, inviteCode: code }, hash: to.hash }
    }
  },
  {
    path: '/network',
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
          const matchEq = fp.match(/\/network=([^?&#]+)/)
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
    path: '/console',
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
    path: '/legal/terms',
    name: 'Terms',
    component: Terms
  },
  {
    path: '/legal/privacy',
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
    path: '/legal/agreement',
    name: 'Solution',
    component: Solution
  },
  {
    path: '/home',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/company',
    name: 'AboutUs',
    component: AboutUs
  },
  {
    path: '/user',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/user/statistic',
    name: 'ProfileStatistic',
    component: ProfileStatistic,
    meta: { requiresAuth: true }
  },
  {
    path: '/app/charge',
    name: 'Deposit',
    component: Deposit,
    meta: { requiresAuth: true }
  },
  {
    path: '/app/charge/history',
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
    path: '/user/detail',
    name: 'PersonalInfo',
    component: PersonalInfo,
    meta: { requiresAuth: true }
  },
  {
    path: '/user/change',
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
    path: '/hall/taskhall',
    name: 'Missions',
    component: Missions,
    meta: { requiresAuth: true }
  },
  {
    path: '/user/person',
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
    path: '/hall/taskhall/user-status',
    name: 'UserStatus',
    component: UserStatus,
    meta: { requiresAuth: true }
  },
  {
    path: '/hall/taskhall/status/instructions',
    name: 'InstructionsStatus',
    component: InstructionsStatus,
    meta: { requiresAuth: true }
  },
  {
    path: '/hall/sign',
    name: 'Attendance',
    component: AttendanceIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/hall/sign/history',
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
    path: '/user/history',
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
    path: '/user/help',
    name: 'Support',
    component: Support,
    meta: { requiresAuth: false }
  },
  {
    path: '/user/contact',
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
    path: '/help',
    name: 'Help',
    component: Help,
    meta: { requiresAuth: false }
  },
  {
    path: '/network/community/1',
    name: 'Teams',
    component: Teams,
    meta: { requiresAuth: true }
  },
  {
    path: '/network/community/2',
    name: 'Teams2',
    component: Teams2,
    meta: { requiresAuth: true }
  },
  {
    path: '/network/community/3',
    name: 'Teams3',
    component: Teams3,
    meta: { requiresAuth: true }
  },
  {
    path: '/network/community',
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
    path: '/home/news',
    name: 'NewsIndex',
    component: NewsIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/home/news/:id',
    name: 'NewsDetails',
    component: NewsDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/shop',
    name: 'ProductIndex',
    component: ProductIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    redirect: () => `${PAGES_PREFIX}/shop`
  },
  {
    path: '/products/:id',
    redirect: (to) => `${PAGES_PREFIX}/shop/detail/${to.params.id}`
  },
  {
    path: '/orders',
    name: 'ProductHistory',
    component: ProductTransactions,
    meta: { requiresAuth: true }
  },
  {
    path: '/shop/detail/:id',
    name: 'ProductDetails',
    component: ProductDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/hall/outputhall',
    name: 'ActiveProduct',
    component: InvestmentsActive,
    meta: { requiresAuth: true }
  },
  {
    path: '/hall/outputhall/:id',
    name: 'ActiveProductDetails',
    component: InvestmentDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/hall/outputhall/history',
    name: 'InvestmentHistory',
    component: InvestmentTransactions,
    meta: { requiresAuth: true }
  },
  {
    path: '/user/account',
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
    path: '/network/invite',
    name: 'ShareIndex',
    component: ShareIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/app/settlement',
    name: 'WithdrawCreate',
    component: WithdrawCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/app/settlement/history',
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
  { path: '/me', redirect: '/user' },
  { path: '/me/statistic', redirect: '/user/statistic' },
  { path: '/deposit', redirect: '/app/charge' },
  { path: '/deposit/history', redirect: '/app/charge/history' },
  { path: '/missions', redirect: '/hall/taskhall' },
  { path: '/missions/user-status', redirect: '/hall/taskhall/user-status' },
  { path: '/missions/status/instructions', redirect: '/hall/taskhall/status/instructions' },
  { path: '/svip', redirect: '/user/person' },
  { path: '/attendance', redirect: '/hall/sign' },
  { path: '/attendance/history', redirect: '/hall/sign/history' },
  { path: '/billing/overview', redirect: '/informations/overview' },
  { path: '/billing/options', redirect: '/informations/options' },
  { path: '/transactions', redirect: '/user/history' },
  { path: '/bank', redirect: '/user/account' },
  { path: '/bank/add', redirect: '/connect/add' },
  { path: '/bank/edit', redirect: '/connect/edit' },
  { path: '/invite', redirect: '/network/invite' },
  { path: '/withdraw', redirect: '/app/settlement' },
  { path: '/withdraw/history', redirect: '/app/settlement/history' },
  { path: '/index/download-app', redirect: '/download-app' },
  { path: '/index/access', redirect: '/console' },
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
  { path: '/index/terms', redirect: '/legal/terms' },
  { path: '/index/privacy', redirect: '/legal/privacy' },
  { path: '/index/cookie', redirect: '/cookie' },
  { path: '/index/media', redirect: '/media' },
  { path: '/index/media/:id', redirect: (to) => ({ path: `/media/${to.params.id}`, query: to.query, hash: to.hash }) },
  { path: '/index/career', redirect: '/career' },
  { path: '/index/solution', redirect: '/legal/agreement' },
  { path: '/index/active', redirect: '/home' },
  { path: '/index/about', redirect: '/company' },
  { path: '/index/account', redirect: '/user' },
  { path: '/balance/recharge', redirect: '/app/charge' },
  { path: '/history/recharge', redirect: '/app/charge/history' },
  { path: '/index/settings', redirect: '/settings' },
  { path: '/index/settings/personal-info', redirect: '/user/detail' },
  { path: '/index/settings/change-password', redirect: '/user/change' },
  { path: '/index/settings/pin-withdraw', redirect: '/settings/pin-withdraw' },
  { path: '/index/settings/device-info', redirect: '/settings/device-info' },
  { path: '/index/settings/address', redirect: '/settings/address' },
  { path: '/index/missions', redirect: '/hall/taskhall' },
  { path: '/benefits/premium', redirect: '/user/person' },
  { path: '/index/missions/user-status', redirect: '/hall/taskhall/user-status' },
  { path: '/index/missions/status/instructions', redirect: '/hall/taskhall/status/instructions' },
  { path: '/index/attendance', redirect: '/hall/sign' },
  { path: '/history/attendance', redirect: '/hall/sign/history' },
  { path: '/index/billing/overview', redirect: '/informations/overview' },
  { path: '/history/transaction', redirect: '/user/history' },
  { path: '/index/billing/options', redirect: '/informations/options' },
  { path: '/history/teams', redirect: '/commission/history' },
  { path: '/index/support/platform', redirect: '/user/help' },
  { path: '/index/support', redirect: '/user/contact' },
  { path: '/index/support/bot', redirect: '/support/bot' },
  { path: '/index/support/help', redirect: '/user/help' },
  { path: '/index/help', redirect: '/help' },
  { path: '/invite/team/level/1', redirect: '/network/community/1' },
  { path: '/invite/team/level/2', redirect: '/network/community/2' },
  { path: '/invite/team/level/3', redirect: '/network/community/3' },
  { path: '/invite/team', redirect: '/network/community' },
  { path: '/team/level/:level(1|2|3)', redirect: (to) => ({ path: `/network/community/${to.params.level}`, query: to.query, hash: to.hash }) },
  { path: '/index/news', redirect: '/home/news' },
  { path: '/index/news/:id', redirect: (to) => ({ path: `/home/news/${to.params.id}`, query: to.query, hash: to.hash }) },
  { path: '/index/products', redirect: '/shop' },
  { path: '/history/order', redirect: '/orders' },
  { path: '/index/products/:id', redirect: (to) => ({ path: `/shop/detail/${to.params.id}`, query: to.query, hash: to.hash }) },
  { path: '/index/panel', redirect: '/hall/outputhall' },
  { path: '/index/panel/history', redirect: '/hall/outputhall/history' },
  { path: '/index/panel/:id', redirect: (to) => ({ path: `/hall/outputhall/${to.params.id}`, query: to.query, hash: to.hash }) },
  { path: '/history/records', redirect: '/hall/outputhall/history' },
  { path: '/assets/bind', redirect: '/user/account' },
  { path: '/assets/bind/add', redirect: '/connect/add' },
  { path: '/assets/bind/edit', redirect: '/connect/edit' },
  { path: '/invite/invite', redirect: '/network/invite' },
  { path: '/assets/release', redirect: '/app/settlement' },
  { path: '/history/release', redirect: '/app/settlement/history' },
  { path: '/index/rewards', redirect: '/rewards' },
  { path: '/history/rewards', redirect: '/rewards/history' },
  { path: '/history/bonus', redirect: '/bonus/history' },
  { path: '/index/bonus', redirect: '/bonus' },
  { path: '/index/notifications', redirect: '/notifications' },
  { path: '/index/company/security', redirect: '/company/security' },
  { path: '/index/ranking', redirect: '/ranking' },
  { path: '/index/rules', redirect: '/rules' },
  { path: '/auth/register', redirect: '/network' },
  { path: '/auth/register/:refCode(.*)', redirect: (to) => ({ path: `/network/${to.params.refCode || ''}`, query: to.query, hash: to.hash }) },
  { path: '/support', redirect: '/user/contact' },
  { path: '/support/platform', redirect: '/user/help' },
  { path: '/shop/detail', redirect: '/shop' }
]

const prefixedRoutes = rawRoutes.map((r) => ({ ...r, path: toPagesPath(r.path) }))
const legacyRedirectRoutes = rawRoutes.map((r) => {
  const p = String(r?.path || '')
  if (!p) return null
  if (p === '/') return { path: '/', redirect: PAGES_PREFIX }
  return {
    path: p,
    redirect: (to) => ({ path: toPagesPath(to.path), query: to.query, hash: to.hash })
  }
}).filter(Boolean)

const routes = [...legacyRedirectRoutes, ...prefixedRoutes]

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
    '/',
    '/download-app',
    '/console',
    '/network',
    '/forgot-password',
    '/legal/terms',
    '/legal/privacy',
    '/cookie',
    '/media',
    '/career',
    '/legal/agreement',
    '/company',
    '/user/help',
    '/user/contact',
    '/help'
  ]
  const normalizedPath = to.path.startsWith(PAGES_PREFIX) ? (to.path.slice(PAGES_PREFIX.length) || '/') : to.path
  const isPublicRoute = publicRoutes.some(route => normalizedPath.startsWith(route))

  if (requiresAuth && !token) {
    if (sessionOk) {
      try {
        await authAPI.getAccountInfo()
        return next()
      } catch (_) {
        localStorage.removeItem('session_authenticated')
        return next(`${PAGES_PREFIX}/login?session_expired=true`)
      }
    }
    if (!isPublicRoute) {
      return next(`${PAGES_PREFIX}/login`)
    }
  }

  next()
})

export default router
