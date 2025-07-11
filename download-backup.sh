#!/bin/bash

# Project Backup Download Script
# This script helps you download the project backup file

echo "==================================="
echo "    Project Backup Download"
echo "==================================="
echo ""

# Check if backup exists
if [ -f "backups/project-backup.zip" ]; then
    echo "✅ Backup file found: backups/project-backup.zip"
    echo "📁 File size: $(du -h backups/project-backup.zip | cut -f1)"
    echo "📅 Created: $(stat -c %y backups/project-backup.zip)"
    echo ""
    echo "The backup contains all your project files including:"
    echo "  • Frontend source code (src/)"
    echo "  • Backend API code (backend/)"
    echo "  • Configuration files"
    echo "  • Documentation"
    echo "  • Docker files"
    echo "  • Package configurations"
    echo ""
    echo "Note: node_modules folders were excluded to reduce file size"
    echo ""
    echo "To download this file:"
    echo "1. Right-click on 'backups/project-backup.zip' in the file explorer"
    echo "2. Select 'Download' from the context menu"
    echo "3. The file will be saved to your local Downloads folder"
    echo ""
    echo "✅ Your project backup is ready and safely stored!"
else
    echo "❌ Backup file not found. Please run the backup creation process first."
fi

echo "==================================="
