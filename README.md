<p align='center'>
    <img
         width="400" 
         height="79" 
         src="https://www.sms77.io/wp-content/uploads/2019/07/sms77-Logo-400x79.png" alt="sms77io Logo"
      />
</p>

# Installation
```shell script
npm install react-sms77
```
or
```shell script
yarn add react-sms77
```

## Usage
```typescript jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Sms77 from 'react-sms77';

ReactDOM.render(
    <Sms77 
        apiKey='MY_SUPER_SECRET_API_KEY_FROM_SMS77IO' 
        to='+4901234567890' />,
    document.getElementById('root')
);
```

### Props
apiKey: string = ''

to: string = ''

If you don't set an API key, you will get prompted to do so after typing in your message in the textarea.
The same goes for the "to" prop which defines the recipient of the sent message.