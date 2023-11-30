import escapeshellarg from "./escapeshellarg.mjs"

export default function(path, {owner, dmode, fmode}) {
	const escaped_path = escapeshellarg(path)

	let tmp = `chown -h '${owner}' ${escaped_path}\n`

	tmp += `if [ ! -h ${escaped_path} ]; then\n`
	tmp += `    if [ -d ${escaped_path} ]; then\n`
	tmp += `        chmod ${dmode} ${escaped_path}\n`
	tmp += `    else\n`
	tmp += `        chmod ${fmode} ${escaped_path}\n`
	tmp += `    fi\n`
	tmp += `fi\n`

	return tmp
}
