# أذكار وأدعية - Arabic Adhkar & Duas App

A comprehensive offline-first application for Islamic morning and evening duas (adhkar) with Arabic RTL support. Built as a monorepo with Spring Boot backend, React web PWA, and React Native mobile app.

## 🎯 Features

- **Offline-First**: Works completely offline after initial data sync
- **Arabic RTL Support**: Full right-to-left layout with proper Arabic typography
- **Cross-Platform**: Web PWA + Mobile (iOS/Android) apps
- **Progress Tracking**: Individual counter for each dhikr with persistent storage
- **Authentic Content**: Sourced from "Hisn al-Muslim" (حصن المسلم)
- **Modern Stack**: Spring Boot, React, React Native, TypeScript

## 📁 Project Structure

```
azkar/
├── apps/
│   ├── backend/           # Spring Boot API server
│   ├── web/              # React web app (PWA)
│   └── mobile/           # React Native mobile app (Expo)
├── packages/
│   └── shared/           # Shared TypeScript types & API client
├── docker-compose.yml    # Docker configuration
├── turbo.json           # Turborepo configuration
└── package.json         # Root monorepo config
```

## 🚀 Quick Start

### Prerequisites

- **Java 21+** (for backend)
- **Node.js 18+** (for web/mobile/shared)
- **npm/yarn/pnpm** (package manager)
- **Docker** (optional, for containerized backend)

### 1. Install Dependencies

```bash
# Install all dependencies across monorepo
npm install

# Or install individual workspaces
npm install --workspace=apps/backend
npm install --workspace=apps/web
npm install --workspace=apps/mobile
```

### 2. Build Shared Package

```bash
# Build shared types and API client
npm run build --workspace=packages/shared
```

### 3. Run Backend

#### Option A: Local Development
```bash
# Navigate to backend
cd apps/backend

# Run Spring Boot application
./mvnw spring-boot:run
# OR
npm run dev
```

#### Option B: Docker
```bash
# Run with Docker Compose
docker-compose up --build

# Or run just the backend container
docker build -t azkar-backend ./apps/backend
docker run -p 8080:8080 azkar-backend
```

The backend will:
- Start on `http://localhost:8080`
- Automatically seed database from `hisn_almuslim.json`
- Create SQLite database in `./data/app.db`
- Provide OpenAPI docs at `/swagger-ui.html`

### 4. Run Web App

```bash
cd apps/web
npm run dev
```

- Opens at `http://localhost:5173`
- PWA installable after first load
- Caches API responses for offline use

### 5. Run Mobile App

```bash
cd apps/mobile
npm run dev
# OR
npx expo start
```

- Opens Expo DevTools
- Scan QR code with Expo Go app (iOS/Android)
- Or run in simulator: `npm run ios` / `npm run android`

## 🧪 Testing

### Backend Tests
```bash
cd apps/backend
./mvnw test
```

### Web Tests
```bash
cd apps/web
npm run test
```

### Mobile Tests
```bash
cd apps/mobile
npm run test
```

### Run All Tests
```bash
# From root directory
npm run test:all
```

## 🏗️ Building for Production

### Backend JAR
```bash
cd apps/backend
./mvnw clean package
# Creates: target/backend-1.0.0.jar
```

### Web PWA
```bash
cd apps/web
npm run build
# Creates: dist/ folder ready for deployment
```

### Mobile APK/IPA
```bash
cd apps/mobile
# For Android APK
expo build:android

# For iOS IPA (requires Apple Developer account)
expo build:ios

# Or use EAS Build (recommended)
npx eas build --platform android
npx eas build --platform ios
```

## 📱 App Usage

### الصفحة الرئيسية (Home Page)
- Select between "أذكار الصباح" (Morning Adhkar) or "أذكار المساء" (Evening Adhkar)
- View app features and information

### قائمة الأذكار (Adhkar List)
- Read each dhikr text in Arabic
- Tap "+" button to increment counter
- Progress bars show completion status
- "إعادة" button resets individual counters
- View footnotes and references

### الإعدادات (Settings)
- Adjust Arabic text font size
- Toggle reading mode for better visibility
- Export/import progress data
- Clear all progress data
- App information and attribution

## 🎨 Design Principles

### Arabic Typography
- **Font**: Cairo (web) / System Arabic fonts (mobile)
- **Direction**: RTL (Right-to-Left) throughout
- **Line Height**: Increased for Arabic text clarity
- **Text Alignment**: Right-aligned with justified option

### Color Palette
- **Primary**: Emerald Green (`#059669`) - representing Islamic tradition
- **Background**: Light green gradient (`#f0fdf4`)
- **Text**: Dark gray (`#1f2937`) for readability
- **Accent**: Orange (`#f59e0b`) for morning, Purple (`#7c3aed`) for evening

### Accessibility
- High contrast ratios for Arabic text
- Large tap targets (48px minimum)
- Screen reader support
- Keyboard navigation support

## 🗃️ Data Source

Content is sourced from **"Hisn al-Muslim" (حصن المسلم)** by Sa'id ibn Ali ibn Wahf al-Qahtani, a widely-recognized compilation of authentic Islamic supplications.

### Data Processing
1. **Source**: `hisn_almuslim.json` from [rn0x/hisn_almuslim_json](https://github.com/rn0x/hisn_almuslim_json)
2. **Processing**: Extracts morning/evening sections, parses repeat counts
3. **Storage**: Persisted in SQLite database with proper indexing
4. **Offline**: Cached locally in IndexedDB (web) and AsyncStorage (mobile)

## 🔧 Technical Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.2+ with Java 21
- **Database**: SQLite with JPA/Hibernate
- **API**: RESTful endpoints with OpenAPI documentation
- **Features**: CORS enabled, health checks, data seeding

### Web App (React + PWA)
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with RTL support
- **PWA**: Service Worker with cache-first strategy
- **Offline**: IndexedDB for persistent storage
- **Build**: Optimized bundle with code splitting

### Mobile App (React Native + Expo)
- **Framework**: React Native with Expo SDK
- **State**: Local state with AsyncStorage persistence
- **RTL**: `I18nManager.forceRTL(true)` for proper Arabic layout
- **Build**: EAS Build for production APK/IPA

### Shared Package
- **Types**: Common TypeScript interfaces
- **API Client**: Unified HTTP client with error handling
- **Distribution**: Published to monorepo packages

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Development mode (all apps)
npm run dev:all

# Build all applications
npm run build:all

# Run all tests
npm run test:all

# Lint all code
npm run lint:all

# Format all code
npm run format:all

# Individual workspace commands
npm run dev --workspace=apps/backend
npm run build --workspace=apps/web
npm run test --workspace=apps/mobile
```

## 🚀 Deployment

### Backend Deployment
```bash
# Docker deployment
docker-compose up -d

# Traditional JAR deployment
java -jar apps/backend/target/backend-1.0.0.jar

# Cloud platforms (Heroku, Railway, etc.)
# Use provided Dockerfile
```

### Web Deployment
```bash
# Build PWA
cd apps/web && npm run build

# Deploy to static hosting (Netlify, Vercel, etc.)
# Upload dist/ folder contents
```

### Mobile Deployment
```bash
# Android Play Store
npx eas build --platform android --profile production
npx eas submit --platform android

# iOS App Store
npx eas build --platform ios --profile production
npx eas submit --platform ios
```

## 📄 API Endpoints

### Health Check
```
GET /api/v1/health
Response: { "status": "ok" }
```

### Categories
```
GET /api/v1/categories
Response: [
  {
    "id": 1,
    "nameAr": "أذكار الصباح",
    "slug": "morning",
    "orderIndex": 1
  },
  {
    "id": 2,
    "nameAr": "أذكار المساء",
    "slug": "evening",
    "orderIndex": 2
  }
]
```

### Adhkar by Category
```
GET /api/v1/azkar?category=morning
GET /api/v1/azkar?category=evening
Response: [
  {
    "id": 1,
    "textAr": "أعوذ بالله من الشيطان الرجيم...",
    "footnoteAr": "البخاري والنسائي...",
    "repeatMin": 3,
    "orderIndex": 1
  }
]
```

## 📖 Content Attribution

**Source**: "Hisn al-Muslim" (حصن المسلم)
**Author**: Sa'id ibn Ali ibn Wahf al-Qahtani
**Data Provider**: [rn0x/hisn_almuslim_json](https://github.com/rn0x/hisn_almuslim_json)

All Islamic content is used for educational and spiritual purposes. References and footnotes are preserved from the original compilation.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- **Backend**: Java with Lombok, follow Spring Boot conventions
- **Frontend**: TypeScript with ESLint + Prettier
- **Arabic Text**: Ensure proper RTL support and typography
- **Tests**: Write tests for new features

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Allah (SWT)** for guidance and blessing
- **Sa'id ibn Ali ibn Wahf al-Qahtani** for compiling "Hisn al-Muslim"
- **rn0x** for providing the JSON data source
- **The Muslim community** for preserving and sharing these precious supplications

---

**بارك الله فيكم** - May Allah bless you all.

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Follow Islamic etiquette in all communications
- Include relevant details for technical issues

**وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ**

*"And remember Allah often that you may succeed."* - Quran 62:10# Azkar
