export interface FalaBakUser {
  id: string;
  name: string;
  firstName: string;
  avatar: string;
  coinBalance: number;
  memberSince: string;
}

export interface DailyQuote {
  id: string;
  text: string;
  author: string;
  image: string;
  date: string;
}

export interface Promotion {
  id: string;
  title: string;
  discountPercent: number;
  badgeLabel: string;
  active: boolean;
  startsAt: string;
  endsAt: string;
  countdownDurationSeconds: number;
}

export interface FortuneType {
  id: string;
  title: string;
  icon: string;
  badge: string | null;
  cost: number;
  route: string | null;
}

export interface LifeBalanceItem {
  id: string;
  label: string;
  sublabel: string;
  value: number;
  color: string;
}

export interface LifeBalance {
  title: string;
  items: LifeBalanceItem[];
}

export interface Activity {
  id: string;
  title: string;
  icon: string;
  route: string;
}

export interface NavTab {
  id: string;
  label: string;
  icon: string;
  active: boolean;
}

export interface TarotPosition {
  index: number;
  id: string;
  label: string;
}

export interface TarotReading {
  title: string;
  cost: number;
  spread: {
    id: string;
    name: string;
    positions: TarotPosition[];
  };
  instructions: string;
}

export interface TarotCardData {
  id: string;
  number: number;
  name: string;
  nameEn: string;
  arcana: string;
  image: string;
  cardBack: string;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  description: string;
}

export interface FalaBakData {
  meta: Record<string, unknown>;
  user: FalaBakUser;
  dailyQuote: DailyQuote;
  promotion: Promotion;
  fortuneTypes: FortuneType[];
  lifeBalance: LifeBalance;
  activities: Activity[];
  navTabs: NavTab[];
  tarotReading: TarotReading;
  tarotCards: TarotCardData[];
}

export interface TarotPick {
  positionIndex: number;
  cardId: string;
  reversed: boolean;
}