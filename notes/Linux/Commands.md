### Files & folders###
**Remove all folders with the given name from all subdirectories**:
`find . -name file_name -exec rm -r {} \;`
Add `-mindepth 2` to ignore the folder in the current directory.

Use the `tree` command to visually display a folder's structure.

### Navigating ###
`cd -` : return to the previous folder you were in
`cd //`: go to root folder

### Ubuntu version
`lsb_release -a`

### Misc
Long pwd -> `export PS1='> '`

**Crop all images in the current folder (with ImageMagick)**
`for img in *.PNG; do convert "$img" -crop +20+40 -crop -20-20 +repage "cropped_$img"; done`
left-top right-down 

