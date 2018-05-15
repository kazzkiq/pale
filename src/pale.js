export default class Pale {
  constructor(validationList) {
    this.validationList = validationList;
  }

  run() {

  }

  extractRules(validationItem) {
    let rules = validationItem[0].split(' ');

    rules = rules
      .map(rule => {
        return {
          rule: rule.replace(/\([0-9]\)/, ''),
          value: ((rule.match(/\(([0-9]{1,})\)/g) || [])[0].replace(/\(\)/g, '') || false)
        }
      });

    return {
      rules: rules,
      value: validationItem[1],
      element: validationItem[2]
    }
  }
}