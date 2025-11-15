#!/bin/bash
# Verify if an import is actually unused before removing it
# Usage: ./scripts/verify-imports.sh <file-path> <import-name>

FILE=$1
IMPORT=$2

if [ -z "$FILE" ] || [ -z "$IMPORT" ]; then
    echo "Usage: ./scripts/verify-imports.sh <file-path> <import-name>"
    echo "Example: ./scripts/verify-imports.sh src/blocks/card/edit.js ToggleControl"
    exit 1
fi

if [ ! -f "$FILE" ]; then
    echo "Error: File not found: $FILE"
    exit 1
fi

echo "Searching for '$IMPORT' in $FILE..."
echo ""

# Search for the import usage (case-sensitive)
MATCHES=$(grep -n "$IMPORT" "$FILE" | grep -v "^[0-9]*:import")

if [ -z "$MATCHES" ]; then
    echo "❌ NOT FOUND - Safe to remove this import"
    exit 0
else
    echo "✅ FOUND - DO NOT remove this import:"
    echo ""
    echo "$MATCHES"
    echo ""
    echo "This import IS being used in the file."
    exit 1
fi
