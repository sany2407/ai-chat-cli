const { GoogleGenerativeAI } = require('@google/generative-ai');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ConfigManager = require('./config');

class ChatInterface {
    constructor() {
        this.configManager = new ConfigManager();
        this.genAI = null;
        this.model = null;
        this.chat = null;
    }

    /**
     * Initialize the Google AI client
     */
    async initialize() {
        try {
            const apiKey = this.configManager.getApiKey();
            const modelName = this.configManager.getModel();
            
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: modelName });
            
            // Start a new chat session
            this.chat = this.model.startChat({
                history: [],
                generationConfig: {
                    maxOutputTokens: 1000,
                    temperature: 0.7,
                }
            });
            
            return true;
        } catch (error) {
            throw new Error(`Failed to initialize AI client: ${error.message}`);
        }
    }

    /**
     * Send a message and get response
     * @param {string} message - The user's message
     * @returns {Promise<string>} The AI's response
     */
    async sendMessage(message) {
        if (!this.chat) {
            throw new Error('Chat not initialized. Please run initialize() first.');
        }

        try {
            const result = await this.chat.sendMessage(message);
            const response = await result.response;
            return response.text();
        } catch (error) {
            if (error.message.includes('API_KEY_INVALID')) {
                throw new Error('Invalid API key. Please check your Google API key and try again.');
            } else if (error.message.includes('QUOTA_EXCEEDED')) {
                throw new Error('API quota exceeded. Please check your Google Cloud billing and quotas.');
            } else if (error.message.includes('SAFETY')) {
                throw new Error('Message blocked by safety filters. Please try rephrasing your question.');
            } else {
                throw new Error(`API Error: ${error.message}`);
            }
        }
    }

    /**
     * Display ASCII art banner
     */
    displayBanner() {
        const banner = `
 ██████╗ ██╗         ██████╗██╗     ██╗
██╔══██╗██║        ██╔════╝██║     ██║
██████╔╝██║        ██║     ██║     ██║
██╔══██╗██║        ██║     ██║     ██║
██║  ██║██║        ╚██████╗███████╗██║
╚═╝  ╚═╝╚═╝         ╚═════╝╚══════╝╚═╝
`;
        console.log(chalk.cyan(banner));
        console.log(chalk.yellow('         AI Chat CLI - Powered by Gemini 2.0 Flash'));
        console.log(chalk.gray('━'.repeat(50)));
    }

    /**
     * Start an interactive chat session
     */
    async startInteractiveChat() {
        // Display ASCII banner
        this.displayBanner();
        
        console.log(chalk.green('🤖 Interactive Mode'));
        console.log(chalk.gray('Type "exit" or "quit" to end the conversation\n'));

        try {
            await this.initialize();
            const modelName = this.configManager.getModel();
            console.log(chalk.green(`✓ Connected to Google Gemini API (${modelName})\n`));
            
            // Send welcome message
            console.log(chalk.blue('🌟 Welcome! I\'m your AI assistant powered by Google\'s Gemini 2.0 Flash.'));
            console.log(chalk.blue('I can help with coding, writing, analysis, creative tasks, and much more!'));
            console.log(chalk.gray('What would you like to talk about today?\n'));
        } catch (error) {
            console.error(chalk.red('✗ Failed to initialize:'), error.message);
            return;
        }

        while (true) {
            try {
                const { message } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'message',
                        message: chalk.blue('You:'),
                        validate: (input) => {
                            if (!input.trim()) {
                                return 'Please enter a message';
                            }
                            return true;
                        }
                    }
                ]);

                const trimmedMessage = message.trim().toLowerCase();
                if (trimmedMessage === 'exit' || trimmedMessage === 'quit') {
                    console.log(chalk.yellow('Goodbye! 👋'));
                    break;
                }

                // Show thinking indicator
                process.stdout.write(chalk.gray('🤔 Thinking...'));

                try {
                    const response = await this.sendMessage(message);
                    
                    // Clear the thinking indicator
                    process.stdout.write('\r' + ' '.repeat(20) + '\r');
                    
                    console.log(chalk.green('AI:'), response);
                    console.log(); // Empty line for better readability
                } catch (error) {
                    // Clear the thinking indicator
                    process.stdout.write('\r' + ' '.repeat(20) + '\r');
                    
                    console.error(chalk.red('✗ Error:'), error.message);
                    console.log(); // Empty line for better readability
                }
            } catch (error) {
                if (error.isTtyError) {
                    console.error(chalk.red('✗ Interactive mode not supported in this terminal'));
                    break;
                } else {
                    console.error(chalk.red('✗ Unexpected error:'), error.message);
                }
            }
        }
    }

    /**
     * Send a single message and get response (non-interactive mode)
     * @param {string} message - The message to send
     */
    async sendSingleMessage(message) {
        try {
            await this.initialize();
            console.log(chalk.blue('You:'), message);
            console.log(chalk.gray('🤔 Thinking...'));
            
            const response = await this.sendMessage(message);
            console.log(chalk.green('AI:'), response);
        } catch (error) {
            console.error(chalk.red('✗ Error:'), error.message);
            process.exit(1);
        }
    }
}

module.exports = ChatInterface;
