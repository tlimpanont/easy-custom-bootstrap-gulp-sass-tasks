### How to add own bootstrap-sass to this existing project?

In the folder **themes** you see the all the theming folder. Each theme has a recognisable name like the names you can see on http://bootswatch.com/.
This project has a **default** theme as a starting example.

Imagine a project with the following custom themes:
```
[project-root]
 - themes
	 - [default]
	 - [fancytheme]
	 - [uglytheme]
	 - _default.scss
	 - _fancytheme.scss
	 - _uglytheme.scss
```
Each theme has it's own folder and it's own entrypoint.scss file (prefix with _ means that the file should be used as an importable file)

In a custom theme folder you should create a folder structure like this:

```
[project-root]
 - themes
	 - [default]
		 - [variables]
			 - _bootstrap.scss
		 - [fonts]
		 - [overrides]
	 - _overrides.scss
 - _default.scss
```
- **[variables]**:  use the files in this folder to change whatever default $variables values you have.
- **_bootstrap.scss**:  contains the sass-bootstrap variables see: https://github.com/twbs/bootstrap-sass/blob/master/assets/stylesheets/bootstrap/_variables.scss
- **[fonts]**:  any custom fonts you wish to use in your theme
- **[overrides]**: when changing default $variables values is not sufficient enough, you can use the files inside this folder to override or add new css structures.
- **_default.scss**: entry point for gulp-sass to do compilation. Remember that the filename should match the theme folder name.  Minimum required imports:
```sass
@import "[theme-name]/variables/bootstrap";
@import "../node_modules/bootstrap-sass/assets/stylesheets/bootstrap";
@import "[theme-name]/overrides";
```
- **_overrides.scss**:  import all the overrides you need

Extract sections of **_bootstrap.scss** variables if decide to change $variables values.
For example: if you decide to change the values of the default bootstrap colors
```sass
//== Colors
//
//## Gray and brand colors for use across Bootstrap.

$gray-base:              #000 !default;
$gray-darker:            lighten($gray-base, 13.5%) !default;
```
to
```

//== Colors
//
//## Gray and brand colors for use across Bootstrap.

$gray-base:              #ccc !default;
$gray-darker:            #999 !default;
```
then you should extract the **colors** variables section into a separate file  with the filename matches the name of the variable section. In this case the filename should be **_colors.scss*. After that you can @import the colors in the __bootstrap.scss file like:

```sass
$bootstrap-sass-asset-helper: false !default;
//
// Variables
// --------------------------------------------------


//== Colors
@import "colors";
```

#### Use _overrides.scss when $variables are not sufficient enough
Let's say you want to make a very fancy button, but the _bootstrap.scss variables lack options to do this. With that in mind you can start use to override stuffs like this:

file: **[overrides]/_buttons.scss**
```sass
@import "../variables/colors";
@import "../variables/typography";
@import "../variables/buttons";
@import "../variables/font-faces";
@import "animated-buttons";

@mixin button-bg-hover($color) {
  &:hover {
    background: darken($color, 5%);
  }
}

.btn {
  -webkit-transition: background-color 0.3s;
  -moz-transition: background-color 0.3s;
  transition: background-color 0.3s;

  &.btn-primary, &.btn-default {
    &:hover, &:active, &:focus {
      background: #33a8de !important;
    }
  }

  &.btn-secondary {
    background: white;
    border: 1px solid $light-gray;
    color: $semi-gray;
    @extend .semi-bold;
    @include button-bg-hover(white);
  }

  &.btn-modal {
    background: $blue-sea;
    color: white;
    @include button-bg-hover($blue-sea);
  }

  &:focus {
    outline: none !important;
  }
}
```
So whenever you start to add or change CSS structure and states, you should start  using **overrides** in stead of **variables**. As you can see we can import our variables to enrich the overriding template in a much easier way.

#### Gulp task information
Gulp will handle all the folders (non-recursively) as a theming folder. It will look for _[theme-name].scss entry point file to trigger the gulp-sass compilation process.

### Running the build


```
 npm install
 npm run build.all

// OR
npm run build.dev
npm run build.prod
```
Difference between **dev** and **prod** is that in productio mode the css will be minified using **cssnano**

The build also copy separate dist folders
```
- dist/dev
	- css
		- themes
			- [theme-name]
				- [fonts]
				- style.css
- dist/prod
	"idem structure"
```
