if(!self.define){let e,s={};const c=(c,n)=>(c=new URL(c+".js",n).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(n,a)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let i={};const r=e=>c(e,t),d={module:{uri:t},exports:i,require:r};s[t]=Promise.all(n.map((e=>d[e]||r(e)))).then((e=>(a(...e),i)))}}define(["./workbox-07a7b4f2"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/akmUh3aO3qhv7uOZ1ipXH/_buildManifest.js",revision:"58b32ffa86674195f60c03682d8c0222"},{url:"/_next/static/akmUh3aO3qhv7uOZ1ipXH/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/1029.ec4950a73367a80b.js",revision:"ec4950a73367a80b"},{url:"/_next/static/chunks/1119.d2d26e806c02bd5e.js",revision:"d2d26e806c02bd5e"},{url:"/_next/static/chunks/1269.74d12596295e923b.js",revision:"74d12596295e923b"},{url:"/_next/static/chunks/1311.2130ce7e13f6d773.js",revision:"2130ce7e13f6d773"},{url:"/_next/static/chunks/1373.4bb64bc12bb75dbf.js",revision:"4bb64bc12bb75dbf"},{url:"/_next/static/chunks/1626.e3aca3ed22a525be.js",revision:"e3aca3ed22a525be"},{url:"/_next/static/chunks/1675.0bb1908d993fc99c.js",revision:"0bb1908d993fc99c"},{url:"/_next/static/chunks/169.0306c16c8ebc53b0.js",revision:"0306c16c8ebc53b0"},{url:"/_next/static/chunks/2024.5c677db1fb431a8e.js",revision:"5c677db1fb431a8e"},{url:"/_next/static/chunks/2067.75ec08bf6132bca6.js",revision:"75ec08bf6132bca6"},{url:"/_next/static/chunks/215.e2df1ebcfe557ce1.js",revision:"e2df1ebcfe557ce1"},{url:"/_next/static/chunks/2212.d4a3ffec2d7b49d4.js",revision:"d4a3ffec2d7b49d4"},{url:"/_next/static/chunks/2264.e7a60f862cee31fa.js",revision:"e7a60f862cee31fa"},{url:"/_next/static/chunks/2328.6118322762883c04.js",revision:"6118322762883c04"},{url:"/_next/static/chunks/2532.13f9da1add3ec0c4.js",revision:"13f9da1add3ec0c4"},{url:"/_next/static/chunks/2555.85bfc3758c8580c5.js",revision:"85bfc3758c8580c5"},{url:"/_next/static/chunks/2610.94a59a9178c95202.js",revision:"94a59a9178c95202"},{url:"/_next/static/chunks/2692.0abec4ddc634e503.js",revision:"0abec4ddc634e503"},{url:"/_next/static/chunks/2785.5a293e11cc2a3e49.js",revision:"5a293e11cc2a3e49"},{url:"/_next/static/chunks/2876.1a04a3b4c6aacf36.js",revision:"1a04a3b4c6aacf36"},{url:"/_next/static/chunks/3028.534a66ceaa897ba7.js",revision:"534a66ceaa897ba7"},{url:"/_next/static/chunks/3046.fbb85eb6746cac5f.js",revision:"fbb85eb6746cac5f"},{url:"/_next/static/chunks/3111.b0cba052272b88c6.js",revision:"b0cba052272b88c6"},{url:"/_next/static/chunks/3199.debe30af10e37685.js",revision:"debe30af10e37685"},{url:"/_next/static/chunks/3320.736c721d63abd516.js",revision:"736c721d63abd516"},{url:"/_next/static/chunks/337d5454.22bfc054f210521f.js",revision:"22bfc054f210521f"},{url:"/_next/static/chunks/338.31060b4862994f7e.js",revision:"31060b4862994f7e"},{url:"/_next/static/chunks/3424-3a75a3bb01b5e21e.js",revision:"3a75a3bb01b5e21e"},{url:"/_next/static/chunks/344.a0362c9bc91f6dbd.js",revision:"a0362c9bc91f6dbd"},{url:"/_next/static/chunks/3565.fb5464bf14b9a14e.js",revision:"fb5464bf14b9a14e"},{url:"/_next/static/chunks/3610.0698e8765df068e3.js",revision:"0698e8765df068e3"},{url:"/_next/static/chunks/3734.cc67f0390b4fe4df.js",revision:"cc67f0390b4fe4df"},{url:"/_next/static/chunks/3792.5f4a939233dd8262.js",revision:"5f4a939233dd8262"},{url:"/_next/static/chunks/4033.8280e158da47c441.js",revision:"8280e158da47c441"},{url:"/_next/static/chunks/4247.4043c6e5bac6b5be.js",revision:"4043c6e5bac6b5be"},{url:"/_next/static/chunks/4292.b87924d736203806.js",revision:"b87924d736203806"},{url:"/_next/static/chunks/4363.c206317f9403e9d4.js",revision:"c206317f9403e9d4"},{url:"/_next/static/chunks/44.b70d9b95a8978a3f.js",revision:"b70d9b95a8978a3f"},{url:"/_next/static/chunks/4481.b45dd6b41d701ddf.js",revision:"b45dd6b41d701ddf"},{url:"/_next/static/chunks/4506.bfe29b5281fd9412.js",revision:"bfe29b5281fd9412"},{url:"/_next/static/chunks/4542.ce6f42c9c05ea79e.js",revision:"ce6f42c9c05ea79e"},{url:"/_next/static/chunks/4756.82c7c6d2c855922d.js",revision:"82c7c6d2c855922d"},{url:"/_next/static/chunks/5025.bffc01482880e95f.js",revision:"bffc01482880e95f"},{url:"/_next/static/chunks/5163.485ec9c506a59f55.js",revision:"485ec9c506a59f55"},{url:"/_next/static/chunks/5164.9b510079899540fb.js",revision:"9b510079899540fb"},{url:"/_next/static/chunks/5236.07e838469b8d259e.js",revision:"07e838469b8d259e"},{url:"/_next/static/chunks/5442.60bed5da7400e353.js",revision:"60bed5da7400e353"},{url:"/_next/static/chunks/5664.44367deff59915cf.js",revision:"44367deff59915cf"},{url:"/_next/static/chunks/5811.d20663481ae19090.js",revision:"d20663481ae19090"},{url:"/_next/static/chunks/5844.9adf43b602c58535.js",revision:"9adf43b602c58535"},{url:"/_next/static/chunks/6044.31ed27ca5a7f0dc3.js",revision:"31ed27ca5a7f0dc3"},{url:"/_next/static/chunks/6164.c16a1412c44063ff.js",revision:"c16a1412c44063ff"},{url:"/_next/static/chunks/6457.bd9aa12b6e740dd5.js",revision:"bd9aa12b6e740dd5"},{url:"/_next/static/chunks/6518.595a65ba30029b53.js",revision:"595a65ba30029b53"},{url:"/_next/static/chunks/6799.5c9dac1f7ca8819e.js",revision:"5c9dac1f7ca8819e"},{url:"/_next/static/chunks/6942.c08085427c39966c.js",revision:"c08085427c39966c"},{url:"/_next/static/chunks/7053.be789e4c14d0e478.js",revision:"be789e4c14d0e478"},{url:"/_next/static/chunks/7611.be2a0ef02c69bf14.js",revision:"be2a0ef02c69bf14"},{url:"/_next/static/chunks/7652.8c2df55e68488cf7.js",revision:"8c2df55e68488cf7"},{url:"/_next/static/chunks/7878.f2f705fa9faf9609.js",revision:"f2f705fa9faf9609"},{url:"/_next/static/chunks/7891.dc7891aa6add1107.js",revision:"dc7891aa6add1107"},{url:"/_next/static/chunks/78e521c3-c9b3269e32769921.js",revision:"c9b3269e32769921"},{url:"/_next/static/chunks/8110.04039e0a11541389.js",revision:"04039e0a11541389"},{url:"/_next/static/chunks/8448.5f52906f8d109dbb.js",revision:"5f52906f8d109dbb"},{url:"/_next/static/chunks/8586.1340dbc08135bac9.js",revision:"1340dbc08135bac9"},{url:"/_next/static/chunks/8692.983bc8d08e459c5a.js",revision:"983bc8d08e459c5a"},{url:"/_next/static/chunks/8715.bac264fbd71de05c.js",revision:"bac264fbd71de05c"},{url:"/_next/static/chunks/8777.777a798a3187899d.js",revision:"777a798a3187899d"},{url:"/_next/static/chunks/8839.ebb9d9b57e8ac0ee.js",revision:"ebb9d9b57e8ac0ee"},{url:"/_next/static/chunks/8872.493398bcee70be1d.js",revision:"493398bcee70be1d"},{url:"/_next/static/chunks/8910.f7c2738f4d216528.js",revision:"f7c2738f4d216528"},{url:"/_next/static/chunks/8953.f0f192f34b5f30b3.js",revision:"f0f192f34b5f30b3"},{url:"/_next/static/chunks/9108.f6ab8daa1ad48be9.js",revision:"f6ab8daa1ad48be9"},{url:"/_next/static/chunks/9189.e87eb465f12ffb61.js",revision:"e87eb465f12ffb61"},{url:"/_next/static/chunks/9325.389e85109848d324.js",revision:"389e85109848d324"},{url:"/_next/static/chunks/9343.c49d8a7a47267493.js",revision:"c49d8a7a47267493"},{url:"/_next/static/chunks/9498.7cfca90a298d56d9.js",revision:"7cfca90a298d56d9"},{url:"/_next/static/chunks/9695.bc574f43a6c7f86a.js",revision:"bc574f43a6c7f86a"},{url:"/_next/static/chunks/981.38e383ec79d95f8e.js",revision:"38e383ec79d95f8e"},{url:"/_next/static/chunks/9863.a5bf77c356881e1b.js",revision:"a5bf77c356881e1b"},{url:"/_next/static/chunks/9867.dab9a219d323983e.js",revision:"dab9a219d323983e"},{url:"/_next/static/chunks/9869.43c181c4ef7f0eda.js",revision:"43c181c4ef7f0eda"},{url:"/_next/static/chunks/9921.ca411b7c991c5571.js",revision:"ca411b7c991c5571"},{url:"/_next/static/chunks/a3ff1dbb-4f6b82841019c11f.js",revision:"4f6b82841019c11f"},{url:"/_next/static/chunks/ae51ba48-6204b17c95968403.js",revision:"6204b17c95968403"},{url:"/_next/static/chunks/fb7d5399.6e516f716fb199a1.js",revision:"6e516f716fb199a1"},{url:"/_next/static/chunks/framework-ca706bf673a13738.js",revision:"ca706bf673a13738"},{url:"/_next/static/chunks/main-2a40bf14d4849667.js",revision:"2a40bf14d4849667"},{url:"/_next/static/chunks/pages/_error-e4216aab802f5810.js",revision:"e4216aab802f5810"},{url:"/_next/static/chunks/pages/chat/%5Baddress%5D-2e7f9b6c4945dbde.js",revision:"2e7f9b6c4945dbde"},{url:"/_next/static/chunks/pages/chats-61312d4bd34d6b95.js",revision:"61312d4bd34d6b95"},{url:"/_next/static/chunks/pages/contacts-cbde19dfeab78c4d.js",revision:"cbde19dfeab78c4d"},{url:"/_next/static/chunks/pages/index-34a1c4515d91c08d.js",revision:"34a1c4515d91c08d"},{url:"/_next/static/chunks/pages/profile-89892cd72e381e9f.js",revision:"89892cd72e381e9f"},{url:"/_next/static/chunks/pages/twitterauth-29c7b2d502fdab00.js",revision:"29c7b2d502fdab00"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-82f542a66d31d88e.js",revision:"82f542a66d31d88e"},{url:"/_next/static/css/a1cb37ca9631557c.css",revision:"a1cb37ca9631557c"},{url:"/bottom-navigation-icons/chatdollar.png",revision:"1c6811bd229bca07021ae6ee83fce7ec"},{url:"/bottom-navigation-icons/profile.png",revision:"5c6ff5e61d22d2b0b99c6414777a8ece"},{url:"/bottom-navigation-icons/searchuser.png",revision:"335e67824f14ea9597390b31638e79e8"},{url:"/favicon.ico",revision:"c2bdab8da799dc162c7745978faf12bf"},{url:"/logo.png",revision:"22f91bc09d2e7f5222ba464903f9668b"},{url:"/logo192x192.png",revision:"8d02756c0322d04bc8ec6c87e9a72e3c"},{url:"/logo520x520.png",revision:"d9827d53c35dc518cb5f1ff66e24ec2d"},{url:"/logoicon.png",revision:"6d8ae6d462317f2fa93e9700edb99545"},{url:"/logoside.png",revision:"b29dfad116364538c65729bfa396ddbc"},{url:"/manifest.json",revision:"ed309303727baf61d5d43b92016f78be"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
