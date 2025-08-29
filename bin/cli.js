#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const ChatInterface = require('../src/chat');
const ConfigManager = require('../src/config');
const packageInfo = require('../package.json');

const program = new Command();
const configManager = new ConfigManager();
const chatInterface = new ChatInterface();

// Main program configuration
program
    .name('ai-chat')
    .description('A command-line AI chatbot powered by Google Gemini')
    .version(packageInfo.version);

// Interactive chat command (default)
program
    .command('chat', { isDefault: true })
    .description('Start an interactive chat session')
    .action(async () => {
        if (!configManager.hasApiKey()) {
            console.error(chalk.red('✗ No API key configured.'));
            console.log(chalk.yellow('Please set your Google API key first:'));
            console.log(chalk.cyan('ai-chat config --key YOUR_API_KEY'));
            console.log(chalk.gray('\nGet your API key from: https://makersuite.google.com/app/apikey'));
            process.exit(1);
        }

        await chatInterface.startInteractiveChat();
    });

// Send a single message
program
    .command('ask <message>')
    .description('Send a single message and get a response')
    .action(async (message) => {
        if (!configManager.hasApiKey()) {
            console.error(chalk.red('✗ No API key configured.'));
            console.log(chalk.yellow('Please set your Google API key first:'));
            console.log(chalk.cyan('ai-chat config --key YOUR_API_KEY'));
            process.exit(1);
        }

        await chatInterface.sendSingleMessage(message);
    });

// Configuration commands
const configCommand = program
    .command('config')
    .description('Manage configuration settings');

configCommand
    .option('-k, --key <apikey>', 'Set Google API key')
    .option('-m, --model <model>', 'Set the AI model to use (default: gemini-2.0-flash-exp)')
    .option('-s, --show', 'Show current configuration')
    .option('-c, --clear', 'Clear all configuration')
    .action((options) => {
        try {
            if (options.key) {
                configManager.setApiKey(options.key);
            }
            
            if (options.model) {
                configManager.setModel(options.model);
            }
            
            if (options.show) {
                configManager.show();
            }
            
            if (options.clear) {
                configManager.clear();
            }
            
            // If no options provided, show help
            if (!options.key && !options.model && !options.show && !options.clear) {
                configCommand.help();
            }
        } catch (error) {
            console.error(chalk.red('✗ Configuration error:'), error.message);
            process.exit(1);
        }
    });

// Setup command for first-time users
program
    .command('setup')
    .description('Interactive setup for first-time users')
    .action(async () => {
        // Display ASCII banner
        const banner = `
 ██████╗ ██╗         ██████╗██╗     ██╗
██╔══██╗██║        ██╔════╝██║     ██║
██████╔╝██║        ██║     ██║     ██║
██╔══██╗██║        ██║     ██║     ██║
██║  ██║██║        ╚██████╗███████╗██║
╚═╝  ╚═╝╚═╝         ╚═════╝╚══════╝╚═╝
`;
        console.log(chalk.cyan(banner));
        console.log(chalk.yellow('         AI Chat CLI - Setup Wizard'));
        console.log(chalk.gray('━'.repeat(50)));
        
        console.log(chalk.green('🚀 Welcome to AI Chat CLI!'));
        console.log(chalk.gray('Let\'s get you set up...\n'));
        
        console.log(chalk.yellow('Step 1: Get your Google API key'));
        console.log('Visit: https://makersuite.google.com/app/apikey');
        console.log('Create a new API key for the Gemini API\n');
        
        const inquirer = require('inquirer');
        
        try {
            const { apiKey } = await inquirer.prompt([
                {
                    type: 'password',
                    name: 'apiKey',
                    message: 'Enter your Google API key:',
                    mask: '*',
                    validate: (input) => {
                        if (!input.trim()) {
                            return 'API key is required';
                        }
                        return true;
                    }
                }
            ]);
            
            configManager.setApiKey(apiKey);
            console.log(chalk.green('✓ Setup complete! You can now start chatting:'));
            console.log(chalk.cyan('ai-chat chat    # Start interactive mode'));
            console.log(chalk.cyan('ai-chat ask "Hello, how are you?"    # Send a single message'));
            
        } catch (error) {
            console.error(chalk.red('✗ Setup failed:'), error.message);
            process.exit(1);
        }
    });

// Help command enhancement
program.on('--help', () => {
    console.log('');
    console.log(chalk.yellow('Examples:'));
    console.log('  ai-chat setup                           # First-time setup');
    console.log('  ai-chat config --key YOUR_API_KEY       # Set API key');
    console.log('  ai-chat config --show                   # Show current config');
    console.log('  ai-chat chat                            # Start interactive chat');
    console.log('  ai-chat ask "What is machine learning?" # Send single message');
    console.log('');
    console.log(chalk.blue('Get your Google API key from:'));
    console.log('https://makersuite.google.com/app/apikey');
});

// Error handling for unknown commands
program.on('command:*', () => {
    console.error(chalk.red('✗ Invalid command:'), program.args.join(' '));
    console.log('See --help for available commands');
    process.exit(1);
});

// Handle process interruption gracefully
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n👋 Goodbye!'));
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log(chalk.yellow('\n👋 Goodbye!'));
    process.exit(0);
});

// Parse command line arguments
program.parse(process.argv);
