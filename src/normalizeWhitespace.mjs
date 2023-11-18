export default function(str) {
	str = str.split("\t").join(" ")

	while (str.includes("  ")) {
		str = str.split("  ").join(" ")
	}

	return str
}
