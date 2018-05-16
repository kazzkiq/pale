[![Build Status](https://travis-ci.com/kazzkiq/pale.svg?branch=master)](https://travis-ci.com/kazzkiq/pale)

<p align="center">
  <img src="pale-logo.png" width="412">
  <br>
  Pale: A dead-simple schema validator.
</p>

## Instalation

You can install Pale via **npm**:

```
npm install --save pale
```

Or use it directly in browser via cdn service:

```
https://unpkg.com/pale/build/pale.min.js
```

## Usage

```js
import Pale from 'pale';

const check = new Pale({
  name: ['string minLength(2)', 'John Doe'],
  age: ['number minLength(1) maxLength(3)', '35']
});

check.run()
  .then(console.log)   // Object with input data
  .catch(console.log); // Object showing which validator failed
```

### Adding a new validator

```js
import Pale from 'pale';

const check = new Pale({
  acceptedTerms: ['boolean', true]
});

function boolean(value) {
  if (['true', 'false', true, false].includes(value)) {
    return true;
  } else {
    return false;
  }
}

check.addValidator(boolean);

check.run();

// ...
```

### Get all available validators

```js
import Pale from 'pale';

const check = new Pale({
  acceptedTerms: ['boolean', true]
});

Object.keys(check.validators);
// Outputs by default:
// ['string', 'number', 'min', 'max', 'minLength', 'maxLength']
```

# Credits & Thanks

By [@Kazzkiq](https://twitter.com/kazzkiq)

Pale was made possible by awesome open-source projects such as [Rollup](https://github.com/rollup/rollup).