if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function(value) {

      // Steps 1-2.
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }

      var O = Object(this);

      // Steps 3-5.
      var len = O.length >>> 0;

      // Steps 6-7.
      var start = arguments[1];
      var relativeStart = start >> 0;

      // Step 8.
      var k = relativeStart < 0 ?
        Math.max(len + relativeStart, 0) :
        Math.min(relativeStart, len);

      // Steps 9-10.
      var end = arguments[2];
      var relativeEnd = end === undefined ?
        len : end >> 0;

      // Step 11.
      var final = relativeEnd < 0 ?
        Math.max(len + relativeEnd, 0) :
        Math.min(relativeEnd, len);

      // Step 12.
      while (k < final) {
        O[k] = value;
        k++;
      }

      // Step 13.
      return O;
    }
  });
}

(function () {
	const NUMBERS = 'numberList';

	class NumberCheck {
		constructor() {
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
			}
			this.init();
		}

		init() {
			this.displaySavedNumbers();
			this.bindInputKeyEvent();
			this.bindSaveNumbersEvent();
			this.bindRemoveNumbersEvent();
		}


		bindInputKeyEvent() {
			document.getElementById('duplicate-number-input').addEventListener('keyup', (event) => {
				event.stopImmediatePropagation();
				this.inputVal = event.target.value;

				this.resetErrorMsg();
				this.resetNumbersOnError();

				this.validateField();
				this.generateNumList();

				if (this.fieldErrors.length === 0 && this.inputVal) {
					this.findDuplicate();
					this.displayDuplicateNumbers();
				}
			});
		}

		/* CREATE NUMBERS */

		generateNumList() {
			this.numbers.fromInput = [];
			let valueList = this.inputVal.split(',');

			valueList.forEach(crrNo => {
				if (crrNo.indexOf('-') === 0) {
					this.showHideErrors(this.errorType.negativeNumber);
				}
				else if (crrNo.indexOf('-') === -1) {
					this.generateNumListFromSingleValue(crrNo);
				}
				else {
					this.generateNumListFromRange(crrNo);
				}
			});
			this.generateAllNumbers();
		}

		generateNumListFromSingleValue(crrNo) {
			crrNo = parseInt(crrNo);
			if (!isNaN(crrNo)) {
				this.numbers.fromInput.push(crrNo);
			}
		}

		generateNumListFromRange(range) {
			let rangeList = [];
			let rangeArr = range.split('-');
			let low = parseInt(rangeArr[0]);
			let high = parseInt(rangeArr[1]);

			if (rangeArr.length !== 2 || isNaN(high) || low >= high) {
				this.showHideErrors(this.errorType.invalidRange);
			}
			else {
				rangeList = (new Array(high - low + 1)).fill(undefined).map((_, i) => i + low);
				this.numbers.fromInput = this.numbers.fromInput.concat(rangeList);
			}
		}

		/* NUMBERS STORED IN SESSION */

		bindSaveNumbersEvent() {
			document.getElementById('store-numbers').addEventListener('submit', (event) => {
				event.preventDefault();
				this.setSavedNumbers(this.numbers.once.sort((a, b) => (a - b)));
				this.resetWarningMsg();
				this.displaySavedNumbers();
				alert('Saved!');
				event.target.reset();
			});
		}

		bindRemoveNumbersEvent() {
			document.getElementById('clear-existing').addEventListener('click', () => {
				this.removeSavedNumbers();
				this.displaySavedNumbers();
			})
		}

		getSavedNumbers() {
			return window.sessionStorage ? JSON.parse(window.sessionStorage.getItem(NUMBERS)) : [];
		}

		removeSavedNumbers() {
			if (window.sessionStorage) {
				window.sessionStorage.removeItem(NUMBERS);
			}
		}

		setSavedNumbers(numbers) {
			if (window.sessionStorage) {
				window.sessionStorage.setItem(NUMBERS, JSON.stringify(numbers));
			}
		}

		displaySavedNumbers() {
			let savedNumbers = this.getSavedNumbers();
			if (savedNumbers === null || savedNumbers.length === 0) {
				this.numbers.saved = [];
				document.getElementById('existing-numbers-wrapper').classList.add('hidden');
			}
			else {
				this.numbers.saved = savedNumbers;
				document.getElementById('existing-numbers').innerHTML = this.numbers.saved.join(', ');
				this.generateAllNumbers();
				document.getElementById('existing-numbers-wrapper').classList.remove('hidden');
			}
		}

		generateAllNumbers() {
			this.numbers.all = this.numbers.saved.concat(this.numbers.fromInput);
		}

		/* VALIDATION */

		showHideErrors(err) {
			if (!this.inputVal) {
				this.fieldErrors = [];
			}
			else {
				if (this.fieldErrors.indexOf(err) === -1) {
					this.fieldErrors.push(err);
				}
			}

			this.appendErrors();
		}

		appendErrors() {
			let errDom = document.getElementById('duplicate-number-error');
			let submitBtn = document.getElementById('submit-numbers');
			if (this.fieldErrors.length > 0) {
				errDom.innerHTML = this.fieldErrors.map(error => `<li>${error}</li>`).join(' ');
				submitBtn.setAttribute('disabled', 'disabled');
				this.resetNumbersOnError();
				errDom.classList.remove('hidden');
			}
			else {
				this.resetErrorMsg(errDom, submitBtn);
			}
		}

		validateField() {
			let numbersPattern = /^[0-9,-]+$/;
			if (!this.inputVal.match(numbersPattern)) {
				this.showHideErrors(this.errorType.invalidNumber);
			}
		}

		resetWarningMsg(dupeNumElem, dupeWarnElem) {
			dupeNumElem = dupeNumElem || document.getElementById('duplicate-numbers-list');
			dupeWarnElem = dupeWarnElem || document.getElementById('duplicate-warning');
			dupeNumElem.innerHTML = '';
			dupeWarnElem.classList.add('hidden');
		}

		resetNumbersOnError() {
			this.numbers.duplicate = [];
			this.numbers.once = [];
			this.resetWarningMsg();
		}

		resetErrorMsg(elem, submitBtn) {
			let dupeElem = elem || document.getElementById('duplicate-number-error');
			submitBtn = submitBtn || document.getElementById('submit-numbers');
			this.fieldErrors = [];
			dupeElem.innerHTML = '';
			dupeElem.classList.add('hidden');
			if(this.inputVal) {
				submitBtn.removeAttribute('disabled');
			} else{
				submitBtn.setAttribute('disabled', 'disabled');
			}
		}

		/* DUPLICATES */

		findDuplicate() {
			this.numbers.all.forEach(num => {
				if (this.numbers.once.indexOf(num) === -1) {
					this.numbers.once.push(num);
				}
				else if (this.numbers.duplicate.indexOf(num) === -1) {
					this.numbers.duplicate.push(num);
				}
			});
		}
		displayDuplicateNumbers() {
			let dupeNumElem = document.getElementById('duplicate-numbers-list');
			let dupeWarnElem = document.getElementById('duplicate-warning');
			if (this.numbers.duplicate.length > 0) {
				dupeNumElem.innerHTML = this.numbers.duplicate.join(', ');
				dupeWarnElem.classList.remove('hidden');
			}
			else {
				this.resetWarningMsg(dupeNumElem, dupeWarnElem);
			}
		}
	}

	return new NumberCheck();
})();