import normalizeWhitespace from "./normalizeWhitespace.mjs"

export default function(line) {
	const l = normalizeWhitespace(line)
	const fields = l.split(" ")

	if (9 > fields.length) {
		process.stderr.write(`Invalid formatted line '${line}'.\n`)

		return null
	}

	const type = fields[0][0]
	const path = fields[8]

	// ignore root path from archive
	if (path === "./" || path === "/") {
		return null
	}

	return {type, path}
}
