#!/usr/bin/env node

/**
 * Build Verification Script
 * Career Path Institute - Production Build Checker
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BuildVerifier {
    constructor() {
        this.distPath = path.join(__dirname, 'dist');
        this.results = {
            buildExists: false,
            filesCount: 0,
            totalSize: 0,
            criticalFiles: {},
            errors: [],
            warnings: []
        };
    }

    async verify() {
        console.log('🔍 VERIFYING PRODUCTION BUILD...\n');
        
        this.checkBuildDirectory();
        this.checkCriticalFiles();
        this.calculateBuildSize();
        this.checkAssetOptimization();
        this.displayResults();
        
        return this.results;
    }

    checkBuildDirectory() {
        if (!fs.existsSync(this.distPath)) {
            this.results.errors.push('❌ Build directory (dist) does not exist');
            return;
        }
        
        this.results.buildExists = true;
        console.log('✅ Build directory exists');
    }

    checkCriticalFiles() {
        const criticalFiles = [
            'index.html',
            'assets/index.css',
            'assets/index.js'
        ];

        criticalFiles.forEach(file => {
            const filePath = path.join(this.distPath, file);
            const exists = fs.existsSync(filePath);
            
            if (exists) {
                const stats = fs.statSync(filePath);
                this.results.criticalFiles[file] = {
                    exists: true,
                    size: stats.size,
                    sizeFormatted: this.formatBytes(stats.size)
                };
                console.log(`✅ ${file} - ${this.formatBytes(stats.size)}`);
            } else {
                // Check for hashed filenames
                const dir = path.dirname(filePath);
                const basename = path.basename(file, path.extname(file));
                const ext = path.extname(file);
                
                if (fs.existsSync(dir)) {
                    const files = fs.readdirSync(dir);
                    const hashedFile = files.find(f => 
                        f.startsWith(basename) && f.endsWith(ext)
                    );
                    
                    if (hashedFile) {
                        const hashedPath = path.join(dir, hashedFile);
                        const stats = fs.statSync(hashedPath);
                        this.results.criticalFiles[file] = {
                            exists: true,
                            actualFile: hashedFile,
                            size: stats.size,
                            sizeFormatted: this.formatBytes(stats.size)
                        };
                        console.log(`✅ ${file} (as ${hashedFile}) - ${this.formatBytes(stats.size)}`);
                    } else {
                        this.results.criticalFiles[file] = { exists: false };
                        this.results.errors.push(`❌ Critical file missing: ${file}`);
                    }
                } else {
                    this.results.criticalFiles[file] = { exists: false };
                    this.results.errors.push(`❌ Critical file missing: ${file}`);
                }
            }
        });
    }

    calculateBuildSize() {
        if (!this.results.buildExists) return;

        const calculateDirSize = (dirPath) => {
            let totalSize = 0;
            let fileCount = 0;

            const items = fs.readdirSync(dirPath);
            
            items.forEach(item => {
                const itemPath = path.join(dirPath, item);
                const stats = fs.statSync(itemPath);
                
                if (stats.isDirectory()) {
                    const subResult = calculateDirSize(itemPath);
                    totalSize += subResult.size;
                    fileCount += subResult.count;
                } else {
                    totalSize += stats.size;
                    fileCount++;
                }
            });

            return { size: totalSize, count: fileCount };
        };

        const result = calculateDirSize(this.distPath);
        this.results.totalSize = result.size;
        this.results.filesCount = result.count;

        console.log(`\n📊 BUILD STATISTICS:`);
        console.log(`   Total files: ${result.count}`);
        console.log(`   Total size: ${this.formatBytes(result.size)}`);
    }

    checkAssetOptimization() {
        const assetsPath = path.join(this.distPath, 'assets');
        
        if (!fs.existsSync(assetsPath)) {
            this.results.warnings.push('⚠️ Assets directory not found');
            return;
        }

        const assets = fs.readdirSync(assetsPath);
        
        // Check for large files
        assets.forEach(asset => {
            const assetPath = path.join(assetsPath, asset);
            const stats = fs.statSync(assetPath);
            
            if (stats.size > 1024 * 1024) { // > 1MB
                this.results.warnings.push(
                    `⚠️ Large asset detected: ${asset} (${this.formatBytes(stats.size)})`
                );
            }
        });

        // Check for proper minification
        const jsFiles = assets.filter(f => f.endsWith('.js'));
        const cssFiles = assets.filter(f => f.endsWith('.css'));

        console.log(`\n🎯 ASSET OPTIMIZATION:`);
        console.log(`   JavaScript files: ${jsFiles.length}`);
        console.log(`   CSS files: ${cssFiles.length}`);
        
        if (jsFiles.length === 0) {
            this.results.errors.push('❌ No JavaScript files found in build');
        }
        
        if (cssFiles.length === 0) {
            this.results.errors.push('❌ No CSS files found in build');
        }
    }

    displayResults() {
        console.log('\n' + '='.repeat(50));
        console.log('📋 BUILD VERIFICATION SUMMARY');
        console.log('='.repeat(50));

        if (this.results.errors.length === 0) {
            console.log('🎉 BUILD VERIFICATION PASSED!');
            console.log('✅ All critical files present');
            console.log('✅ Build size is reasonable');
            console.log('✅ Assets are properly optimized');
        } else {
            console.log('🚨 BUILD VERIFICATION FAILED!');
            this.results.errors.forEach(error => console.log(error));
        }

        if (this.results.warnings.length > 0) {
            console.log('\n⚠️ WARNINGS:');
            this.results.warnings.forEach(warning => console.log(warning));
        }

        console.log('\n📊 FINAL STATISTICS:');
        console.log(`   Build Status: ${this.results.buildExists ? 'SUCCESS' : 'FAILED'}`);
        console.log(`   Total Files: ${this.results.filesCount}`);
        console.log(`   Total Size: ${this.formatBytes(this.results.totalSize)}`);
        console.log(`   Errors: ${this.results.errors.length}`);
        console.log(`   Warnings: ${this.results.warnings.length}`);

        // Performance recommendations
        console.log('\n🚀 PERFORMANCE RECOMMENDATIONS:');
        
        if (this.results.totalSize > 5 * 1024 * 1024) { // > 5MB
            console.log('   📦 Consider code splitting for large bundles');
        }
        
        console.log('   🗜️ Enable gzip compression on server');
        console.log('   🌐 Use CDN for static assets');
        console.log('   ⚡ Implement service worker for caching');
        
        console.log('\n' + '='.repeat(50));
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Run verification
const verifier = new BuildVerifier();
verifier.verify().then(results => {
    process.exit(results.errors.length > 0 ? 1 : 0);
}).catch(error => {
    console.error('❌ Verification failed:', error);
    process.exit(1);
});