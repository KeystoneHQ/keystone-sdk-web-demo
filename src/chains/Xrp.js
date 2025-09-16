import KeystoneSDK, {UR, URType} from "@keystonehq/keystone-sdk"
import {AnimatedQRCode, AnimatedQRScanner} from "@keystonehq/animated-qr"

let xrpTransaction = {
    TransactionType: "Payment",
    Amount: "10000000",
    Destination: "rGUmkyLbvqGF3hwX4qwGHdrzLdY2Qpskum",
    Flags: 2147483648,
    Account: "rDur9gS6DjqrwGnPRa4RZeiPpkqtv2Gf2m",
    Fee: "12",
    Sequence: 82376388,
    LastLedgerSequence: 80032220,
    SigningPubKey: "03b91e16e98ba86b62a52aaa2d41c114b36c8bfcd862b1eced77dc5d77676510f8"
}

export const Xrp = () => {
    const keystoneSDK = new KeystoneSDK();
    const ur = keystoneSDK.xrp.generateSignRequest(xrpTransaction);

    return <AnimatedQRCode type={ur.type} cbor={ur.cbor.toString("hex")}/>
}

export const XrpScanner = () => {
    const keystoneSDK = new KeystoneSDK();

    const onSucceed = ({cbor, type}) => {
        const signature = keystoneSDK.xrp.parseSignature(new UR(Buffer.from(cbor, "hex"), type))
        console.log("signature: ", signature);
    }
    const onError = (errorMessage) => {
        console.log("error: ",errorMessage);
    }

    return <AnimatedQRScanner handleScan={onSucceed} handleError={onError} urTypes={[URType.XrpSignature]} />
}
