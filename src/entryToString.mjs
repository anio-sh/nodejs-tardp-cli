import escapeshellarg from "./escapeshellarg.mjs"

export default function(entry, defaults) {
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
