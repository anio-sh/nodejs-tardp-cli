export default function(line) {
	const path = line

	// ignore root path from archive
	if (path === "./" || path === "/") {
		return null
	}

	return path
}
