# Vishaka Vedic Astrology - Project Continuation Guide

## 🚀 Quick Start on a New Machine

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/vishaka_website.git
   cd vishaka_website
   ```

2. **Environment Setup**:
   - Install Node.js 20.x and npm 10.x
   - Install Python 3.10+ (for backend services)
   - Install PostgreSQL (or have a remote database connection)

3. **Install Dependencies**:
   ```bash
   # Install Node.js dependencies
   npm install

   # Install Python dependencies
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Environment Variables**:
   Copy `.env.example` to `.env` and update with your local values:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🔧 Project Structure

```
vishaka_website/
├── src/                  # Frontend source code
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   └── lib/              # Utility functions
├── server/               # Server-side code
│   └── vedic-calculations.ts  # Vedic astrology calculations
├── prisma/               # Database schema
├── public/               # Static files
└── netlify/              # Netlify functions
```

## 🛠 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Database migrations
npx prisma migrate dev    # Create and apply migrations
npx prisma generate       # Generate Prisma Client
npx prisma studio         # Database GUI
```

## 🔐 Environment Variables

Required environment variables (store in `.env`):

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vishaka?schema=public"

# JWT Authentication
SECRET_KEY="your-secret-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRES_MINUTES="1440"

# Application
NODE_ENV="development"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Admin User
FIRST_SUPERUSER="admin@example.com"
FIRST_SUPERUSER_PASSWORD="changeme"

# Swiss Ephemeris
SWISS_EPHEM_PATH="./swiss_ephemeris"
```

## 🚀 Deployment

### Netlify Deployment

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Deploy:
   ```bash
   # Build and deploy
   npm run build
   netlify deploy --prod
   ```

### Environment Setup on Netlify

Set these environment variables in your Netlify dashboard:

- `NODE_VERSION`: 20
- `NPM_VERSION`: 10
- `NEXT_TELEMETRY_DISABLED`: 1
- All variables from your `.env` file

## 🔄 Database Management

```bash
# Create and apply migrations
npx prisma migrate dev --name init

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

## 📦 Dependencies

### Key Dependencies
- **Frontend**: Next.js 13+, React 18+, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Vedic Calculations**: vedic-astrology, swisseph-v2

### Updating Dependencies

```bash
# Update Node.js dependencies
npm update

# Update Python dependencies
pip install --upgrade -r requirements.txt
```

## 🐛 Troubleshooting

1. **Build Failures**:
   - Clear Next.js cache: `rm -rf .next`
   - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

2. **Database Issues**:
   - Check if PostgreSQL is running
   - Verify `DATABASE_URL` in `.env`
   - Run `npx prisma migrate reset` (warning: deletes data)

3. **Native Module Errors**:
   - Ensure Python and build tools are installed
   - Run `npm rebuild` if native modules fail to build

## 📝 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vedic Astrology Package](https://github.com/your-username/vedic-astrology)

## 📞 Support

For issues or questions:
1. Check the GitHub issues
2. Contact: your-email@example.com
3. Join our [Discord/Slack channel] (if applicable)

---

*Last updated: September 7, 2025*
