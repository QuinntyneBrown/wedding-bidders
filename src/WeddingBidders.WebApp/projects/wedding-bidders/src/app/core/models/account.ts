export enum AccountType {
  Bidder = 0,
  Customer = 1,
  Internal = 2
}

export enum AccountStatus {
  Free = 0,
  Paid = 1,
  Unpaid = 2
}

export interface Account {
  accountId: string;
  firstname: string;
  lastname: string;
  email: string;
  accountType: AccountType;
  accountStatus: AccountStatus;
  defaultProfileId?: string;
}

export interface Billing {
  accountStatus: AccountStatus;
  subscriptionExpiry?: string;
  lastPaymentAmount?: number;
  lastPaymentDate?: string;
}
