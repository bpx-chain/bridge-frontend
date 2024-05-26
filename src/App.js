import WalletProvider from './components/WalletProvider.js';
import Navbar from './components/Navbar';
import Tabs from './components/Tabs';

function App() {
  return (
    <WalletProvider>
      <Navbar />
      <Tabs />
    </WalletProvider>
  );
}

export default App;
