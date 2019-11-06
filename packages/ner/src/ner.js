/*
 * Copyright (c) AXA Group Operations Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const { Clonable } = require('@nlpjs/core');
const { TrimType } = require('./trim-types');

class Ner extends Clonable {
  constructor(settings = {}, container) {
    super(
      {
        settings: {},
        container: settings.container || container,
      },
      container
    );
    this.applySettings(this.settings, settings);
    this.applySettings(this.settings, { locale: 'en' });
    if (!this.settings.tag) {
      this.settings.tag = `ner-${this.settings.locale}`;
    }
    this.registerDefault();
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
    this.rules = {};
    this.applySettings(this, {
      pipelineProcess: this.getPipeline(`${this.settings.tag}-process`),
    });
  }

  registerDefault() {
    this.container.registerPipeline(
      'ner-??-process',
      ['.decideRules', 'extract-enum', 'extract-regex', 'extract-trim'],
      false
    );
  }

  getRulesByName(locale = '*', name, force = false) {
    if (!this.rules[locale]) {
      if (!force) {
        return undefined;
      }
      this.rules[locale] = {};
    }
    if (!this.rules[locale][name]) {
      if (!force) {
        return undefined;
      }
      this.rules[locale][name] = {
        name,
        type: 'enum',
        rules: [],
      };
    }
    return this.rules[locale][name];
  }

  addRule(locale = '*', name, type, rule) {
    if (!this.rules[locale]) {
      this.rules[locale] = {};
    }
    if (!this.rules[locale][name]) {
      this.rules[locale][name] = {
        name,
        type,
        rules: [],
      };
    }
    this.rules[locale][name].rules.push(rule);
  }

  asString(item) {
    if (item && item.toString) {
      return item.toString();
    }
    return JSON.stringify(item);
  }

  findRule(rules, rule) {
    const str = this.asString(rule);
    for (let i = 0; i < rules.length; i += 1) {
      if (this.asString(rules[i]) === str) {
        return i;
      }
    }
    return -1;
  }

  removeRule(locale = '*', name, rule) {
    if (this.rules[locale]) {
      if (this.rules[locale][name]) {
        if (!rule) {
          delete this.rules[locale][name];
        } else {
          const index = this.findRule(this.rules[locale][name].rules, rule);
          if (index > -1) {
            this.rules[locale][name].rules.splice(index, 1);
          }
        }
      }
    }
  }

  getRules(locale = '*') {
    const result = [];
    if (this.rules[locale]) {
      const keys = Object.keys(this.rules[locale]);
      for (let i = 0; i < keys.length; i += 1) {
        result.push(this.rules[locale][keys[i]]);
      }
    }
    if (locale !== '*' && this.rules['*']) {
      const keys = Object.keys(this.rules['*']);
      for (let i = 0; i < keys.length; i += 1) {
        result.push(this.rules['*'][keys[i]]);
      }
    }
    return result;
  }

  decideRules(srcInput) {
    const input = srcInput;
    input.nerRules = this.getRules(input.locale || 'en');
    return input;
  }

  getRuleOption(rules, option) {
    for (let i = 0; i < rules.length; i += 1) {
      if (rules[i].option === option) {
        return rules[i];
      }
    }
    return undefined;
  }

  addRuleOptionTexts(locale, name, option, srcTexts) {
    if (Array.isArray(locale)) {
      for (let i = 0; i < locale.length; i += 1) {
        this.addRuleOptionTexts(locale[i], name, option, srcTexts);
      }
    } else {
      let texts = srcTexts || option;
      if (!Array.isArray(texts)) {
        texts = [texts];
      }
      const rules = this.getRulesByName(locale, name, true);
      let ruleOption = this.getRuleOption(rules.rules, option);
      if (!ruleOption) {
        ruleOption = {
          option,
          texts,
        };
        rules.rules.push(ruleOption);
      } else {
        const dict = {};
        for (let i = 0; i < ruleOption.texts.length; i += 1) {
          dict[ruleOption.texts[i]] = 1;
        }
        for (let i = 0; i < texts.length; i += 1) {
          dict[texts[i]] = 1;
        }
        ruleOption.texts = Object.keys(dict);
      }
    }
  }

  removeRuleOptionTexts(locale, name, option, srcTexts) {
    if (Array.isArray(locale)) {
      for (let i = 0; i < locale.length; i += 1) {
        this.removeRuleOptionTexts(locale[i], name, option, srcTexts);
      }
    } else {
      let texts = srcTexts || option;
      if (!Array.isArray(texts)) {
        texts = [texts];
      }
      const rules = this.getRulesByName(locale, name, false);
      if (rules) {
        const ruleOption = this.getRuleOption(rules.rules, option);
        if (ruleOption) {
          const dict = {};
          for (let i = 0; i < ruleOption.texts.length; i += 1) {
            dict[ruleOption.texts[i]] = 1;
          }
          for (let i = 0; i < texts.length; i += 1) {
            delete dict[texts[i]];
          }
          ruleOption.texts = Object.keys(dict);
        }
      }
    }
  }

  static str2regex(str) {
    const index = str.lastIndexOf('/');
    return new RegExp(str.slice(1, index), str.slice(index + 1));
  }

  static regex2str(regex) {
    return regex.toString();
  }

  addRegexRule(locale, name, srcRegex) {
    const regex =
      typeof srcRegex === 'string' ? Ner.str2regex(srcRegex) : srcRegex;
    const globalFlag = 'g';
    const fixedRegex = regex.flags.includes(globalFlag)
      ? regex
      : new RegExp(regex.source, `${regex.flags}${globalFlag}`);
    this.addRule(locale, name, 'regex', fixedRegex);
  }

  addBetweenCondition(locale, name, srcLeftWords, srcRightWords, srcOptions) {
    const options = srcOptions || {};
    const leftWords = Array.isArray(srcLeftWords)
      ? srcLeftWords
      : [srcLeftWords];
    const rightWords = Array.isArray(srcRightWords)
      ? srcRightWords
      : [srcRightWords];
    const conditions = [];
    for (let i = 0; i < leftWords.length; i += 1) {
      for (let j = 0; j < rightWords.length; j += 1) {
        const leftWord =
          options.noSpaces === true ? leftWords[i] : ` ${leftWords[i]} `;
        const rightWord =
          options.noSpaces === true ? rightWords[j] : ` ${rightWords[j]} `;
        conditions.push(`(?<=${leftWord})(.*)(?=${rightWord})`);
      }
    }
    let regex = `/${conditions.join('|')}/g`;
    if (!(options.caseSensitive === true)) {
      regex += 'i';
    }
    const rule = {
      type: 'between',
      leftWords,
      rightWords,
      regex: Ner.str2regex(regex),
      options,
    };
    this.addRule(locale, name, 'trim', rule);
  }

  addPositionCondition(locale, name, position, srcWords, srcOptions) {
    const options = srcOptions || {};
    const words = Array.isArray(srcWords) ? srcWords : [srcWords];
    const rule = {
      type: position,
      words,
      options,
    };
    this.addRule(locale, name, 'trim', rule);
  }

  addAfterCondition(locale, words, opts) {
    this.addPositionCondition(TrimType.After, locale, words, opts);
  }

  addAfterFirstCondition(locale, words, opts) {
    this.addPositionCondition(TrimType.AfterFirst, locale, words, opts);
  }

  addAfterLastCondition(locale, words, opts) {
    this.addPositionCondition(TrimType.AfterLast, locale, words, opts);
  }

  addBeforeCondition(locale, words, opts) {
    this.addPositionCondition(TrimType.Before, locale, words, opts);
  }

  addBeforeFirstCondition(locale, words, opts) {
    this.addPositionCondition(TrimType.BeforeFirst, locale, words, opts);
  }

  addBeforeLastCondition(locale, words, opts) {
    this.addPositionCondition(TrimType.BeforeLast, locale, words, opts);
  }

  process(input) {
    return this.runPipeline(input, this.pipelineProcess);
  }
}

module.exports = Ner;
