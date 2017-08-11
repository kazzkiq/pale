# Pale

Pale is a dead-simple, fat-free, schema validator.

## Instalation

*TODO: UMD...*

## Usage

Using Pale is pretty simple. With just few lines you're able to validate form inputs or received values in your backend server.

Pale will always return a Promise upon `.run()` call. If there are any validation errors, it will raise a rejected promise which will require `.catch()` to be handled properly. If there aren't any errors, it will return an object containing only a object with your values (which you can then use to send a request or pass to another part of your applicatioon, for example). Enough talk, lets see some examples!

Micro example:

```js
const Pale = require('pale');

const validation = Pale.validate({
  name: ['string min(1)', 'Michael Jackson'],
  age: ['number min(1) max(3)', '33']
});

validation.run()
  .then(console.log)     // {name: 'Michael Jackson', age: '33'}
  .catch(console.log);    // {failed_validators: [string, ...], element: HTMLElement | null, value: string}
```

HTMLElement handling:

```js
const Pale = require('pale');

const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');

const validation = Pale.validate({
  name: ['string min(1)', nameInput.value, nameInput],
  age: ['number min(1) max(3)', ageInput.value, ageInput]
});

validation.run()
  .then(console.log)
  .catch((errorItem) => {
    // Paint the input with error in red color
    errorItem.style.border = '1px solid red';
    errorItem.style.background = 'rgba(255, 0, 0, 0.1)';
  });
```

Add a custom validator:

```js
const Pale = require('pale');

// The returned value is always a boolean
// true = validation has errors
// false = no errors found
Pale.add('youngster', value => value > 30)

// Accept only people bellow 30yo
const validation = Pale.validate({
  name: ['string min(1)', 'Michael Jackson'],
  age: ['number youngster min(1) max(3)', '77'] // will fail in the 'youngster' validation
});

validation.run()
  .then(console.log)
  .catch(console.log);
```


