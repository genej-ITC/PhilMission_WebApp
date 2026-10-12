import {defineConfig,devices} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'*.spec.mjs',timeout:90000,workers:1,use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure'},projects:[{name:'android-chrome',use:{...devices['Pixel 7'],browserName:'chromium'}},{name:'iphone-webkit',use:{...devices['iPhone 13'],browserName:'webkit'}}]});
