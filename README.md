# Seekr Mobile App

Seekr is an AI-driven travel planning app that helps users discover and plan their perfect trips with minimal effort. The app uses AI to generate personalized recommendations, create engaging stories, and provide a seamless travel planning experience.

## Features

- **AI-Driven Recommendations**: Personalized travel suggestions based on user preferences
- **Effortless Planning**: One-tap trip planning with AI-generated itineraries
- **Storytelling**: AI-generated travel stories and social sharing
- **Community Engagement**: Connect with other travelers and share experiences
- **Seekr Wrapped**: Annual travel summary with beautiful visualizations

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI Components**: Custom components with React Native Skia for animations
- **State Management**: React Context + Hooks
- **Navigation**: React Navigation
- **Authentication**: Supabase Auth with Google/Apple SSO

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/seekr.git
   cd seekr
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

5. Run on iOS or Android:
   ```bash
   npm run ios
   # or
   npm run android
   ```

## Project Structure

```
seekr/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── navigation/     # Navigation configuration
│   ├── theme/         # Theme configuration
│   ├── lib/           # Utility functions and services
│   └── hooks/         # Custom React hooks
├── assets/            # Images, fonts, and other static assets
├── App.tsx           # Root component
└── package.json      # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspiration from modern travel apps
- AI integration powered by Supabase Edge Functions
- Beautiful animations with React Native Skia
