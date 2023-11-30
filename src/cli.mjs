#!/usr/bin/env -S node --experimental-detect-module
import process from "node:process"
import main from "./index.mjs"

const cli_args = process.argv.slice(2)

if (1 > cli_args.length || cli_args.length > 3) {
	process.stderr.write(
		`Usage: tar -tf input.tar.gz | anio_tardp <owner> [dmode] [fmode] > script.sh\n`
	)

	process.exit(2)
}

try {
	await main({
		owner: cli_args[0],
		dmode: cli_args[1] ?? "0750",
		fmode: cli_args[2] ?? "0640"
	})
} catch (error) {
	process.stderr.write(`${error.message}\n`)
	process.stderr.write(`\n-- stack trace --\n${error.stack}\n`)
	process.exit(1)
}
