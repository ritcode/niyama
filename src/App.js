import React, {useState, useEffect} from 'react';
import Web3 from 'web3';
import getWeb3 from "./getWeb3";

//import contractABI from './contractABI.js';

import niyama from "./contracts/niyama.json";
//import Resell from './Resell';
//import CatalogUploader from './CatalogUploader';
import './App.css';
import './App.sass';
import IPFS from 'ipfs'


function App() {


  const [address, setAddress] = useState('');
  const [contract, setContract] = useState();
  const [web3 , setWeb3] = useState(new Web3(window.web3.currentProvider));


  //reseller
  const [ids, setIds] = useState([]);
  const [currentId, setCurrentId] = useState();
  const [subscribed,setSubscribed]=useState([]) ;
  //catalogUploader
  const [products, setProducts] = useState([]);
  const [currentProductId, setCurrentProductId] = useState('');
  const [currentProductName, setCurrentProductIName] = useState('');
  const [currentProductPrice, setCurrentProductPrice] = useState();
  const [currentProductCompany, setCurrentProductCompany] = useState('');
  const [currentProductIncentive, setCurrentProductIncentive] = useState();
  
  const createCatalog = async () => {

    const node = await IPFS.create()
    const Store = JSON.stringify(products)
    const filesAdded = await node.add({
      path: './items.json',
      content: Store
    })

    contract.methods.addCatalog(filesAdded.cid.toString()).send({from: address}); //contract method called to add catalog-commented by rit

    //setProducts([]);

    
    // const fileBuffer = await node.cat(filesAdded[0].hash)
    
    //const decryptedHashKey = CryptoJS.AES.decrypt(encryptedHashKey, privateKey); //added by rit

    //const decrypted = CryptoJS.AES.decrypt(encryptedStore, hashKey); //added by rit
    //setIpfsHash(encryptedHashKey) //no use of ipfs hash-commented by rit
    }


    //reseller
    const subscribe = () => {
      contract.methods.subscribe(currentId).send({from: address});
      setIds([...ids, currentId]);
      dashboard()
    }
    let dashboard=() => {
      products.forEach(element => {
        ids.forEach(i => {
          if(element.id==i) {
             setSubscribed([...subscribed, element.name])
          }
        });
      });
    }

  useEffect( async () => {
    //window.web3 = new Web3(window.web3.currentProvider)
    const w3 =await getWeb3();
    const accounts = await w3.eth.getAccounts();
    setAddress(accounts[0]);
    setWeb3(w3);
    /*web3.currentProvider.enable().then(accounts => {
      setAddress(accounts[0])//Address here for accounts to choose -commented by rit
    });*/

  }, []);

  useEffect(() => {
    if(address) {
      /*const ctr = new web3.eth.Contract(contractABI, "0x74FAf259893bEB6cFC7cc3A487DC463B9ee915A5"); // address of contract is here-commented by rit*/

      /*const networkId = web3.eth.net.getId();*/
      const deployedNetwork = niyama.networks[5777];
      const ctr = new web3.eth.Contract(
        niyama.abi,
        deployedNetwork && deployedNetwork.address,
      );
      setContract(ctr);
    }
  }, [address]);

  return (
    <div className="App has-text-white">
      <section className="hero is-primary">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">This is Niyama Project</h1>
            <h2>Hello User!!</h2>
          </div>
        </div>
      </section>
      { address && contract &&
        <div className="columns">
          <div className="column">
            <section className="section">
              <section className="section">
                <h1>Company</h1>
              </section>
              <section className="section">
                <div className="container">
                  <div className="field">
                    <div className="control">
                        <input className="input is-primary" value={currentProductName} onChange={e => setCurrentProductIName(e.target.value)} placeholder="Product name"/>
                    </div>
                  </div>
                  <div className="field">
                      <div className="control">
              <input className="input is-primary" value={currentProductId} onChange={e => setCurrentProductId(e.target.value)} placeholder="Product Id"/>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input className="input is-primary" value={currentProductCompany} onChange={e => setCurrentProductCompany(e.target.value)} placeholder="Company name"/>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input className="input is-primary" type="number" value={currentProductPrice} onChange={e => setCurrentProductPrice(e.target.value)} placeholder="Product Price"/>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input className="input is-primary" type="number" value={currentProductIncentive} onChange={e => setCurrentProductIncentive(e.target.value)} placeholder="Incentive per Product (In %)"/>
            </div>
          </div>
          <button className="button" onClick={() => setProducts([...products, {'id': currentProductId, 'name':currentProductName, 'company':currentProductCompany, 'price':currentProductPrice, 'incentive': currentProductIncentive}])}>Add Product</button>
          <button className="button" onClick={createCatalog}>Create Catalog</button>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <header className="has-background-info"><h2 className="title has-text-white">Products</h2></header>
          { products.map((productId, i) => (
            <div className="box" key={i}>
              {productId.id}
            </div>
          ))}
        </div>
      </section>
    </section>
          </div>
          <div className="column">
          <section className="section">
      <section className="section">
        <h1>Reseller</h1>
      </section>
      <div className="container">
        <section className="section">
          <div className="field">
            <div className="control">
              <input className="input is-primary"  value={currentId} onChange={ e => setCurrentId(e.target.value)} placeholder="Product Id"/>
            </div>
          </div>
          <button className="button" onClick={subscribe}>Subscribe</button>
        </section>
        <section className="section">
        <div className="container">
          <header className="has-background-info"><h2 className="title has-text-white">Products</h2></header>
          { subscribed.map((s, i) => (
            <div className="box" key={i}>
              {s}
            </div>
          ))}
        </div>
      </section>
      </div>
    </section>
          </div>
        </div>
      }
    </div>
  );
}

export default App;
