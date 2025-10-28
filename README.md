# 🚀 Base Stats

A beautiful analytics dashboard for the Base blockchain network, built as a Farcaster Mini App.

## 📊 Features

- **Real-time Block Data** - Current block number and network status
- **Gas Price Tracking** - Live gas price monitoring
- **Transaction Statistics** - Total and daily transaction metrics
- **TVL Analytics** - Total Value Locked tracking
- **Modern UI** - Beautiful gradient design with Framer Motion animations
- **Farcaster Integration** - Ready to use as a Farcaster Frame

## 🛠️ Tech Stack

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Wagmi** - Ethereum React hooks
- **Viem** - Low-level Ethereum library
- **Framer Motion** - Smooth animations
- **Base Network** - Optimism L2

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Piti420/Base-Stats.git
cd Base-Stats
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Project Structure

```
Base-Stats/
├── app/
│   ├── layout.tsx       # Root layout with Farcaster meta tags
│   ├── page.tsx         # Main dashboard page
│   ├── providers.tsx    # Wagmi & React Query providers
│   └── globals.css      # Global styles
├── components/
│   ├── BaseDashboard.tsx   # Main dashboard component
│   └── StatCard.tsx        # Reusable stat card
├── lib/
│   └── baseStats.ts     # Base network data fetching utilities
└── ...
```

## 🔗 Base Network

Base is a secure, low-cost, builder-friendly Ethereum L2 built to bring the next billion users onchain.

- **Website**: [base.org](https://base.org)
- **Explorer**: [basescan.org](https://basescan.org)
- **Documentation**: [docs.base.org](https://docs.base.org)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Deploy automatically

### Manual Deployment

```bash
npm run build
npm start
```

## 📝 License

MIT License - feel free to use this project!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

- **GitHub**: [@Piti420](https://github.com/Piti420)
- **Project**: [Base-Stats](https://github.com/Piti420/Base-Stats)

---

Made with ❤️ for the Base ecosystem

