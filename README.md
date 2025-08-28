# 🐍 Snake Game - Farcaster Mini App

A classic retro snake game built as a Farcaster mini app with blockchain integration and creator economy features.

## ✨ Features

### 🎮 Classic Snake Game
- **Retro Gameplay**: Classic snake game with modern controls
- **Responsive Design**: Works on all devices and screen sizes
- **Score Tracking**: Local high score storage and global leaderboards
- **Game Controls**: Arrow keys, WASD, and spacebar support

### 🔗 Farcaster Integration
- **Automatic Wallet Connection**: Seamlessly connects with Farcaster wallets
- **Social Gaming**: Share scores and compete with the Farcaster community
- **Leaderboards**: Real-time score tracking and rankings
- **User Profiles**: Display Farcaster usernames and profile pictures

### 🪙 Creator Economy
- **Zora Integration**: Connect Zora accounts for creator coin functionality
- **Creator Coins**: Create and manage your own creator tokens
- **Marketplace**: Buy, sell, and trade creator coins
- **Creator Profiles**: Build your brand and community

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Farcaster account
- Neynar API key (optional, for enhanced features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd snake_game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your configuration:
   ```env
   NEXT_PUBLIC_URL=http://localhost:3000
   NEYNAR_API_KEY=your_neynar_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

** note the below is the example .env file
```bash
# Default values for local development
# For production, update these URLs to your deployed domain
KV_REST_API_TOKEN=''
KV_REST_API_URL=''
NEXT_PUBLIC_URL='http://localhost:3000'
NEXTAUTH_URL='http://localhost:3000'

NEYNAR_API_KEY="your api"
NEYNAR_CLIENT_ID="your client id"
SEED_PHRASE=""
NEXTAUTH_SECRET="keyxx"
USE_TUNNEL="true"
```

## 🎯 How to Play

### Game Controls
- **Movement**: Use arrow keys or WASD to control the snake
- **Pause**: Press SPACE to pause/resume the game
- **Objective**: Eat red food to grow and increase your score
- **Avoid**: Don't hit walls or your own tail

### Scoring System
- **Food**: +10 points per food eaten
- **High Scores**: Local storage saves your best scores
- **Leaderboards**: Compete globally with other players
- **Farcaster Integration**: Share achievements with the community

## 🏗️ Architecture

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Responsive Design**: Mobile-first approach

### Backend
- **API Routes**: Next.js API endpoints for game logic
- **Score Management**: RESTful API for leaderboards
- **Farcaster Integration**: Neynar SDK for social features

### Blockchain Integration
- **Farcaster**: Social identity and wallet connection
- **Neynar**: Farcaster API and mini app framework
- **Zora**: Creator economy and token creation

## 🔧 Configuration

### Environment Variables
- `NEXT_PUBLIC_URL`: Your app's public URL
- `NEYNAR_API_KEY`: Neynar API key for enhanced features
- `NEYNAR_CLIENT_ID`: Neynar client ID for webhooks

### Customization
- **Game Settings**: Modify `GRID_SIZE`, `CELL_SIZE`, and `GAME_SPEED` in `SnakeGame.tsx`
- **Styling**: Update Tailwind classes for custom themes
- **API Endpoints**: Configure score submission and leaderboard APIs

## 📱 Farcaster Mini App Features

### Automatic Integration
- **Wallet Connection**: Seamless Farcaster wallet integration
- **User Context**: Access to user profile and social data
- **Mini App Framework**: Built with Neynar's mini app SDK

### Social Features
- **Score Sharing**: Post achievements to Farcaster
- **Community**: Compete with other Farcaster users
- **Leaderboards**: Real-time rankings and statistics

## 🪙 Creator Economy

### Zora Integration
- **Account Connection**: Link Zora accounts for creator features
- **Token Creation**: Create and manage creator coins
- **Marketplace**: Buy, sell, and trade creator tokens

### Creator Features
- **Profile Management**: Build your creator brand
- **Coin Economics**: Set pricing and supply for your tokens
- **Community Building**: Engage with your audience through tokens

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run deploy:vercel
```

### Manual Deployment
```bash
npm run build
npm run start
```

### Environment Setup
Ensure all environment variables are configured in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Farcaster**: Social protocol and community
- **Neynar**: Mini app framework and API
- **Zora**: Creator economy platform
- **Next.js**: React framework
- **Tailwind CSS**: Utility-first CSS framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/snake_game/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/snake_game/discussions)
- **Documentation**: [Farcaster Docs](https://docs.farcaster.xyz/)
- **Neynar Docs**: [Neynar Documentation](https://docs.neynar.com/)

---

**Made with ❤️ for the Farcaster community**

