/**
 * Premium Page Constants
 * Centralized content for Go Premium page
 * All text content, benefits, and comparison data
 */

/**
 * Premium Benefits Categories
 * Organized by value proposition for conversion
 */
export const PREMIUM_BENEFITS = {
  // Core audio quality benefit
  audioQuality: {
    id: 'audio-quality',
    icon: 'Headphones',
    titleKey: 'premium.benefits.audioQuality.title',
    descriptionKey: 'premium.benefits.audioQuality.description',
    highlight: true
  },
  
  // Ad-free experience
  adFree: {
    id: 'ad-free',
    icon: 'VolumeX',
    titleKey: 'premium.benefits.adFree.title',
    descriptionKey: 'premium.benefits.adFree.description',
    highlight: true
  },
  
  // Offline listening
  offline: {
    id: 'offline',
    icon: 'Download',
    titleKey: 'premium.benefits.offline.title',
    descriptionKey: 'premium.benefits.offline.description',
    highlight: false
  },
  
  // Unlimited skips
  unlimitedSkips: {
    id: 'unlimited-skips',
    icon: 'SkipForward',
    titleKey: 'premium.benefits.unlimitedSkips.title',
    descriptionKey: 'premium.benefits.unlimitedSkips.description',
    highlight: false
  },
  
  // High-quality streaming
  streamingQuality: {
    id: 'streaming-quality',
    icon: 'Wifi',
    titleKey: 'premium.benefits.streamingQuality.title',
    descriptionKey: 'premium.benefits.streamingQuality.description',
    highlight: false
  },
  
  // Exclusive content
  exclusiveContent: {
    id: 'exclusive-content',
    icon: 'Star',
    titleKey: 'premium.benefits.exclusiveContent.title',
    descriptionKey: 'premium.benefits.exclusiveContent.description',
    highlight: false
  }
};

/**
 * Feature Comparison Data
 * Premium vs Free comparison table
 */
export const PREMIUM_COMPARISON = {
  features: [
    {
      id: 'audio-quality',
      featureKey: 'premium.comparison.audio_quality',
      freeValueKey: 'premium.comparison.free.standard',
      premiumValueKey: 'premium.comparison.premium.hifi',
      freeIcon: 'X',
      premiumIcon: 'Check'
    },
    {
      id: 'ads',
      featureKey: 'premium.comparison.ads',
      freeValueKey: 'premium.comparison.free.withAds',
      premiumValueKey: 'premium.comparison.premium.noAds',
      freeIcon: 'X',
      premiumIcon: 'Check'
    },
    {
      id: 'offline',
      featureKey: 'premium.comparison.offline',
      freeValueKey: 'premium.comparison.free.limited',
      premiumValueKey: 'premium.comparison.premium.unlimited',
      freeIcon: 'X',
      premiumIcon: 'Check'
    },
    {
      id: 'skips',
      featureKey: 'premium.comparison.skips',
      freeValueKey: 'premium.comparison.free.limited',
      premiumValueKey: 'premium.comparison.premium.unlimited',
      freeIcon: 'AlertCircle',
      premiumIcon: 'Check'
    },
    {
      id: 'on-demand',
      featureKey: 'premium.comparison.on_demand',
      freeValueKey: 'premium.comparison.free.shuffle',
      premiumValueKey: 'premium.comparison.premium.full',
      freeIcon: 'Shuffle',
      premiumIcon: 'Play'
    },
    {
      id: 'social',
      featureKey: 'premium.comparison.social',
      freeValueKey: 'premium.comparison.free.basic',
      premiumValueKey: 'premium.comparison.premium.full',
      freeIcon: 'Users',
      premiumIcon: 'Share2'
    }
  ]
};

/**
 * Pricing Plans
 * Available subscription options
 */
export const PREMIUM_PLANS = {
  monthly: {
    id: 'monthly',
    nameKey: 'premium.plans.monthly.name',
    price: 99000,
    currency: 'VND',
    periodKey: 'premium.plans.monthly.period',
    popular: false,
    badgeKey: null
  },
  yearly: {
    id: 'yearly',
    nameKey: 'premium.plans.yearly.name',
    price: 890000,
    currency: 'VND',
    periodKey: 'premium.plans.yearly.period',
    popular: true,
    badgeKey: 'premium.plans.yearly.badge',
    savings: '25%'
  },
  student: {
    id: 'student',
    nameKey: 'premium.plans.student.name',
    price: 49000,
    currency: 'VND',
    periodKey: 'premium.plans.student.period',
    popular: false,
    badgeKey: 'premium.plans.student.badge',
    eligibilityKey: 'premium.plans.student.eligibility'
  }
};

/**
 * Trust Badges
 * Social proof elements
 */
export const TRUST_BADGES = {
  users: {
    count: '10M+',
    labelKey: 'premium.trust.users'
  },
  rating: {
    score: '4.9',
    max: '5',
    labelKey: 'premium.trust.rating'
  },
  guarantee: {
    period: '30',
    labelKey: 'premium.trust.guarantee'
  }
};

/**
 * FAQ Items for Premium
 * Common questions and answers
 */
export const PREMIUM_FAQ = [
  {
    id: 'cancel',
    questionKey: 'premium.faq.cancel.question',
    answerKey: 'premium.faq.cancel.answer'
  },
  {
    id: 'devices',
    questionKey: 'premium.faq.devices.question',
    answerKey: 'premium.faq.devices.answer'
  },
  {
    id: 'offline-content',
    questionKey: 'premium.faq.offline.question',
    answerKey: 'premium.faq.offline.answer'
  },
  {
    id: 'family',
    questionKey: 'premium.faq.family.question',
    answerKey: 'premium.faq.family.answer'
  }
];

/**
 * Default export with all premium-related constants
 */
export default {
  PREMIUM_BENEFITS,
  PREMIUM_COMPARISON,
  PREMIUM_PLANS,
  TRUST_BADGES,
  PREMIUM_FAQ
};
