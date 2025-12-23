import { AccountInfo } from "@/types/walletTypes";

let currentAccount: AccountInfo | null = null;

export const getCurrentAccount = (): AccountInfo | null => {
  return currentAccount;
};

export const setCurrentAccount = (account: AccountInfo | null) => {
  currentAccount = account;
};
