"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function () {
  var NUMBERS = 'numberList';

  var NumberCheck =
  /*#__PURE__*/
  function () {
    function NumberCheck() {
      _classCallCheck(this, NumberCheck);

      this.fieldErrors = [];
      this.errorType = {
        invalidNumber: 'Please enter a valid number',
        invalidRange: 'Please enter a valid range',
        negativeNumber: 'Negative number not allowed'
      };
      this.numbers = {
        all: [],
        saved: [],
        fromInput: [],
        unique: [],
        duplicate: []
      };
      this.init();
    }

    _createClass(NumberCheck, [{
      key: "init",
      value: function init() {
        this.displaySavedNumbers();
        this.bindInputKeyEvent();
        this.bindSaveNumbersEvent();
        this.bindRemoveNumbersEvent();
      }
    }, {
      key: "bindInputKeyEvent",
      value: function bindInputKeyEvent() {
        var _this = this;

        document.getElementById('duplicate-number-input').addEventListener('keyup', function (event) {
          event.stopImmediatePropagation();
          _this.inputVal = event.target.value;

          _this.resetErrorMsg();

          _this.resetNumbersOnError();

          _this.validateField();

          _this.generateNumList();

          if (_this.fieldErrors.length === 0 && _this.inputVal) {
            _this.findDuplicate();

            _this.displayDuplicateNumbers();
          }
        });
      }
      /* CREATE NUMBERS */

    }, {
      key: "generateNumList",
      value: function generateNumList() {
        var _this2 = this;

        this.numbers.fromInput = [];
        var valueList = this.inputVal.split(',');
        valueList.forEach(function (crrNo) {
          if (crrNo.indexOf('-') === 0) {
            _this2.showHideErrors(_this2.errorType.negativeNumber);
          } else if (crrNo.indexOf('-') === -1) {
            _this2.generateNumListFromSingleValue(crrNo);
          } else {
            _this2.generateNumListFromRange(crrNo);
          }
        });
        this.generateAllNumbers();
      }
    }, {
      key: "generateNumListFromSingleValue",
      value: function generateNumListFromSingleValue(crrNo) {
        crrNo = parseInt(crrNo);

        if (!isNaN(crrNo)) {
          this.numbers.fromInput.push(crrNo);
        }
      }
    }, {
      key: "generateNumListFromRange",
      value: function generateNumListFromRange(range) {
        var rangeList = [];
        var rangeArr = range.split('-');
        var low = parseInt(rangeArr[0]);
        var high = parseInt(rangeArr[1]);

        if (rangeArr.length !== 2 || isNaN(high) || low >= high) {
          this.showHideErrors(this.errorType.invalidRange);
        } else {
          rangeList = new Array(high - low + 1).fill(undefined).map(function (_, i) {
            return i + low;
          });
          this.numbers.fromInput = this.numbers.fromInput.concat(rangeList);
        }
      }
      /* NUMBERS STORED IN SESSION */

    }, {
      key: "bindSaveNumbersEvent",
      value: function bindSaveNumbersEvent() {
        var _this3 = this;

        document.getElementById('store-numbers').addEventListener('submit', function (event) {
          event.preventDefault();

          _this3.setSavedNumbers(_this3.numbers.once.sort(function (a, b) {
            return a - b;
          }));

          _this3.resetWarningMsg();

          _this3.displaySavedNumbers();

          alert('Saved!');
          event.target.reset();
        });
      }
    }, {
      key: "bindRemoveNumbersEvent",
      value: function bindRemoveNumbersEvent() {
        var _this4 = this;

        document.getElementById('clear-existing').addEventListener('click', function () {
          _this4.removeSavedNumbers();

          _this4.displaySavedNumbers();
        });
      }
    }, {
      key: "getSavedNumbers",
      value: function getSavedNumbers() {
        return JSON.parse(window.sessionStorage.getItem(NUMBERS));
      }
    }, {
      key: "removeSavedNumbers",
      value: function removeSavedNumbers() {
        window.sessionStorage.removeItem(NUMBERS);
      }
    }, {
      key: "setSavedNumbers",
      value: function setSavedNumbers(numbers) {
        window.sessionStorage.setItem(NUMBERS, JSON.stringify(numbers));
      }
    }, {
      key: "displaySavedNumbers",
      value: function displaySavedNumbers() {
        var savedNumbers = this.getSavedNumbers();

        if (savedNumbers === null || savedNumbers.length === 0) {
          this.numbers.saved = [];
          document.getElementById('existing-numbers-wrapper').classList.add('hidden');
        } else {
          this.numbers.saved = savedNumbers;
          document.getElementById('existing-numbers').innerHTML = this.numbers.saved.join(', ');
          this.generateAllNumbers();
          document.getElementById('existing-numbers-wrapper').classList.remove('hidden');
        }
      }
    }, {
      key: "generateAllNumbers",
      value: function generateAllNumbers() {
        this.numbers.all = this.numbers.saved.concat(this.numbers.fromInput);
      }
      /* VALIDATION */

    }, {
      key: "showHideErrors",
      value: function showHideErrors(err) {
        if (!this.inputVal) {
          this.fieldErrors = [];
        } else {
          if (this.fieldErrors.indexOf(err) === -1) {
            this.fieldErrors.push(err);
          }
        }

        this.appendErrors();
      }
    }, {
      key: "appendErrors",
      value: function appendErrors() {
        var errDom = document.getElementById('duplicate-number-error');
        var submitBtn = document.getElementById('submit-numbers');

        if (this.fieldErrors.length > 0) {
          errDom.innerHTML = this.fieldErrors.map(function (error) {
            return "<li>".concat(error, "</li>");
          }).join(' ');
          submitBtn.setAttribute('disabled', 'disabled');
          this.resetNumbersOnError();
          errDom.classList.remove('hidden');
        } else {
          this.resetErrorMsg(errDom, submitBtn);
        }
      }
    }, {
      key: "validateField",
      value: function validateField() {
        var numbersPattern = /^[0-9,-]+$/;

        if (!this.inputVal.match(numbersPattern)) {
          this.showHideErrors(this.errorType.invalidNumber);
        }
      }
    }, {
      key: "resetWarningMsg",
      value: function resetWarningMsg(dupeNumElem, dupeWarnElem) {
        dupeNumElem = dupeNumElem || document.getElementById('duplicate-numbers-list');
        dupeWarnElem = dupeWarnElem || document.getElementById('duplicate-warning');
        dupeNumElem.innerHTML = '';
        dupeWarnElem.classList.add('hidden');
      }
    }, {
      key: "resetNumbersOnError",
      value: function resetNumbersOnError() {
        this.numbers.duplicate = [];
        this.numbers.once = [];
        this.resetWarningMsg();
      }
    }, {
      key: "resetErrorMsg",
      value: function resetErrorMsg(elem, submitBtn) {
        var dupeElem = elem || document.getElementById('duplicate-number-error');
        submitBtn = submitBtn || document.getElementById('submit-numbers');
        this.fieldErrors = [];
        dupeElem.innerHTML = '';
        dupeElem.classList.add('hidden');

        if (this.inputVal) {
          submitBtn.removeAttribute('disabled');
        } else {
          submitBtn.setAttribute('disabled', 'disabled');
        }
      }
      /* DUPLICATES */

    }, {
      key: "findDuplicate",
      value: function findDuplicate() {
        var _this5 = this;

        this.numbers.all.forEach(function (num) {
          if (_this5.numbers.once.indexOf(num) === -1) {
            _this5.numbers.once.push(num);
          } else if (_this5.numbers.duplicate.indexOf(num) === -1) {
            _this5.numbers.duplicate.push(num);
          }
        });
      }
    }, {
      key: "displayDuplicateNumbers",
      value: function displayDuplicateNumbers() {
        var dupeNumElem = document.getElementById('duplicate-numbers-list');
        var dupeWarnElem = document.getElementById('duplicate-warning');

        if (this.numbers.duplicate.length > 0) {
          dupeNumElem.innerHTML = this.numbers.duplicate.join(', ');
          dupeWarnElem.classList.remove('hidden');
        } else {
          this.resetWarningMsg(dupeNumElem, dupeWarnElem);
        }
      }
    }]);

    return NumberCheck;
  }();

  return new NumberCheck();
})();
