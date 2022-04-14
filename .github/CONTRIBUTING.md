# Authme

-   Hi! Thanks for contributing!

## Developing instructions

-   Install Node.js 16+ and Git
-   Clone the repository `git clone https://github.com/Levminer/authme`
-   Install node modules `npm i`
-   Run start command: `npm run start`

## Building

-   Follow Developing instructions
-   Run build command: `npm run build` (You can only build for your own OS)

## Contributing rules

1. Use NPM
1. Use VS Code
1. Use ESLint and Prettier
1. Variable names: snake_case
1. Function names: camelCase
1. Don't use new node modules
1. Make your PR to the dev branch

## Translation

-   Make a copy of the languages/en.js
-   Rename the file to the [two-letter country code](https://laendercode.net/en/2-letter-list.html) of the language you translating
-   Also change the locale code in the 5. line to the two-letter country code
-   Translate the rest of the strings
-   Make a PR

## Notes

-   Changelog: `git log --pretty=format:'* [[%h](https://github.com/Levminer/authme/commit/%h)] %s (%cs)' 3.2.0..HEAD > log.txt`
