/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { spawn } from 'child_process';
import { assign } from 'vs/base/common/objects';
import { parseArgs, helpMessage } from 'vs/code/node/argv';
import pkg from 'vs/code/node/package';

export function main(args: string[]) {
	const argv = parseArgs(args);

	if (argv.help) {
		console.log(helpMessage);
	} else if (argv.version) {
		console.log(pkg.version);
	} else {
		const env = assign({}, process.env, {
			// this will signal Code that it was spawned from this module
			'VSCODE_CLI': '1',
			'ELECTRON_NO_ATTACH_CONSOLE': '1'
		});
		delete env['ATOM_SHELL_INTERNAL_RUN_AS_NODE'];

		const child = spawn(process.execPath, args, {
			detached: true,
			stdio: 'ignore',
			env
		});

		if (argv.wait) {
			child.on('exit', process.exit);
			return;
		}
	}

	process.exit(0);
}

main(process.argv.slice(2));
