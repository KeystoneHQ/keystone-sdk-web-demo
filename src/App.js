import './App.css';
import {Bitcoin} from "./chains/Bitcoin";
import {Ethereum} from "./chains/Ethereum";
import {MultiAccounts} from "./wallet/MultiAccounts";
import {Solana} from "./chains/Solana";
import {Cosmos} from "./chains/Cosmos";
import {Aptos} from "./chains/Aptos";
import {KeyDerivationCall} from "./wallet/KeyDerivationCall";
import {Box, Tab, Tabs} from "@mui/material";
import {useState} from "react";
import {Cardano} from "./chains/Cardano";

function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return value === index
    ? <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box flex justifyContent={"space-between"} width={"300px"} height={"300px"}>
          <Box display={"inline-block"}>
            {children}
          </Box>
        </Box>
      )}
    </div>
    : <></>
}

function App() {
  const [chain, setChain] = useState(0);
  const [walletAction, setWalletAction] = useState(0);
  const handleChainChange = (_, newValue) => {
    setChain(newValue);
  };
  const handleWalletActionChange = (_, newValue) => {
    setWalletAction(newValue);
  };

  return (
    <div className="App">
      <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
        <Tabs value={chain} onChange={handleChainChange} aria-label="basic tabs example">
          <Tab label="Bitcoin"/>
          <Tab label="Ethereum"/>
          <Tab label="Solana"/>
          <Tab label="Cosmos"/>
          <Tab label="Aptos"/>
          <Tab label="Cardano"/>
        </Tabs>
      </Box>
      <TabPanel value={chain} index={0}>
        <Bitcoin/>
      </TabPanel>
      <TabPanel value={chain} index={1}>
        <Ethereum/>
      </TabPanel>
      <TabPanel value={chain} index={2}>
        <Solana/>
      </TabPanel>
      <TabPanel value={chain} index={3}>
        <Cosmos/>
      </TabPanel>
      <TabPanel value={chain} index={4}>
        <Aptos/>
      </TabPanel>
      <TabPanel value={chain} index={5}>
        <Cardano/>
      </TabPanel>

      <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
        <Tabs value={walletAction} onChange={handleWalletActionChange} aria-label="basic tabs example">
          <Tab label="Key Call"/>
          <Tab label="MultiAccounts"/>
        </Tabs>
      </Box>
      <TabPanel value={walletAction} index={0}>
        <KeyDerivationCall />
      </TabPanel>
      <TabPanel value={walletAction} index={1}>
        <MultiAccounts />
      </TabPanel>
    </div>
  );
}

export default App;