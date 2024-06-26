import KeystoneSDK, { UR, URType } from "@keystonehq/keystone-sdk"
import {AnimatedQRCode, AnimatedQRScanner} from "@keystonehq/animated-qr"

let cardanoSignDataRequest = {
    requestId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    path: "m/1852'/1815'/0'/0/0",
    xfp: "52744703",
    payload: "846a5369676e6174757265315882a301270458390069fa1bd9338574702283d8fb71f8cce1831c3ea4854563f5e4043aea33a4f1f468454744b2ff3644b2ab79d48e76a3187f902fe8a1bcfaad676164647265737358390069fa1bd9338574702283d8fb71f8cce1831c3ea4854563f5e4043aea33a4f1f468454744b2ff3644b2ab79d48e76a3187f902fe8a1bcfaad4043abc123",
    origin: "cardano-wallet"
}

let cardanoSignRequest = {
    requestId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    signData: Buffer.from("84a400828258204e3a6e7fdcb0d0efa17bf79c13aed2b4cb9baf37fb1aa2e39553d5bd720c5c99038258204e3a6e7fdcb0d0efa17bf79c13aed2b4cb9baf37fb1aa2e39553d5bd720c5c99040182a200581d6179df4c75f7616d7d1fd39cbc1a6ea6b40a0d7b89fea62fc0909b6c370119c350a200581d61c9b0c9761fd1dc0404abd55efc895026628b5035ac623c614fbad0310119c35002198ecb0300a0f5f6", "hex"),
    utxos: [
        {
            transactionHash:
                "4e3a6e7fdcb0d0efa17bf79c13aed2b4cb9baf37fb1aa2e39553d5bd720c5c99",
            index: 3,
            amount: "10000000",
            xfp: "73c5da0a",
            hdPath: "m/1852'/1815'/0'/0/0",
            address:
                "addr1qy8ac7qqy0vtulyl7wntmsxc6wex80gvcyjy33qffrhm7sh927ysx5sftuw0dlft05dz3c7revpf7jx0xnlcjz3g69mq4afdhv",
        },
        {
            transactionHash:
                "4e3a6e7fdcb0d0efa17bf79c13aed2b4cb9baf37fb1aa2e39553d5bd720c5c99",
            index: 4,
            amount: "18020000",
            xfp: "73c5da0a",
            hdPath: "m/1852'/1815'/0'/0/1",
            address:
                "addr1qyz85693g4fr8c55mfyxhae8j2u04pydxrgqr73vmwpx3azv4dgkyrgylj5yl2m0jlpdpeswyyzjs0vhwvnl6xg9f7ssrxkz90",
        },
    ],
    extraSigners: [
        {
            keyHash: "e557890352095f1cf6fd2b7d1a28e3c3cb029f48cf34ff890a28d176",
            xfp: "73c5da0a",
            keyPath: "m/1852'/1815'/0'/2/0",
        },
    ],
    origin: "cardano-wallet"
}

export const Cardano = () => {
    const keystoneSDK = new KeystoneSDK();
    const ur = keystoneSDK.cardano.generateSignDataRequest(cardanoSignDataRequest);

    return <>
        <AnimatedQRCode type={ur.type} cbor={ur.cbor.toString("hex")} />
        <CardanoScanner />
    </>
}

export const CardanoScanner = () => {
    const keystoneSDK = new KeystoneSDK();

    const onSucceed = ({type, cbor}) => {
        const signature = keystoneSDK.cardano.parseSignDataSignature(new UR(Buffer.from(cbor, "hex"), type))
        console.log("signature: ", signature.signature.toString("hex"));
        console.log("publicKey: ", signature.publicKey);
        console.log("request id: ", signature.requestId);
    }
    const onError = (errorMessage) => {
        console.log("error: ",errorMessage);
    }

    return <AnimatedQRScanner
        handleScan={onSucceed}
        handleError={onError}
        urTypes={[URType.CardanoSignDataSignature]}
        options={{
            width: 100,
        }}
    />
}
