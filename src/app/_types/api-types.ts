export interface ApiRequestOptions {
  baseURL?: string;
}

export interface ApiAuthOptions extends ApiRequestOptions {
  accessToken?: string;
}

export interface PaginationOptions extends ApiAuthOptions {
  page?: number;
  limit?: number;
}

export interface TokenConfig {
  name: string;
  symbol: string;
  priceUsdt: number;
}

export interface DashboardData {
  token: TokenConfig;
}

export interface BondingPackage {
  id: string | number;
  name: string;
  days: number;
  dailyProfit: number;
  minAmount: number;
  icon: string;
}

export interface BondingItem {
  id: string | number;
  packageName: string;
  amount: number;
  token: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface BondingData {
  packages: BondingPackage[];
  myBondingList: BondingItem[];
}

export interface BondingStartResult {
  bondingId: string;
  packageId: string;
  packageLabel: string;
  principalTto: number;
  dailyRate: number;
  dailyProfitTto: number;
  durationDays: number;
  startDate: string;
  endDate: string;
  totalProjectedProfit: number;
}

export interface NetworkAffiliateWallet {
  address: string;
  bonusTto: number;
  inviteDate: string;
  status: string;
}

export interface NetworkAffiliateLevel {
  level: number;
  label: string;
  wallets: NetworkAffiliateWallet[];
}

export interface NetworkData {
  affiliates: NetworkAffiliateLevel[];
}

export interface SwapRateConfig {
  ttoPriceUsdt: number;
  priceSource: string;
  feePercentage: number;
  minimumTto: number;
}

export interface SwapQuoteData extends SwapRateConfig {
  ttoAmount: number;
  grossUsdt: number;
  feeTto: number;
  feeUsdt: number;
  netUsdt: number;
}

export interface SwapExecutionResult {
  swapId: string;
  ttoAmount: number;
  feeTto: number;
  netUsdt: number;
  newUsdtBalance: number;
  status: string;
}

export interface SwapHistoryItem {
  id: string | number;
  fromAmount: number;
  fromToken: string;
  toAmount: number;
  toToken: string;
  date: string;
  status: string;
}

export interface DepositPriceData {
  ttoPriceUsdt: number;
  priceSource: string;
}

export interface DepositQuoteData extends DepositPriceData {
  phaseId: string;
  usdtAmount: number;
  ttoReceive: number;
  remainingAllocationTto: number;
}

export interface DepositConfirmationResult {
  depositId: string;
  status: string;
}

export interface PurchaseHistoryItem {
  id: string | number;
  amount: number;
  token: string;
  received: number;
  receivedToken: string;
  date: string;
  status: string;
}

export interface WithdrawQuoteData {
  requestedUsdt: number;
  networkFeeUsdt: number;
  youReceiveUsdt: number;
  recipientAddress: string;
}

export interface WithdrawSubmissionResult {
  withdrawId: string;
  usdtAmount: number;
  networkFeeUsdt: number;
  netUsdt: number;
  recipientAddress: string;
  status: string;
  message: string;
}

export interface WithdrawHistoryItem {
  id: string | number;
  amount: number;
  token: string;
  wallet: string;
  fee: number;
  date: string;
  status: string;
}

export interface HistoryData {
  purchaseHistory: PurchaseHistoryItem[];
  withdrawHistory: WithdrawHistoryItem[];
}

export interface ProfileData {
  username: string;
  rankLevel: string;
  registeredSince: string;
  invitedBy: string;
  affiliateLink: string;
  version: string;
}

export interface WalletSessionData {
  walletAddress: string;
  username: string;
  balance: number;
  privateBonding: number;
  usdtBalance: number;
}

export interface AuthChallengeData {
  challenge: string;
  expiresAt: string;
}

export interface AuthVerifyResult {
  accessToken: string;
  wallet: string;
  expiresIn: number;
  isNewUser: boolean;
}
