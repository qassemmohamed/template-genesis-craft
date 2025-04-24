

## Repository Structure

```sh
└── samtax/
    ├── README.md
    └── client
        ├── .eslintrc.cjs
        ├── .gitignore
        ├── .hintrc
        ├── .htaccess
        ├── .prettierrc
        ├── app
        │   ├── css
        │   └── images
        ├── components.json
        ├── index.html
        ├── package-lock.json
        ├── package.json
        ├── postcss.config.js
        ├── src
        │   ├── .env.local
        │   ├── App.tsx
        │   ├── components
        │   ├── context
        │   ├── data
        │   ├── helper.ts
        │   ├── hooks
        │   ├── i18n.ts
        │   ├── index.css
        │   ├── languages
        │   ├── lib
        │   ├── main.tsx
        │   ├── pages
        │   ├── routes
        │   ├── themes
        │   └── vite-env.d.ts
        ├── tailwind.config.js
        ├── tsconfig.json
        ├── tsconfig.node.json
        ├── vercel.json
        └── vite.config.ts
```

## Getting Started

### Prerequisites

**TypeScript**: `version x.y.z`

### Installation

Build the project from source:

1. Clone the samtax repository:

```sh
❯ git clone https://github.com/balshaer/samtax
```

2. Navigate to the project directory:

```sh
❯ cd samtax
```

3. Install the required dependencies:

```sh
❯ npm install
```

### Usage

To run the project, execute the following command:

```sh
❯ npm run build && node dist/main.js
```

### Tests

Execute the test suite using the following command:

```sh
❯ npm test
```

---
