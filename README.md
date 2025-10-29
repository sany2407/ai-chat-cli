# AI Chat CLI

A powerful command-line chatbot powered by Google's Gemini AI. Chat with AI directly from your terminal!

## Features

- 🤖 Interactive chat sessions with Google Gemini 2.0 Flash
- 🧠 **Smart Context Detection** - Automatically determines when to use project context vs. general knowledge
- 📁 **File context awareness** - Analyzes your project files for relevant responses
- 🔐 Secure API key storage
- 💬 Single message mode for quick questions
- 🔍 Enhanced project analysis with structured insights
- 🎨 Beautiful colored terminal output
- ⚙️ Easy configuration management
- 🌐 Global CLI access

## Prerequisites

- Node.js 14.0.0 or higher
- A Google API key for Gemini API

## Getting Your Google API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API key"
4. Copy the generated API key

## Installation

### Clone this Repository

```
git clone https://github.com/sany2407/ai-chat-cli
```

### Option 1: Global Installation (Recommended)

```bash
# Install dependencies
npm install

# Install globally
npm install -g .
```

After global installation, you can use `ai-chat` from anywhere in your terminal.

### Option 2: Local Installation

```bash
# Install dependencies
npm install

# Use with npm start or node
npm start
# or
node bin/cli.js
```

## Quick Start

1. **First-time setup:**
   ```bash
   ai-chat setup
   ```
   This will guide you through the initial configuration.

2. **Start chatting:**
   ```bash
   ai-chat chat
   ```

3. **Ask a single question:**
   ```bash
   ai-chat ask "What is artificial intelligence?"
   ```

## Usage

### Commands

- `ai-chat chat` - Start an interactive chat session (default command)
- `ai-chat ask <message>` - Send a single message and get a response
- `ai-chat analyze` - Analyze current project directory
- `ai-chat analyze --detailed` - Detailed project analysis
- `ai-chat setup` - Interactive first-time setup
- `ai-chat config [options]` - Manage configuration
- `ai-chat --help` - Show help information

### Configuration Options

```bash
# Set API key
ai-chat config --key YOUR_API_KEY

# Set model (default: gemini-2.0-flash-exp)
ai-chat config --model gemini-2.0-flash-exp

# Show current configuration
ai-chat config --show

# Clear all configuration
ai-chat config --clear
```

### Interactive Chat Mode

In interactive mode, you can:
- Have ongoing conversations with context
- Type `exit` or `quit` to end the session
- Use Ctrl+C to interrupt at any time

Example:
```
🤖 AI Chat CLI - Interactive Mode
Type "exit" or "quit" to end the conversation

✓ Connected to Google Gemini API

You: Hello! What can you help me with?
AI: Hello! I'm an AI assistant powered by Google's Gemini. I can help you with a wide variety of tasks...

You: exit
Goodbye! 👋
```

### Single Message Mode

Perfect for quick questions or scripting:

```bash
ai-chat ask "Explain quantum computing in simple terms"
ai-chat ask "Write a Python function to sort a list"
ai-chat ask "What's the weather like?" # Note: AI can't access real-time data
```

## 🧠 Smart Context Detection

**AI Chat CLI intelligently determines when to use project context vs. general knowledge!**

The CLI automatically analyzes your questions and decides whether to:
- **Include Project Context**: For questions about your code, files, or project
- **Use General Knowledge**: For questions about concepts, definitions, or general topics

### Examples

**General Questions (No Project Context):**
```bash
ai-chat ask "What is artificial intelligence?"
ai-chat ask "Explain machine learning"
ai-chat ask "What are the benefits of Python?"
ai-chat ask "How does blockchain work?"
```

**Project-Specific Questions (Includes Context):**
```bash
ai-chat ask "What does this project do?"
ai-chat ask "How can I improve my code?"
ai-chat ask "Analyze this repository"
ai-chat ask "Fix the bugs in this project"
ai-chat ask "Explain this code structure"
ai-chat ask "How do I run this project?"
```

### How Smart Detection Works

The CLI uses intelligent pattern matching to determine context needs:

- **General Knowledge Triggers**: "What is...", "Define...", "Explain [concept]...", "Tell me about..."
- **Project Context Triggers**: "This project...", "My code...", "Analyze this...", "How does this work..."
- **Keyword Detection**: Looks for project-related terms like "implement", "fix", "refactor", "package.json", etc.

## 📁 File Context Features

**When project context is detected, the CLI provides enhanced project-aware responses!**

### Automatic Context Detection

When you're in a project directory, the CLI automatically:
- Scans for relevant code files (`.js`, `.py`, `.java`, `.cpp`, etc.)
- Reads configuration files (`package.json`, `README.md`, etc.)
- Excludes unnecessary files (`node_modules`, `.git`, etc.)
- Provides project context to the AI for better responses

### Enhanced Project Analysis

```bash
# Quick project analysis with summary
ai-chat analyze

# Comprehensive analysis with detailed insights
ai-chat analyze --detailed
```

**Basic Analysis includes:**
- Project summary and purpose
- Technologies and dependencies
- Code structure overview
- Notable observations

**Detailed Analysis includes:**
- Complete project overview
- Technical architecture analysis
- Code quality assessment
- Security considerations
- Performance recommendations
- Actionable improvement suggestions

### Context-Aware Questions

Ask questions about your project and get relevant answers:

```bash
# The AI will automatically include your project files as context
ai-chat ask "How can I improve this code?"
ai-chat ask "What does this project do?"
ai-chat ask "How do I add a new feature?"
ai-chat ask "Are there any bugs in my code?"
ai-chat ask "How do I set up this project?"
```

### Supported File Types

- **Code:** `.js`, `.jsx`, `.ts`, `.tsx`, `.py`, `.java`, `.cpp`, `.c`, `.cs`, `.php`, `.rb`, `.go`, `.rs`, `.swift`, etc.
- **Web:** `.html`, `.css`, `.scss`, `.sass`
- **Config:** `.json`, `.yaml`, `.yml`, `.toml`, `.ini`
- **Documentation:** `.md`, `.txt`, `.rst`
- **Scripts:** `.sh`, `.bat`, `.ps1`
- **Other:** `.sql`, `.dockerfile`, `.gitignore`

### How It Works

1. **Smart Detection:** The CLI detects when you ask project-related questions
2. **File Scanning:** Scans your directory for relevant files (up to 200KB total)
3. **Context Building:** Creates a structured context with file contents
4. **Enhanced Prompts:** Sends your question along with project context to the AI
5. **Relevant Responses:** Get answers that are specific to your project structure and code

## Configuration Storage

Your API key and settings are stored securely using the `conf` package:
- **Windows:** `%APPDATA%/ai-chat-cli-nodejs/config.json`
- **macOS:** `~/Library/Preferences/ai-chat-cli-nodejs/config.json`
- **Linux:** `~/.config/ai-chat-cli-nodejs/config.json`

## Troubleshooting

### Common Issues

1. **"No API key configured" error:**
   ```bash
   ai-chat config --key YOUR_GOOGLE_API_KEY
   ```

2. **"Invalid API key" error:**
   - Verify your API key is correct
   - Ensure the Gemini API is enabled in your Google Cloud project
   - Check that your API key has the necessary permissions

3. **"API quota exceeded" error:**
   - Check your Google Cloud billing settings
   - Monitor your API usage in the Google Cloud Console

4. **Network connectivity issues:**
   - Check your internet connection
   - Verify you can access Google's services
   - Consider firewall/proxy settings

### Getting Help

If you encounter issues:
1. Run `ai-chat config --show` to verify your configuration
2. Check the [Google AI Studio documentation](https://ai.google.dev/docs)
3. Ensure your API key has the correct permissions

## Examples

### Development Assistance
```bash
ai-chat ask "How do I implement a binary search in JavaScript?"
ai-chat ask "Explain the differences between REST and GraphQL"
```

### Learning and Education
```bash
ai-chat ask "Explain machine learning concepts"
ai-chat ask "What are design patterns in software engineering?"
```

### Writing Help
```bash
ai-chat ask "Help me write a professional email"
ai-chat ask "Proofread this text: [your text]"
```

## Security Notes

- Your API key is stored locally and never shared
- The tool only communicates with Google's official Gemini API
- No conversation data is stored permanently

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - see LICENSE file for details.
