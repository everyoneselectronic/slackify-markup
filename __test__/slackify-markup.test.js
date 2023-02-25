const slackifyMarkup = require('..');

const zws = String.fromCharCode(0x200B); // zero-width-space

test('Simple text', () => {
  expect(slackifyMarkup('hello world')).toBe('hello world\n');
});

test('Escaped text', () => {
  expect(slackifyMarkup('*h&ello>world<')).toBe('*h&amp;ello&gt;world&lt;\n');
});

test('Definitions', () => {
  const mrkdown = 'hello\n\n[1]: http://atlassian.com\n\nworld\n\n[2]: http://atlassian.com';
  const slack = 'hello\n\nworld\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Headings', () => {
  const mrkdown = '# heading 1\n## heading 2\n### heading 3';
  const slack = '*heading 1*\n\n*heading 2*\n\n*heading 3*\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Bold', () => {
  const mrkdown = '**bold text**';
  const slack = `${zws}*bold text*${zws}\n`;
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Bold character in word', () => {
  expect(slackifyMarkup('he**l**lo')).toBe(`he${zws}*l*${zws}lo\n`);
});

test('Italic', () => {
  const mrkdown = '*italic text*';
  const slack = `${zws}_italic text_${zws}\n`;
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Bold+Italic', () => {
  const mrkdown = '***bold+italic***';
  const slack = `${zws}_${zws}*bold+italic*${zws}_${zws}\n`;
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Strike', () => {
  const mrkdown = '~~strike text~~';
  const slack = `${zws}~strike text~${zws}\n`;
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Unordered list', () => {
  const mrkdown = '* list\n* list\n* list';
  const slack = '•   list\n•   list\n•   list\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Ordered list', () => {
  const mrkdown = '1. list\n2. list\n3. list';
  const slack = '1.  list\n2.  list\n3.  list\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Link with title', () => {
  const mrkdown = '[](http://atlassian.com "Atlassian")';
  const slack = '[Atlassian](http://atlassian.com)\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Link with alt', () => {
  const mrkdown = '[test](http://atlassian.com)';
  const slack = '[test](http://atlassian.com)\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Link with alt and title', () => {
  const mrkdown = '[test](http://atlassian.com "Atlassian")';
  const slack = '[test](http://atlassian.com)\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Link with angle bracket syntax', () => {
  const mrkdown = '<http://atlassian.com>';
  const slack = 'http://atlassian.com\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Link with no alt nor title', () => {
  const mrkdown = '[](http://atlassian.com)';
  const slack = 'http://atlassian.com\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Link with invalid URL', () => {
  const mrkdown = '[test](/atlassian)';
  const slack = 'test\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Link in reference style with alt', () => {
  const mrkdown = '[Atlassian]\n\n[atlassian]: http://atlassian.com';
  const slack = '[Atlassian](http://atlassian.com)\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Link in reference style with custom label', () => {
  const mrkdown = '[][test]\n\n[test]: http://atlassian.com';
  const slack = 'http://atlassian.com\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Link in reference style with alt and custom label', () => {
  const mrkdown = '[Atlassian][test]\n\n[test]: http://atlassian.com';
  const slack = '[Atlassian](http://atlassian.com)\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Link in reference style with title', () => {
  const mrkdown = '[][test]\n\n[test]: http://atlassian.com "Title"';
  const slack = '[Title](http://atlassian.com)\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Link in reference style with alt and title', () => {
  const mrkdown = '[Atlassian]\n\n[atlassian]: http://atlassian.com "Title"';
  const slack = '[Atlassian](http://atlassian.com)\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Link is already encoded', () => {
  const mrkdown = '[Atlassian](https://www.atlassian.com?redirect=https%3A%2F%2Fwww.asana.com): /atlassian';
  const slack = '[Atlassian](https://www.atlassian.com?redirect=https%3A%2F%2Fwww.asana.com): /atlassian\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Link in reference style with invalid definition', () => {
  const mrkdown = '[Atlassian][test]\n\n[test]: /atlassian';
  const slack = 'Atlassian\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Image with title', () => {
  const mrkdown = '![](https://bitbucket.org/repo/123/images/logo.png "test")';
  const slack = '[test](https://bitbucket.org/repo/123/images/logo.png)\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Image with alt', () => {
  const mrkdown = '![logo.png](https://bitbucket.org/repo/123/images/logo.png)';
  const slack = '[logo.png](https://bitbucket.org/repo/123/images/logo.png)\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Image with alt and title', () => {
  const mrkdown = "![logo.png](https://bitbucket.org/repo/123/images/logo.png 'test')";
  const slack = '[logo.png](https://bitbucket.org/repo/123/images/logo.png)\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Image with no alt nor title', () => {
  const mrkdown = '![](https://bitbucket.org/repo/123/images/logo.png)';
  const slack = 'https://bitbucket.org/repo/123/images/logo.png\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Image with invalid URL', () => {
  const mrkdown = "![logo.png](/relative-path-logo.png 'test')";
  const slack = 'logo.png\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Image in reference style with alt', () => {
  const mrkdown = '![Atlassian]\n\n[atlassian]: https://bitbucket.org/repo/123/images/logo.png';
  const slack = '[Atlassian](https://bitbucket.org/repo/123/images/logo.png)\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Image in reference style with custom label', () => {
  const mrkdown = '![][test]\n\n[test]: https://bitbucket.org/repo/123/images/logo.png';
  const slack = 'https://bitbucket.org/repo/123/images/logo.png\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Image in reference style with alt and custom label', () => {
  const mrkdown = '![Atlassian][test]\n\n[test]: https://bitbucket.org/repo/123/images/logo.png';
  const slack = '[Atlassian](https://bitbucket.org/repo/123/images/logo.png)\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Image in reference style with title', () => {
  const mrkdown = '![][test]\n\n[test]: https://bitbucket.org/repo/123/images/logo.png "Title"';
  const slack = '[Title](https://bitbucket.org/repo/123/images/logo.png)\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Image in reference style with alt and title', () => {
  const mrkdown = '![Atlassian]\n\n[atlassian]: https://bitbucket.org/repo/123/images/logo.png "Title"';
  const slack = '[Atlassian](https://bitbucket.org/repo/123/images/logo.png)\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Image in reference style with invalid definition', () => {
  const mrkdown = '![Atlassian][test]\n\n[test]: /relative-path-logo.png';
  const slack = 'Atlassian\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Inline code', () => {
  const mrkdown = 'hello `world`';
  const slack = 'hello `world`\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Code block', () => {
  const mrkdown = '```\ncode block\n```';
  const slack = '```\ncode block\n```\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Code block with newlines', () => {
  const mrkdown = '```\ncode\n\n\nblock\n```';
  const slack = '```\ncode\n\n\nblock\n```\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Code block with language', () => {
  const mrkdown = '```javascript\ncode block\n```';
  const slack = '```\ncode block\n```\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('Code block with deprecated language declaration', () => {
  const mrkdown = '```\n#!javascript\ncode block\n```';
  const slack = '```\ncode block\n```\n';
  expect(slackifyMarkup(mrkdown)).toBe(slack);
});

test('User mention', () => {
  const mrkdown = '<@UPXGB22A2>';
  const slack = '<@UPXGB22A2>\n';

  expect(slackifyMarkup(mrkdown)).toBe(slack);
});
