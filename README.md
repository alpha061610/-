# 台中西區午餐決策小幫手

這是一個基於 React + Vite + Tailwind CSS 開發的網頁應用程式，結合 Google Gemini AI 來幫你篩選午餐餐廳並提供美食摘要。

## 功能特色
- **智慧篩選**：根據預算、騎車距離、用餐時間篩選餐廳。
- **AI 評論摘要**：利用 Gemini AI 模擬分析餐廳的網路評論、環境氛圍與建議。
- **Google Maps 整合**：快速查看地圖與菜單。

## 如何在本地運行

1. **複製專案**
   ```bash
   git clone <YOUR_REPO_URL>
   cd <YOUR_REPO_NAME>
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **設定 API Key**
   在根目錄建立 `.env` 檔案，並填入你的 Google Gemini API Key：
   ```env
   VITE_API_KEY=你的_GOOGLE_API_KEY
   ```

4. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

## 如何部署到 GitHub Pages

1. 確保 `vite.config.ts` 中的 `base` 設定正確（通常設為 `./` 或 `/repo-name/`）。
2. 執行建置：
   ```bash
   npm run build
   ```
3. 將 `dist` 資料夾的內容推送到 GitHub 的 `gh-pages` 分支，或使用 GitHub Actions 自動部署。

> 注意：由於這是純前端應用，API Key 若直接寫在程式碼中會暴露。建議使用本地環境變數，或限制 API Key 的使用網域。
