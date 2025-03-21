const { HttpClient, Api } = require('tonapi-sdk-js');
const chalk = require('chalk');
require('dotenv').config();

/**
 * API клиент для работы с модулем accounts
 */
class AccountsApi {
  constructor(options = {}) {
    // Определяем используемую сеть
    const isTestnet = options.testnet === true;
    this.network = isTestnet ? 'testnet' : 'mainnet';
    
    // Базовый URL API в зависимости от сети
    const baseUrl = isTestnet ? 'https://testnet.tonapi.io' : 'https://tonapi.io';
    console.log(chalk.blue(`Using ${this.network} network: ${baseUrl}`));
    
    // Получаем API-ключ из опций или переменных окружения
    const apiKey = options.apiKey || process.env.TON_API_KEY;
    
    // Создаем HTTP клиент с настройками
    const httpClient = new HttpClient({
      baseUrl,
      baseApiParams: {
        headers: apiKey ? {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        }
      }
    });
    
    // Инициализируем клиент API
    this.client = new Api(httpClient);
  }

  /**
   * Получает accounts
   * Вызывает метод accounts.getAccounts из tonapi-sdk-js
   */
  async getAccounts(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.getAccounts`));
      const result = await this.client.accounts.getAccounts(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in getAccounts: ${error.message}`));
      throw error;
    }
  }

  /**
   * Получает account
   * Вызывает метод accounts.getAccount из tonapi-sdk-js
   */
  async getAccount(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.getAccount`));
      const result = await this.client.accounts.getAccount(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in getAccount: ${error.message}`));
      throw error;
    }
  }

  /**
   * Account dns back resolve
   * Вызывает метод accounts.accountDnsBackResolve из tonapi-sdk-js
   */
  async accountDnsBackResolve(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.accountDnsBackResolve`));
      const result = await this.client.accounts.accountDnsBackResolve(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in accountDnsBackResolve: ${error.message}`));
      throw error;
    }
  }

  /**
   * Получает account jettons balances
   * Вызывает метод accounts.getAccountJettonsBalances из tonapi-sdk-js
   */
  async getAccountJettonsBalances(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.getAccountJettonsBalances`));
      const result = await this.client.accounts.getAccountJettonsBalances(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in getAccountJettonsBalances: ${error.message}`));
      throw error;
    }
  }

  /**
   * Получает account jetton balance
   * Вызывает метод accounts.getAccountJettonBalance из tonapi-sdk-js
   */
  async getAccountJettonBalance(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.getAccountJettonBalance`));
      const result = await this.client.accounts.getAccountJettonBalance(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in getAccountJettonBalance: ${error.message}`));
      throw error;
    }
  }

  /**
   * Получает account jettons history
   * Вызывает метод accounts.getAccountJettonsHistory из tonapi-sdk-js
   */
  async getAccountJettonsHistory(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.getAccountJettonsHistory`));
      const result = await this.client.accounts.getAccountJettonsHistory(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in getAccountJettonsHistory: ${error.message}`));
      throw error;
    }
  }

  /**
   * Получает account jetton history by id
   * Вызывает метод accounts.getAccountJettonHistoryById из tonapi-sdk-js
   */
  async getAccountJettonHistoryById(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.getAccountJettonHistoryById`));
      const result = await this.client.accounts.getAccountJettonHistoryById(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in getAccountJettonHistoryById: ${error.message}`));
      throw error;
    }
  }

  /**
   * Получает account nft items
   * Вызывает метод accounts.getAccountNftItems из tonapi-sdk-js
   */
  async getAccountNftItems(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.getAccountNftItems`));
      const result = await this.client.accounts.getAccountNftItems(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in getAccountNftItems: ${error.message}`));
      throw error;
    }
  }

  /**
   * Получает account events
   * Вызывает метод accounts.getAccountEvents из tonapi-sdk-js
   */
  async getAccountEvents(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.getAccountEvents`));
      const result = await this.client.accounts.getAccountEvents(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in getAccountEvents: ${error.message}`));
      throw error;
    }
  }

  /**
   * Получает account event
   * Вызывает метод accounts.getAccountEvent из tonapi-sdk-js
   */
  async getAccountEvent(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.getAccountEvent`));
      const result = await this.client.accounts.getAccountEvent(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in getAccountEvent: ${error.message}`));
      throw error;
    }
  }

  /**
   * Получает account traces
   * Вызывает метод accounts.getAccountTraces из tonapi-sdk-js
   */
  async getAccountTraces(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.getAccountTraces`));
      const result = await this.client.accounts.getAccountTraces(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in getAccountTraces: ${error.message}`));
      throw error;
    }
  }

  /**
   * Получает account subscriptions
   * Вызывает метод accounts.getAccountSubscriptions из tonapi-sdk-js
   */
  async getAccountSubscriptions(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.getAccountSubscriptions`));
      const result = await this.client.accounts.getAccountSubscriptions(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in getAccountSubscriptions: ${error.message}`));
      throw error;
    }
  }

  /**
   * Reindex account
   * Вызывает метод accounts.reindexAccount из tonapi-sdk-js
   */
  async reindexAccount(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.reindexAccount`));
      const result = await this.client.accounts.reindexAccount(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in reindexAccount: ${error.message}`));
      throw error;
    }
  }

  /**
   * Ищет accounts
   * Вызывает метод accounts.searchAccounts из tonapi-sdk-js
   */
  async searchAccounts(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.searchAccounts`));
      const result = await this.client.accounts.searchAccounts(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in searchAccounts: ${error.message}`));
      throw error;
    }
  }

  /**
   * Получает account dns expiring
   * Вызывает метод accounts.getAccountDnsExpiring из tonapi-sdk-js
   */
  async getAccountDnsExpiring(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.getAccountDnsExpiring`));
      const result = await this.client.accounts.getAccountDnsExpiring(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in getAccountDnsExpiring: ${error.message}`));
      throw error;
    }
  }

  /**
   * Получает account public key
   * Вызывает метод accounts.getAccountPublicKey из tonapi-sdk-js
   */
  async getAccountPublicKey(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.getAccountPublicKey`));
      const result = await this.client.accounts.getAccountPublicKey(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in getAccountPublicKey: ${error.message}`));
      throw error;
    }
  }

  /**
   * Получает account multisigs
   * Вызывает метод accounts.getAccountMultisigs из tonapi-sdk-js
   */
  async getAccountMultisigs(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.getAccountMultisigs`));
      const result = await this.client.accounts.getAccountMultisigs(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in getAccountMultisigs: ${error.message}`));
      throw error;
    }
  }

  /**
   * Получает account diff
   * Вызывает метод accounts.getAccountDiff из tonapi-sdk-js
   */
  async getAccountDiff(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.getAccountDiff`));
      const result = await this.client.accounts.getAccountDiff(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in getAccountDiff: ${error.message}`));
      throw error;
    }
  }

  /**
   * Получает account extra currency history by id
   * Вызывает метод accounts.getAccountExtraCurrencyHistoryById из tonapi-sdk-js
   */
  async getAccountExtraCurrencyHistoryById(...args) {
    try {
      console.log(chalk.yellow(`Calling accounts.getAccountExtraCurrencyHistoryById`));
      const result = await this.client.accounts.getAccountExtraCurrencyHistoryById(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(`Error in getAccountExtraCurrencyHistoryById: ${error.message}`));
      throw error;
    }
  }

}

module.exports = { AccountsApi };
