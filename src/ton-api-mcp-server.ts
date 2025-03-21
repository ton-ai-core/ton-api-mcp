#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express, { Request, Response } from "express";
import { TonApiCliWrapper } from "./ton-api-cli-wrapper";
import { z } from "zod";
import chalk from "chalk";

// Определение интерфейса параметров для методов API
interface ApiParams {
  [key: string]: any;
}

/**
 * MCP сервер для TON API
 * Предоставляет доступ к функциям TON API через Model Context Protocol
 */
export class TonApiMcpServer {
  private wrapper: TonApiCliWrapper;
  private server: McpServer;
  private demoMode: boolean;

  /**
   * Создает экземпляр MCP сервера для TON API
   * @param options Параметры инициализации
   */
  constructor(options: { testnet?: boolean; apiKey?: string; skipApiKeyCheck?: boolean } = {}) {
    console.log(chalk.green('Initializing TON API MCP Server...'));
    
    this.demoMode = options.skipApiKeyCheck === true;
    
    // Создаем экземпляр обертки для TON API
    this.wrapper = new TonApiCliWrapper({
      testnet: options.testnet,
      apiKey: options.apiKey,
      skipApiKeyCheck: options.skipApiKeyCheck
    });
    
    // Создаем MCP сервер
    this.server = new McpServer({
      name: "TON API",
      version: "1.0.0",
      description: "MCP Server for TON API - The Open Network Blockchain API"
    });
    
    // Регистрируем инструменты и ресурсы
    this.registerTools();
    this.registerResources();
    
    if (this.demoMode) {
      console.log(chalk.yellow('Running in DEMO mode. API requests requiring authentication will not work.'));
      console.log(chalk.yellow('To enable full functionality, provide an API key using --api-key option or set the TON_API_KEY environment variable.'));
    }
  }

  /**
   * Регистрирует все доступные методы API как инструменты MCP
   */
  private registerTools() {
    const modules = this.wrapper.getApiModules();
    
    modules.forEach(moduleName => {
      const methods = this.wrapper.getModuleMethods(moduleName);
      
      methods.forEach(methodName => {
        // Получаем описание и сигнатуру метода
        const description = this.wrapper.getMethodDescription(moduleName, methodName) || 
                           `Call ${moduleName}.${methodName} method`;
        
        // Регистрируем метод как инструмент MCP
        this.server.tool(
          `${moduleName}_${methodName}`,
          description,
          { params: z.record(z.any()).optional() },
          async ({ params }: { params?: ApiParams }) => {
            try {
              console.log(chalk.blue(`Calling ${moduleName}.${methodName} with params:`), params);
              
              if (this.demoMode) {
                console.log(chalk.yellow('DEMO MODE: This API call may require authentication.'));
              }
              
              // Вызываем метод API
              const result = await this.wrapper.callMethod(moduleName, methodName, params || {});
              
              // Форматируем результат
              let resultText = JSON.stringify(result, null, 2);
              
              return {
                content: [
                  { type: "text", text: resultText }
                ]
              };
            } catch (error: any) {
              console.error(chalk.red(`Error calling ${moduleName}.${methodName}: ${error.message}`));
              return {
                content: [
                  { type: "text", text: `Error: ${error.message}` }
                ]
              };
            }
          }
        );
      });
    });
    
    // Добавляем специальный инструмент для получения информации о текущей сети
    this.server.tool(
      "get_network_info",
      "Get information about the current network (mainnet or testnet)",
      {},
      async () => {
        const network = this.wrapper.getNetwork();
        return {
          content: [
            { type: "text", text: `Current network: ${network}` }
          ]
        };
      }
    );
    
    console.log(chalk.green(`Registered ${modules.length} modules with their methods as MCP tools`));
  }

  /**
   * Регистрирует ресурсы MCP
   */
  private registerResources() {
    // Регистрируем ресурс для получения списка всех методов API
    this.server.resource(
      "api-methods",
      "ton-api://methods",
      async (uri) => {
        const modules = this.wrapper.getApiModules();
        let content = "# TON API Methods\n\n";
        
        if (this.demoMode) {
          content += "> **Note:** Running in DEMO mode. API requests requiring authentication will not work.\n\n";
        }
        
        modules.forEach(moduleName => {
          content += `## ${moduleName}\n\n`;
          
          const methods = this.wrapper.getModuleMethods(moduleName);
          methods.forEach(methodName => {
            const description = this.wrapper.getMethodDescription(moduleName, methodName);
            const signature = this.wrapper.getMethodSignature(moduleName, methodName);
            
            content += `### ${methodName}\n`;
            if (description) content += `Description: ${description}\n`;
            if (signature) content += `Signature: ${signature}\n`;
            content += `Tool name: ${moduleName}_${methodName}\n\n`;
          });
        });
        
        // Добавляем информацию о специальных инструментах
        content += "## Special Tools\n\n";
        content += "### get_network_info\n";
        content += "Description: Get information about the current network (mainnet or testnet)\n";
        content += "No parameters required\n\n";
        
        return {
          contents: [{
            uri: uri.href,
            text: content
          }]
        };
      }
    );
    
    // Регистрируем ресурс для получения информации о текущей сети
    this.server.resource(
      "network-info",
      "ton-api://network",
      async (uri) => {
        return {
          contents: [{
            uri: uri.href,
            text: `Current network: ${this.wrapper.getNetwork()}`
          }]
        };
      }
    );
    
    console.log(chalk.green('Registered MCP resources'));
  }

  /**
   * Запускает MCP сервер с использованием транспорта stdio
   */
  async startStdioServer() {
    const transport = new StdioServerTransport();
    console.log(chalk.green('Starting MCP server with stdio transport...'));
    await this.server.connect(transport);
  }

  /**
   * Запускает MCP сервер с использованием HTTP/SSE транспорта
   * @param port Порт для HTTP сервера
   */
  async startHttpServer(port: number = 3000) {
    const app = express();
    
    app.get('/', (req: Request, res: Response) => {
      res.send('TON API MCP Server is running');
    });
    
    app.get('/sse', async (req: Request, res: Response) => {
      console.log(chalk.blue('New SSE connection established'));
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      const transport = new SSEServerTransport('/messages', res);
      await this.server.connect(transport);
    });
    
    app.post('/messages', express.json(), async (req: Request, res: Response) => {
      // Этот маршрут будет обрабатывать сообщения от клиента
      // В реальной имплементации здесь нужно реализовать маршрутизацию сообщений
      // к правильному транспорту
      res.status(200).send({ message: 'Message received' });
    });
    
    return new Promise<void>((resolve, reject) => {
      try {
        app.listen(port, () => {
          console.log(chalk.green(`TON API MCP Server is running on http://localhost:${port}`));
          console.log(chalk.blue(`- SSE endpoint: http://localhost:${port}/sse`));
          console.log(chalk.blue(`- Messages endpoint: http://localhost:${port}/messages`));
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

// Запуск сервера при прямом вызове файла
if (require.main === module) {
  // Парсим аргументы командной строки
  const args = process.argv.slice(2);
  const options: {
    testnet?: boolean;
    apiKey?: string;
    http?: boolean;
    port?: number;
    skipApiKeyCheck?: boolean;
  } = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--testnet') {
      options.testnet = true;
    } else if (args[i] === '--api-key' && i + 1 < args.length) {
      options.apiKey = args[i + 1];
      i++;
    } else if (args[i] === '--http') {
      options.http = true;
    } else if (args[i] === '--port' && i + 1 < args.length) {
      options.port = Number(args[i + 1]);
      i++;
    } else if (args[i] === '--demo') {
      options.skipApiKeyCheck = true;
    }
  }
  
  const server = new TonApiMcpServer(options);
  
  if (options.http) {
    server.startHttpServer(options.port).catch(error => {
      console.error(chalk.red(`Error starting HTTP server: ${error.message}`));
      process.exit(1);
    });
  } else {
    server.startStdioServer().catch(error => {
      console.error(chalk.red(`Error starting stdio server: ${error.message}`));
      process.exit(1);
    });
  }
} 