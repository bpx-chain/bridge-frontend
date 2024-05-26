import WalletProvider from './components/WalletProvider';
import SynapseProvider from './components/SynapseProvider';
import Navbar from './components/Navbar';
import Tabs from './components/Tabs';

function App() {
  return (
    <WalletProvider>
      <SynapseProvider>
        <Navbar />
        <Tabs />
      </SynapseProvider>
    </WalletProvider>
  );
}

export default App;
