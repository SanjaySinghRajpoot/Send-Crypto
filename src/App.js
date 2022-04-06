import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import { useEffect, useState } from 'react';

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
  })
 
  useEffect(() => {
    const loadProvider = async () => {
      let provider = null;

      if(window.ethereum){  // for new version of metamask
         provider = window.ethereum;  

         try{
           await provider.enable();
         } catch {
           console.error("user denied account acess");
         }
      }
      else if(window.web3){
         provider = window.web3.currentProvider
      }
      else if (!process.env.production){
          provider = new Web3.providers.HttpProvoder("http://localhost:7545")
      }

      setWeb3Api({
        web3: new web3(provider),
        provider: provider,
      })
    }
  }, [])

  console.log(web3Api.web3);

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          { web3Api.isProviderLoaded ?
            <div className="is-flex is-align-items-center">
              <span>
                <strong className="mr-2">Account: </strong>
              </span>
                { account ?
                  <div>{account}</div> :
                  !web3Api.provider ?
                  <>
                    <div className="notification is-warning is-size-6 is-rounded">
                      Wallet is not detected!{` `}
                      <a
                        rel="noreferrer"
                        target="_blank"
                        href="https://docs.metamask.io">
                        Install Metamask
                      </a>
                    </div>
                  </> :
                  <button
                    className="button is-small"
                    onClick={() =>
                      web3Api.provider.request({method: "eth_requestAccounts"}
                    )}
                  >
                    Connect Wallet
                  </button>
                }
            </div> :
            <span>Looking for Web3...</span>
          }
          <div className="balance-view is-size-2 my-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          { !canConnectToContract &&
            <i className="is-block">
              Connect to Ganache
            </i>
          }
          <button
            disabled={!canConnectToContract}
            onClick={addFunds}
            className="button is-link mr-2">
              Donate 1 eth
            </button>
          <button
            disabled={!canConnectToContract}
            onClick={withdraw}
            className="button is-primary">Withdraw 0.1 eth</button>
        </div>
      </div>
    </>
  );
}

export default App;
