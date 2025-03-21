const fs = require('fs');
const path = require('path');
const { HttpClient, Api } = require('tonapi-sdk-js');

/**
 * Генератор JS файлов для модулей API
 */
class ApiModuleGenerator {
  constructor(options = {}) {
    // Инициализация API клиента
    const httpClient = new HttpClient({
      baseUrl: options.testnet ? 'https://testnet.tonapi.io' : 'https://tonapi.io',
      baseApiParams: {
        headers: options.apiKey ? {
          'Authorization': `Bearer ${options.apiKey}`,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        }
      }
    });
    
    this.client = new Api(httpClient);
    this.outputDir = options.outputDir || path.join(__dirname, '../src/api-modules');
    
    // Создаем директорию для выходных файлов, если она не существует
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Получает все доступные модули API
   */
  getApiModules() {
    return Object.keys(this.client)
      .filter(key => 
        typeof this.client[key] === 'object' && 
        key !== 'http' && 
        !key.startsWith('_')
      );
  }

  /**
   * Получает все методы указанного модуля API
   * @param {string} moduleName Название модуля API
   */
  getModuleMethods(moduleName) {
    if (!this.getApiModules().includes(moduleName)) {
      return [];
    }
    
    const module = this.client[moduleName];
    return Object.keys(module)
      .filter(key => typeof module[key] === 'function');
  }

  /**
   * Генерирует JS файл для указанного модуля
   * @param {string} moduleName Название модуля API
   */
  generateModuleFile(moduleName) {
    const methods = this.getModuleMethods(moduleName);
    
    if (methods.length === 0) {
      console.log(`Skipping module ${moduleName} - no methods found`);
      return;
    }
    
    console.log(`Generating JS file for module ${moduleName} with ${methods.length} methods...`);
    
    // Формируем содержимое файла
    let fileContent = `const { HttpClient, Api } = require('tonapi-sdk-js');
const chalk = require('chalk');
require('dotenv').config();

/**
 * API клиент для работы с модулем ${moduleName}
 */
class ${this.capitalize(moduleName)}Api {
  constructor(options = {}) {
    // Определяем используемую сеть
    const isTestnet = options.testnet === true;
    this.network = isTestnet ? 'testnet' : 'mainnet';
    
    // Базовый URL API в зависимости от сети
    const baseUrl = isTestnet ? 'https://testnet.tonapi.io' : 'https://tonapi.io';
    console.log(chalk.blue(\`Using \${this.network} network: \${baseUrl}\`));
    
    // Получаем API-ключ из опций или переменных окружения
    const apiKey = options.apiKey || process.env.TON_API_KEY;
    
    // Создаем HTTP клиент с настройками
    const httpClient = new HttpClient({
      baseUrl,
      baseApiParams: {
        headers: apiKey ? {
          'Authorization': \`Bearer \${apiKey}\`,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        }
      }
    });
    
    // Инициализируем клиент API
    this.client = new Api(httpClient);
  }

`;
    
    // Добавляем методы
    methods.forEach(methodName => {
      fileContent += this.generateMethodCode(moduleName, methodName);
    });
    
    // Завершаем класс и экспортируем его
    fileContent += `}

module.exports = { ${this.capitalize(moduleName)}Api };
`;
    
    // Сохраняем файл
    const fileName = path.join(this.outputDir, `${moduleName}-api.js`);
    fs.writeFileSync(fileName, fileContent);
    
    console.log(`Module ${moduleName} saved to ${fileName}`);
    
    return fileName;
  }

  /**
   * Генерирует код метода для класса API
   * @param {string} moduleName Название модуля API
   * @param {string} methodName Название метода
   */
  generateMethodCode(moduleName, methodName) {
    const methodNameCamel = this.toCamelCase(methodName);
    
    return `  /**
   * ${this.describeMethod(methodName)}
   * Вызывает метод ${moduleName}.${methodName} из tonapi-sdk-js
   */
  async ${methodNameCamel}(...args) {
    try {
      console.log(chalk.yellow(\`Calling ${moduleName}.${methodName}\`));
      const result = await this.client.${moduleName}.${methodName}(...args);
      return result;
    } catch (error) {
      console.error(chalk.red(\`Error in ${methodName}: \${error.message}\`));
      throw error;
    }
  }

`;
  }

  /**
   * Создает описание метода на основе его имени
   * @param {string} methodName Название метода
   */
  describeMethod(methodName) {
    // Преобразуем camelCase в слова
    const words = methodName.replace(/([A-Z])/g, ' $1').toLowerCase();
    // Преобразуем get в "Получает"
    if (methodName.startsWith('get')) {
      return `Получает ${words.replace(/^get /, '')}`;
    }
    // Для search
    if (methodName.startsWith('search')) {
      return `Ищет ${words.replace(/^search /, '')}`;
    }
    // Для других методов
    return words.charAt(0).toUpperCase() + words.slice(1);
  }

  /**
   * Преобразует строку в camelCase
   * @param {string} str Строка для преобразования
   */
  toCamelCase(str) {
    return str;
  }

  /**
   * Преобразует первую букву строки в верхний регистр
   * @param {string} str Строка для преобразования
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Генерирует JS файлы для всех модулей API
   */
  generateAllModuleFiles() {
    const modules = this.getApiModules();
    console.log(`Generating JS files for ${modules.length} API modules...`);
    
    const generatedFiles = modules.map(moduleName => this.generateModuleFile(moduleName));
    
    // Создаем индексный файл
    this.generateIndexFile(modules);
    
    return generatedFiles;
  }

  /**
   * Генерирует индексный файл для всех модулей API
   * @param {string[]} modules Список модулей
   */
  generateIndexFile(modules) {
    let indexContent = '';
    
    // Добавляем импорты
    modules.forEach(moduleName => {
      const capitalizedName = this.capitalize(moduleName);
      indexContent += `const { ${capitalizedName}Api } = require('./${moduleName}-api');\n`;
    });
    
    // Добавляем экспорт
    indexContent += '\nmodule.exports = {\n';
    modules.forEach(moduleName => {
      const capitalizedName = this.capitalize(moduleName);
      indexContent += `  ${capitalizedName}Api,\n`;
    });
    indexContent += '};\n';
    
    // Сохраняем файл
    const indexFile = path.join(this.outputDir, 'index.js');
    fs.writeFileSync(indexFile, indexContent);
    
    console.log(`Index file generated at ${indexFile}`);
    
    return indexFile;
  }
}

// Запускаем генератор при прямом вызове скрипта
if (require.main === module) {
  const generator = new ApiModuleGenerator();
  
  // Получаем модуль для генерации из аргументов командной строки
  const moduleName = process.argv[2];
  
  if (moduleName) {
    // Генерируем файл для указанного модуля
    generator.generateModuleFile(moduleName);
  } else {
    // Генерируем файлы для всех модулей
    generator.generateAllModuleFiles();
  }
}

module.exports = { ApiModuleGenerator }; 