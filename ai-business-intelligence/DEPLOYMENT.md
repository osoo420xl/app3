# 🚀 Deployment Guide - AI Business Intelligence

## Quick Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial AI Business Intelligence app"
git push origin main
```

2. **Deploy to Vercel**
- Visit [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Set environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Click "Deploy"

3. **Set up Supabase Database**
```sql
-- Create business_ideas table
CREATE TABLE business_ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  market_opportunity TEXT,
  target_customer TEXT,
  revenue_model TEXT,
  competitive_advantage TEXT,
  implementation_roadmap TEXT,
  risk_assessment TEXT,
  success_metrics TEXT,
  feasibility_score INTEGER DEFAULT 0,
  market_timing TEXT,
  resource_requirements TEXT,
  success_probability INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'discovered',
  source TEXT DEFAULT 'AI Generated',
  confidence_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create competitors table
CREATE TABLE competitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_idea_id UUID REFERENCES business_ideas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  business_model TEXT,
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  market_position TEXT,
  threat_level TEXT DEFAULT 'medium',
  opportunities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trends table
CREATE TABLE trends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT NOT NULL,
  trend_score INTEGER DEFAULT 0,
  category TEXT,
  metadata JSONB DEFAULT '{}',
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE business_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE trends ENABLE ROW LEVEL SECURITY;

-- Create policies (for demo purposes - adjust for production)
CREATE POLICY "Allow all operations" ON business_ideas FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON competitors FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON trends FOR ALL USING (true);
```

## Environment Variables

### Required
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Optional
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Alternative Deployment Options

### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Set environment variables in Netlify dashboard

### Railway
1. Connect GitHub repository
2. Set environment variables
3. Railway will auto-deploy

### Self-hosted (VPS/Docker)
```bash
# Build the application
npm run build

# Start production server
npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start npm --name "ai-business-intelligence" -- start
```

## Performance Optimization

1. **Enable Caching**
- Redis for API responses
- CDN for static assets

2. **Database Optimization**
- Add indexes on frequently queried columns
- Set up connection pooling

3. **API Rate Limiting**
- Implement rate limiting for API routes
- Monitor LLM provider usage

## Monitoring & Analytics

1. **Add Analytics**
```bash
npm install @vercel/analytics
```

2. **Error Tracking**
```bash
npm install @sentry/nextjs
```

3. **Performance Monitoring**
- Vercel Analytics (built-in)
- Google PageSpeed Insights
- Core Web Vitals

## Security Checklist

- [ ] Environment variables secured
- [ ] API routes protected
- [ ] Input validation implemented
- [ ] Rate limiting configured
- [ ] CORS properly set up
- [ ] Database policies configured
- [ ] Error messages sanitized

## Production Checklist

- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Environment variables set
- [ ] Database populated
- [ ] API endpoints tested
- [ ] Performance optimized
- [ ] Analytics configured
- [ ] Error tracking active
- [ ] Backup strategy in place

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors
   - Verify environment variables
   - Update dependencies

2. **API Errors**
   - Verify LLM provider API keys
   - Check rate limits
   - Validate request formats

3. **Database Connection**
   - Verify Supabase credentials
   - Check RLS policies
   - Confirm table structure

### Support

- GitHub Issues: [Create an issue](https://github.com/yourusername/ai-business-intelligence/issues)
- Documentation: [View docs](https://github.com/yourusername/ai-business-intelligence/docs)
- Community: [Join discussions](https://github.com/yourusername/ai-business-intelligence/discussions)
