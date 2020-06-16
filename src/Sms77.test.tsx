import React from 'react';
import {render} from '@testing-library/react';

import Sms77 from './Sms77';

test('renders learn react link', () => {
    const {getByText} = render(<Sms77/>);

    const helperText = getByText('0 (1)');

    expect(helperText).toBeInTheDocument();
});
