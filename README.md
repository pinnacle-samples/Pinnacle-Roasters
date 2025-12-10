# Pinnacle Cafe Chatbot

An interactive RCS chatbot for Pinnacle Cafe that provides a rich customer experience through Rich Communication Services (RCS) messaging.


https://github.com/user-attachments/assets/6caaf196-5b1a-40c5-a969-e5ea01c282c5


## Features

### Menu Browsing

- Browse menu items organized by category (Coffee, Pastries, Sandwiches, etc.)
- View detailed item information including descriptions, prices, and images
- Rich card-based interface for easy navigation

### Online Ordering

- Add items to cart with a single tap
- View cart with itemized breakdown and totals
- Complete orders through the chatbot
- Receive order confirmation and estimated pickup time

### Loyalty & Rewards

- View available loyalty rewards
- Check current points balance
- Redeem rewards with QR codes for in-person redemption
- Track accumulated points from purchases

### Event Management

- Browse upcoming events (Coffee Tastings, Barista Workshops, Private Events)
- View available time slots for events
- Book and confirm appointments
- Receive appointment confirmations and reminders

### Additional Features

- Direct calling capability to contact the cafe
- Button-based interactions for seamless user experience
- Test mode support for development and testing

## Project Structure

```
Pinnacle Cafe/
├── lib/
│   ├── types.ts              # Shared TypeScript interfaces
│   ├── rcsClient.ts          # Pinnacle RCS client configuration
│   ├── baseAgent.ts          # Base agent class with common functionality
│   ├── brand/
│   │   ├── types.ts          # Business-specific type definitions
│   │   └── menu.ts           # Menu data loader
│   └── agent.ts              # Main chatbot agent implementation
├── data/
│   ├── business.yml          # Business information
│   ├── menu.yml              # Menu items and categories
│   └── loyalty.yml           # Loyalty rewards configuration
├── server.ts                 # Main server with graceful shutdown
├── router.ts                 # Express router for webhook handling
├── package.json              # Project dependencies
├── tsconfig.json             # TypeScript configuration
├── .env.example              # Environment variables template
└── .gitignore                # Git ignore rules

```

## Setup

### Prerequisites

- Node.js 18+
- A Pinnacle API account
- RCS agent configured in Pinnacle

### Installation

1. Clone the repository

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:

```env
PINNACLE_API_KEY=your_api_key_here
PINNACLE_AGENT_ID=your_agent_id_here
PINNACLE_SIGNING_SECRET=your_signing_secret_here
TEST_MODE=true
PORT=3000
```

5. Set up a public HTTPS URL for your webhook. For local development, you can use a tunneling service like [ngrok](https://ngrok.com):

   ```bash
   ngrok http 3000
   ```

   For production, deploy to your preferred hosting provider.

6. Connect your webhook to your RCS agent:

   - Go to the [Pinnacle Webhooks Dashboard](https://app.pinnacle.sh/dashboard/development/webhooks)
   - Add your public URL with the `/webhook` path (e.g., `https://your-domain.com/webhook`)
   - Select your RCS agent to receive messages at this endpoint
   - Copy the signing secret and add it to your `.env` file as `PINNACLE_SIGNING_SECRET`. The `process()` method uses this environment variable to verify the request signature.

7. Text "MENU" to the bot to see the main menu.

### Running the Application

Development mode with auto-reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## Configuration

### Environment Variables

- `PINNACLE_API_KEY` (required): Your Pinnacle API key
- `PINNACLE_AGENT_ID` (required): Your RCS agent ID from Pinnacle Dashboard
- `PINNACLE_SIGNING_SECRET` (required): Webhook signing secret for request verification
- `TEST_MODE` (optional): Enable test mode for development (default: false)
- `PORT` (optional): Server port (default: 3000)

### Menu Configuration

Menu items are configured in YAML files under the `data/` directory:

- `business.yml`: Business name, description, contact info
- `menu.yml`: Menu categories and items
- `loyalty.yml`: Loyalty rewards and point requirements

## API Endpoints

**Supported Actions:**

- `sendMenuCategories`: Display menu categories
- `viewCategory`: Show items in a category
- `viewLoyalty`: Display loyalty rewards
- `redeemReward`: Redeem a loyalty reward
- `sendEvents`: Show upcoming events
- `showAppointmentTimes`: Display available booking times
- `confirmAppointment`: Confirm event booking
- `addToCart`: Add item to shopping cart
- `viewCart`: Display cart contents
- `checkout`: Process order
- `clearCart`: Empty shopping cart

## Development

### Adding New Menu Items

Edit `data/menu.yml` to add new categories or items:

```yaml
- name: 'New Category'
  description: 'Category description'
  image: 'https://example.com/image.jpg'
  items:
    - name: 'New Item'
      price: '$5.99'
      description: 'Item description'
      image: 'https://example.com/item.jpg'
```

### Adding New Features

1. Define action handlers in `lib/agent.ts`
2. Add corresponding trigger payloads in button configurations
3. Update router in `router.ts` to handle new actions

## Technologies

- **TypeScript**: Type-safe development
- **Express**: Web framework for webhook handling
- **rcs-js**: Pinnacle RCS SDK v2.0.6+
- **js-yaml**: YAML configuration parsing
- **tsx**: TypeScript execution and hot-reload

## Support

For issues related to:

- RCS functionality: Contact Pinnacle support
- Chatbot implementation: Refer to the code documentation
- Configuration: Check the `.env.example` file

## License

ISC
