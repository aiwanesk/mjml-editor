import { DomainEvent } from "./DomainEvent.js";

type EventHandler = (event: DomainEvent) => void | Promise<void>;

class EventBusImpl {
  private handlers = new Map<string, EventHandler[]>();

  subscribe(eventName: string, handler: EventHandler): void {
    const existing = this.handlers.get(eventName) || [];
    existing.push(handler);
    this.handlers.set(eventName, existing);
  }

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventName) || [];
    for (const handler of handlers) {
      await handler(event);
    }
  }
}

export const eventBus = new EventBusImpl();
