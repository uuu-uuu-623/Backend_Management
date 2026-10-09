export default {
  extends: [
    'stylelint-config-standard-scss',            // SCSS 标准规则
    'stylelint-config-recommended-vue/scss'      // Vue 文件中的 SCSS 格式化
  ],
  plugins: ['stylelint-order'],
  overrides: [
    {
      files: ['**/*.scss', '**/*.css', '**/*.vue'],
      customSyntax: 'postcss-scss'
    },
    {
      files: ['**/*.html', '**/*.vue'],
      customSyntax: 'postcss-html'
    }
  ],
  ignoreFiles: ['**/*.js', '**/*.ts', '**/*.json', '**/*.md'],
  rules: {
    // 属性排序（盒子模型 → 排版 → 视觉）
    'order/properties-order': [
      'position', 'top', 'right', 'bottom', 'left',
      'display', 'flex', 'grid', 'width', 'height',
      'margin', 'padding', 'border', 'background',
      'font', 'text', 'color', 'opacity'
    ],
    'value-keyword-case': null,            // 允许 v-bind 用的 CSS 自定义属性
    'no-descending-specificity': null,     // 允许覆盖优先级
    'function-url-quotes': 'always',
    'no-empty-source': null,
    'selector-class-pattern': null,
    'property-no-unknown': null,
    'block-opening-brace-space-before': 'always',
    'value-no-vendor-prefix': null,
    'property-no-vendor-prefix': null,
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global', 'v-deep', 'deep'] }
    ]
  }
};