import { Request } from 'express';
import { Pinnacle } from 'rcs-js';

export interface TriggerPayload {
  action: string;
  params?: Record<string, unknown>;
}

export interface RequestWithMessageEvent extends Request {
  messageEvent: Pinnacle.MessageEvent;
}
