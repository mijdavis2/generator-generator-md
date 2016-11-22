'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

module.exports = yeoman.Base.extend({
  _defaultYear: function () {
    return (new Date).getFullYear();
  },

  constructor: function () {
    yeoman.Base.apply(this, arguments);
    this.log(yosay(
      chalk.red('Welcome!') + '\n' +
      chalk.yellow('You\'re using the <%= appName %> generator - <%= packageDescription %>!')
    ));
  },

  prompting: function () {
    return this.prompt([
      {
        type    : 'input',
        name    : 'useDirectory',
        message : 'Target directory for new application (default is current directory): \n',
        default : this.appname // Default to current folder name
      },
      {
        type   : 'input',
        name   : 'packageName',
        message: 'Your project name: ',
        default: this.appname // Default to current folder name
      },
      {
        type   : 'input',
        name   : 'packageDescription',
        message: 'A description of your package: '
      },
      {
        type   : 'input',
        name   : 'username',
        message: 'Your github username: '
      },
      {
        name   : 'license',
        message: 'Select license:',
        type   : 'list',
        choices: [
          {
            value: 'MIT',
            name : 'MIT'
          },
          {
            value: 'ApacheV2',
            name : 'Apache v2'
          },
          {
            value: null,
            name : 'None'
          }
        ]
      }
    ]).then(function (answers) {
      this.log('package name', answers.packageName);
      this.answers = answers;
      if (this.answers.license) {
        this.answers.includeLicense = 'include LICENSE';
      } else {
        this.answers.includeLicense = '';
      }
    }.bind(this));
  },

  writing: function () {
    this._templateMap = {
      packageName: this.answers.packageName,
      appName: this.answers.packageName,
      appTitle: _.startCase(this.answers.packageName),
      username: this.answers.username,
      userName: this.answers.username,
      packageDescription: this.answers.packageDescription,
      license: this.answers.license,
      year: this._defaultYear(),
      includeLicense: this.answers.includeLicense
    };
    if (this.answers.useDirectory !== this.appname) {
      this.destinationRoot(this.answers.useDirectory);
    }
    this.fs.copyTpl(
      this.templatePath('*'),
      this.destinationRoot(),
      this._templateMap
    );
    this.fs.copyTpl(
      this.templatePath('tests/*'),
      this.destinationPath('tests/'),
      this._templateMap
    );
    this.fs.copyTpl(
      this.templatePath('dot_github/*'),
      this.destinationPath('.github/'),
      this._templateMap
    );
    this.fs.copyTpl(
      this.templatePath('dotfiles/.*'),
      this.destinationRoot(),
      this._templateMap
    );
    if (this.answers.license) {
      this.fs.copyTpl(
        this.templatePath('licenses/' + this.answers.license),
        this.destinationPath('LICENSE'),
        this._templateMap
      );
    }
  },

  install: function () {
    this.installDependencies();
  }
});
