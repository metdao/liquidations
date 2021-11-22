import { fireEvent } from '@testing-library/react';
import { injectProvider, renderWithTheme as render } from '../helpers';
import WrappedAccountSelect from '../../components/header/AccountSelect';

const { click } = fireEvent;

let warn;

beforeAll(() => {
  injectProvider();
  warn = console.warn;
  console.warn = (...args) => {
    if (args[0].match(/falling back to/)) return;
    return warn(...args);
  };
});

afterAll(() => {
  console.warn = warn;
});

test('can connect an account', async () => {
  // temporary hack to hide spam warnings from web3react
  console.warn = () => {};

  const { findByText, findAllByText } = render(<WrappedAccountSelect />);
  const connectButton = await findByText('Connect wallet');
  expect(connectButton).toBeDefined();

  click(connectButton);
  click(await findByText('MetaMask'));

  const copyButton = await findByText('Copy Address');
  expect(copyButton).toBeDefined();
  const etherscanButton = await findByText('etherscan', { exact: false });
  expect(etherscanButton).toBeDefined();
  const displayedAddress = await findAllByText('0x16F', { exact: false });
  expect(displayedAddress.length).toBe(2);
});
