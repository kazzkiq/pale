(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
   /**
   * Represents pure functions that can validate an entry.
   * Those functions always return a boolean
   * true = validation error
   * false = validation passed
   */
  let validators = {
    string(value) {
      return /[\d]+/g.test(value);
    },
    number(value) {
      return /[A-zÀ-ÿ\D]+/g.test(value);
    },
    min(value, size) {
      return value.length < size;
    },
    max(value, size) {
      return value.length > size;
    }
  }

  return {
    /**
     * Returns the object with all validator functions.
     */
    get validators() {
      return validators;
    },

    /**
     * @param {object} new_validators - override the current validators
     */
    set validators(new_validators) {
      validators = new_validators;
    },

    /**
     * Append a new validator.
     * @param {string} name - name used to call validator
     * @param {Function} action - pure boolean function
     */
    add(name, action) {
      // If validator name already in use, throw error
      if (this.validators[name]) {
        throw new Error(`Failed to add validator "${name}". This validator (${name}) already exists.`);
      }
    
      this.validators[name] = action;
    },

    /**
     * Prepare to run validation through objects
     * @param {object} items - object following this interface:
     * {name: [validators, value, element?]}
     * ex.: {age: ['number min(1) max(3)', '33']}
     */
    validate(items) {
      const keys = Object.keys(items);
      const selfs = this;
      // If no itens to handle, throw error
      if (keys.length < 1 || !items) {
        throw new Error('There are no items to validade.');
      }

      return { run: this.run.bind(selfs, items) }
    },

    /**
     * Run the validation on items and return a Promise with
     * the result
     * @param {items} items - object following this interface:
     * {name: [validators, value, element?]}
     * ex.: {age: ['number min(1) max(3)', '33']}
     *
     * Note: this function is called without parameters by the user.
     */
    run(items) {
      return new Promise((resolve, reject) => {
        const validators_with_error = [];
        let has_errors = false;
        let element;
        let elements_with_error = [];
        let values = [];
        
          Object.keys(items).forEach(key => {
            const validators = items[key][0];
            const localValue = items[key][1];
            values.push(localValue);
            this.getValidatorsFromItem(validators).forEach(validator => {
              element = items[key][2];
              const validator_failed = this.validators[validator.name](localValue, validator.param);

              // If validator failed
              if(validator_failed) {
                has_errors = true;
                elements_with_error.push(element);
                if (validators_with_error[key]) {
                    validators_with_error[key].push(validator.name);
                } else {
                    validators_with_error[key] = [validator.name];
                }
              }
            });
          });
        // });

        if (has_errors) {
          reject({
            failed_validators: validators_with_error,
            elements: elements_with_error,
            values: values
          });
          validators_with_error = [];
        } else {
          const final_items = {};
          const keys = Object.keys(items);

          keys.forEach((key) => {
            final_items[key] = items[key][1];
          });

          resolve(final_items);
        }
      });
    },

    /**
     * Filter string containing validators and handle each one
     * individually into an object.
     * the result
     * @param {string} item_validators - validators separated by space
     * ex.: "string min(1) max(3)"
     */
    getValidatorsFromItem(item_validators) {
      const validators_list = [];
      item_validators.split(' ').forEach(validator => {
        const validator_name = /(\w{1,})/g.exec(validator)[1];
        const validator_params = /\((\w{1,})\)/g.exec(validator);
        let validator_param;

        // If couldn't resolve validator
        if(!validator_name) {
          throw new Error(`Couldn't resolve validator "${validator}". Perhaps you mispelled something?.`);
        }

        if (validator_params) {
          validator_param = validator_params[1];
        }

        validators_list.push({
          name: validator_name,
          param: validator_param
        });
      });

      return validators_list;
    }
  }
}));