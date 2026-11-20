import { render, screen } from '@testing-library/react-native';
import Home from '../../app/index';

it('mostra o nome do app na tela inicial', async () => {
  await render(<Home />);
  expect(screen.getByText('Pocketoo')).toBeOnTheScreen();
});
