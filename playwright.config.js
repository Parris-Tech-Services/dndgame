const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 120000,
  expect: {
    timeout: 10000
  },
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:8765",
    headless: true
  },
  webServer: {
    command: "python -m http.server 8765 --bind 127.0.0.1",
    url: "http://127.0.0.1:8765/index.html",
    cwd: __dirname,
    reuseExistingServer: true,
    timeout: 120000
  }
});
