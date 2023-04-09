const path = require( 'path' );
const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );

module.exports = {
  assetsDir: 'static',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'App',
    },
  },
  // The source of CKEditor is encapsulated in ES6 modules. By default, the code
  // from the node_modules directory is not transpiled, so you must explicitly tell
  // the CLI tools to transpile JavaScript files in all ckeditor5-* modules.
  transpileDependencies: [
    /ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/,
  ],
  configureWebpack: {
    devtool: 'source-map',
    plugins: [
      // // CKEditor needs its own plugin to be built using webpack.
      // new CKEditorWebpackPlugin( {
      //   // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
      //   language: 'en',
      //   buildAllTranslationsToSeparateFiles: true,
      // } )
    ]
  },
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "~bootstrap/scss/functions";
          @import "~bootstrap/scss/variables";
          @import "~@/scss/variables";
          @import "~@/scss/overwrites/bootstrap/variables";
          @import "~bootstrap/scss/mixins.scss";
        `,
      },
    },
  },
  // Vue CLI would normally use its own loader to load .svg and .css files, however:
  //	1. The icons used by CKEditor must be loaded using raw-loader,
  //	2. The CSS used by CKEditor must be transpiled using PostCSS to load properly.
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        // https://stackoverflow.com/a/50812286
        options.prettify = false;

        options.transformAssetUrls = {
          img: 'src',
          image: 'xlink:href',
          'b-avatar': 'src',
          'b-img': 'src',
          'b-img-lazy': ['src', 'blank-src'],
          'b-card': 'img-src',
          'b-card-img': 'src',
          'b-card-img-lazy': ['src', 'blank-src'],
          'b-carousel-slide': 'img-src',
          'b-embed': 'src',
          'avatar': 'src',
        };
        return options;
      });

    // (1.) To handle editor icons, get the default rule for *.svg files first:
    const svgRule = config.module.rule('svg');

    // Then you can either:
    //
    // * clear all loaders for existing 'svg' rule:
    //
    //		svgRule.uses.clear();
    //
    // * or exclude ckeditor directory from node_modules:
    svgRule.exclude.add(path.join(__dirname, 'node_modules', '@ckeditor'));

    // Add an entry for *.svg files belonging to CKEditor. You can either:
    //
    // * modify the existing 'svg' rule:
    //
    //		svgRule.use( 'raw-loader' ).loader( 'raw-loader' );
    //
    // * or add a new one:
    config.module
      .rule('cke-svg')
      .test(/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/)
      .use('raw-loader')
      .loader('raw-loader');

    // (2.) Transpile the .css files imported by the editor using PostCSS.
    // Make sure only the CSS belonging to ckeditor5-* packages is processed this way.
    config.module
      .rule('cke-css')
      .test(/ckeditor5-[^/\\]+[/\\].+\.css$/)
      .use('postcss-loader')
      .loader('postcss-loader')
      .tap(() => {
        return styles.getPostCssConfig({
          themeImporter: {
            themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
          },
          minify: true,
        });
      });
  }
};
