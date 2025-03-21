#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { TonApiCliWrapper } from './ton-api-cli-wrapper';

/**
 * Генератор тестов для методов TON API
 */
class ApiTestGenerator {
  private wrapper: TonApiCliWrapper;
  private testsDir: string;

  constructor(options: { testnet?: boolean; apiKey?: string; testsDir?: string } = {}) {
    this.wrapper = new TonApiCliWrapper({
      testnet: options.testnet,
      apiKey: options.apiKey
    });
    
    // Директория для сохранения тестов
    this.testsDir = options.testsDir || path.join(__dirname, '../__tests__');
    
    // Создаем директорию для тестов, если она не существует
    if (!fs.existsSync(this.testsDir)) {
      fs.mkdirSync(this.testsDir, { recursive: true });
    }
  }

  /**
   * Генерирует тесты для всех методов API
   */
  async generateTests() {
    // Получаем все модули API
    const modules = this.wrapper.getApiModules();
    
    console.log(`Generating tests for ${modules.length} API modules...`);
    
    // Для каждого модуля создаем отдельный файл с тестами
    for (const moduleName of modules) {
      await this.generateModuleTests(moduleName);
    }
    
    console.log('Test generation completed!');
  }

  /**
   * Генерирует тесты для методов указанного модуля
   * @param moduleName Название модуля
   */
  async generateModuleTests(moduleName: string) {
    // Получаем методы модуля
    const methods = this.wrapper.getModuleMethods(moduleName);
    
    if (methods.length === 0) {
      console.log(`Skipping module ${moduleName} - no methods found`);
      return;
    }
    
    console.log(`Generating tests for module ${moduleName} with ${methods.length} methods...`);
    
    // Создаем содержимое файла с тестами
    let testContent = this.generateTestFileHeader(moduleName);
    
    // Добавляем тесты для каждого метода
    for (const methodName of methods) {
      testContent += this.generateMethodTest(moduleName, methodName);
    }
    
    // Завершаем файл
    testContent += '});\n';
    
    // Сохраняем файл с тестами
    const testFileName = path.join(this.testsDir, `${moduleName}.test.ts`);
    fs.writeFileSync(testFileName, testContent);
    
    console.log(`Tests for module ${moduleName} saved to ${testFileName}`);
  }

  /**
   * Генерирует заголовок файла с тестами
   * @param moduleName Название модуля
   */
  private generateTestFileHeader(moduleName: string): string {
    return `import { TonApiCliWrapper } from '../src/ton-api-cli-wrapper';

describe('${moduleName} module', () => {
  // Создаем экземпляр API клиента для тестов
  const apiWrapper = new TonApiCliWrapper({
    testnet: true // Используем тестовую сеть для тестов
  });
  
  // Увеличиваем таймаут для тестов с API запросами
  jest.setTimeout(15000);
  
`;
  }

  /**
   * Генерирует тест для указанного метода
   * @param moduleName Название модуля
   * @param methodName Название метода
   */
  private generateMethodTest(moduleName: string, methodName: string): string {
    // Генерируем заглушку для тестовых данных
    const testData = this.generateTestData(moduleName, methodName);
    
    return `  test('${methodName} should not throw an error', async () => {
    try {
      // Готовим параметры для вызова метода
${testData.paramSetup}
      
      // Вызываем тестируемый метод
      const result = await apiWrapper.callMethod('${moduleName}', '${methodName}'${testData.params});
      
      // Проверяем, что результат не undefined
      expect(result).toBeDefined();
      
      // Дополнительные проверки результата
${testData.assertions}
    } catch (error) {
      // Если тест не проходит из-за отсутствия доступа к API или ошибки в параметрах,
      // можно временно пропустить тест, раскомментировав следующую строку
      // console.log('Skipping test due to API error:', error);
      // return;
      
      // В обычном режиме пробрасываем ошибку
      throw error;
    }
  });
  
`;
  }

  /**
   * Генерирует тестовые данные для метода
   * @param moduleName Название модуля
   * @param methodName Название метода
   */
  private generateTestData(moduleName: string, methodName: string): { paramSetup: string; params: string; assertions: string } {
    // Здесь можно добавить специальные кейсы для известных методов
    
    // Для методов, работающих с аккаунтами
    if (moduleName === 'accounts') {
      if (methodName === 'getAccount' || methodName === 'getAccountEvents') {
        return {
          paramSetup: '      const testAccountAddress = "0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365"; // Тестовый адрес',
          params: ', testAccountAddress',
          assertions: '      // Проверяем наличие данных в ответе\n      if (Array.isArray(result)) {\n        expect(result.length).toBeGreaterThanOrEqual(0);\n      } else {\n        expect(result).toBeTruthy();\n      }'
        };
      }
    }
    
    // Для методов, работающих с блокчейном
    if (moduleName === 'blockchain') {
      if (methodName.includes('Block') || methodName.includes('Blocks')) {
        return {
          paramSetup: '      // Без специальных параметров',
          params: '',
          assertions: '      // Проверяем наличие данных в ответе\n      if (Array.isArray(result)) {\n        expect(result.length).toBeGreaterThanOrEqual(0);\n      } else {\n        expect(result).toBeTruthy();\n      }'
        };
      }
    }
    
    // Для других методов используем шаблон по умолчанию
    return {
      paramSetup: '      // Параметры для вызова метода\n      // Замените этот комментарий на реальные параметры, если метод их требует',
      params: '',
      assertions: '      // Дополнительные проверки результата\n      // Замените этот комментарий на реальные проверки, специфичные для данного метода'
    };
  }
}

// Запускаем генератор тестов при прямом вызове скрипта
if (require.main === module) {
  const generator = new ApiTestGenerator();
  generator.generateTests()
    .then(() => console.log('Test generation completed successfully'))
    .catch(error => console.error('Error generating tests:', error));
}

export { ApiTestGenerator }; 