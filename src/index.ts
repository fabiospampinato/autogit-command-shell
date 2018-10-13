
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

        const hasArguments = /\s/.test ( command );

        if ( hasArguments ) {

          task.output = ( await execa.shell ( `${command} && exit 0`, { cwd: repoPath } ) ).stdout;

        } else {

          task.output = ( await execa ( command, { cwd: repoPath } ) ).stdout;

        }

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
