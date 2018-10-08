# Autogit Command - Shell

A command for executing a plain shell command.

## Install

```sh
npm install --save autogit-command-shell
```

## Usage

#### Configuration

Add this command to your configuration:

```js
const shell = require ( 'autogit-command-shell' );

module.exports = {
  commands: {
    shell
  }
}
```

#### CLI

Call it from the CLI with:

```sh
autogit shell
autogit shell 'rm -rf node_modules'
autogit shell 'npm audit fix' --include '**/js-*'
```

## License

MIT © Fabio Spampinato
