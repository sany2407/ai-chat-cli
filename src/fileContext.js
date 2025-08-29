const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class FileContextManager {
    constructor() {
        this.supportedExtensions = [
            '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.h', '.hpp',
            '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala',
            '.html', '.htm', '.css', '.scss', '.sass', '.less',
            '.json', '.xml', '.yaml', '.yml', '.toml', '.ini', '.cfg',
            '.md', '.txt', '.rtf', '.csv',
            '.sql', '.sh', '.bat', '.ps1',
            '.dockerfile', '.gitignore', '.env'
        ];
        
        this.maxFileSize = 50 * 1024; // 50KB per file
        this.maxTotalSize = 200 * 1024; // 200KB total context
        this.excludePatterns = [
            'node_modules', '.git', 'dist', 'build', '.next', '.nuxt',
            'coverage', '.nyc_output', 'logs', '*.log',
            '.DS_Store', 'Thumbs.db', '.env.local', '.env.production'
        ];
    }

    /**
     * Check if file should be excluded
     * @param {string} filePath - Path to check
     * @returns {boolean} True if should be excluded
     */
    shouldExclude(filePath) {
        const relativePath = path.relative(process.cwd(), filePath);
        return this.excludePatterns.some(pattern => {
            if (pattern.includes('*')) {
                const regex = new RegExp(pattern.replace(/\*/g, '.*'));
                return regex.test(relativePath);
            }
            return relativePath.includes(pattern);
        });
    }

    /**
     * Check if file extension is supported
     * @param {string} filePath - File path to check
     * @returns {boolean} True if supported
     */
    isSupportedFile(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        return this.supportedExtensions.includes(ext) || path.basename(filePath).startsWith('.');
    }

    /**
     * Get file content safely
     * @param {string} filePath - Path to file
     * @returns {string|null} File content or null if error
     */
    getFileContent(filePath) {
        try {
            const stats = fs.statSync(filePath);
            if (stats.size > this.maxFileSize) {
                return `[File too large: ${this.formatFileSize(stats.size)}]`;
            }
            
            const content = fs.readFileSync(filePath, 'utf8');
            return content;
        } catch (error) {
            return `[Error reading file: ${error.message}]`;
        }
    }

    /**
     * Format file size in human readable format
     * @param {number} bytes - Size in bytes
     * @returns {string} Formatted size
     */
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    /**
     * Scan directory recursively for supported files
     * @param {string} dirPath - Directory to scan
     * @param {number} maxDepth - Maximum depth to scan
     * @returns {Array<string>} Array of file paths
     */
    scanDirectory(dirPath, maxDepth = 3) {
        const files = [];
        
        const scanRecursive = (currentPath, depth) => {
            if (depth > maxDepth) return;
            
            try {
                const items = fs.readdirSync(currentPath);
                
                for (const item of items) {
                    const itemPath = path.join(currentPath, item);
                    
                    if (this.shouldExclude(itemPath)) continue;
                    
                    try {
                        const stats = fs.statSync(itemPath);
                        
                        if (stats.isDirectory()) {
                            scanRecursive(itemPath, depth + 1);
                        } else if (stats.isFile() && this.isSupportedFile(itemPath)) {
                            files.push(itemPath);
                        }
                    } catch (error) {
                        // Skip files we can't access
                        continue;
                    }
                }
            } catch (error) {
                // Skip directories we can't read
                return;
            }
        };
        
        scanRecursive(dirPath, 0);
        return files;
    }

    /**
     * Build context from current directory
     * @param {string} workingDir - Working directory path
     * @returns {Object} Context object with files and metadata
     */
    buildContext(workingDir = process.cwd()) {
        console.log(chalk.gray('📁 Scanning directory for context files...'));
        
        const files = this.scanDirectory(workingDir);
        const context = {
            workingDirectory: workingDir,
            files: [],
            totalSize: 0,
            skippedFiles: [],
            summary: ''
        };
        
        // Sort files by likely importance (package.json, README, then alphabetical)
        files.sort((a, b) => {
            const aName = path.basename(a).toLowerCase();
            const bName = path.basename(b).toLowerCase();
            
            if (aName === 'package.json') return -1;
            if (bName === 'package.json') return 1;
            if (aName.startsWith('readme')) return -1;
            if (bName.startsWith('readme')) return 1;
            
            return a.localeCompare(b);
        });
        
        for (const filePath of files) {
            if (context.totalSize >= this.maxTotalSize) {
                context.skippedFiles.push(filePath);
                continue;
            }
            
            const content = this.getFileContent(filePath);
            const relativePath = path.relative(workingDir, filePath);
            
            const fileInfo = {
                path: relativePath,
                fullPath: filePath,
                content: content,
                size: Buffer.byteLength(content, 'utf8')
            };
            
            context.files.push(fileInfo);
            context.totalSize += fileInfo.size;
        }
        
        // Generate summary
        const fileTypes = context.files.reduce((types, file) => {
            const ext = path.extname(file.path).toLowerCase() || 'config';
            types[ext] = (types[ext] || 0) + 1;
            return types;
        }, {});
        
        context.summary = `Found ${context.files.length} files (${this.formatFileSize(context.totalSize)}) in ${path.basename(workingDir)}. ` +
            `File types: ${Object.entries(fileTypes).map(([ext, count]) => `${ext}(${count})`).join(', ')}.`;
        
        if (context.skippedFiles.length > 0) {
            context.summary += ` Skipped ${context.skippedFiles.length} files due to size limits.`;
        }
        
        console.log(chalk.green('✓'), context.summary);
        
        return context;
    }

    /**
     * Format context for AI consumption
     * @param {Object} context - Context object from buildContext
     * @returns {string} Formatted context string
     */
    formatContextForAI(context) {
        let formatted = `\n=== PROJECT CONTEXT ===\n`;
        formatted += `Working Directory: ${path.basename(context.workingDirectory)}\n`;
        formatted += `${context.summary}\n\n`;
        
        for (const file of context.files) {
            formatted += `=== FILE: ${file.path} ===\n`;
            formatted += file.content;
            formatted += `\n\n`;
        }
        
        formatted += `=== END CONTEXT ===\n\n`;
        return formatted;
    }

    /**
     * Get context-aware prompt
     * @param {string} userMessage - Original user message
     * @param {string} workingDir - Working directory
     * @returns {string} Enhanced prompt with context
     */
    getContextAwarePrompt(userMessage, workingDir = process.cwd()) {
        const context = this.buildContext(workingDir);
        const contextString = this.formatContextForAI(context);
        
        return `${contextString}Based on the project files above, please answer this question: ${userMessage}

Please consider the code structure, dependencies, and project setup when providing your response. If the question is about the project specifically, reference the relevant files.`;
    }

    /**
     * Check if current directory has relevant files
     * @param {string} workingDir - Working directory
     * @returns {boolean} True if context-worthy files found
     */
    hasRelevantFiles(workingDir = process.cwd()) {
        const files = this.scanDirectory(workingDir, 1); // Shallow scan
        return files.length > 0;
    }
}

module.exports = FileContextManager;
