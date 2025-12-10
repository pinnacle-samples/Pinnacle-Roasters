import { Router, Request, Response } from 'express';
import { agent } from './lib/agent';
import { MenuItem } from './lib/brand/types';
import { rcsClient } from './lib/rcsClient';

const pinnacleCafeRouter = Router();

pinnacleCafeRouter.post('/', async (req: Request, res: Response) => {
  try {
    const messageEvent = await rcsClient.messages.process(req);
    if (messageEvent.type !== 'MESSAGE.RECEIVED') {
      return res.status(200).json({ message: 'Non-message event received' });
    }
    const message = messageEvent.message;
    const from = messageEvent.conversation.from;

    // Handle quick reply actions
    if (
      message.type === 'RCS_BUTTON_DATA' &&
      typeof message.button.raw === 'object' &&
      message.button.raw.type == 'trigger'
    ) {
      const payload = JSON.parse(message.button.raw.payload) as {
        action: string;
        params?: Record<string, unknown>;
      };

      switch (payload.action) {
        case 'sendMenuCategories':
          await agent.sendMenuCategories(from);
          return res.status(200).json({ message: 'Menu categories sent' });

        case 'viewCategory':
          // invariant: items must exist
          await agent.viewCategory(from, payload.params!.items as MenuItem[]);
          return res.status(200).json({ message: 'Category items sent' });

        case 'viewLoyalty':
          await agent.sendLoyalty(from);
          return res.status(200).json({ message: 'Loyalty rewards sent' });

        case 'redeemReward':
          await agent.redeemReward(from, payload.params!.reward as string);
          return res.status(200).json({ message: 'Reward redeemed' });

        case 'sendEvents':
          await agent.sendEvents(from);
          return res.status(200).json({ message: 'Events sent' });

        case 'showAppointmentTimes':
          await agent.showAppointmentTimes(from, payload.params!.event as string);
          return res.status(200).json({ message: 'Appointment times sent' });

        case 'confirmAppointment':
          await agent.confirmAppointment(
            from,
            payload.params!.event as string,
            payload.params!.day as string,
            payload.params!.time as string,
          );
          return res.status(200).json({ message: 'Appointment confirmed' });

        case 'addToCart':
          await agent.addToCart(from, payload.params!.item as MenuItem);
          return res.status(200).json({ message: 'Item added to cart' });

        case 'viewCart':
          await agent.viewCart(from);
          return res.status(200).json({ message: 'Cart sent' });

        case 'checkout':
          await agent.checkout(from);
          return res.status(200).json({ message: 'Order processed' });

        case 'clearCart':
          await agent.clearCart(from);
          return res.status(200).json({ message: 'Cart cleared' });

        default:
          console.error('[PinnacleCafe]: Invalid trigger payload', payload.action);
          return res.status(400).json({
            error: 'Invalid Trigger Payload',
            action: payload.action,
          });
      }
    }

    // Handle text messages - send main menu
    if (message.type === 'RCS_TEXT') {
      const text = message.text.trim();
      if (text === 'START' || text === 'SUBSCRIBE' || text === 'MENU') {
        await agent.showMainMenu(from);
        return res.status(200).json({ message: 'Main menu sent' });
      }

      // Notify user that text messages are not processed
      await agent.sendButtonOnlyMessage(from);
      return res.status(200).json({ message: 'Text message skipped, sent notice to user.' });
    }

    return res.status(200).json({
      message: 'Nontrigger Event, skipping',
      received: message,
    });
  } catch (error) {
    console.error('[PinnacleCafe]: Internal server error', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default pinnacleCafeRouter;
