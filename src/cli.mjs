#!/usr/bin/env node --experimental-detect-module
import readline from "node:readline"
import parseLine from "./parseLine.mjs"
import entryToString from "./entryToString.mjs"
import process from "node:process"

let input = {
	owner: null,
	dmode: null,
	fmode: null
}

if (process.argv.length >= 3) {
	input.owner = process.argv[2]
}

if (process.argv.length >= 4) {
	input.dmode = process.argv[3]
}

if (process.argv.length >= 5) {
	input.fmode = process.argv[4]
}

if (process.argv.length > 5) {
	process.stderr.write(`Too many arguments!\n`)
	process.exit(2)
}

if (input.owner === null) {
	process.stderr.write(
		`Usage: tar -tf archive.tar | anio_tardp <owner> [dmode] [fmode] > script.sh\n`
	)

	process.exit(2)
}

try {
	const rl = readline.createInterface({
		input: process.stdin
	})

	process.stdout.write(`#!/bin/bash -euf\n`)

	rl.on("line", line => {
		const parsed = parseLine(line)

		if (parsed === null) return

		process.stdout.write(
			"\n" +
			entryToString(parsed, {
				owner: input.owner,
				default_dir_mode: input.dmode ?? "0750",
				default_file_mode: input.fmode ?? "0640"
			}) + "\n"
		)
	})
} catch (e) {
	process.stderr.write(`${e.message}\n`)
	process.exit(1)
}
