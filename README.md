# ⚡ EnergyPilot

A mobile-first Progressive Web App that helps residential customers in Luxembourg optimize their energy consumption and costs based on EPEX day-ahead electricity prices.

## 🎯 Overview

EnergyPilot empowers homeowners to take control of their energy usage by automatically scheduling smart devices (EVs, batteries, solar) to charge during low-price periods and discharge during peak-price times. Save money, reduce carbon emissions, and maximize your renewable energy investment.

## ✨ Key Features

### 📊 Real-Time Price Monitoring
- View EPEX day-ahead electricity prices with 30-minute resolution
- Visual indicators for optimal charging/discharging windows
- Historical price trends and forecasting

### 🔌 Smart Device Control
Manage multiple energy devices from one interface:
- **Electric Vehicles (EV)**: Automated charging schedules
- **Home Battery Storage**: Smart charge/discharge cycles
- **Solar Panels**: Monitor production and optimize self-consumption
- **Power Purchase Agreements (PPA)**: Track contract performance

### 🧠 AI-Powered Strategies

Choose from intelligent optimization modes:
- **SmartShift (AI)**: Automated optimization for maximum savings
- **ECO Mode**: Prioritizes renewable energy and self-consumption
- **Peak Shaving**: Maximizes grid arbitrage during peak hours
- **Custom**: Create your own charging/discharging schedule

### 🔔 Negative Price Alerts
Get notified when electricity prices go negative – you're literally paid to use energy!

### 📈 Performance Insights
- Track daily, weekly, and monthly savings
- Monitor CO2 impact reduction
- Community rankings and leaderboards
- Performance badges and savings streaks

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser (Chrome, Safari, Firefox, Edge)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DavitPogosian/EnergyPilot.git
cd EnergyPilot
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

### First-Time Setup

Complete the 3-step onboarding process:

1. **Configure Devices**: Add your EV, battery, solar panels, or PPA
2. **Set Preferences**: Define minimum battery levels and do-not-disturb hours
3. **Choose Strategy**: Select your default optimization mode

The app will automatically redirect you to the dashboard after setup.

## 📁 Project Structure

```
app/
├── onboarding/          # 3-step onboarding flow
├── dashboard/           # Main dashboard with price chart
├── devices/             # Device control interface
├── strategy/            # Strategy editor with timeline
├── notifications/       # Alert center
├── insights/            # Performance analytics
├── settings/            # App configuration
└── api/
    ├── prices/          # Mock EPEX price data
    ├── devices/         # Device status and control
    ├── strategy/        # Strategy application
    └── summary/         # Daily summary stats

components/
├── price-chart.tsx      # Interactive price visualization
├── timeline-editor.tsx  # Drag-to-select strategy editor
├── device-card.tsx      # Individual device control
├── bottom-nav.tsx       # Mobile navigation
└── ui/                  # shadcn/ui components

lib/
├── types.ts             # TypeScript interfaces
└── mock-data.ts         # Sample data generation
```

## 🔌 API Endpoints

### Get Energy Prices
```typescript
GET /api/prices?date=YYYY-MM-DD

Response:
{
  region: 'LU',
  date: '2025-11-25',
  prices: [
    { time: '00:00', price: 45.23 },
    { time: '00:30', price: 42.11 },
    ...
  ]
}
```

### Get All Devices
```typescript
GET /api/devices

Response:
{
  devices: [
    {
      id: 'ev-1',
      type: 'ev',
      name: 'Tesla Model 3',
      battery: 75,
      status: 'charging'
    },
    ...
  ]
}
```

### Control Device
```typescript
POST /api/devices/{id}/action

Body:
{
  action: 'charge_now' | 'stop' | 'auto' | 'discharge'
}

Response:
{
  success: true,
  newStatus: 'charging'
}
```

### Apply Strategy
```typescript
POST /api/strategy/apply

Body:
{
  intervals: [
    { start: '00:00', end: '06:00', action: 'charge' },
    ...
  ],
  devices: ['ev-1', 'battery-1']
}

Response:
{
  success: true,
  estimatedSavings: 12.45
}
```

## 🔗 Connecting to Real APIs

The app currently uses mock data. To connect to production systems:

### 1. EPEX Price Data

Edit `app/api/prices/route.ts`:
- Replace mock data with real EPEX API calls
- Use [ENTSO-E Transparency Platform](https://transparency.entsoe.eu/) or EPEX SPOT API
- Add authentication tokens

### 2. Device Control Integration

Edit `app/api/devices/[id]/action/route.ts`:
- Integrate with your smart home system (Tesla API, battery management systems)
- Implement device-specific protocols
- Add authentication and security measures

### 3. Strategy Engine

Edit `app/api/strategy/apply/route.ts`:
- Implement optimization algorithms (linear programming, dynamic scheduling)
- Connect to device scheduling systems
- Add constraint validation

### Environment Variables

Create a `.env.local` file:
```bash
EPEX_API_KEY=your_api_key
DEVICE_API_KEY=your_device_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📱 Progressive Web App

EnergyPilot is installable on mobile devices:

- **Manifest**: `/public/manifest.json`
- **Service Worker**: Auto-generated by Next.js
- **Offline Support**: Cached assets and data
- **Install Prompt**: Appears on supported browsers

### Installation on Mobile
1. Open the app in your mobile browser
2. Tap "Add to Home Screen" (iOS) or "Install App" (Android)
3. The app will appear as a native icon on your home screen

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Charts**: Recharts
- **State Management**: SWR for data fetching
- **Language**: TypeScript
- **Icons**: Lucide React

## 📱 Mobile-First Design

Built with mobile users in mind:

- Bottom navigation for thumb-friendly access
- Touch-optimized timeline editor
- Responsive charts and cards
- Large tap targets (minimum 44x44px)
- Optimized for screen widths 360px - 428px

## ♿ Accessibility

- ARIA labels on all interactive elements
- Full keyboard navigation support
- Screen reader optimized
- High contrast color themes
- Semantic HTML structure

## 🎮 Gamification Features

- **Community Rankings**: Compare performance with users in your area
- **Savings Streaks**: Track consecutive optimization days
- **Performance Badges**: Earn titles like "Elite Saver" and "Green Champion"
- **Leaderboards**: Monthly and all-time top performers


## 📦 Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## ☁️ AWS Deployment

> **Note**: This section to be completed by the solution architect.

### Architecture Overview

*[Diagram and description of AWS infrastructure to be added]*

### AWS Services Used

*[List of AWS services utilized in the deployment]*

- **Compute**: [e.g., EC2, ECS, Lambda, Amplify]
- **Storage**: [e.g., S3, EFS]
- **Database**: [e.g., RDS, DynamoDB]
- **Networking**: [e.g., VPC, CloudFront, Route53]
- **CI/CD**: [e.g., CodePipeline, CodeBuild, CodeDeploy]
- **Monitoring**: [e.g., CloudWatch, X-Ray]
- **Security**: [e.g., IAM, Secrets Manager, WAF]

### Infrastructure as Code

*[Details about IaC implementation]*

```bash
# Deployment commands to be added
# e.g., terraform apply, cdk deploy, etc.
```

### Deployment Pipeline

*[Description of CI/CD pipeline and deployment workflow]*

1. **Source Stage**: [Details]
2. **Build Stage**: [Details]
3. **Test Stage**: [Details]
4. **Deploy Stage**: [Details]

### Environment Configuration

*[AWS-specific environment variables and configuration]*

```bash
# AWS Environment Variables
AWS_REGION=
AWS_ACCOUNT_ID=
# Additional AWS-specific configs
```

## 📞 Support

For issues, questions, or feature requests, please [open an issue](https://github.com/DavitPogosian/EnergyPilot/issues) on GitHub.

---

Built with ⚡ for the Watt the Hackathon
