import {useState} from "react";
import KeystoneSDK, {UR, URType} from "@keystonehq/keystone-sdk"
import {AnimatedQRCode, AnimatedQRScanner} from "@keystonehq/animated-qr"
import {networks, payments, Psbt} from "bitcoinjs-lib";

const generatePSBT = () => {
    const psbt = new Psbt();

    psbt.addInput({
        hash: "226a14d30cfd411b14bf20b7ffd211f7f206699690c54d456cc1bef70c2de5a6", // The utxo hash
        index: 0, // The utxo index
        witnessUtxo: { // An example of a P2WPKH utxo
            value: 100000000, // The utxo amount
            script: payments.p2wpkh({
                pubkey: Buffer.from("0341d94247fabfc265035f0a51bcfaca3b65709a7876698769a336b4142faa4bad", "hex"), // The public key this utxo locked
                network: networks.bitcoin,
            }).output,
        },
        bip32Derivation: [
            {
                masterFingerprint: Buffer.from("F23F9FD2", "hex"), // The master fingerprint
                pubkey: Buffer.from("0341d94247fabfc265035f0a51bcfaca3b65709a7876698769a336b4142faa4bad", 'hex'), // The public key this utxo locked
                path: "m/84'/0'/0'/0/0" // The public key HD path
            }
        ]
    })

    psbt.addOutputs([
        {
            address: "bc1qwvr3x4mc3jrpys0xaxguc8mexw4gw3zyt3h05c", // transfer target
            value: 10000000 // transfer value
        },
        {
            address: "bc1qmx85cfywqmj56z96lhpp8yf2e2qvpg620f2pa6", // change address
            value: 85000000, // change value
            bip32Derivation: [
                {
                    masterFingerprint: Buffer.from("F23F9FD2", "hex"),
                    pubkey: Buffer.from("03ab7173024786ba14179c33db3b7bdf630039c24089409637323b560a4b1d0256", 'hex'), // change public key
                    path: "m/84'/0'/0'/1/0" // change full path
                }
            ]
        }
    ])

    return psbt.toHex()
}

const extractTransaction = (psbtHex) => {
    const psbt = Psbt.fromHex(psbtHex)
    let extractedTransaction
    try {
        extractedTransaction = psbt.finalizeAllInputs().extractTransaction()
    } catch (_){
        extractedTransaction = psbt.extractTransaction()
    }
    // network serialized transaction
    return extractedTransaction.toHex()
}


export const Bitcoin = () => {
    const [isScanning, setIsScanning] = useState(false);

    // const psbtHex = generatePSBT();
    const psbtHex = "70736274ff01007d020000000131824c908664a134c64f4872de22724550f3cfb538f286d7b8ce99dd9b57c7b90000000000ffffffff02e803000000000000160014f87283ca2ab20a1ab50cc7cea290f722c9a24574401f000000000000225120c0cadc81a0b905d839e719ed250d91d25d345226d1643f19d1e05dbd9e8619b0000000000001012b10270000000000002251207499e407088786c398b899dd7d9429275a644345f0317a73aff42704e4aeb42f4215c150929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac08e338c3b1e8ccf3037961af88657ef61787514b9f0da98b7fa4717f8097f0804ad203f8f4496a7367a7c3fe78f95c084578b228e20325697cfe423936b905f7ac062ad2061550462adbff78ce0694a0643b452f408f3696f64647f0bedbf2a0ee38a9d58ad2059d3532148a597a2d05c0395bf5f7176044b1cd312f37701a9b4d0aad70bc5a4ac20a5c60c2188e833d39d0fa798ab3f69aa12ed3dd2f3bad659effa252782de3c31ba20ffeaec52a9b407b355ef6967a7ffc15fd6c3fe07de2844d61550475e7a5233e5ba529cc021163f8f4496a7367a7c3fe78f95c084578b228e20325697cfe423936b905f7ac0623901ef8ccf3ab4569093abcf1f3f210ec1d2755d82d578b1103c3a85792bd9ea8c270ea5efa4560000800100008000000080000000000000000001172050929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0000000"
    const keystoneSDK = new KeystoneSDK();
    const ur = keystoneSDK.btc.generatePSBT(Buffer.from(psbtHex, "hex"));

    const onSucceed = ({type, cbor}) => {
        console.log("type: ", type);
        const psbtHex = keystoneSDK.btc.parsePSBT(new UR(Buffer.from(cbor, "hex"), type))
        console.log("psbt: ", psbtHex);
        console.log("tx: ", extractTransaction(psbtHex));
        setIsScanning(false);
    }

    const onError = (errorMessage) => {
        console.log("error: ",errorMessage);
        setIsScanning(false);
    }

    return (
        isScanning
            ? <AnimatedQRScanner
                handleScan={onSucceed}
                handleError={onError}
                urTypes={[URType.CryptoPSBT]}
                options={{
                    width: 400,
                    height: 300
                }}
            />
            : (
                <>
                    <AnimatedQRCode type={ur.type} cbor={ur.cbor.toString("hex")}/>
                    <button onClick={() => { setIsScanning(true) }}>Scan Keystone</button>
                </>
            )
    )
}
