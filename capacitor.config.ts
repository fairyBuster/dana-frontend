import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.android.abbot',
  appName: 'Abbot',
  webDir: 'dist',
  // Mode offline/local: muat aset build Vite dari folder dist
  server: {
    androidScheme: 'https'
    // Hapus url untuk menggunakan aset lokal (bukan memuat dari domain)
    // allowNavigation dapat ditambahkan jika perlu membuka domain eksternal dalam webview
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
}

export default config