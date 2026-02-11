import { DomainEvent } from "../shared/DomainEvent.js";

export class TemplateCreated implements DomainEvent {
  readonly eventName = "template.created";
  readonly occurredOn = new Date();
  constructor(public readonly payload: { templateId: string; name: string }) {}
}

export class TemplateDeleted implements DomainEvent {
  readonly eventName = "template.deleted";
  readonly occurredOn = new Date();
  constructor(public readonly payload: { templateId: string }) {}
}

export class TemplateSaved implements DomainEvent {
  readonly eventName = "template.saved";
  readonly occurredOn = new Date();
  constructor(public readonly payload: { templateId: string; version: number }) {}
}
