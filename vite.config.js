import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/ for more info about configuration options
export default ({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return defineConfig({
    plugins: [react()],
    server: {
      port: 3001,
      proxy: {
        '/api': {
          target: env.VITE_TARGET,
          secure: false,
          changeOrigin: true,
          cookiePathRewrite: {
            '*': '/',
          },
          cookieDomainRewrite: {
            '*': 'localhost',
          },
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log(
                'Sending Request to Target:',
                proxyReq.getHeader('X-CSRF-TOKEN'),
              );
            });

            proxy.on('proxyRes', (proxyRes) => {
              const cookies = proxyRes.headers['set-cookie'];
              if (!cookies) return;

              const cookieArray = Array.isArray(cookies) ? cookies : [cookies];
              proxyRes.headers['set-cookie'] = cookieArray.map((cookie) =>
                cookie
                  .replace(/; *Secure/gi, '')
                  .replace(/; *SameSite=None/gi, '')
                  .replace(/; *Domain=[^;]+/gi, ''),
              );
            });
          },
        },
      },
    },
  });
};
