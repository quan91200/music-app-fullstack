import React, {
  useState,
  useEffect
} from 'react'

import { useTranslation } from 'react-i18next'

import PaypalButton from '@components/payment/PaypalButton'

import {
  getCurrentSubscription
} from '@services/payment/payment.service'

import {
  Check,
  X,
  Headphones,
  VolumeX,
  Download,
  SkipForward,
  Wifi,
  Star,
  AlertCircle,
  Shuffle,
  Play,
  Users,
  Share2,
  ChevronDown,
  ChevronUp,
  Crown,
  Sparkles
} from 'lucide-react'

import {
  PREMIUM_BENEFITS,
  PREMIUM_COMPARISON,
  PREMIUM_PLANS,
  TRUST_BADGES,
  PREMIUM_FAQ
} from '@constants/premium.constants'

import Button from '@mui/material/Button'

/**
 * Icon mapping for benefits and comparison
 */
const iconMap = {
  Headphones,
  VolumeX,
  Download,
  SkipForward,
  Wifi,
  Star,
  Check,
  X,
  AlertCircle,
  Shuffle,
  Play,
  Users,
  Share2,
  Crown,
  Sparkles
}

/**
 * Get translated array from object values
 * @param {Object} obj - Object with translation keys
 * @param {Function} t - Translation function
 * @returns {Array} Array of translated items
 */
const getTranslatedArray = (obj, t) => {
  return Object.values(obj).map(item => ({
    ...item,
    title: item.titleKey ? t(item.titleKey) : '',
    description: item.descriptionKey ? t(item.descriptionKey) : '',
    name: item.nameKey ? t(item.nameKey) : '',
    period: item.periodKey ? t(item.periodKey) : '',
    badge: item.badgeKey ? t(item.badgeKey) : null,
    feature: item.featureKey ? t(item.featureKey) : '',
    freeValue: item.freeValueKey ? t(item.freeValueKey) : '',
    premiumValue: item.premiumValueKey ? t(item.premiumValueKey) : ''
  }))
}


const PremiumPage = () => {
  const { t, i18n } = useTranslation()
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState('premium')
  const [currentSubscription, setCurrentSubscription] = useState(null)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await getCurrentSubscription();
        if (response.success) {
          setCurrentSubscription(response.data);
          setSelectedPlan(response.data.plan || 'premium');
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      }
    };
    fetchSubscription();
  }, []);

  const benefits = getTranslatedArray(PREMIUM_BENEFITS, t)
  const comparison = getTranslatedArray(PREMIUM_COMPARISON.features, t)
  const plans = getTranslatedArray(PREMIUM_PLANS, t)
  const faq = PREMIUM_FAQ.map(item => ({
    ...item,
    question: t(item.questionKey),
    answer: t(item.answerKey)
  }))

  const handleApproval = (data) => {
    setCurrentSubscription(data);
  }

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  const renderIcon = (iconName, className = '') => {
    const Icon = iconMap[iconName]
    return Icon ? <Icon className={className} size={20} /> : null
  }

  const formatPrice = (price) => {
    const localeMap = {
      vi: 'vi-VN',
      en: 'en-US',
      de: 'de-DE',
      es: 'es-ES',
      fr: 'fr-FR',
      ja: 'ja-JP',
      ko: 'ko-KR',
      zh: 'zh-CN'
    }
    const locale = localeMap[i18n.language] || 'en-US'
    return price.toLocaleString(locale)
  }

  return (
    <div className="premium-page">
      {/* ... Hero Section (unchanged) ... */}
      <section className="premium-hero">
        <div className="premium-hero-content">
          <div className="premium-badge">
            <Crown size={24} />
            <span>{t('premium.badge')}</span>
          </div>
          <h1 className="premium-title">{t('premium.hero.title')}</h1>
          <p className="premium-subtitle">{t('premium.hero.subtitle')}</p>

          <div className="trust-badges">
            <div className="trust-badge">
              <span className="trust-count">{TRUST_BADGES.users.count}</span>
              <span className="trust-label">{t(TRUST_BADGES.users.labelKey)}</span>
            </div>
            <div className="trust-divider" />
            <div className="trust-badge">
              <span className="trust-count">{TRUST_BADGES.rating.score}</span>
              <span className="trust-label">{t(TRUST_BADGES.rating.labelKey)}</span>
            </div>
            <div className="trust-divider" />
            <div className="trust-badge">
              <span className="trust-count">{TRUST_BADGES.guarantee.period}</span>
              <span className="trust-label">{t(TRUST_BADGES.guarantee.labelKey)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="premium-benefits">
        <h2 className="section-title">{t('premium.benefits.title')}</h2>
        <div className="benefits-grid">
          {benefits.map(benefit => (
            <div
              key={benefit.id}
              className={`benefit-card ${benefit.highlight ? 'highlight' : ''}`}
            >
              <div className="benefit-icon">
                {renderIcon(benefit.icon)}
              </div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="premium-comparison">
        <h2 className="section-title">{t('premium.comparison.title')}</h2>
        <div className="comparison-table">
          <div className="comparison-header">
            <div className="comparison-cell feature-header" />
            <div className="comparison-cell plan-header free">
              <span className="plan-name">{t('premium.comparison.free.title')}</span>
            </div>
            <div className="comparison-cell plan-header premium">
              <span className="plan-name">{t('premium.comparison.premium.title')}</span>
              <Sparkles size={16} className="premium-sparkle" />
            </div>
          </div>

          {comparison.map(item => (
            <div key={item.id} className="comparison-row">
              <div className="comparison-cell feature-name">
                {item.feature}
              </div>
              <div className="comparison-cell plan-cell free">
                {renderIcon(item.freeIcon, 'free-icon')}
                <span>{item.freeValue}</span>
              </div>
              <div className="comparison-cell plan-cell premium">
                {renderIcon(item.premiumIcon, 'premium-icon')}
                <span>{item.premiumValue}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="premium-pricing">
        <h2 className="section-title">{t('premium.pricing.title')}</h2>
        <p className="section-subtitle">{t('premium.pricing.subtitle')}</p>

        <div className="pricing-plans">
          {plans.map(plan => {
            const isCurrentPlan = currentSubscription?.plan === plan.id;

            return (
              <div
                key={plan.id}
                className={`plan-card ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.id ? 'selected' : ''} ${isCurrentPlan ? 'is-active' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.badge && (
                  <div className="plan-badge">{plan.badge}</div>
                )}
                {isCurrentPlan && (
                  <div className="current-plan-badge">{t('premium.plans.current')}</div>
                )}
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  <span className="price-amount">
                    {formatPrice(plan.price, plan.currency)}
                  </span>
                  <span className="price-currency">{plan.currency}</span>
                </div>
                <span className="plan-period">/{plan.period}</span>
                {plan.savings && (
                  <span className="plan-savings">
                    {t('premium.plans.savings', { percent: plan.savings })}
                  </span>
                )}
                {plan.eligibilityKey && (
                  <span className="plan-eligibility">{t(plan.eligibilityKey)}</span>
                )}

                <div className="plan-action-container">
                  {isCurrentPlan ? (
                    <Button variant="outlined" color="success" fullWidth disabled>
                      {t('premium.cta.active')}
                    </Button>
                  ) : (
                    <PaypalButton
                      plan={plan}
                      onApproval={handleApproval}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="premium-faq">
        <h2 className="section-title">{t('premium.faq.title')}</h2>
        <div className="faq-list">
          {faq.map(item => (
            <div
              key={item.id}
              className={`faq-item ${expandedFaq === item.id ? 'expanded' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFaq(item.id)}
              >
                <span>{item.question}</span>
                {expandedFaq === item.id ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              {expandedFaq === item.id && (
                <div className="faq-answer">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </section>


    </div>
  )
}

export default PremiumPage
