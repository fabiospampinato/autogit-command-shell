
/* IMPORT */

import chalk from 'chalk';
import * as execa from 'execa';
import * as input from 'listr-input';
import * as minimist from 'minimist';

const argv = minimist ( process.argv.slice ( 2 ) );

/* SHELL */

let globalCommand; // Cached command from previous run

const shell = {
  description: 'Execute a plain shell command',
  arguments: [
    ['[command]', 'Shell command to execute']
  ],
  plugins: [
    async function shell ( config, repoPath, ctx, task ) {

      async function run ( command ) {

        task.title = `shell ${chalk.gray ( command.replace ( /\n/g, '\\n' ) )}`;

        if ( config.dry ) return task.skip ();

        command = `${command} && exit 0`;

        const {stdout} = await execa.shell ( command, { cwd: repoPath } );

        task.output = stdout;

        return stdout;

      }

      if ( argv._[1] ) { // Command passed as an argument

        return run ( argv._[1] );

      } else if ( globalCommand ) { // Cached command from previous run

        return run ( globalCommand );

      } else { // Asking

        return input ( 'Command:', { done: command => {
          globalCommand = command;
          return run ( command );
        }});

      }

    }
  ]
};

/* EXPORT */

export = Object.assign ( shell, { default: shell } );
