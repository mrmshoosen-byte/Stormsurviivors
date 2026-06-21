# 🚀 SURVIVORS - QUICKSTART (5 Minutes to Launch)

## Start Here 👇

### 1️⃣ Install Node.js (If Not Already Installed)
Visit: https://nodejs.org/  
Download: v18 or later  
Verify: Open terminal and run:
```bash
node --version
npm --version
```

### 2️⃣ Navigate to Project
```bash
cd survivors-setup
```

### 3️⃣ Install Dependencies (Takes 1-2 minutes)
```bash
npm install
```

### 4️⃣ Start Development Server
```bash
npm run dev
```

### 5️⃣ Open in Browser
```
http://localhost:3000
```

## ✅ You Should Now See

- Animated SURVIVORS landing page
- Live storm countdown (60 seconds)
- Top holders leaderboard  
- "Buy To Enter" button
- Real-time eliminations
- Activity feed with events

## 🎮 Test the Game

1. **Click "Buy To Enter"** → Enter amount → See new survivor in leaderboard
2. **Wait for storm** → Watch countdown reach 0 → See lightning effects
3. **Check eliminations** → Random wallets fade out with glitch effect
4. **View leaderboard** → Survivors decrease, eliminations increase
5. **Check activity feed** → Real-time game events appear

## 🚀 Deploy to Vercel (2 minutes)

### Option A: Vercel CLI
```bash
npm install -g vercel
vercel
# Follow prompts
```

### Option B: GitHub + Vercel
1. Push code to GitHub
2. Go to vercel.com
3. Click "Import Project"
4. Select your GitHub repo
5. Click Deploy (auto-detects Next.js)

### Option C: Share Live URL
After deploying, Vercel gives you a live URL to share with the world.

## 📖 Read Next

1. **PROJECT_SUMMARY.md** - Complete feature checklist (5 min read)
2. **README.md** - Full documentation (15 min read)
3. **SETUP_GUIDE.md** - Detailed setup & customization (20 min read)

## 🎨 Customize (Optional)

### Easy Changes (No Code Knowledge Needed)
Edit these files with any text editor:

**Change Title/Text:**
- `pages/index.tsx` - Line 30: Change "VOID SURVIVOR"

**Change Colors:**
- `tailwind.config.js` - Edit color values
- `styles/globals.css` - Edit hex codes

**Change Game Speed:**
- `context/GameContext.tsx` - Line 30: Change "60" to any number

## 🔧 Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
# Open http://localhost:3001
```

**Styles not showing?**
```bash
rm -rf .next
npm run dev
```

**Module errors?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📊 File Guide

| File | What It Does |
|------|-------------|
| `pages/index.tsx` | Main game page |
| `context/GameContext.tsx` | Game state & storm logic |
| `utils/mockData.ts` | Survivor data & calculations |
| `tailwind.config.js` | Colors & theme |
| `styles/globals.css` | Global styles & animations |

## ⚡ Key Features

✅ **Real-time Storm Mechanics** - Every 60 seconds  
✅ **Animated Eliminations** - Glitch effects when survivors are knocked out  
✅ **Live Leaderboard** - Top 10 holders with sorting  
✅ **Dynamic Jackpot** - Grows with each purchase  
✅ **Activity Feed** - Real-time game events  
✅ **Extra Lives** - Bonus protection for large holders  
✅ **Mobile Optimized** - Works on phone/tablet/desktop  
✅ **No Setup Needed** - Runs with mock data immediately  

## 🎯 Next Steps

- [ ] Run `npm run dev` and see the game live
- [ ] Click "Buy To Enter" and add a survivor
- [ ] Wait for a storm to eliminate wallets
- [ ] Customize colors in `tailwind.config.js`
- [ ] Deploy to Vercel with `vercel` command
- [ ] Share link with friends/community

## 📱 Mobile Testing

Open in mobile browser:
```
http://[YOUR_COMPUTER_IP]:3000
```

Or deploy to Vercel and share the URL.

## 💡 Pro Tip

Everything works with mock data. You can:
- Test all features immediately
- Customize freely
- Deploy and go live now
- Connect real data later (v2)

## ❓ Questions?

1. Check **README.md** for detailed docs
2. Check **SETUP_GUIDE.md** for customization
3. Check **PROJECT_SUMMARY.md** for features

## 🎉 Ready?

```bash
npm install && npm run dev
```

Then open http://localhost:3000 and watch the magic happen! ⚡💎🎮

---

**That's it! You now have a production-ready meme coin battle royale game.**

Deploy, launch, and let the survivors compete for the jackpot! 🚀
