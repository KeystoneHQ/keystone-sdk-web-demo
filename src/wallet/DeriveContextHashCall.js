import KeystoneSDK, { QRHardwareCallVersion, UREncoder } from "@keystonehq/keystone-sdk";
import { AnimatedQRCode } from "@keystonehq/animated-qr";
// import { UREncoder } from '@ngraveio/bc-ur'

export const DeriveContextHashCall = () => {
    const ur = KeystoneSDK.generateDeriveContextHashCall({
        appName: "test-app",
        network: "bitcoin-mainnet",
        keyPath: "m/44'/0'/0'/0/0",
        context: "deadbeef",
        origin: "test app",
        version: QRHardwareCallVersion.V1,
    });

    console.log("Derive Context Hash Call UR: ", UREncoder.encodeSinglePart(ur).toUpperCase());

    return <AnimatedQRCode type={ur.type} cbor={ur.cbor.toString("hex")} />;
}
