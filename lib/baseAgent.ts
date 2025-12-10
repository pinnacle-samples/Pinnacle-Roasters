import { PinnacleClient } from 'rcs-js';
import { rcsClient } from './rcsClient';
import dotenv from 'dotenv';

dotenv.config();

export class BaseAgent {
  protected client: PinnacleClient;
  protected agentId: string;
  protected TEST_MODE: boolean;

  constructor() {
    this.client = rcsClient;
    this.agentId = process.env.PINNACLE_AGENT_ID || '';
    this.TEST_MODE = process.env.TEST_MODE === 'true';

    if (!this.agentId) {
      throw new Error('PINNACLE_AGENT_ID environment variable is required');
    }
  }

  async sendButtonOnlyMessage(to: string) {
    return await this.client.messages.rcs.send({
      from: this.agentId,
      to: to,
      text: 'Please use the buttons to interact with the chatbot.',
      options: { test_mode: this.TEST_MODE },
      quickReplies: [],
    });
  }
}
