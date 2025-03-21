#!/usr/bin/env node
const { program } = require('commander');
const chalk = require('chalk');
const { AccountsApi } = require('./api-modules/accounts-api');
const dotenv = require('dotenv');

// Загружаем переменные окружения
dotenv.config();

// Создаем экземпляр клиента accounts API
let accountsApi = null;

// Настраиваем CLI
program
  .name('accounts-cli')
  .description('CLI для работы с аккаунтами TON через tonapi.io')
  .version('1.0.0')
  .option('-t, --testnet', 'Использовать тестовую сеть вместо основной')
  .option('-k, --api-key <key>', 'API ключ для TON API')
  .hook('preAction', (thisCommand) => {
    // Получаем опции
    const options = thisCommand.opts();
    
    // Получаем API-ключ из опций или из переменных окружения
    const apiKey = options.apiKey || process.env.TON_API_KEY;
    
    // Проверяем наличие API-ключа
    if (!apiKey) {
      console.error(chalk.red('Ошибка: API-ключ не указан. Укажите его с помощью опции -k или установите переменную окружения TON_API_KEY'));
      process.exit(1);
    }
    
    // Обновляем экземпляр API с учетом переданных опций
    accountsApi = new AccountsApi({
      testnet: options.testnet,
      apiKey: apiKey
    });
  });

// Команда для получения информации об аккаунте
program
  .command('info <address>')
  .description('Получить информацию об аккаунте')
  .action(async (address) => {
    try {
      console.log(chalk.blue(`Получение информации об аккаунте ${address}...`));
      const result = await accountsApi.getAccount(address);
      console.log(chalk.green('Результат:'));
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(chalk.red(`Ошибка: ${error.message}`));
      process.exit(1);
    }
  });

// Команда для получения событий аккаунта
program
  .command('events <address>')
  .description('Получить события аккаунта')
  .option('-l, --limit <number>', 'Лимит событий', '10')
  .action(async (address, options) => {
    try {
      const limit = parseInt(options.limit);
      console.log(chalk.blue(`Получение событий аккаунта ${address} (лимит: ${limit})...`));
      
      // Создаем объект параметров для вызова API
      const params = { limit };
      
      const result = await accountsApi.getAccountEvents(address, params);
      console.log(chalk.green('Результат:'));
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(chalk.red(`Ошибка: ${error.message}`));
      process.exit(1);
    }
  });

// Команда для поиска аккаунтов
program
  .command('search <query>')
  .description('Поиск аккаунтов')
  .option('-l, --limit <number>', 'Лимит результатов', '10')
  .action(async (query, options) => {
    try {
      const limit = parseInt(options.limit);
      console.log(chalk.blue(`Поиск аккаунтов по запросу "${query}" (лимит: ${limit})...`));
      
      // Создаем объект параметров для запроса
      // Используем параметр name вместо query согласно требованиям API
      const queryParams = { 
        name: query,
        limit
      };
      
      // Вызываем метод searchAccounts с правильными параметрами
      console.log(chalk.yellow('Вызываем метод searchAccounts...'));
      const result = await accountsApi.searchAccounts(queryParams);
      console.log(chalk.green('Результат:'));
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(chalk.red(`Ошибка: ${error.message || 'Неизвестная ошибка'}`));
      if (error.status) {
        console.error(chalk.red(`Статус ошибки: ${error.status}`));
      }
      if (error.response && error.response.data) {
        console.error(chalk.red('Детали ошибки:'), error.response.data);
      }
      process.exit(1);
    }
  });

// Команда для получения токенов аккаунта
program
  .command('jettons <address>')
  .description('Получить список токенов аккаунта')
  .action(async (address) => {
    try {
      console.log(chalk.blue(`Получение токенов аккаунта ${address}...`));
      const result = await accountsApi.getAccountJettonsBalances(address);
      console.log(chalk.green('Результат:'));
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(chalk.red(`Ошибка: ${error.message}`));
      process.exit(1);
    }
  });

// Команда для получения NFT аккаунта
program
  .command('nft <address>')
  .description('Получить список NFT аккаунта')
  .option('-l, --limit <number>', 'Лимит результатов', '10')
  .action(async (address, options) => {
    try {
      const limit = parseInt(options.limit);
      console.log(chalk.blue(`Получение NFT аккаунта ${address} (лимит: ${limit})...`));
      
      // Создаем объект параметров для вызова API
      const params = { limit };
      
      const result = await accountsApi.getAccountNftItems(address, params);
      console.log(chalk.green('Результат:'));
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(chalk.red(`Ошибка: ${error.message}`));
      process.exit(1);
    }
  });

// Запускаем программу
program.parse(process.argv); 