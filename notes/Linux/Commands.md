### Files & folders###
**Remove all folders with the given name from all subdirectories**:
`find . -name file_name -exec rm -r {} \;`
Add `-mindepth 2` to ignore the folder in the current directory.

## File System Navigation
Detailed ls:
`ls -la`

Go to prev dir:
`cd -`

Show folder as tree:
`tree`

## File Operations
Copy file:
`cp file1 file2`

Copy directory:
`cp -r dir1 dir2`

Move / rename file:
`mv file1 file2`

Delete file:
`rm file.txt` 

Delete directory:
`rm -r dir`

Create empty file:
`touch file.txt
`
Create directory (nested):
`mkdir -p dir/subdir`

## SSH & SCP
Connect to remote:
`ssh user@host`

Connect with identity file:
`ssh -i key.pem user@host`

Copy from remote to local:
`scp user@host:/dir/file .`

Sync files:
`rsync -avz src/ user@host:/dir`

## Search
Find file by name:
`find . -name "*.txt" `

Search inside file:
`grep "pattern" file.txt`  

Recursive search inside folder:
`grep -r "pattern" dir/  `

Case-insensitive search:
`grep -i "pattern" file.txt`

## Text Processing
First 10 lines in a file:
`head -n 10 file.txt`

Last 10 lines in a file:
`tail -n 10 file.txt`

Line count:
`wc -l file.txt`

## Redirects
Redirect + overwrite:
`command > out.txt` 

Redirect + append:
`command >> out.txt`

Redirect stderr:
`command 2> err.txt `

Redirect stdout + stderr:
`command &> all.txt`

## Complex Redirects
Redirect stderr and pipe stdout:  
`ls -la 2> errors.txt | less`  

Redirect stdout and stderr separately:  
`command > out.txt 2> err.txt`  

Redirect stdout and stderr together:  
`command > out.txt 2>&1`  

Use with pipes for advanced behavior:  
`command1 2> err.txt | command2 > out.txt`  

### Ubuntu version
`lsb_release -a`

### Btop
:O

### Misc
Long pwd -> `export PS1='> '`

**Crop all images in the current folder (with ImageMagick)**
`for img in *.PNG; do convert "$img" -crop +20+40 -crop -20-20 +repage "cropped_$img"; done`
left-top right-down 

