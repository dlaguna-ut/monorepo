# **_Mono Repo Test_**

**Initialize project**

    pnpm init

Create apps and packages folders
Create a pnpm-workspace.yaml file
Update packages.json with workspaces key

**Add a Nest Js app**

    pnpx @nestjs/cli new apps/my-nestjs-app --package-manager=pnpm --skip-git

'pnpx' runs the package without globally installing it

**Add a Puppeteer app**
Since Puppeteer is a library, not a framework with a CLI, we'll set this up manually. This is a common pattern for "worker" services or automation scripts.

1.  **Create the App Directory:**

    ```
    mkdir apps/automation-service
    ```

2.  **Initialize its own `package.json`:**

    Bash

    ```
    # You can 'cd' into it...
    cd apps/automation-service
    pnpm init
    cd ../..

    # ...or do it from the root
    # pnpm init --dir apps/automation-service

    ```

3.  **Add Dependencies to the App:** Use the `--filter` flag to add `puppeteer` and `typescript` as dependencies for _only_ this specific app.

    Bash

    ```
    # Run from the root of /my-monorepo

    # Add puppeteer as a regular dependency
    pnpm add puppeteer --filter automation-service

    # Add dev dependencies
    pnpm add typescript ts-node @types/node -D --filter automation-service
    ```

# Sharing Code

**1. 🔧 Shared TypeScript tsconfig.json**

We'll create one package to hold all our base TypeScript configurations.

**Step 1**: Create the Config Package

First, let's create the package.

Create the directory:

Bash

```
mkdir packages/typescript-config
```

Create its package.json: This file is minimal. The two most important keys are name (so we can import it) and files (so pnpm makes the config files visible to other packages).

JSON

```
// packages/typescript-config/package.json

{
	"name": "@my-monorepo/typescript-config",
	"version": "1.0.0",
	"private": true,
	"files": [
		"base.json"
	]
}
```

**@my-monorepo/**: Using a scoped name is a best practice for monorepo packages.

**Step 2**: Create the Base Config

Now, create the base.json file that we listed in the files array.

JSON

```
// packages/typescript-config/base.json
{
	"$schema": "https://json.schemastore.org/tsconfig",
	"display": "Default Base",
	"compilerOptions": {
		"target": "ES2021",
		"module": "commonjs",
		"lib": ["ES2021"],
		"declaration": true,
		"strict": true,
		"skipLibCheck": true,
		"esModuleInterop": true,
		"moduleResolution": "node",
		"sourceMap": true,
		"composite": false,
		"declarationMap": false,
		"forceConsistentCasingInFileNames": true,
		"outDir": "dist"
	},
	"exclude": ["node_modules", "dist"]
}
```

**Step 3**: Use the Shared Config in Your Apps

Add the config as a dependency: Run this from the root of your monorepo.

Bash

```
pnpm add -D @my-monorepo/typescript-config --filter my-nestjs-app --workspace
```

Add it to the automation-service as well

```
pnpm add -D @my-monorepo/typescript-config --filter automation-service --workspace
```

**--workspace**: This special flag tells pnpm to link the local package from packages/typescript-config instead of looking for it on the npm registry.

Extend the config in your app: Now, you can dramatically simplify your app-level tsconfig.json.

JSON

```
// apps/my-nestjs-app/tsconfig.json
{
	"extends": "@my-monorepo/typescript-config/base.json",
	"compilerOptions": {
		// App-specific overrides go here
		"outDir": "./dist",
		"baseUrl": "./"
	},
	"include": ["src/**/*"]
}
```

**2. 🧹 Shared ESLint Configuration**

The pattern is identical for ESLint. The main difference is that the config package must also include all plugins and parsers as its own dependencies.

**Step 1**: Create the ESLint Package

Create the directory:

Bash

```
mkdir packages/eslint-config
```

Create its package.json:

```
pnpm init --dir packages/typescript-config
```

JSON

```
// packages/eslint-config/package.json

{
	"name": "@my-monorepo/eslint-config",
	"version": "1.0.0",
	"private": true,
	"files": [
		".eslintrc.js"
	],
	"main": ".eslintrc.js"
}
```

We use .eslintrc.js (a JavaScript file) because it's more flexible and can include comments.

**Step 2**: Add Linters and Create the Config

Add ESLint dependencies to the shared package: This is the key step. Your apps won't need to install these plugins directly.

Bash

```
pnpm add -D eslint \
@typescript-eslint/parser \
@typescript-eslint/eslint-plugin \
eslint-config-prettier \
eslint-plugin-prettier \
--filter @my-monorepo/eslint-config
```

Create the base .eslintrc.js:

JavaScript

```
// packages/eslint-config/.eslintrc.js

module.exports = {
	parser: "@typescript-eslint/parser",
	extends: [
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended",
	],
	plugins: ["@typescript-eslint/eslint-plugin"],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: [".eslintrc.js", "dist/"],
	rules: {
		// Your global rules go here
		"@typescript-eslint/interface-name-prefix": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
	},
};
```

**Step 3**: Use the Shared ESLint Config

Add the config as a dependency:

Bash

```
pnpm add -D @my-monorepo/eslint-config --filter my-nestjs-app --workspace
```

```
pnpm add -D @my-monorepo/eslint-config --filter automation-service --workspace
```

Extend the config in your app: Your app's ESLint config now becomes incredibly simple.

JavaScript

```
// apps/my-nestjs-app/.eslintrc.js

module.exports = {
	// This is all you need
	extends: ["@my-monorepo/eslint-config"],
	// You can add app-specific overrides if needed
	rules: {
		// e.g., a specific rule for this app
	}
};
```

3. 💡 Making it Work with Your IDE (VS Code)

There's one final step to make your IDE's language servers happy.

For ESLint: The VS Code ESLint extension looks for eslint in the project root. You should add eslint as a dev dependency to the workspace root.

Bash

# The -w flag adds it to the root package.json

pnpm add -D eslint -w

For TypeScript: VS Code works best if you have a "solution" tsconfig.json in the root that references all other projects. This enables it to understand imports between packages.

Create a tsconfig.json in your monorepo root:

JSON

// /my-monorepo/tsconfig.json

{

"compilerOptions": {

// This lets you use path aliases

"baseUrl": ".",

"paths": {

"shared-types": ["packages/shared-types/src"]

}

},

// This tells VS Code about your other projects

"references": [

{ "path": "apps/my-nestjs-app" },

{ "path": "apps/automation-service" },

{ "path": "packages/shared-types" }

],

// This file is just for VS Code, not for building

"files": []

}

You now have a clean, maintainable, and scalable setup that separates shared logic from application logic, which is a core principle of good software architecture.# **_Mono Repo Test_**

Initialize project

pnpm init

Create apps and packages folders

Create a pnpm-workspace.yaml file

Update packages.json with workspaces key

Add a Nest Js app

# 'pnpx' runs the package without globally installing it

pnpx @nestjs/cli new apps/my-nestjs-app --package-manager=pnpm --skip-git

1. 🔧 Shared TypeScript tsconfig.json

We'll create one package to hold all our base TypeScript configurations.

Step 1: Create the Config Package

First, let's create the package.

Create the directory:

Bash

# From the monorepo root

mkdir packages/typescript-config

Create its package.json: This file is minimal. The two most important keys are name (so we can import it) and files (so pnpm makes the config files visible to other packages).

JSON

// packages/typescript-config/package.json

{

"name": "@my-monorepo/typescript-config",

"version": "1.0.0",

"private": true,

"files": [

"base.json"

]

}

@my-monorepo/: Using a scoped name is a best practice for monorepo packages.

Step 2: Create the Base Config

Now, create the base.json file that we listed in the files array.

JSON

// packages/typescript-config/base.json

{

"$schema": "https://json.schemastore.org/tsconfig",

"display": "Default Base",

"compilerOptions": {

"target": "ES2021",

"module": "commonjs",

"lib": ["ES2021"],

"declaration": true,

"strict": true,

"skipLibCheck": true,

"esModuleInterop": true,

"moduleResolution": "node",

"sourceMap": true,

"composite": false,

"declarationMap": false,

"forceConsistentCasingInFileNames": true,

"outDir": "dist"

},

"exclude": ["node_modules", "dist"]

}

Step 3: Use the Shared Config in Your Apps

Add the config as a dependency: Run this from the root of your monorepo.

Bash

# Add the local package to my-nestjs-app

pnpm add -D @my-monorepo/typescript-config --filter my-nestjs-app --workspace

# Add it to the automation-service as well

pnpm add -D @my-monorepo/typescript-config --filter automation-service --workspace

--workspace: This special flag tells pnpm to link the local package from packages/typescript-config instead of looking for it on the npm registry.

Extend the config in your app: Now, you can dramatically simplify your app-level tsconfig.json.

JSON

// apps/my-nestjs-app/tsconfig.json

{

"extends": "@my-monorepo/typescript-config/base.json",

"compilerOptions": {

// App-specific overrides go here

"outDir": "./dist",

"baseUrl": "./"

},

"include": ["src/**/*"]

} 2. 🧹 Shared ESLint Configuration

The pattern is identical for ESLint. The main difference is that the config package must also include all plugins and parsers as its own dependencies.

Step 1: Create the ESLint Package

Create the directory:

Bash

mkdir packages/eslint-config

Create its package.json:

JSON

// packages/eslint-config/package.json

{

"name": "@my-monorepo/eslint-config",

"version": "1.0.0",

"private": true,

"files": [

".eslintrc.js"

],

"main": ".eslintrc.js"

}

We use .eslintrc.js (a JavaScript file) because it's more flexible and can include comments.

Step 2: Add Linters and Create the Config

Add ESLint dependencies to the shared package: This is the key step. Your apps won't need to install these plugins directly.

Bash

# Run from the root

pnpm add -D eslint \

@typescript-eslint/parser \

@typescript-eslint/eslint-plugin \

eslint-config-prettier \

eslint-plugin-prettier \

--filter @my-monorepo/eslint-config

Create the base .eslintrc.js:

JavaScript

// packages/eslint-config/.eslintrc.js

module.exports = {

parser: "@typescript-eslint/parser",

extends: [

"plugin:@typescript-eslint/recommended",

"plugin:prettier/recommended",

],

plugins: ["@typescript-eslint/eslint-plugin"],

root: true,

env: {

node: true,

jest: true,

},

ignorePatterns: [".eslintrc.js", "dist/"],

rules: {

// Your global rules go here

"@typescript-eslint/interface-name-prefix": "off",

"@typescript-eslint/explicit-function-return-type": "off",

"@typescript-eslint/explicit-module-boundary-types": "off",

},

};

Step 3: Use the Shared ESLint Config

Add the config as a dependency:

Bash

# Run from the root

pnpm add -D @my-monorepo/eslint-config --filter my-nestjs-app --workspace

pnpm add -D @my-monorepo/eslint-config --filter automation-service --workspace

Extend the config in your app: Your app's ESLint config now becomes incredibly simple.

JavaScript

// apps/my-nestjs-app/.eslintrc.js

module.exports = {

// This is all you need

extends: ["@my-monorepo/eslint-config"],

// You can add app-specific overrides if needed

rules: {

// e.g., a specific rule for this app

}

}; 3. 💡 Making it Work with Your IDE (VS Code)

There's one final step to make your IDE's language servers happy.

For ESLint: The VS Code ESLint extension looks for eslint in the project root. You should add eslint as a dev dependency to the workspace root.

Bash

# The -w flag adds it to the root package.json

pnpm add -D eslint -w

For TypeScript: VS Code works best if you have a "solution" tsconfig.json in the root that references all other projects. This enables it to understand imports between packages.

Create a tsconfig.json in your monorepo root:

JSON

// /my-monorepo/tsconfig.json

{

"compilerOptions": {

// This lets you use path aliases

"baseUrl": ".",

"paths": {

"shared-types": ["packages/shared-types/src"]

}

},

// This tells VS Code about your other projects

"references": [

{ "path": "apps/my-nestjs-app" },

{ "path": "apps/automation-service" },

{ "path": "packages/shared-types" }

],

// This file is just for VS Code, not for building

"files": []

}

You now have a clean, maintainable, and scalable setup that separates shared logic from application logic, which is a core principle of good software architecture.
