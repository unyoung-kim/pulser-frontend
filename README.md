## Getting Started

### Development Steps

1. **Install Node.js (if not already installed)**:

    - **Option 1: Using** `nvm` (recommended):
        - Install `nvm` from [nvm's GitHub page](https://github.com/nvm-sh/nvm#installing-and-updating):
          ```bash
          curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
          ```
        - Restart your terminal and verify installation:
          ```bash
          nvm --version
          ```
        - Install Node.js:
          ```bash
          nvm install # Installs the version specified in .nvmrc
          nvm use     # Switches to the installed version
          ```
    - **Option 2: Without** `nvm`:
        - Download and install Node.js from [nodejs.org](https://nodejs.org).

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the Development Server**:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

### Environment Variables

Environment variables can be found here on Pulser Notion:

- [Frontend Environment Variables](https://www.notion.so/Frontend-env-139e49034280801c91f8c6215814945c?pvs=4)

### Running the Application

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

