import getTarEntries from "./getTarEntries.mjs"
import escapeshellarg from "./escapeshellarg.mjs"

function entryToString(entry, defaults) {
	const escaped_path = escapeshellarg(entry.path)

	let tmp = `chown -h '${defaults.owner}' ${escaped_path}`

	if (entry.type === "-") {
		tmp += `\nchmod ${defaults.default_file_mode} ${escaped_path}`
	} else if (entry.type === "d") {
		tmp += `\nchmod ${defaults.default_dir_mode} ${escaped_path}`
	} else if (entry.type === "l") {

	} else {
		throw new Error(`Unknown file type '${entry.type}'`)
	}

	return tmp
}

export default async function(input_tar, defaults) {
	let script = `#!/bin/bash -euf\n`

	const entries = await getTarEntries(input_tar)

	for (const entry of entries) {
		script += "\n" + entryToString(entry, defaults) + "\n"
	}

	return script
}
