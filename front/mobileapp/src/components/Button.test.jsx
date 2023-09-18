import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from './Button';

describe('Button', () => {
  
  // Test 1: Render Tests
  it('should render a button with a title', () => {
    const { getByText } = render(<Button title="Click Me" />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should not render a title when not provided', () => {
    const { queryByText } = render(<Button />);
    expect(queryByText(/.+/)).toBeNull();
  });

  // Test 2: Props Tests
  it('should apply custom styles to button', () => {
    const customStyle = { backgroundColor: 'blue' };
    const { getByTestId } = render(
      <Button title="Click Me" buttonStyle={customStyle} />
    );

    expect(getByTestId('button')).toHaveStyle(customStyle);
  });

  it('should apply custom styles to text', () => {
    const customTextStyle = { fontSize: 20 };
    const { getByText } = render(
      <Button title="Click Me" textStyle={customTextStyle} />
    );

    expect(getByText('Click Me')).toHaveStyle(customTextStyle);
  });

  // Test 3: Interaction Tests
  it('should call onPress when button is pressed', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(<Button title="Click Me" onPress={mockOnPress} />);

    fireEvent.press(getByTestId('button'));

    expect(mockOnPress).toHaveBeenCalled();
  });
});
