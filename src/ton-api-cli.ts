#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { TonApiCliWrapper } from './ton-api-cli-wrapper';

/**
 * Автоматически генерирует CLI команды для tonapi-sdk-js
 */
class TonApiCli {
  private program: Command;
  private wrapper: TonApiCliWrapper;

  constructor() {
    this.program = new Command();
    
    // Настраиваем основную программу
    this.program
      .name('tonapi-cli')
      .description('CLI для работы с TON API')
      .version('1.0.0')
      .option('-t, --testnet', 'Использовать тестовую сеть вместо основной')
      .option('-k, --api-key <key>', 'API ключ для TON API')
      .hook('preAction', (thisCommand, actionCommand) => {
        // Пропускаем создание обертки с проверкой API-ключа для команды list
        const commandName = actionCommand.name();
        if (commandName === 'list') {
          return; // Для list используем уже созданный экземпляр с skipApiKeyCheck: true
        }
        
        // Создаем экземпляр обертки с учетом переданных опций для выполнения команды
        const options = thisCommand.opts();
        this.wrapper = new TonApiCliWrapper({
          testnet: options.testnet,
          apiKey: options.apiKey
        });
      });
    
    // Создаем экземпляр обертки API с пропуском проверки API-ключа только для генерации команд
    this.wrapper = new TonApiCliWrapper({ skipApiKeyCheck: true });
    
    // Генерируем команды для всех модулей API
    this.generateCommands();
  }

  /**
   * Генерирует команды для всех модулей API
   */
  private generateCommands() {
    // Получаем список всех модулей API
    const modules = this.wrapper.getApiModules();
    
    console.log(chalk.green(`Найдено ${modules.length} модулей API:`));
    
    // Для каждого модуля создаем подкоманду
    modules.forEach(moduleName => {
      const moduleCommand = this.program
        .command(moduleName)
        .description(`Методы модуля ${moduleName}`);
      
      // Получаем все методы модуля
      const methods = this.wrapper.getModuleMethods(moduleName);
      console.log(chalk.blue(`  - ${moduleName} (${methods.length} методов)`));
      
      // Для каждого метода создаем подкоманду модуля
      methods.forEach(methodName => {
        moduleCommand
          .command(methodName)
          .description(`Вызов метода ${moduleName}.${methodName}`)
          .option('-p, --params <json>', 'Параметры в формате JSON')
          .option('-a, --args <args...>', 'Аргументы через пробел')
          .action(async (options) => {
            try {
              let args: any[] = [];
              
              // Обрабатываем параметры
              if (options.params) {
                try {
                  const params = JSON.parse(options.params);
                  args.push(params);
                } catch (error) {
                  console.error(chalk.red(`Ошибка парсинга JSON параметров: ${error}`));
                  process.exit(1);
                }
              }
              
              // Добавляем позиционные аргументы, если они есть
              if (options.args && options.args.length > 0) {
                // Пытаемся преобразовать строковые аргументы в нужные типы (числа, булевы и т.д.)
                const parsedArgs = options.args.map((arg: string) => {
                  // Попытка распарсить JSON
                  try {
                    return JSON.parse(arg);
                  } catch {
                    // Если не получается - оставляем как строку
                    return arg;
                  }
                });
                
                args = args.concat(parsedArgs);
              }
              
              console.log(chalk.yellow(`Вызов ${moduleName}.${methodName} с аргументами:`), args);
              
              // Вызываем метод API
              const result = await this.wrapper.callMethod(moduleName, methodName, ...args);
              
              // Выводим результат
              console.log(chalk.green('Результат:'));
              console.log(JSON.stringify(result, null, 2));
            } catch (error: any) {
              console.error(chalk.red(`Ошибка: ${error.message}`));
              process.exit(1);
            }
          });
      });
    });
    
    // Добавляем команду для вывода всех доступных модулей и методов
    this.program
      .command('list')
      .description('Показать список всех доступных модулей и методов')
      .action(() => {
        const modules = this.wrapper.getApiModules();
        
        console.log(chalk.green(`Доступные модули и методы TON API:`));
        
        modules.forEach(moduleName => {
          console.log(chalk.blue(`\n${moduleName}`));
          
          const methods = this.wrapper.getModuleMethods(moduleName);
          methods.forEach(methodName => {
            console.log(chalk.yellow(`  - ${methodName}`));
          });
        });
      });
  }

  /**
   * Запускает CLI приложение
   */
  run() {
    this.program.parse(process.argv);
  }
}

// Создаем и запускаем CLI
const cli = new TonApiCli();
cli.run(); 