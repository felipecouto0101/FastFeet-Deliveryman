import * as bcrypt from 'bcrypt';
import { DomainEvent } from '../events/domain-event';
import { DeliveryManCreatedEvent, DeliveryManActivatedEvent, DeliveryManDeactivatedEvent, DeliveryManDeletedEvent } from '../events/deliveryman-events';

export class DeliveryMan {
  private _domainEvents: DomainEvent[] = [];

  constructor(
    private readonly _id: string,
    private _name: string,
    private _email: string,
    private _cpf: string,
    private _phone: string,
    private _password: string,
    private _isActive: boolean = true,
    private _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date(),
  ) {}

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
    this._updatedAt = new Date();
  }

  get email(): string {
    return this._email;
  }

  set email(email: string) {
    this._email = email;
    this._updatedAt = new Date();
  }

  get cpf(): string {
    return this._cpf;
  }

  set cpf(cpf: string) {
    this._cpf = cpf;
    this._updatedAt = new Date();
  }

  get phone(): string {
    return this._phone;
  }

  set phone(phone: string) {
    this._phone = phone;
    this._updatedAt = new Date();
  }

  get password(): string {
    return this._password;
  }

  async setPassword(password: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    this._password = await bcrypt.hash(password, salt);
    this._updatedAt = new Date();
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this._password);
  }

  get isActive(): boolean {
    return this._isActive;
  }

  activate(): void {
    if (!this._isActive) {
      this._isActive = true;
      this._updatedAt = new Date();
      this.addDomainEvent(new DeliveryManActivatedEvent(this._id, this._name));
    }
  }

  deactivate(): void {
    if (this._isActive) {
      this._isActive = false;
      this._updatedAt = new Date();
      this.addDomainEvent(new DeliveryManDeactivatedEvent(this._id, this._name));
    }
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  markAsCreated(): void {
    this.addDomainEvent(new DeliveryManCreatedEvent(
      this._id,
      this._name,
      this._email,
      this._cpf,
      this._phone
    ));
  }

  markAsDeleted(): void {
    this.addDomainEvent(new DeliveryManDeletedEvent(this._id, this._name));
  }

  clearEvents(): void {
    this._domainEvents = [];
  }

  private addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      cpf: this._cpf,
      phone: this._phone,
      isActive: this._isActive,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}