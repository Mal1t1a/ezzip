ezzip
===========

[![NPM](https://nodei.co/npm/ezzip.png)](https://nodei.co/npm/ezzip/)

ezzip is meant to be used as a cli tool which allows you to easily and effortlessly zip up files and folders.

## Installation
```
npm install -g ezzip
```

Options
=======
```
-o <output_file_name>
aliases: --output -n --name 
-d <output_destination>
aliases: --destination -p --path
```

Examples
======
### Zip up current folder
```
ezzip .
```
This will create a zip archive of the current folder named `folder_name.zip`

### Zip up current folder and specify archive name
```
ezzip . -o myZip.zip
```
This will create a zip archive of the current folder named `myZip.zip`

### Zip up a file
```
ezzip test1.txt
```
This will create a zip archive of the file `test1.txt` named `test1.txt.zip`

### Zip up multiple files and place archive into folder
```
ezzip test1.txt test2.txt -o tests.zip -d archives
```
This will create a zip archive of `test1.txt` and `test2.txt` named `tests.zip` and place the archive into the `archives` subfolder.

### Zip up a file, a folder and place into a subfolder.
```
ezzip package.json build -o "build.v1.zip" -d "public/builds"
```
This will create a zip archive of the `package.json` file and the `build` folder named `build.v1.zip` and will place it into the `public/builds` folder.