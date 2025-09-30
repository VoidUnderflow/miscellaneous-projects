Source: https://www.digitalocean.com/community/tutorials/grep-command-in-linux-unix
No, I won't read the manual.

`grep "string" filename` = search for string in filename
`grep -r "string" foldername` = search recursively for string in folder
`grep -i` = ignore case
`grep -c` = count lines which contain string
`grep -v` = invert == e.g: lines that don't contain string
`grep -n` = number lines which contain a match
`grep -w` = search for exact word (no partial matches)
`grep -o` = print only the matching part
`grep -l` = show only filenames with matches
`grep -L` = show only filenames without matches
`grep -H` = print filename

Pipes + grep = <3
`dpkg -l | grep "openssh"` 

`grep -A 4` = display 4 lines that come after each match
`grep -B 4` = ---------------------------------------before----------------

### Regex
`^$.[a-z][^a-z]` = standard regex
`grep -E` = extended regular expressions (`egrep`)

### Examples
Print all filenames in current folder which contain the string "Linux" ignoring case:
`grep -irl linux .`


