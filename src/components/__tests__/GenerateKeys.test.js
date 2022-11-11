import { render, screen, cleanup } from '@testing-library/react';
import GenerateKeys from '../GenerateKeys';

test('should render GenerateKeysFormComponent', () => {
    render(<GenerateKeys/>);
    const generateKeysElement = screen.getByTestId('generateKeysFormComponent');
    expect(generateKeysElement).toBeInTheDocument();
});
