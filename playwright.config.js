import {defineConfig} from '@playwright/test';
import {fileURLToPath} from 'node:url';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= fileURLToPath(new URL('./.playwright-browsers', import.meta.url));
export default defineConfig({testDir:'./tests/browser',use:{baseURL:'http://127.0.0.1:4173'},webServer:{command:'npm run dev -- --port 4173',url:'http://127.0.0.1:4173',reuseExistingServer:false},projects:[{name:'desktop',use:{browserName:'chromium',viewport:{width:1280,height:900}}},{name:'mobile',use:{browserName:'chromium',viewport:{width:390,height:844},isMobile:true,hasTouch:true}}]});
