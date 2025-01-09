import KeystoneSDK, { UR } from "@keystonehq/keystone-sdk"
import { AnimatedQRCode, AnimatedQRScanner } from "@keystonehq/animated-qr"
import { AvalancheSignRequest } from "@keystonehq/bc-ur-registry-avalanche";
import { Buffer } from 'buffer';

let avalancheTransaction = {
    // requestId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    mfp: "1250B6Bc",
    xpub: "xpub661MyMwAqRbcGSmFWVZk2h773zMrcPFqDUWi7cFRpgPhfn7y9HEPzPsBDEXYxAWfAoGo7E7ijjYfB3xAY86MYzfvGLDHmcy2epZKNeDd4uQ",
    walletIndex: 0,
    data: "00000000000000000001ed5f38341e436e5d46e2bb00b45d62ae97d1b050c64bc634ae10626739e35c4b0000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000000089544000000000000000000000000100000001512e7191685398f00663e12197a3d8f6012d9ea300000001db720ad6707915cc4751fb7e5491a3af74e127a1d81817abe9438590c0833fe10000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000050000000000989680000000010000000000000000",
}
// const mfp = "1250B6Bc";
// const xpub =
//   "xpub661MyMwAqRbcGSmFWVZk2h773zMrcPFqDUWi7cFRpgPhfn7y9HEPzPsBDEXYxAWfAoGo7E7ijjYfB3xAY86MYzfvGLDHmcy2epZKNeDd4uQ";
// const walletIndex = 0;

export const Avalanche = () => {
    // const keystoneSDK = new KeystoneSDK();
    // const ur = keystoneSDK.avalanche.generateSignRequest(avalancheTransaction);
    // console.log(ur.cbor.toString("hex"));

    const ur = AvalancheSignRequest.constructAvalancheRequest(
        Buffer.from(avalancheTransaction.data, "hex"),
        avalancheTransaction.mfp,
        avalancheTransaction.xpub,
        avalancheTransaction.walletIndex
    ).toUR();
    console.log(ur.cbor.toString("hex"));

    return <AnimatedQRCode options={{
        capacity: 300,
    }} type={ur.type} cbor={"a501d825501a79a2072e114014837e792e003384c10258de00000000000000000001ed5f38341e436e5d46e2bb00b45d62ae97d1b050c64bc634ae10626739e35c4b0000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000000089544000000000000000000000000100000001512e7191685398f00663e12197a3d8f6012d9ea300000001db720ad6707915cc4751fb7e5491a3af74e127a1d81817abe9438590c0833fe10000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000050000000000989680000000010000000000000000031a1250b6bc06786f787075623636314d794d7741715262634646444d75466947516d4131457157787867444c64744e7678786975636639716b666f56727677676e5979736878576f657757746b5a31614c684b6f564472706544766e31595271785832737a68474b69335569534576316859524d4638710700"} />;
}

export const AvalancheScanner = () => {
    const keystoneSDK = new KeystoneSDK();

    const onSucceed = ({ cbor, type }) => {
        console.log(type, cbor);
        // const signature = keystoneSDK.avalanche.parseAccount(new UR(Buffer.from(cbor, "hex"), type))
        // console.log("signature: ", signature);
    }
    const onError = (errorMessage) => {
        console.log("error: ", errorMessage);
    }

    return <AnimatedQRScanner handleScan={onSucceed} handleError={onError} urTypes={['avax-signature']} />
}