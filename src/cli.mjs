#!/usr/bin/env node
import main from "./index.mjs"

if (process.argv.length !== 4) {
	process.stderr.write(`Usage: tarp <input-tar> <default-owner>\n`)
	process.exit(2)
}

try {
	const script = await main(process.argv[2], {
		owner: process.argv[3],
		default_dir_mode: "0750",
		default_file_mode: "0640"
	})

	process.stdout.write(script)
} catch (e) {
	process.stderr.write(`${e.message}\n`)
	process.exit(1)
}
