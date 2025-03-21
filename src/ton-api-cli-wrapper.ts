import { HttpClient, Api } from 'tonapi-sdk-js';
import chalk from 'chalk';
import dotenv from 'dotenv';

// Загружаем переменные окружения из .env файла
dotenv.config();

/**
 * Класс-обертка для автоматического создания CLI-команд на основе tonapi-sdk-js
 */
export class TonApiCliWrapper {
  private client: Api<unknown>;
  private network: string;

  /**
   * Создает экземпляр обертки для tonapi-sdk-js
   * @param options Опции инициализации
   */
  constructor(options: { testnet?: boolean; apiKey?: string } = {}) {
    // Определяем используемую сеть
    const isTestnet = options.testnet === true;
    this.network = isTestnet ? 'testnet' : 'mainnet';
    
    // Базовый URL API в зависимости от сети
    const baseUrl = isTestnet ? 'https://testnet.tonapi.io' : 'https://tonapi.io';
    console.log(chalk.blue(`Using ${this.network} network: ${baseUrl}`));
    
    // Получаем API-ключ из опций или переменных окружения
    const apiKey = options.apiKey || process.env.TON_API_KEY;
    
    // Проверяем наличие API-ключа
    if (!apiKey) {
      console.error(chalk.red('Ошибка: API-ключ не указан. Укажите его с помощью опции --api-key или установите переменную окружения TON_API_KEY'));
      throw new Error('API key is required');
    }
    
    // Создаем HTTP клиент с настройками
    const httpClient = new HttpClient({
      baseUrl,
      baseApiParams: {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    });
    
    // Инициализируем клиент API
    this.client = new Api(httpClient);
  }

  /**
   * Получает все доступные модули API
   */
  getApiModules(): string[] {
    // Получаем все ключи (модули) из API клиента, исключая служебные свойства и методы
    return Object.keys(this.client)
      .filter(key => 
        typeof (this.client as any)[key] === 'object' && 
        key !== 'http' && 
        !key.startsWith('_')
      );
  }

  /**
   * Получает все методы указанного модуля API
   * @param moduleName Название модуля API
   */
  getModuleMethods(moduleName: string): string[] {
    if (!this.hasModule(moduleName)) {
      return [];
    }
    
    // Получаем все методы модуля
    const module = (this.client as any)[moduleName];
    return Object.keys(module)
      .filter(key => typeof module[key] === 'function');
  }

  /**
   * Проверяет наличие указанного модуля в API
   * @param moduleName Название модуля
   */
  hasModule(moduleName: string): boolean {
    return this.getApiModules().includes(moduleName);
  }

  /**
   * Проверяет наличие указанного метода в модуле API
   * @param moduleName Название модуля
   * @param methodName Название метода
   */
  hasMethod(moduleName: string, methodName: string): boolean {
    return this.hasModule(moduleName) && 
           this.getModuleMethods(moduleName).includes(methodName);
  }

  /**
   * Вызывает метод API с указанными аргументами
   * @param moduleName Название модуля API
   * @param methodName Название метода API
   * @param args Аргументы для вызова метода
   */
  async callMethod(moduleName: string, methodName: string, ...args: any[]): Promise<any> {
    if (!this.hasMethod(moduleName, methodName)) {
      throw new Error(`Method ${methodName} not found in module ${moduleName}`);
    }
    
    try {
      // Получаем ссылку на модуль и метод
      const module = (this.client as any)[moduleName];
      const method = module[methodName];
      
      // Вызываем метод с переданными аргументами
      return await method.apply(module, args);
    } catch (error: any) {
      console.error(chalk.red(`Error calling ${moduleName}.${methodName}: ${error.message}`));
      throw error;
    }
  }

  /**
   * Получает экземпляр API клиента
   */
  getApiClient(): Api<unknown> {
    return this.client;
  }
  
  /**
   * Получает информацию о текущей сети
   */
  getNetwork(): string {
    return this.network;
  }
} 