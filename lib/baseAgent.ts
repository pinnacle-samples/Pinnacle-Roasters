import { Pinnacle } from 'rcs-js';
import { rcsClient } from './rcsClient';
import dotenv from 'dotenv';

dotenv.config();

export class BaseAgent {
  protected client: Pinnacle;
  protected agentName: string;
  protected TEST_MODE: boolean;

  constructor() {
    this.client = rcsClient;
    this.agentName = process.env.PINNACLE_AGENT_NAME || '';
    this.TEST_MODE = process.env.TEST_MODE === 'true';

    if (!this.agentName) {
      throw new Error('PINNACLE_AGENT_NAME environment variable is required');
    }
  }

  async sendButtonOnlyMessage(to: string) {
    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      text: 'Please use the buttons to interact with the chatbot.',
      options: { test_mode: this.TEST_MODE },
    });
  }
}
