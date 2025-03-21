#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { TonApiCliWrapper } from './ton-api-cli-wrapper.js';

/**
 * CLI interface for tonapi-sdk-js
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
          .addHelpText('after', `
Examples:
  ${chalk.green(`node bin/ton-api-cli.js ${moduleName} ${methodName} -a "arg1" -a "arg2"`)}
  ${chalk.green(`node bin/ton-api-cli.js ${moduleName} ${methodName} -p '{"param1": "value1", "param2": "value2"}'`)}

API Signature: ${this.wrapper.getMethodSignature(moduleName, methodName)}
`)
          .action(async (options) => {
            try {
              // Parse arguments from CLI options using wrapper's method
              const args = this.wrapper.parseArguments(options);
              
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
    this.addListCommand();
  }

  /**
   * Adds the list command to the program
   */
  private addListCommand() {
    this.program
      .command('list')
      .description('Show list of all available modules and methods')
      .action(() => {
        // Get sorted modules and methods
        const { modules: sortedModules, methodsByModule } = this.wrapper.getSortedModulesAndMethods();
        
        console.log(chalk.green(`Available modules and methods of TON API (sorted alphabetically):`));
        
        sortedModules.forEach(moduleName => {
          console.log(chalk.blue(`\n${moduleName}`));
          
          // Get methods for current module
          const methods = methodsByModule[moduleName];
          
          methods.forEach(methodName => {
            // Get method description and signature
            const description = this.wrapper.getMethodDescription(moduleName, methodName);
            const signature = this.wrapper.getMethodSignature(moduleName, methodName);
            
            console.log(chalk.yellow(`  - ${methodName}`));
            
            // Output description if available
            if (description) {
              console.log(chalk.white(`    Description: ${description}`));
            }
            
            // Output method signature if available
            if (signature) {
              console.log(chalk.gray(`    Signature: ${signature}`));
            }
            
            // Add help instructions
            console.log(chalk.gray(`    Use: node bin/ton-api-cli.js ${moduleName} ${methodName} --help for more details`));
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