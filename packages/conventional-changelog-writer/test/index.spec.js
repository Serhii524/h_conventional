'use strict';
var conventionalcommitsWriter = require('../');
var dateFormat = require('dateformat');
var expect = require('chai').expect;
var through = require('through2');

describe('conventionalCommitsWriter', function() {
  function getStream() {
    var upstream = through.obj();
    upstream.write({
      hash: '9b1aff905b638aa274a5fc8f88662df446d374bd',
      header: 'feat(scope): broadcast $destroy event on scope destruction',
      type: 'feat',
      scope: 'scope',
      subject: 'broadcast $destroy event on scope destruction',
      body: null,
      footer: 'Closes #1',
      notes: [{
        title: 'BREAKING NEWS',
        text: 'breaking news'
      }],
      references: [{
        action: 'Closes',
        repository: null,
        issue: '1',
        raw: '#1'
      }, {
        action: 'Closes',
        repository: null,
        issue: '2',
        raw: '#2'
      }, {
        action: 'Closes',
        repository: null,
        issue: '3',
        raw: '#3'
      }]
    });
    upstream.write({
      hash: '13f31602f396bc269076ab4d389cfd8ca94b20ba',
      header: 'fix(ng-list): Allow custom separator',
      type: 'fix',
      scope: 'ng-list',
      subject: 'Allow custom separator',
      body: 'bla bla bla',
      footer: 'BREAKING CHANGE: some breaking change',
      notes: [{
        title: 'BREAKING CHANGE',
        text: 'some breaking change'
      }],
      references: []
    });
    upstream.write({
      hash: '2064a9346c550c9b5dbd17eee7f0b7dd2cde9cf7',
      header: 'perf(template): tweak',
      type: 'perf',
      scope: 'template',
      subject: 'tweak',
      body: 'My body.',
      footer: '',
      notes: [],
      references: []
    });
    upstream.write({
      hash: '5f241416b79994096527d319395f654a8972591a',
      header: 'refactor(name): rename this module to conventional-commits-writer',
      type: 'refactor',
      scope: 'name',
      subject: 'rename this module to conventional-commits-writer',
      body: '',
      footer: '',
      notes: [],
      references: []
    });
    upstream.end();

    return upstream;
  }

  describe('host', function() {
    it('should work if there is a "/" at the end of host', function(done) {
      getStream()
        .pipe(conventionalcommitsWriter({
          version: '0.0.1',
          title: 'this is a title',
          host: 'https://github.com/',
          repository: 'a/b'
        }))
        .pipe(through(function(chunk, enc, cb) {
          expect(chunk.toString()).to.equal('<a name="0.0.1"></a>\n## 0.0.1 "this is a title" (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n### Bug Fixes\n\n* **ng-list:** Allow custom separator ([13f3160][https://github.com/a/b/commits/13f3160])\n\n### Features\n\n* **scope:** broadcast $destroy event on scope destruction ([9b1aff9][https://github.com/a/b/commits/9b1aff9]), closes [#1](https://github.com/a/b/issues/1) [#2](https://github.com/a/b/issues/2) [#3](https://github.com/a/b/issues/3)\n\n### Performance Improvements\n\n* **template:** tweak ([2064a93][https://github.com/a/b/commits/2064a93])\n\n* **name:** rename this module to conventional-commits-writer ([5f24141][https://github.com/a/b/commits/5f24141])\n\n\n### BREAKING CHANGES\n\n* some breaking change\n\n\n\n');
          cb(null);
        }, function() {
          done();
        }));
    });
  });

  describe('link', function() {
    it('should link if host, repository, commit and issue are truthy', function(done) {
      getStream()
        .pipe(conventionalcommitsWriter({
          version: '0.5.0',
          title: 'this is a title',
          host: 'https://github.com',
          repository: 'a/b'
        }))
        .pipe(through(function(chunk, enc, cb) {
          expect(chunk.toString()).to.equal('<a name="0.5.0"></a>\n# 0.5.0 "this is a title" (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n### Bug Fixes\n\n* **ng-list:** Allow custom separator ([13f3160][https://github.com/a/b/commits/13f3160])\n\n### Features\n\n* **scope:** broadcast $destroy event on scope destruction ([9b1aff9][https://github.com/a/b/commits/9b1aff9]), closes [#1](https://github.com/a/b/issues/1) [#2](https://github.com/a/b/issues/2) [#3](https://github.com/a/b/issues/3)\n\n### Performance Improvements\n\n* **template:** tweak ([2064a93][https://github.com/a/b/commits/2064a93])\n\n* **name:** rename this module to conventional-commits-writer ([5f24141][https://github.com/a/b/commits/5f24141])\n\n\n### BREAKING CHANGES\n\n* some breaking change\n\n\n\n');
          cb(null);
        }, function() {
          done();
        }));
    });

    it ('should not link otherwise', function(done) {
      getStream()
        .pipe(conventionalcommitsWriter())
        .pipe(through(function(chunk, enc, cb) {
          expect(chunk.toString()).to.equal('<a name=""></a>\n#  (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n### Bug Fixes\n\n* **ng-list:** Allow custom separator 13f3160\n\n### Features\n\n* **scope:** broadcast $destroy event on scope destruction 9b1aff9, closes #1 #2 #3\n\n### Performance Improvements\n\n* **template:** tweak 2064a93\n\n* **name:** rename this module to conventional-commits-writer 5f24141\n\n\n### BREAKING CHANGES\n\n* some breaking change\n\n\n\n');
          cb(null);
        }, function() {
          done();
        }));
    });
  });
});
