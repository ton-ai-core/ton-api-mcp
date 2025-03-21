#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { TonApiCliWrapper } from './ton-api-cli-wrapper';

/**
 * Automatically generates CLI commands for tonapi-sdk-js
 */
class TonApiCli {
  private program: Command;
  private wrapper: TonApiCliWrapper;

  constructor() {
    this.program = new Command();
    
    // Configure the main program
    this.program
      .name('tonapi-cli')
      .description('CLI tool for working with TON API')
      .version('1.0.0')
      .option('-t, --testnet', 'Use testnet instead of mainnet')
      .option('-k, --api-key <key>', 'API key for TON API')
      .hook('preAction', (thisCommand, actionCommand) => {
        // Skip creating wrapper with API key check for the list command
        const commandName = actionCommand.name();
        if (commandName === 'list') {
          return; // For list command, use the existing instance with skipApiKeyCheck: true
        }
        
        // Create a wrapper instance with provided options for command execution
        const options = thisCommand.opts();
        this.wrapper = new TonApiCliWrapper({
          testnet: options.testnet,
          apiKey: options.apiKey
        });
      });
    
    // Create API wrapper instance with skipping API key check for commands generation only
    this.wrapper = new TonApiCliWrapper({ skipApiKeyCheck: true });
    
    // Generate commands for all API modules
    this.generateCommands();
  }

  /**
   * Generates commands for all API modules
   */
  private generateCommands() {
    // Get list of all API modules
    const modules = this.wrapper.getApiModules();
    
    console.log(chalk.green(`Found ${modules.length} API modules:`));
    
    // Create a subcommand for each module
    modules.forEach(moduleName => {
      const moduleCommand = this.program
        .command(moduleName)
        .description(`Methods of ${moduleName} module`);
      
      // Get all methods of the module
      const methods = this.wrapper.getModuleMethods(moduleName);
      console.log(chalk.blue(`  - ${moduleName} (${methods.length} methods)`));
      
      // Create a subcommand for each method of the module
      methods.forEach(methodName => {
        moduleCommand
          .command(methodName)
          .description(`Call method ${moduleName}.${methodName}`)
          .option('-p, --params <json>', 'Parameters in JSON format')
          .option('-a, --args <args...>', 'Space-separated arguments')
          .action(async (options) => {
            try {
              let args: any[] = [];
              
              // Process parameters
              if (options.params) {
                try {
                  const params = JSON.parse(options.params);
                  args.push(params);
                } catch (error) {
                  console.error(chalk.red(`Error parsing JSON parameters: ${error}`));
                  process.exit(1);
                }
              }
              
              // Add positional arguments if they exist
              if (options.args && options.args.length > 0) {
                // Try to convert string arguments to appropriate types (numbers, booleans, etc.)
                const parsedArgs = options.args.map((arg: string) => {
                  // Try to parse JSON
                  try {
                    return JSON.parse(arg);
                  } catch {
                    // If parsing fails - leave as string
                    return arg;
                  }
                });
                
                args = args.concat(parsedArgs);
              }
              
              console.log(chalk.yellow(`Calling ${moduleName}.${methodName} with arguments:`), args);
              
              // Call API method
              const result = await this.wrapper.callMethod(moduleName, methodName, ...args);
              
              // Display result
              console.log(chalk.green('Result:'));
              console.log(JSON.stringify(result, null, 2));
            } catch (error: any) {
              console.error(chalk.red(`Error: ${error.message}`));
              process.exit(1);
            }
          });
      });
    });
    
    // Add command to display all available modules and methods
    this.program
      .command('list')
      .description('Show list of all available modules and methods')
      .action(() => {
        const modules = this.wrapper.getApiModules();
        
        console.log(chalk.green(`Available modules and methods of TON API:`));
        
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
   * Runs the CLI application
   */
  run() {
    this.program.parse(process.argv);
  }
}

// Create and run CLI
const cli = new TonApiCli();
cli.run(); 