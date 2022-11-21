#! /usr/bin/env node
process.title = "EZ Zip by Mal1t1a";
const fs = require("fs");
const args = process.argv.slice(2);
const JSZip = require("jszip");
const zip = new JSZip();
const currentFolderName = process.cwd().split("\\").pop();

function parseCommandArguments()
{
	let options = {
		output: null,
		destination: null,
		files: [],
	};

	let i = 0;
	while (i < args.length)
	{
		if (args[i] === "-o" || args[i] === "-n" || args[i] === "--name" || args[i] === "--output")
		{
			options.output = args[i + 1];
			i += 2;
		}
		else if (args[i] === "-d" || args[i] === "-p" || args[i] === "--path" || args[i] === "--destination")
		{
			options.destination = args[i + 1];
			//check if ends with double quotes
			if (options.destination[options.destination.length - 1] === "\"")
			{
				options.destination = options.destination.slice(0, -1);
			}
			i += 2;
		} else
		{
			options.files.push(args[i]);
			i++;
		}
	}
	return options;
}

function readFilesAndFolders(options)
{
	let files = [];
	let folders = [];
	for (let i = 0; i < options.files.length; i++)
	{
		let file = options.files[i];
		if (file === "." || file === "./")
		{
			folders.push(process.cwd());
		}
		else if (fs.existsSync(file))
		{
			let stat = fs.statSync(file);
			if (stat.isFile())
			{
				files.push(file);
			}
			else if (stat.isDirectory())
			{
				folders.push(file);
			}
		}
	}
	return { files, folders };
}

function addFilesAndFoldersToZip(files, folders)
{
	for (let i = 0; i < files.length; i++)
	{
		let file = files[i];
		let data = fs.readFileSync(file);
		zip.file(file, data);
	}
	for (let i = 0; i < folders.length; i++)
	{
		let folder = folders[i];
		let folderRelativePath = folder;
		if (folderRelativePath.split(process.cwd()).length > 1)
		{
			folderRelativePath = folderRelativePath.split(process.cwd())[1];
		}
		if (folderRelativePath.indexOf("/") == 0)
		{
			folderRelativePath = folderRelativePath.split("/").slice(1).join("/");
		}

		if (folderRelativePath !== "")
		{
			zip.folder(folderRelativePath);
		}

		let files = fs.readdirSync(folder);
		for (let j = 0; j < files.length; j++)
		{
			let file = files[j];
			let stat = fs.statSync(folder + "/" + file);
			if (stat.isFile())
			{
				let data = fs.readFileSync(folder + "/" + file);
				zip.file((folderRelativePath !== "" ? folderRelativePath + "/" : "") + file, data);
			}
			else if (stat.isDirectory())
			{
				folders.push(folder + "/" + file);
			}
		}
	}
}

function writeZipFileToDisk(options)
{
	let output = options.output;
	if (output === null)
	{
		if (options.files.length === 1 && options.files[0] !== ".")
		{
			output = options.files[0] + ".zip";
		}
		else
		{
			output = currentFolderName + ".zip";
		}
	}

	let destination = options.destination;
	if (destination === null)
	{
		destination = process.cwd();
	}

	zip.generateNodeStream({ type: "nodebuffer", streamFiles: true })
	.pipe(fs.createWriteStream(destination + "/" + output))
	.on("finish", function ()
	{
		console.log(`Wrote "${output}" to directory: "${destination}"`);
	});
}

function run()
{
	let options = parseCommandArguments();
	let { files, folders } = readFilesAndFolders(options);
	addFilesAndFoldersToZip(files, folders);
	writeZipFileToDisk(options);
}

run();