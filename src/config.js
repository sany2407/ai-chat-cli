const Conf = require('conf');
const chalk = require('chalk');

class ConfigManager {
    constructor() {
        this.config = new Conf({
            projectName: 'ai-chat-cli',
            schema: {
                apiKey: {
                    type: 'string',
                    default: ''
                },
                model: {
                    type: 'string',
                    default: 'gemini-2.0-flash-exp'
                }
            }
        });
    }

    /**
     * Set the Google API key
     * @param {string} apiKey - The Google API key
     */
    setApiKey(apiKey) {
        if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
            throw new Error('Invalid API key provided');
        }
        
        this.config.set('apiKey', apiKey.trim());
        console.log(chalk.green('✓ API key saved successfully!'));
    }

    /**
     * Get the stored API key
     * @returns {string} The stored API key
     */
    getApiKey() {
        const apiKey = this.config.get('apiKey');
        if (!apiKey) {
            throw new Error('No API key found. Please set your Google API key first using: ai-chat config --key YOUR_API_KEY');
        }
        return apiKey;
    }

    /**
     * Check if API key is configured
     * @returns {boolean} True if API key exists
     */
    hasApiKey() {
        const apiKey = this.config.get('apiKey');
        return apiKey && apiKey.length > 0;
    }

    /**
     * Set the model to use
     * @param {string} model - The model name
     */
    setModel(model) {
        this.config.set('model', model);
        console.log(chalk.green(`✓ Model set to: ${model}`));
    }

    /**
     * Get the current model
     * @returns {string} The current model
     */
    getModel() {
        return this.config.get('model');
    }

    /**
     * Clear all configuration
     */
    clear() {
        this.config.clear();
        console.log(chalk.yellow('Configuration cleared'));
    }

    /**
     * Show current configuration (without revealing full API key)
     */
    show() {
        const apiKey = this.config.get('apiKey');
        const model = this.config.get('model');
        
        console.log(chalk.blue('Current Configuration:'));
        console.log(`API Key: ${apiKey ? `${apiKey.substring(0, 8)}...` : 'Not set'}`);
        console.log(`Model: ${model}`);
        console.log(`Config location: ${this.config.path}`);
    }
}

module.exports = ConfigManager;
