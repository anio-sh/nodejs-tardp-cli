import {spawn} from "node:child_process"
import readline from "node:readline"
import normalizeWhitespace from "./normalizeWhitespace.mjs"

export default function(input_tar) {
	return new Promise((resolve, reject) => {
		let entries = []

		const proc = spawn("tar", [
			"-tzvf", input_tar
		])

		const rl = readline.createInterface({
			input: proc.stdout
		})

		rl.on("line", line => {
			const l = normalizeWhitespace(line)
			const fields =l.split(" ")

			const type = fields[0][0]
			const path = fields[8]

			entries.push({type, path})
		})

		proc.on("exit", code => {
			if (code === 0) {
				resolve(entries)
			} else {
				reject(
					new Error(`Could not list entries of tar file.`)
				)
			}
		})
	})
}
