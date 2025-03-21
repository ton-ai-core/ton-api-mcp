const { HttpClient, Api } = require('tonapi-sdk-js');
const chalk = require('chalk');
const dotenv = require('dotenv');

// Загружаем переменные окружения
dotenv.config();

// Тестирование API клиента
async function testApi() {
  try {
    // Получаем API-ключ из переменных окружения
    const apiKey = process.env.TON_API_KEY;
    
    // Проверяем наличие API-ключа
    if (!apiKey) {
      console.error(chalk.red('Ошибка: API-ключ не указан. Установите переменную окружения TON_API_KEY'));
      process.exit(1);
    }
    
    // Базовый URL API
    const baseUrl = 'https://testnet.tonapi.io'; // Используем тестовую сеть
    console.log(chalk.blue(`Using API: ${baseUrl}`));
    console.log(chalk.blue(`Using API Key: ${apiKey.substring(0, 10)}...`));
    
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
    const client = new Api(httpClient);
    
    // Получаем информацию об аккаунте
    console.log(chalk.yellow('Тест #1: Получение информации об аккаунте'));
    try {
      const accountResult = await client.accounts.getAccount('0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365');
      console.log(chalk.green('  Успешно!'));
      console.log(chalk.blue('  Баланс аккаунта:'), accountResult.balance);
    } catch (error) {
      console.error(chalk.red(`  Ошибка: ${error.message}`));
    }
    
    // Поиск аккаунтов
    console.log(chalk.yellow('Тест #2: Поиск аккаунтов (метод searchAccounts)'));
    try {
      // Обновленный формат параметров с required полем name
      const searchParams = { name: 'ton', limit: 2 };
      console.log(chalk.blue('  Параметры поиска:'), searchParams);
      const searchResult = await client.accounts.searchAccounts(searchParams);
      console.log(chalk.green('  Успешно!'));
      console.log(JSON.stringify(searchResult, null, 2));
    } catch (error) {
      console.error(chalk.red(`  Ошибка: ${error.message || 'Неизвестная ошибка'}`));
      if (error.status) {
        console.error(chalk.red(`  Статус ошибки: ${error.status}`));
      }
      if (error.response && error.response.data) {
        console.error(chalk.red('  Детали ошибки:'), error.response.data);
      } else {
        console.error(chalk.red('  Полная ошибка:'), error);
      }
    }
    
    // Проверка версии API
    console.log(chalk.yellow('Тест #3: Получение списка методов accounts'));
    try {
      console.log('  Доступные методы accounts:');
      console.log('  - ' + Object.keys(client.accounts).filter(key => typeof client.accounts[key] === 'function').join('\n  - '));
    } catch (error) {
      console.error(chalk.red(`  Ошибка: ${error.message}`));
    }
    
  } catch (error) {
    console.error(chalk.red(`Глобальная ошибка: ${error.message}`));
  }
}

// Запускаем тестирование API
testApi(); 