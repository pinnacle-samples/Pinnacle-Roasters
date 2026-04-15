# Pinnacle Roasters — RCS Cafe Ordering Chatbot

A cafe ordering chatbot that runs entirely inside RCS. Customers browse the menu by category, build a cart, RSVP to in-store events, and earn loyalty points on every order — no app install required.

> **Live guide:** https://pinnacle.sh/samples/pinnacle-roasters

https://github.com/user-attachments/assets/6caaf196-5b1a-40c5-a969-e5ea01c282c5

> Note: the visuals in this demo recording have since been refreshed with sharper brand assets. The conversation flow is identical to what you'll get from a fresh clone.

## What's inside

- Browse menu categories — coffee, tea, pastries, food
- Persistent cart per customer with running totals
- Loyalty points earned on every order, redeemable for free items
- 1000 starter points so the redemption flow is demoable on day one
- Order confirmation with pickup time and order number
- In-store events with RSVP slot picker

## Prerequisites

- Node.js 18+
- A Pinnacle account — [sign up](https://app.pinnacle.sh/auth/sign-up)
- An RCS [test agent](https://docs.pinnacle.sh/guides/branded-test-agents) for development
- A Pinnacle [API key](https://app.pinnacle.sh/dashboard/development/api-keys) and [webhook signing secret](https://app.pinnacle.sh/dashboard/development/webhooks)

## Quick start

```bash
git clone https://github.com/pinnacle-samples/Pinnacle-Roasters
cd Pinnacle-Roasters
npm install
cp .env.example .env
# fill in PINNACLE_API_KEY, PINNACLE_AGENT_ID, PINNACLE_SIGNING_SECRET
npm run dev
```

Expose your webhook with [ngrok](https://ngrok.com):

```bash
ngrok http 3000
```

Then in the [Pinnacle Webhooks dashboard](https://app.pinnacle.sh/dashboard/development/webhooks):

1. Add `https://<your-tunnel-domain>/webhook`
2. Attach it to your RCS agent
3. Copy the signing secret into `PINNACLE_SIGNING_SECRET`

Send `MENU` or `START` to your agent — you'll see the cafe landing card with **Menu**, **Loyalty & Rewards**, and **Events** buttons.

## Environment variables

```env
PINNACLE_API_KEY=your_api_key_here
PINNACLE_AGENT_ID=your_agent_id_here
PINNACLE_SIGNING_SECRET=your_signing_secret_here
TEST_MODE=false
PORT=3000
```

## Project structure

```
Pinnacle-Roasters/
├── server.ts                  # Express bootstrap
├── router.ts                  # /webhook POST — verifies + dispatches
├── data/
│   ├── business.yml           # Brand name, tagline, address, phone, image
│   ├── menu.yml               # Categories + items
│   └── loyalty.yml            # Reward tiers + points cost
└── lib/
    ├── rcsClient.ts           # PinnacleClient instance
    ├── baseAgent.ts           # Shared send + typing helpers
    ├── typing.ts              # Fire-and-forget typing indicator
    ├── agent.ts               # Agent — every action handler lives here
    └── brand/
        ├── menu.ts            # YAML loader
        └── types.ts           # BusinessInfo, MenuCategory, MenuItem, LoyaltyReward
```

## Action handlers

| Action | What it does |
| --- | --- |
| `showMainMenu` | Landing card with menu, loyalty, and events |
| `sendMenuCategories` | Top-level menu categories |
| `viewCategory` | Items inside a chosen category |
| `addToCart` / `viewCart` / `clearCart` | Cart management |
| `checkout` | Confirms and clears the cart |
| `viewLoyalty` / `redeemReward` | Loyalty points + reward redemption |
| `sendEvents` | Upcoming in-store events |
| `showAppointmentTimes` / `confirmAppointment` | RSVP slot picker |

## Customize the menu

Open `data/menu.yml` and append a new category. Categories and items are plain YAML — no code changes required:

```yaml
- name: 🍂 Seasonal
  description: Limited-time fall favorites.
  image: https://yourcdn.com/seasonal.jpg
  items:
    - name: Pumpkin Spice Latte
      price: $5.50
      description: Espresso, pumpkin spice syrup, steamed milk, whipped cream
      image: https://yourcdn.com/psl.jpg
```

`sendMenuCategories` iterates over whatever's in `menu.yml` — restart the server to reload the YAML.

## Loyalty program

Rewards live in `data/loyalty.yml`. Edit `data/business.yml` to rename the cafe, swap the logo, or update the address.

## Going to production

- Set `TEST_MODE=false` and submit your agent for [carrier approval](https://docs.pinnacle.sh/guides/campaigns/rcs)
- Replace the in-memory `carts` Map with Postgres or Redis
- Wire the checkout flow to your real POS or Stripe

## Resources

- **Live guide:** https://pinnacle.sh/samples/pinnacle-roasters
- **Pinnacle docs:** https://docs.pinnacle.sh/documentation/introduction
- **Pinnacle dashboard:** https://app.pinnacle.sh
- **Support:** founders@trypinnacle.app
