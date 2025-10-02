Has to be at least the 4th try I'm trying to learn this.
Source: https://vim-adventures.com/
### Movements
`h, j` = Left, Down
`k, l` = Up, Right

`l` = Right is already pretty illegal imo

`w` = go to beginning of next word
`e` = go to end of next word

`b` = go to the beginning of prev word
`B` = go to the beginning of the prev WORD (space delimiters(?))

`$` = end of line
`0` = beginning of line

`f` = Move to next occurrence of the following character, on the same line.
`F` = Move to previous..

`t` = same as `f`, stops before the next occurrence
`T` = same as `F`, ...

`;` = repeat last `f, F, T, t` in the same direction
`,` = repeat last ... in the opposite direction;

Really useful for quickly deleting things, e.g: `dt)` or `dt"` then `d;` or `d,`

## Vimtutor
### Insert / append
`i` = insert here
`I` = insert at the start of the line

`o` = insert line below + enter insert mode

`a` = insert after current character
`A` = insert at the end of the line

### Delete
`x` = delete char on cursor
`dw` = delete next word
`d$` = delete from here to the end of the line
`d2w` = delete next two words
`dd` = delete whole line

### Command = operator + number + motion (e.g: operator: `d`, motion: `$`)

### Undo / Redo
`u` = redo previous operation
`U` = undo all previous operations on the current line
`C-r`= redo

### Put
`p` = puts previously deleted text after the cursor

### Yank (Copy)
`y` = copy text, can combine with `v`
`yw` = yank next word
`yy` = yank line

### Replace
`r` = replaces the character at cursor with whatever you type in next
`R` = some sort of interactive replace

### Change
`c` = edit stuff
`ce` = edit the rest of the word
`cc` = edit the whole line

### File meta
`C-g` = location in file + file status
`G` = move to the bottom of the file
`gg` = move to start of the file
`22G` = move to line 22

`/` = search for phrase
`n` = move to next match
`N` = move to previous match

`%` = find matching `), ], }`
`:s/thee/the` = replaces first occurrence of `thee` in line with `the;
`:s/thee/the/g` = replaces all occurrences in line;
`:%s/old/new/g` = replaces all occurrences in file;
`:%s/old/new/gc` = replaces all occurrences, but prompts user whether to substitute or not;

Regexp + very magic mode + replace all repeated words:
`:%s/\v(\w+)\s+\1/\1/gc`
Without the g, you would remove only the first occurrence on each line.









