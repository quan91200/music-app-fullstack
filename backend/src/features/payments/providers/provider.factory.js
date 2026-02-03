/**
 * @fileoverview Factory for payment providers.
 * @module features/payments/providers/provider.factory
 */

import paypalProvider from './paypal.provider.js';

class PaymentProviderFactory {
  constructor() {
    this.providers = {
      'paypal': paypalProvider,
      // 'vnpay': vnpayProvider, // Future
      // 'zalopay': zalopayProvider // Future
    };
  }

  /**
   * Get a provider instance by name.
   * @param {string} name - Provider name.
   * @returns {IPaymentProvider}
   */
  get(name) {
    const provider = this.providers[name.toLowerCase()];
    if (!provider) {
      throw new Error(`Payment provider '${name}' not supported`);
    }
    return provider;
  }
}

export default new PaymentProviderFactory();
