#!/usr/bin/env node

import { spawn } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Получаем текущую директорию для ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Путь к серверу
const serverPath = join(__dirname, 'bin', 'ton-api-mcp-server.js');

// Функция для запуска и проверки API
async function testApi() {
  return new Promise((resolve, reject) => {
    console.log(`Запуск сервера: ${serverPath}`);
    
    // Запускаем процесс сервера
    const server = spawn('node', [serverPath, '--api-key', process.env.TON_API_KEY], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let serverOutput = '';
    let errorOutput = '';
    
    // Обработка стандартного вывода
    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('STDOUT:', output);
      serverOutput += output;
      
      // Проверяем, содержит ли ответ JSON
      if (output.includes('{') && output.includes('}')) {
        try {
          const jsonStart = output.indexOf('{');
          const jsonText = output.substring(jsonStart);
          const response = JSON.parse(jsonText);
          
          console.log('Получен ответ от TON API:');
          console.log(JSON.stringify(response, null, 2));
          
          // Завершаем сервер
          server.kill();
          resolve(response);
        } catch (e) {
          console.error('Ошибка при разборе JSON:', e);
        }
      }
    });
    
    // Обработка ошибок
    server.stderr.on('data', (data) => {
      const error = data.toString();
      errorOutput += error;
      console.error('STDERR:', error);
    });
    
    // Обработка завершения процесса
    server.on('close', (code) => {
      if (code !== 0) {
        console.error(`Сервер завершился с кодом ${code}`);
        console.error('Ошибки сервера:', errorOutput);
        reject(new Error(`Процесс завершился с кодом ${code}`));
      } else {
        console.log('Сервер успешно завершил работу');
        resolve();
      }
    });
    
    // Правильный формат запроса для MCP
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',  // Используем правильный MCP метод для получения списка доступных инструментов
      params: {}
    };
    
    console.log('Отправка запроса:', JSON.stringify(request));
    
    // Пишем запрос в stdin сервера
    server.stdin.write(JSON.stringify(request) + '\n');
    server.stdin.end();
    
    // Устанавливаем таймаут на выполнение
    setTimeout(() => {
      console.log('Таймаут: принудительное завершение сервера');
      server.kill();
      reject(new Error('Таймаут при выполнении запроса'));
    }, 10000); // 10 секунд
  });
}

// Тест для вызова конкретного метода
async function testCallMethod() {
  return new Promise((resolve, reject) => {
    console.log(`Запуск сервера для вызова метода: ${serverPath}`);
    
    // Запускаем процесс сервера
    const server = spawn('node', [serverPath, '--api-key', process.env.TON_API_KEY], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let serverOutput = '';
    let errorOutput = '';
    
    // Обработка стандартного вывода
    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('STDOUT:', output);
      serverOutput += output;
      
      // Проверяем, содержит ли ответ JSON
      if (output.includes('{') && output.includes('}')) {
        try {
          const jsonStart = output.indexOf('{');
          const jsonText = output.substring(jsonStart);
          const response = JSON.parse(jsonText);
          
          console.log('Получен ответ при вызове метода:');
          console.log(JSON.stringify(response, null, 2));
          
          // Завершаем сервер
          server.kill();
          resolve(response);
        } catch (e) {
          console.error('Ошибка при разборе JSON:', e);
        }
      }
    });
    
    // Обработка ошибок
    server.stderr.on('data', (data) => {
      const error = data.toString();
      errorOutput += error;
      console.error('STDERR:', error);
    });
    
    // Обработка завершения процесса
    server.on('close', (code) => {
      if (code !== 0) {
        console.error(`Сервер завершился с кодом ${code}`);
        console.error('Ошибки сервера:', errorOutput);
        reject(new Error(`Процесс завершился с кодом ${code}`));
      } else {
        console.log('Сервер успешно завершил работу');
        resolve();
      }
    });
    
    // Правильный формат запроса для вызова MCP метода
    const request = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',  // Метод MCP для вызова инструмента
      params: {
        name: 'list_modules',  // Имя инструмента
        arguments: {}  // Аргументы инструмента
      }
    };
    
    console.log('Отправка запроса для вызова метода:', JSON.stringify(request));
    
    // Пишем запрос в stdin сервера
    server.stdin.write(JSON.stringify(request) + '\n');
    server.stdin.end();
    
    // Устанавливаем таймаут на выполнение
    setTimeout(() => {
      console.log('Таймаут: принудительное завершение сервера');
      server.kill();
      reject(new Error('Таймаут при выполнении запроса'));
    }, 10000); // 10 секунд
  });
}

// Запускаем тесты
console.log('Запуск тестов API...');

// Сначала получаем список инструментов
testApi()
  .then(() => {
    console.log('Первый тест завершен, запускаем вызов метода...');
    // Затем вызываем конкретный метод
    return testCallMethod();
  })
  .then((result) => {
    console.log('Все тесты завершены успешно');
    if (result) {
      console.log('Итоговый результат:', result);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('Ошибка при выполнении тестов:', error);
    process.exit(1);
  }); 