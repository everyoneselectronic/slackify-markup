# Slackify-Markup

![Build Status](https://github.com/everyoneselectronic/slackify-markup/workflows/Build%20CI/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/everyoneselectronic/slackify-markup/branch/master/graph/badge.svg)](https://codecov.io/gh/everyoneselectronic/slackify-markup) [![Known Vulnerabilities](https://snyk.io/test/github/everyoneselectronic/slackify-markup/badge.svg)](https://snyk.io/test/github/everyoneselectronic/slackify-markup)


Slackify-Markup is a Markdown to [Slack-specific-markup](https://slack.com/intl/en-gb/help/articles/202288908-Format-your-messages#markup) converter, based on [jsarafajr/slackify-markdown](https://github.com/jsarafajr/slackify-markdown) and [Unified](https://github.com/unifiedjs/unified) and [Remark](https://github.com/remarkjs/remark/).

## Install

```bash
npm install slackify-markup
```

## Usage

```js
const slackifyMarkup = require('slackify-markup');
const markdown = `
# List of items

* item 1
* item 2
* item 3

[here is an example](https://example.com)
`;

slackifyMarkup(markdown);
/*
 *List of items*

 • item 1
 • item 2
 • item 3

 [here is an example](https://example.com)
/*
```

[MIT Licence](LICENSE)
