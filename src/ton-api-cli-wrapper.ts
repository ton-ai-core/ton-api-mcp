import { HttpClient, Api } from 'tonapi-sdk-js';
import chalk from 'chalk';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Wrapper class for automatic creation of CLI commands based on tonapi-sdk-js
 */
export class TonApiCliWrapper {
  private client: Api<unknown>;
  private network: string;

  /**
   * Creates an instance of the wrapper for tonapi-sdk-js
   * @param options Initialization options
   */
  constructor(options: { testnet?: boolean; apiKey?: string; skipApiKeyCheck?: boolean } = {}) {
    // Determine the network to use
    const isTestnet = options.testnet === true;
    this.network = isTestnet ? 'testnet' : 'mainnet';
    
    // Base API URL depending on the network
    const baseUrl = isTestnet ? 'https://testnet.tonapi.io' : 'https://tonapi.io';
    console.log(chalk.blue(`Using ${this.network} network: ${baseUrl}`));
    
    // Get API key from options or environment variables
    const apiKey = options.apiKey || process.env.TON_API_KEY;
    
    // Check for API key only if check is not skipped
    if (!apiKey && !options.skipApiKeyCheck) {
      console.error(chalk.red('Error: API key not specified. Provide it using the --api-key option or set the TON_API_KEY environment variable'));
      throw new Error('API key is required');
    }
    
    // Define request headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // Add authorization header only if API key is provided
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    
    // Create HTTP client with settings
    const httpClient = new HttpClient({
      baseUrl,
      baseApiParams: {
        headers
      }
    });
    
    // Initialize API client
    this.client = new Api(httpClient);
  }

  /**
   * Gets all available API modules
   */
  getApiModules(): string[] {
    // Get all keys (modules) from API client, excluding service properties and methods
    return Object.keys(this.client)
      .filter(key => 
        typeof (this.client as any)[key] === 'object' && 
        key !== 'http' && 
        !key.startsWith('_')
      );
  }

  /**
   * Gets all methods of the specified API module
   * @param moduleName API module name
   */
  getModuleMethods(moduleName: string): string[] {
    if (!this.hasModule(moduleName)) {
      return [];
    }
    
    // Get all methods of the module
    const module = (this.client as any)[moduleName];
    return Object.keys(module)
      .filter(key => typeof module[key] === 'function');
  }

  /**
   * Checks if the specified module exists in the API
   * @param moduleName Module name
   */
  hasModule(moduleName: string): boolean {
    return this.getApiModules().includes(moduleName);
  }

  /**
   * Checks if the specified method exists in the API module
   * @param moduleName Module name
   * @param methodName Method name
   */
  hasMethod(moduleName: string, methodName: string): boolean {
    return this.hasModule(moduleName) && 
           this.getModuleMethods(moduleName).includes(methodName);
  }

  /**
   * Calls an API method with the specified arguments
   * @param moduleName API module name
   * @param methodName API method name
   * @param args Arguments for the method call
   */
  async callMethod(moduleName: string, methodName: string, ...args: any[]): Promise<any> {
    if (!this.hasMethod(moduleName, methodName)) {
      throw new Error(`Method ${methodName} not found in module ${moduleName}`);
    }
    
    try {
      // Get reference to the module and method
      const module = (this.client as any)[moduleName];
      const method = module[methodName];
      
      // Call the method with provided arguments
      return await method.apply(module, args);
    } catch (error: any) {
      console.error(chalk.red(`Error calling ${moduleName}.${methodName}: ${error.message}`));
      throw error;
    }
  }

  /**
   * Gets the API client instance
   */
  getApiClient(): Api<unknown> {
    return this.client;
  }
  
  /**
   * Gets information about the current network
   */
  getNetwork(): string {
    return this.network;
  }
} 