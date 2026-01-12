#!/bin/bash
# Run prettier on the entire project to ensure consistency
# This runs after file modification tools
echo "Running Prettier..."
npx prettier --write .
