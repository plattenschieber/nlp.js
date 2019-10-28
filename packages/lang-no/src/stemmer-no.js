/*
 * Copyright (c) AXA Group Operations Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const { Among, BaseStemmer } = require('@nlpjs/core');

/* eslint-disable */

/**
 * This class was automatically generated by a Snowball to JSX compiler
 * It implements the stemming algorithm defined by a snowball script.
 */

class StemmerNo extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-no';
    this.I_x = 0;
    this.I_p1 = 0;
  }

  copy_from(other) {
    this.I_x = other.I_x;
    this.I_p1 = other.I_p1;
    super.copy_from(other);
  }

  r_mark_regions() {
    let v_1;
    let v_2;
    // (, line 26
    this.I_p1 = this.limit;
    // test, line 30
    v_1 = this.cursor;
    // (, line 30
    // hop, line 30
    {
      const c = this.cursor + 3;
      if (c < 0 || c > this.limit) {
        return false;
      }
      this.cursor = c;
    }
    // setmark x, line 30
    this.I_x = this.cursor;
    this.cursor = v_1;
    // goto, line 31
    golab0: while (true) {
      v_2 = this.cursor;
      let lab1 = true;
      while (lab1 == true) {
        lab1 = false;
        if (!this.in_grouping(StemmerNo.g_v, 97, 248)) {
          break;
        }
        this.cursor = v_2;
        break golab0;
      }
      this.cursor = v_2;
      if (this.cursor >= this.limit) {
        return false;
      }
      this.cursor++;
    }
    // gopast, line 31
    golab2: while (true) {
      let lab3 = true;
      while (lab3 == true) {
        lab3 = false;
        if (!this.out_grouping(StemmerNo.g_v, 97, 248)) {
          break;
        }
        break golab2;
      }
      if (this.cursor >= this.limit) {
        return false;
      }
      this.cursor++;
    }
    // setmark p1, line 31
    this.I_p1 = this.cursor;
    // try, line 32
    let lab4 = true;
    while (lab4 == true) {
      lab4 = false;
      // (, line 32
      if (!(this.I_p1 < this.I_x)) {
        break;
      }
      this.I_p1 = this.I_x;
    }
    return true;
  }

  r_main_suffix() {
    let among_var;
    let v_1;
    let v_2;
    let v_3;
    // (, line 37
    // setlimit, line 38
    v_1 = this.limit - this.cursor;
    // tomark, line 38
    if (this.cursor < this.I_p1) {
      return false;
    }
    this.cursor = this.I_p1;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 38
    // [, line 38
    this.ket = this.cursor;
    // substring, line 38
    among_var = this.find_among_b(StemmerNo.a_0, 29);
    if (among_var == 0) {
      this.limit_backward = v_2;
      return false;
    }
    // ], line 38
    this.bra = this.cursor;
    this.limit_backward = v_2;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 44
        // delete, line 44
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 46
        // or, line 46
        var lab0 = true;
        lab0: while (lab0 == true) {
          lab0 = false;
          v_3 = this.limit - this.cursor;
          let lab1 = true;
          while (lab1 == true) {
            lab1 = false;
            if (!this.in_grouping_b(StemmerNo.g_s_ending, 98, 122)) {
              break;
            }
            break lab0;
          }
          this.cursor = this.limit - v_3;
          // (, line 46
          // literal, line 46
          if (!this.eq_s_b(1, 'k')) {
            return false;
          }
          if (!this.out_grouping_b(StemmerNo.g_v, 97, 248)) {
            return false;
          }
        }
        // delete, line 46
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 3:
        // (, line 48
        // <-, line 48
        if (!this.slice_from('er')) {
          return false;
        }
        break;
    }
    return true;
  }

  r_consonant_pair() {
    let v_1;
    let v_2;
    let v_3;
    // (, line 52
    // test, line 53
    v_1 = this.limit - this.cursor;
    // (, line 53
    // setlimit, line 54
    v_2 = this.limit - this.cursor;
    // tomark, line 54
    if (this.cursor < this.I_p1) {
      return false;
    }
    this.cursor = this.I_p1;
    v_3 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_2;
    // (, line 54
    // [, line 54
    this.ket = this.cursor;
    // substring, line 54
    if (this.find_among_b(StemmerNo.a_1, 2) == 0) {
      this.limit_backward = v_3;
      return false;
    }
    // ], line 54
    this.bra = this.cursor;
    this.limit_backward = v_3;
    this.cursor = this.limit - v_1;
    // next, line 59
    if (this.cursor <= this.limit_backward) {
      return false;
    }
    this.cursor--;
    // ], line 59
    this.bra = this.cursor;
    // delete, line 59
    if (!this.slice_del()) {
      return false;
    }
    return true;
  }

  r_other_suffix() {
    let among_var;
    let v_1;
    let v_2;
    // (, line 62
    // setlimit, line 63
    v_1 = this.limit - this.cursor;
    // tomark, line 63
    if (this.cursor < this.I_p1) {
      return false;
    }
    this.cursor = this.I_p1;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 63
    // [, line 63
    this.ket = this.cursor;
    // substring, line 63
    among_var = this.find_among_b(StemmerNo.a_2, 11);
    if (among_var == 0) {
      this.limit_backward = v_2;
      return false;
    }
    // ], line 63
    this.bra = this.cursor;
    this.limit_backward = v_2;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 67
        // delete, line 67
        if (!this.slice_del()) {
          return false;
        }
        break;
    }
    return true;
  }

  innerStem() {
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    // (, line 72
    // do, line 74
    v_1 = this.cursor;
    let lab0 = true;
    while (lab0 == true) {
      lab0 = false;
      // call mark_regions, line 74
      if (!this.r_mark_regions()) {
        break;
      }
    }
    this.cursor = v_1;
    // backwards, line 75
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    // (, line 75
    // do, line 76
    v_2 = this.limit - this.cursor;
    let lab1 = true;
    while (lab1 == true) {
      lab1 = false;
      // call main_suffix, line 76
      if (!this.r_main_suffix()) {
        break;
      }
    }
    this.cursor = this.limit - v_2;
    // do, line 77
    v_3 = this.limit - this.cursor;
    let lab2 = true;
    while (lab2 == true) {
      lab2 = false;
      // call consonant_pair, line 77
      if (!this.r_consonant_pair()) {
        break;
      }
    }
    this.cursor = this.limit - v_3;
    // do, line 78
    v_4 = this.limit - this.cursor;
    let lab3 = true;
    while (lab3 == true) {
      lab3 = false;
      // call other_suffix, line 78
      if (!this.r_other_suffix()) {
        break;
      }
    }
    this.cursor = this.limit - v_4;
    this.cursor = this.limit_backward;
    return true;
  }
}

StemmerNo.methodObject = new StemmerNo();

StemmerNo.a_0 = [
  new Among('a', -1, 1),
  new Among('e', -1, 1),
  new Among('ede', 1, 1),
  new Among('ande', 1, 1),
  new Among('ende', 1, 1),
  new Among('ane', 1, 1),
  new Among('ene', 1, 1),
  new Among('hetene', 6, 1),
  new Among('erte', 1, 3),
  new Among('en', -1, 1),
  new Among('heten', 9, 1),
  new Among('ar', -1, 1),
  new Among('er', -1, 1),
  new Among('heter', 12, 1),
  new Among('s', -1, 2),
  new Among('as', 14, 1),
  new Among('es', 14, 1),
  new Among('edes', 16, 1),
  new Among('endes', 16, 1),
  new Among('enes', 16, 1),
  new Among('hetenes', 19, 1),
  new Among('ens', 14, 1),
  new Among('hetens', 21, 1),
  new Among('ers', 14, 1),
  new Among('ets', 14, 1),
  new Among('et', -1, 1),
  new Among('het', 25, 1),
  new Among('ert', -1, 3),
  new Among('ast', -1, 1)
];

StemmerNo.a_1 = [new Among('dt', -1, -1), new Among('vt', -1, -1)];

StemmerNo.a_2 = [
  new Among('leg', -1, 1),
  new Among('eleg', 0, 1),
  new Among('ig', -1, 1),
  new Among('eig', 2, 1),
  new Among('lig', 2, 1),
  new Among('elig', 4, 1),
  new Among('els', -1, 1),
  new Among('lov', -1, 1),
  new Among('elov', 7, 1),
  new Among('slov', 7, 1),
  new Among('hetslov', 9, 1)
];

StemmerNo.g_v = [
  17,
  65,
  16,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  48,
  0,
  128
];

StemmerNo.g_s_ending = [119, 125, 149, 1];

module.exports = StemmerNo;
