import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { useNotification } from "web3uikit"
import { abi } from "../constants/abi";
import { useState, useEffect } from "react";
import { MerkleTree } from "merkletreejs";
const keccak256 = require('keccak256');
import tokens from "../constants/tokens.json";
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Header from "../components/Header"


const supportedChains = 4;

export default function Home() {

    const [live, setlive] = useState()
    const [WL, setWL] = useState();
    const [quantity, setquantity] = useState(1)
    const [priceWL, setpriceWL] = useState(2000000000000000)
    const [priceb, setpriceb] = useState(5000000000000000)
    const [totalSupply, setTotalSupply] = useState("0")
    const { Moralis, isWeb3Enabled,account , chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    
    

    const contractAddress = "0x28e7D1A449D5De9178CdB580f55075169ccEbE5C"

 
  
    
  

    const dispatch = useNotification()
    
      

    let tab = [];
    tokens.map(token => {
        tab.push(token.address)
    })
  
    const leaves = tab.map(v => keccak256(v));
    const tree = new MerkleTree(leaves,keccak256,{ sort: true });
    const leaf = keccak256(account);
    const proof = tree.getHexProof(leaf);

    
    const {
    runContractFunction: preSalemint,
    data: enterTxResponse, isLoading
    } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "preSalemint",
        msgValue: priceWL,
        params: {
            _proof: proof,
            _quantity: quantity
        },
    })
    
    const {
      isFetching,
        runContractFunction: mint,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "mint",
        msgValue: priceb,
        params: {
            _quantity: quantity
        },
    })
    
    const { runContractFunction: gettotalSupply } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress, // specify the networkId
        functionName: "totalSupply",
        params: {},
    })


    async function updateUIValues() {
      if (supportedChains == chainId) {
        const totalSupplyFromCall = (await gettotalSupply()).toString()
        setTotalSupply(totalSupplyFromCall)
      }
      }

    useEffect(() => {
        if (isWeb3Enabled) {
          if (isLoading || isFetching) {document.getElementById('WOM').style.display="block"}
          updateUIValues()
          setWL(true);
          setpriceWL(2000000000000000*quantity)
          setpriceb(5000000000000000*quantity) 
          
        }
        setlive(false)
    }, [live,isWeb3Enabled,quantity,isLoading,isFetching])

    const handleNewNotification = () => {
        dispatch({
            type: "success",
            message: "Congrats!",
            title: "Transaction Complete!",
            position: "topR",
            icon: "eth",
        })
    }
    const handlenewNotification = () => {
      dispatch({
          type: "error",
          message: "Error",
          title: "mint is not success!",
          position: "topR",
          icon: "eth",
      })
  }

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        updateUIValues()
        document.getElementById('WOM').style.display="none";
        handleNewNotification(tx)
    }
    const handleError = async (tx) => {
      document.getElementById('WOM').style.display="none";
      handlenewNotification(tx)
  }

    async function Greatmint() {
      if(isWeb3Enabled){
        if (WL){
          
        try {
            await preSalemint({
            onSuccess: handleSuccess,
            onError: handleError,
            })
           
          } catch(e){
            document.getElementById('WOM').style.display="none";
            console.log(e)
          }
      } else {
        document.getElementById('WOM').style.display="block"
        try {
          await mint({
          onSuccess: handleSuccess,
          onError: handleError,
          })
          
        } catch(e){
          document.getElementById('WOM').style.display="none";
          console.log(e)
        }
      }
    }
  } 



  return (
    <div className={styles.container}>
      <Head>
      <meta charSet="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />

		<link rel="icon" type="image/png" sizes="32x32" href="./images/logo.png" />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" async integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossOrigin="anonymous"></script>
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
		<link
			href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400&family=Poppins:wght@400;500;600&display=swap"
			rel="stylesheet"
		/>

		<link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
			integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
			crossOrigin="anonymous"
			referrerPolicy="no-referrer"
		/>
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossOrigin="anonymous"/>
		<link rel="stylesheet" href="style.css" />

		<title>Degen landing page</title>
      </Head>
      
      {/* Navbar */}
      <div className="container">
            <nav className="navbar navbar-expand">
                <div className="container-fluid">
                  <a className="navbar-brand fw-bold text-white" href="#">
					<img  className="img-fluid logo" src="images/logo.png" alt=""/>
				  </a>
                  {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                  </button> */}
                  <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                      <li className="nav-item">
                      </li>
                    </ul>
                    <div className="d-flex align-items-center text-white">
                      <a className="me-3 nac-link cursor-pointer"href="https://degen-legion.gitbook.io/1.0.1/get-started/welcome" target="_blank" rel="noreferrer">Docs</a>
                      {/* <div className="bg-outline-primary rounded-pill py-2 px-3 ml-4"><Header/></div> */}
                    </div>
                    <Header/>
                  </div>
                </div>
              </nav>
        </div>
      {/* Header */}
      <div className="alert text-center" id="WOM">
      <button className="btn btn-success" type="button" disabled>
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Working for mint !
      </button>
      </div>
      <main className="wrapper mt-3">
			<section className="image shadow-lg py-3 rounded">
				<img src="images/img4.jpeg" alt="" />
			</section>

			<section className="text text-white text-center mt-5">
				{live ? (<h1 className="fw-bold display-1"id="h1">Mint is Live</h1>) : ( <h1 className="fw-bold display-1"id="h1"> Mint Date July 5th 8PM Eastern</h1>)}
				{live ? (supportedChains == chainId ? ((isWeb3Enabled) ? <h2 className="mt-5 fs-1 fw-bold"> {totalSupply}/800</h2> : <h2 ></h2>) : <h2></h2>) : <div></div>}
				{live ? (supportedChains == chainId ? (isWeb3Enabled ? (WL ? (<h2 className="mt-5 fs-1 fw-bold">0.29 ETH</h2>) : (<h2 className="mt-1 fs-1 fw-bold"> 0.59 ETH</h2>)) : <h2> </h2>) : <h2></h2>) : <div></div>}
			
				<div className="mt-3 text-center">
        {live ? (supportedChains == chainId ? (
                <>
                    <button
                        className="btn btn-outline-primary py-2 m-auto w-50 "
                        onClick={Greatmint}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full" ></div>
                        ) : (
                            "mint"
                        )}
                    </button>
                </>
            ) : (
                <div className="fw-bold display-5">Please connect to a supported network </div>
            )) : <div></div>}
				</div>
        {live ? (supportedChains == chainId ? (isWeb3Enabled ?<div className=" mt-2">
					<input type="number" value={quantity} onChange={(e) => setquantity(e.target.value)} className="form-control m-auto w-50 text-center"  min={1} max={10} placeholder="1" id="inp"/>
				</div> : <div></div>) : <div></div>) : <div></div>}
      </section>
		</main>
    {/* Footer */}
    <footer className="wrapper">
			<nav className="social-icons">
				<a href="https://discord.gg/N2XdZyh4t7"  target="_blank" rel="noreferrer"><i className="fa-brands fa-discord"></i></a>
				<a href="https://twitter.com/DegenlegionNFT" target="_blank" rel="noreferrer"><i className="fa-brands fa-twitter"x></i></a>
				{/* <a href="#"><i className="fa-brands fa-instagram"></i></a> */}
			</nav>
		</footer>
    </div>
  )
}
