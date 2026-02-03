# Running and Deploying "Whispers of the White Moon" Outside Caffeine

This guide explains how to run your anime website locally and deploy it to the Internet Computer (IC) so you can access it in Chrome or any browser without using Caffeine.

## Prerequisites

Before you begin, make sure you have these installed on your computer:

1. **Node.js and npm** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **dfx** (Internet Computer SDK)
   - Install with: `sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"`
   - Verify installation: `dfx --version`

3. **pnpm** (package manager)
   - Install with: `npm install -g pnpm`
   - Verify installation: `pnpm --version`

## Running Locally (Preview on Your Computer)

Follow these steps to run the website on your local machine:

### 1. Install Dependencies

Open your terminal in the project root directory and run:

