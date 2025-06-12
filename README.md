# GrayBay Monitoring System

A comprehensive monitoring and management system built with Next.js, TypeScript, and Tailwind CSS. The system provides real-time monitoring of client services, performance metrics, and business analytics with a clean, Stripe-inspired UI.

## Features

- **Dashboard Overview**
  - Real-time metrics and KPIs
  - System health monitoring
  - Alert notifications

- **Client Management**
  - Client overview and status
  - Service deployment tracking
  - Health metrics monitoring

- **Service Monitoring**
  - Website uptime tracking
  - Chatbot performance metrics
  - Analytics service monitoring

- **Billing & Revenue**
  - Revenue tracking
  - Subscription management
  - Invoice generation and tracking

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Lucide Icons

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/graybay-monitoring.git
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard page
│   ├── clients/           # Client management
│   ├── services/          # Service monitoring
│   └── billing/           # Billing dashboard
├── components/            # Reusable components
│   └── layout/           # Layout components
└── styles/               # Global styles
```

## Development

- Run tests: `npm test`
- Build for production: `npm run build`
- Start production server: `npm start`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
