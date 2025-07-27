# "爆速メッセージ"
## Overview
This is a simple app made for Windows to make work more efficient. It is an app to improve work efficiency, including the function to quickly copy commonly used messages to the clipboard. Rather than focusing on making this app, we aim to help you get your work done as efficiently and quickly as possible, and to enrich your life as soon as possible.

## Ready env
You are required to `node 20.x` and `npm 10.x`.

## How to setup
1. Please use below commands.
```sh
mkdir message_creator
cd message_creator
npm init -y
npm install electron --save-dev
npm install -D tailwindcss@3.3.5
npx tailwindcss init
```

2. Please create file as `style.css` and write below content.
```CSS
@tailwind base;
@tailwind components;
@tailwind utilities;
```

3. Please create file as `postcss.config.js` を作成
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

4. Please use below a command when you want to compile styles.
```sh
npx tailwindcss -i ./style.css -o ./tailwind.css --minify
```

5. When you check product, please use `npm start` in CLI.

## How to debug in Windows
Please use `Ctrl + Shift + I` as Chrome and check console.

## How to build
Please use below command as admin when your package.json correctlly.
```sh
npm install --save-dev electron-builder
npm run dist
```