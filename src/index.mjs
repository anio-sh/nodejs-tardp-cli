import process from "node:process"
import readline from "node:readline"
import parseLine from "./parseLine.mjs"
import entryToString from "./entryToString.mjs"

export default async function({owner, dmode, fmode}) {
	process.stderr.write(
		`Creating default permissions ` +
		`with owner=${owner} and dmode=${dmode} and fmode=${fmode}\n`
	)

	const rl = readline.createInterface({
		input: process.stdin
	})

	process.stdout.write(`#!/bin/bash -euf\n`)

	rl.on("line", line => {
		const parsed = parseLine(line)

		if (parsed === null) return

		process.stdout.write(
			`\n${entryToString(parsed, {owner, dmode, fmode})}\n`
		)
	})
}
