import js from "@eslint/js"; // 引入 ESLint 官方核心 JS 规则
import globals from "globals"; // 引入全局变量预设（如 window, document 等）
import tseslint from "typescript-eslint"; // 引入 TypeScript ESLint 插件及解析器
import pluginVue from "eslint-plugin-vue"; // 引入 Vue 官方 ESLint 插件
import css from "@eslint/css"; // 引入 CSS 检查插件
import prettier from "eslint-plugin-prettier"; // 引入 Prettier 插件，将格式化作为 ESLint 规则运行
import eslintConfigPrettier from "eslint-config-prettier"; // 引入 Prettier 冲突消除包，关闭与 Prettier 冲突的 ESLint 格式规则
import { defineConfig } from "eslint/config"; // 引入 Flat Config 的定义辅助函数

export default defineConfig([
  // ==================== 1. 基础环境配置 ====================
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: {
          // 开启项目服务，但允许默认项目解析未包含的文件
          allowDefaultProject: [
            "*.{js,mjs,cjs}",           // 根目录下的 JS 配置文件
            "eslint.config.mjs"         // 显式放行 ESLint 配置文件
          ],
          defaultProject: "./tsconfig.json"  // 可选：指定默认的 tsconfig 路径
        },
        extraFileExtensions: [".vue"],
        tsconfigRootDir: import.meta.dirname,
      }
    }
  },

  // ==================== 2. TypeScript 基础规范 ====================
  // 包含基础的 TS 语法检查和最佳实践规则（不需要类型信息的轻量级检查）
  tseslint.configs.recommended,

  // ==================== 3. TypeScript 深度类型检查 ====================
  // 利用完整的类型信息进行更严格的检查（例如：捕获不安全的类型断言、未处理的 Promise 等）
  ...tseslint.configs.recommendedTypeChecked,

  // ==================== 4. Vue 核心规范 ====================
  // 使用 flat/essential 级别，涵盖 Vue 3 的核心语法和模板防错规则
  pluginVue.configs["flat/essential"],

  // ==================== 5. Vue 文件专属解析器配置 ====================
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        projectService: {
          allowDefaultProject: ["*.{js,mjs,cjs}", "eslint.config.mjs"],
          defaultProject: "./tsconfig.json"
        },
        extraFileExtensions: [".vue"],
        tsconfigRootDir: import.meta.dirname
      }
    }
  },

  // ==================== 6. CSS 样式检查 ====================
  {
    files: ["**/*.css"], // 仅针对 CSS 文件生效
    plugins: { css }, // 注册 CSS 插件
    language: "css/css", // 声明语言类型为 CSS
    extends: ["css/recommended"] // 继承官方推荐的 CSS 检查规范
  },

  // ==================== 7. 全局自定义业务规则 ====================
  {
    rules: {
      // ---------- ESLint 核心规则 ----------
      'no-var': 'error', // 强制使用 let 或 const，禁止使用 var
      'no-multiple-empty-lines': ['warn', { max: 1 }], // 最多只允许出现 1 个连续空行
      'no-unexpected-multiline': 'error', // 禁止可能导致歧义的空余多行代码
      'no-useless-escape': 'off', // 关闭不必要的转义字符检查（正则中常用到）

      // 根据环境变量动态控制日志输出：生产环境报错，开发环境放行
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

      // ---------- TypeScript 专属规则 ----------
      // 禁止未使用的变量，但允许以 _ 开头的参数（常用于解构占位或回调函数的固定参数）
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/prefer-ts-expect-error': 'error', // 强制使用 @ts-expect-error 替代已被废弃的 @ts-ignore
      '@typescript-eslint/no-explicit-any': 'warn', // 允许使用 any，但给出警告提醒开发者优化类型
      '@typescript-eslint/no-non-null-assertion': 'off', // 允许使用非空断言操作符 (!)
      '@typescript-eslint/no-namespace': 'off', // 允许使用自定义 TS 模块和命名空间
      '@typescript-eslint/semi': 'off', // 关闭分号检查，交由 Prettier 统一处理

      // ✅ 【TS 严格模式】基于类型的额外安全保护
      '@typescript-eslint/no-floating-promises': 'error', // 必须正确处理 Promise（防止未 await 导致未捕获的拒绝）
      '@typescript-eslint/no-misused-promises': 'error', // 防止在不支持的地方错误使用 Promise（如 if 条件判断中）

      // ---------- Vue 插件规则 ----------
      'vue/multi-word-component-names': 'off', // 关闭组件必须多词命名的限制（允许 index.vue 等）
      'vue/no-mutating-props': 'off', // 允许修改组件 prop（适用于某些特殊的响应式场景）
      'vue/attribute-hyphenation': 'off', // 关闭模板属性连字符强制要求（kebab-case vs camelCase）
    },
  },

  // ==================== 8. Prettier 冲突消除 ====================
  // ⚠️ 必须放在所有规则之后！它会关掉所有与 Prettier 冲突的 ESLint 格式类规则
  eslintConfigPrettier,

  // ==================== 9. Prettier 格式化执行 ====================
  {
    plugins: { prettier }, // 注册 Prettier 插件
    rules: {
      // 将 Prettier 作为一个 ESLint 规则运行，不符合格式规范的代码会显示波浪线警告
      "prettier/prettier": "warn"
    }
  },

  // ==================== 10. 忽略文件列表 (替代旧版 .eslintignore) ====================
  {
    ignores: [
      "**/dist/**",              // Vite 打包输出目录
      "**/node_modules/**",      // pnpm 依赖包目录
      "**/*.min.js",             // 压缩后的第三方 JS 文件
      "**/*.log",                // 各类调试日志文件
      "**/.local/**",            // Vite 本地开发缓存目录 (.vite)
      "**/components.d.ts",      // unplugin-vue-components 自动生成的组件类型声明
      "**/auto-imports.d.ts",    // unplugin-auto-import 自动生成的 API 类型声明
      "**/.vscode/**",           // VS Code 编辑器工作区配置
      "**/.idea/**",             // WebStorm / IntelliJ IDEA 配置
      "**/.DS_Store",            // macOS 系统生成的隐藏文件
      "src/components.d.ts",     // unplugin-vue-components 自动生成的组件类型声明
      "src/auto-imports.d.ts",   // unplugin-auto-import 自动生成的 API 类型声明
      "**/*.svg"
    ]
  },
  {
    files: ['src/main.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off'
    },
  }
]);