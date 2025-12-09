import { BaseAgent } from './baseAgent';
import { Pinnacle } from 'rcs-js';
import { business, menu, loyaltyRewards } from './brand/menu';
import { MenuItem, CartItem } from './brand/types';

export class Agent extends BaseAgent {
  private defaultPoints = 1000;
  private carts: Map<string, CartItem[]> = new Map();

  // standard buttons
  private standardButtons: Pinnacle.RichButton[] = [
    {
      type: 'trigger',
      title: '🍴 Menu',
      payload: JSON.stringify({ action: 'sendMenuCategories' }),
    },
    {
      type: 'trigger',
      title: '🎁 Loyalty & Rewards',
      payload: JSON.stringify({ action: 'viewLoyalty' }),
    },
    {
      type: 'trigger',
      title: '🎪 Events',
      payload: JSON.stringify({ action: 'sendEvents' }),
    },
    {
      type: 'call',
      title: '📞 Call Us',
      payload: business.phone,
    },
  ];

  // 1. Main Menu
  async showMainMenu(to: string) {
    // Generate additional Buttons if provided
    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      cards: [
        {
          title: business.title,
          subtitle: business.subtitle,
          media: business.image,
          buttons: [...this.standardButtons],
        },
      ],
      quickReplies: [
        {
          type: 'trigger',
          title: '🔚 End Demo',
          payload: 'END_DEMO',
        },
      ],
      options: { test_mode: this.TEST_MODE },
    });
  }

  // 2. Menu Showcase - Category Selection
  async sendMenuCategories(to: string) {
    const cards: Pinnacle.RcsCards.Cards.Item[] = menu.map((category) => ({
      title: category.name,
      media: category.image,
      subtitle: category.description,
      buttons: [
        {
          type: 'trigger',
          title: '👀 View Items',
          payload: JSON.stringify({
            action: 'viewCategory',
            params: { items: category.items },
          }),
        },
      ],
    }));

    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      cards: cards,
      quickReplies: [
        {
          type: 'trigger',
          title: '🎁 Loyalty & Rewards',
          payload: JSON.stringify({ action: 'viewLoyalty' }),
        },
        {
          type: 'trigger',
          title: '🎪 Events',
          payload: JSON.stringify({ action: 'sendEvents' }),
        },
      ],
      options: { test_mode: this.TEST_MODE },
    });
  }

  // 2. Menu Showcase - Show Items in Category
  async viewCategory(to: string, items: MenuItem[]) {
    const cards: Pinnacle.RcsCards.Cards.Item[] = items.slice(0, 10).map((item) => ({
      title: item.name,
      subtitle: `${item.price}\n${item.description}`,
      media: item.image,
      buttons: [
        {
          type: 'trigger',
          title: '🛒 Add to Cart',
          payload: JSON.stringify({ action: 'addToCart', params: { item } }),
        },
      ],
    }));

    // Add checkout button if cart is not empty
    const cart = this.carts.get(to) || [];
    const quickReplies =
      cart.length > 0
        ? [
            {
              type: 'trigger' as const,
              title: '🛍️ Check Out',
              payload: JSON.stringify({ action: 'viewCart' }),
            },
            {
              type: 'trigger' as const,
              title: '🍴 Menu',
              payload: JSON.stringify({ action: 'sendMenuCategories' }),
            },
            {
              type: 'trigger' as const,
              title: '🎁 Loyalty & Rewards',
              payload: JSON.stringify({ action: 'viewLoyalty' }),
            },
            {
              type: 'trigger' as const,
              title: '🎪 Events',
              payload: JSON.stringify({ action: 'sendEvents' }),
            },
          ]
        : [
            {
              type: 'trigger' as const,
              title: '🍴 Menu',
              payload: JSON.stringify({ action: 'sendMenuCategories' }),
            },
            {
              type: 'trigger' as const,
              title: '🎁 Loyalty & Rewards',
              payload: JSON.stringify({ action: 'viewLoyalty' }),
            },
            {
              type: 'trigger' as const,
              title: '🎪 Events',
              payload: JSON.stringify({ action: 'sendEvents' }),
            },
          ];

    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      cards: cards,
      quickReplies: quickReplies,
      options: { test_mode: this.TEST_MODE },
    });
  }

  // 3. Loyalty Rewards - Show available rewards and current points
  async sendLoyalty(to: string) {
    const cards: Pinnacle.RcsCards.Cards.Item[] = loyaltyRewards.rewards.map((reward) => ({
      title: `${reward.name}`,
      subtitle: `${reward.points} points\n${reward.description}`,
      media: reward.image,
      buttons: [
        {
          type: 'trigger' as const,
          title: '🎯 Redeem',
          payload: JSON.stringify({
            action: 'redeemReward',
            params: { reward: reward.name, points: reward.points },
          }),
        },
      ],
    }));

    // Add a header card showing current points
    const headerCard = {
      title: '🎁 Loyalty Rewards',
      subtitle: `Current points: ${this.defaultPoints}\nLoyalty rewards can only be claimed in person.`,
      media: 'https://***REMOVED***',
      buttons: [],
    };

    // Exclude loyalty button from quick replies since we're already in loyalty view
    const buttonsWithoutLoyalty = this.standardButtons.filter(
      (btn) => !('payload' in btn && btn.payload.includes('viewLoyalty')),
    );

    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      cards: [headerCard, ...cards],
      quickReplies: buttonsWithoutLoyalty,
      options: { test_mode: this.TEST_MODE },
    });
  }

  // 4. Redeem Reward - Show QR code for redemption
  async redeemReward(to: string, rewardName: string) {
    // Send redeem text
    await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      cards: [
        {
          title: `🎉 ${rewardName} - Redeemed!`,
          subtitle:
            'Go to the counter and scan \nthis QR code when ordering to redeem your reward.',
          buttons: [],
        },
      ],
      quickReplies: [],
      options: { test_mode: this.TEST_MODE },
    });

    // Send media
    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      media: 'https://***REMOVED***',
      quickReplies: [
        {
          type: 'trigger',
          title: '🍴 Menu',
          payload: JSON.stringify({ action: 'sendMenuCategories' }),
        },
        {
          type: 'trigger',
          title: '🎪 Events',
          payload: JSON.stringify({ action: 'sendEvents' }),
        },
      ],
      options: { test_mode: this.TEST_MODE },
    });
  }

  // 5. Events - Show available events
  async sendEvents(to: string) {
    const events = [
      {
        name: 'Coffee Tasting',
        emoji: '☕',
        description: 'Experience our specialty coffee selections',
        image: 'https://***REMOVED***',
      },
      {
        name: 'Barista Workshop',
        emoji: '👨‍🍳',
        description: 'Learn the art of coffee making',
        image: 'https://***REMOVED***',
      },
      {
        name: 'Private Event',
        emoji: '🎉',
        description: 'Host your event at our cafe',
        image: 'https://***REMOVED***',
      },
    ];

    const cards = events.map((event) => ({
      title: `${event.emoji} ${event.name}`,
      subtitle: event.description,
      media: event.image,
      buttons: [
        {
          type: 'trigger' as const,
          title: '🗓️ Sign Me Up',
          payload: JSON.stringify({
            action: 'showAppointmentTimes',
            params: { event: event.name },
          }),
        },
      ],
    }));

    const buttonsWithoutEvents = this.standardButtons.filter(
      (btn) => !('payload' in btn && btn.payload.includes('sendEvents')),
    );

    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      cards: cards,
      quickReplies: buttonsWithoutEvents,
      options: { test_mode: this.TEST_MODE },
    });
  }

  // 6. Show Appointment Times - Display available time slots
  async showAppointmentTimes(to: string, eventName: string) {
    const timeSlots = [
      { day: 'Monday', time: '10:00 AM' },
      { day: 'Wednesday', time: '2:00 PM' },
      { day: 'Friday', time: '2:00 PM' },
    ];

    const cards = timeSlots.map((slot) => ({
      title: `${slot.day} at ${slot.time}`,
      subtitle: `Book your ${eventName} session`,
      media: 'https://***REMOVED***',
      buttons: [
        {
          type: 'trigger' as const,
          title: '✅ Confirm',
          payload: JSON.stringify({
            action: 'confirmAppointment',
            params: { event: eventName, day: slot.day, time: slot.time },
          }),
        },
      ],
    }));

    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      cards: cards,
      quickReplies: this.standardButtons,
      options: { test_mode: this.TEST_MODE },
    });
  }

  // 7. Confirm Appointment - Finalize booking
  async confirmAppointment(to: string, eventName: string, day: string, time: string) {
    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      text: `✅ Appointment Confirmed!\n\nYour ${eventName} is scheduled for ${day} at ${time}.\n\nWe'll send you a reminder 1 hour before your appointment.`,
      quickReplies: this.standardButtons,
      options: { test_mode: this.TEST_MODE },
    });
  }

  // 8. Add to Cart - Add item to user's cart
  async addToCart(to: string, item: MenuItem) {
    const cart = this.carts.get(to) || [];
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.item.name === item.name);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({ item, quantity: 1 });
    }

    this.carts.set(to, cart);

    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      text: `✅ Added ${item.name} to your cart!`,
      quickReplies: [
        {
          type: 'trigger',
          title: '🛍️ Check Out',
          payload: JSON.stringify({ action: 'viewCart' }),
        },
        {
          type: 'trigger',
          title: '🍴 Menu',
          payload: JSON.stringify({ action: 'sendMenuCategories' }),
        },
      ],
      options: { test_mode: this.TEST_MODE },
    });
  }

  // 9. View Cart - Display items in cart
  async viewCart(to: string) {
    const cart = this.carts.get(to) || [];

    if (cart.length === 0) {
      return await this.client.messages.rcs.send({
        from: this.agentName,
        to: to,
        text: 'Your cart is empty. Browse our menu to add items!',
        quickReplies: this.standardButtons,
        options: { test_mode: this.TEST_MODE },
      });
    }

    const cards: Pinnacle.RcsCards.Cards.Item[] = cart.map((cartItem) => ({
      title: cartItem.item.name,
      subtitle: `${cartItem.item.price} x ${cartItem.quantity}\nTotal: $${(
        parseFloat(cartItem.item.price.replace('$', '')) * cartItem.quantity
      ).toFixed(2)}`,
      media: cartItem.item.image,
      buttons: [],
    }));

    const total = cart.reduce((sum, cartItem) => {
      return sum + parseFloat(cartItem.item.price.replace('$', '')) * cartItem.quantity;
    }, 0);

    // Add a header card with total
    const headerCard = {
      title: '🛒 Your Cart',
      subtitle: `Total: $${total.toFixed(2)}`,
      media: 'https://cdn-icons-png.flaticon.com/512/3081/3081986.png',
      buttons: [],
    };

    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      cards: [headerCard, ...cards],
      quickReplies: [
        {
          type: 'trigger',
          title: '💳 Order Now',
          payload: JSON.stringify({ action: 'checkout' }),
        },
        {
          type: 'trigger',
          title: '🗑️ Clear Cart',
          payload: JSON.stringify({ action: 'clearCart' }),
        },
        {
          type: 'trigger',
          title: '🍴 Menu',
          payload: JSON.stringify({ action: 'sendMenuCategories' }),
        },
      ],
      options: { test_mode: this.TEST_MODE },
    });
  }

  // 10. Checkout - Process order
  async checkout(to: string) {
    const cart = this.carts.get(to) || [];

    if (cart.length === 0) {
      return await this.client.messages.rcs.send({
        from: this.agentName,
        to: to,
        text: 'Your cart is empty. Browse our menu to add items!',
        quickReplies: this.standardButtons,
        options: { test_mode: this.TEST_MODE },
      });
    }

    const total = cart.reduce((sum, cartItem) => {
      return sum + parseFloat(cartItem.item.price.replace('$', '')) * cartItem.quantity;
    }, 0);

    const orderSummary = cart
      .map(
        (cartItem) =>
          `- ${cartItem.item.name} x${cartItem.quantity} - $${(
            parseFloat(cartItem.item.price.replace('$', '')) * cartItem.quantity
          ).toFixed(2)}`,
      )
      .join('\n');

    // Clear the cart
    this.carts.delete(to);

    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      text: `🎉 Order Confirmed!\n\nYour order:\n${orderSummary}\n\nTotal: $${total.toFixed(
        2,
      )}\n\nYour order will be ready for pickup in 15-20 minutes. We'll notify you when it's ready!`,
      quickReplies: this.standardButtons,
      options: { test_mode: this.TEST_MODE },
    });
  }

  // 11. Clear Cart - Remove all items from cart
  async clearCart(to: string) {
    this.carts.delete(to);

    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      text: '🗑️ Your cart has been cleared.',
      quickReplies: this.standardButtons,
      options: { test_mode: this.TEST_MODE },
    });
  }
}

export const agent = new Agent();
