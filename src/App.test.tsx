import React from 'react';
import {render} from '@testing-library/react';

import App from './App';

test('renders learn react link', () => {
    const {getByText} = render(<App/>);

    const helperText = getByText('0 (1)');

    expect(helperText).toBeInTheDocument();
});
