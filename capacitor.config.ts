import type { CapacitorConfig } from '@capacitor/cli';

// The iOS app is a native shell around the live site. The site relies on
// next-intl middleware and Netlify functions, so it can't be bundled as a
// static export — the WebView loads alimubarak1.com instead.
const config: CapacitorConfig = {
  appId: 'com.alimubarak1.app',
  appName: 'Ali Mubarak',
  // Bundled fallback shown only if the remote site can't be reached.
  webDir: 'mobile/www',
  server: {
    url: 'https://alimubarak1.com',
    errorPath: 'index.html'
  },
  ios: {
    contentInset: 'automatic'
  }
};

export default config;
