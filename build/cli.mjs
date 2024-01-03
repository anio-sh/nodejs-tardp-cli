#!/usr/bin/env -S node --experimental-detect-module
import process from 'node:process';
import readline from 'node:readline';

function parseLine(line) {
	const path = line;

	// ignore root path from archive
	if (path === "./" || path === "/") {
		return null
	}

	return path
}

function escapeshellarg(arg) {
  //  discuss at: https://locutus.io/php/escapeshellarg/
  // Warning: this function emulates escapeshellarg() for php-running-on-linux
  // the function behaves differently when running on Windows, which is not covered by this code.
  //
  // original by: Felix Geisendoerfer (https://www.debuggable.com/felix)
  // improved by: Brett Zamir (https://brett-zamir.me)
  // bugfixed by: divinity76 (https://github.com/divinity76)
  //   example 1: escapeshellarg("kevin's birthday")
  //   returns 1: "'kevin'\\''s birthday'"
  //   example 2: escapeshellarg("/home'; whoami;''")
  //   returns 2: "'/home'\\''; whoami;'\\'''\\'''"
  if (arg.indexOf('\x00') !== -1) {
    throw new Error('escapeshellarg(): Argument #1 ($arg) must not contain any null bytes')
  }
  let ret = '';
  ret = arg.replace(/'/g, '\'\\\'\'');
  return "'" + ret + "'"
}

function entryToString(path, {owner, dmode, fmode}) {
	const escaped_path = escapeshellarg(path);

	let tmp = `chown -h '${owner}' ${escaped_path}\n`;

	tmp += `if [ ! -h ${escaped_path} ]; then\n`;
	tmp += `    if [ -d ${escaped_path} ]; then\n`;
	tmp += `        chmod ${dmode} ${escaped_path}\n`;
	tmp += `    else\n`;
	tmp += `        chmod ${fmode} ${escaped_path}\n`;
	tmp += `    fi\n`;
	tmp += `fi\n`;

	return tmp
}

async function main({owner, dmode, fmode}) {
	process.stderr.write(
		`Creating default permissions ` +
		`with owner=${owner} and dmode=${dmode} and fmode=${fmode}\n`
	);

	const rl = readline.createInterface({
		input: process.stdin
	});

	process.stdout.write(`#!/bin/bash -euf\n`);

	rl.on("line", line => {
		const parsed = parseLine(line);

		if (parsed === null) return

		process.stdout.write(
			`\n${entryToString(parsed, {owner, dmode, fmode})}\n`
		);
	});
}

const cli_args = process.argv.slice(2);

if (1 > cli_args.length || cli_args.length > 3) {
	process.stderr.write(
		`Usage: tar -tf input.tar.gz | anio_tardp <owner> [dmode] [fmode] > script.sh\n`
	);

	process.exit(2);
}

try {
	await main({
		owner: cli_args[0],
		dmode: cli_args[1] ?? "0750",
		fmode: cli_args[2] ?? "0640"
	});
} catch (error) {
	process.stderr.write(`${error.message}\n`);
	process.stderr.write(`\n-- stack trace --\n${error.stack}\n`);
	process.exit(1);
}
