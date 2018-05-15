import { validators } from './validators';

export default class Pale {
  constructor(validationList) {
    this.validationList = validationList;
    this.validatorsList = validators;
  }

  get validators() {
    return this.validatorsList;
  }

  set validators(validators) {
    this.validatorsList = validators;
  }

  run() {
    return new Promise((resolve, reject) => {
      const validators = Object.keys(this.validationList);
      const recipe = [];

      validators.forEach((validator) => {
        recipe.push(this.extractRules(this.validationList[validator]));
      });

      const recipeResults = this.runRepice(recipe);
    });
  }

  extractRules(validationItem) {
    let rules = validationItem[0].split(' ');

    rules = rules
      .map(rule => {
        return {
          rule: rule.replace(/\([0-9]\)/, ''),
          value: ((rule.match(/\(([0-9]{1,})\)/g) || [''])[0].replace(/[\(\)]/g, '') || false)
        }
      });

    return {
      rules: rules,
      parameter: validationItem[1],
      element: validationItem[2]
    }
  }

  runRepice(recipe) {
    recipe.forEach((recipeItem) => {
      const value = recipeItem.parameter;
      let validationStatus = true;

      recipeItem.rules.forEach((rule, i) => {
        if (!this.validators[rule.rule]) {
          throw `Could not find validator ${rule.rule} in validators list.`;
        }
        const ruleResult = this.validators[rule.rule](value, rule.parameter);
        recipeItem.rules[i].status = ruleResult;

        if (!ruleResult) validationStatus = false;
      });
      
      recipe.validationStatus = validationStatus;
    });
  }

  addValidator(newValidator) {
    if (!newValidator || {}.toString.call(newValidator) !== '[object Function]') {
      throw `.addValidator() expects a function, ${typeof validator} given.`;
    }

    const validatorList = this.validators;

    this.validationList[newValidator.name] = newValidator;
  }
}