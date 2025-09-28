### Regexp
Source: https://learn.microsoft.com/en-us/visualstudio/ide/using-regular-expressions-in-visual-studio?view=vs-2022

Characters which work as I'd expect:
`.*+?`
`^` = anchor match string to the beginning of a line or string
`\r?$` = anchor match string to the end of a line;
`$` = anchor string to the end of the file
`[abc]` = match any single char in a set;
`()` = capture + number the expression within the paranthesis; can reference it afterwards with e.g: `$1` in replace, `\1` in regexp;
e.g: `(\w+)\s\1` = matches stuff like "the the" or "that that"
`(?!...)` = negative lookahead; e.g: `(?!abc)` = assert that the next thing does not match this pattern;
`\w` = word character;
`\W` = non-word character;
`\s`, `\S` = whitespace, non-whitespace character;
`\d`, `\D` = digit, non-digit character;
