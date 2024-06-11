import React from "react";
import KeystoneSDK, { KeystoneStellarSDK, UR, URType } from "@keystonehq/keystone-sdk"
import { AnimatedQRCode, AnimatedQRScanner } from "@keystonehq/animated-qr"
import { setupScanner } from "@keystonehq/animated-qr-lit";

const VIDEO_ID = "qr-scanner-video";

let stellarTransaction = {
    requestId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    signData: "7ac33997544e3175d266bd022439b22cdb16508c01163f26e5cb2a3e1045a979000000020000000096e8c54780e871fabf106cb5b047149e72b04aa5e069a158b2d0e7a68ab50d4f00002710031494870000000a00000001000000000000000000000000664ed303000000000000000100000000000000060000000155534443000000003b9911380efe988ba0a8900eb1cfe44f366f7dbe946bed077240f7f624df15c57fffffffffffffff00000000",
    dataType: KeystoneStellarSDK.DataType.Transaction,
    path: "m/44'/148'/0'",
    xfp: "1250B6BC",
    origin: 'xbull wallet'
}

let stellarTransactionHash = {
    requestId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    signData: "e3bff0cb003cf867acfd117fb514dfaf7a8dd5dddf6e68cc71f553de5046ae2b",
    dataType: KeystoneStellarSDK.DataType.TransactionHash,
    path: "m/44'/148'/0'",
    xfp: "1250B6BC",
    origin: 'xbull wallet'
}

export const Stellar = () => {
    const keystoneSDK = new KeystoneSDK();
    const ur = keystoneSDK.stellar.generateSignRequest(stellarTransaction);
    // const ur = keystoneSDK.stellar.generateSignRequest(stellarTransactionHash);

    return <>
        <animated-qrcode-lit
            cbor={ur.cbor.toString("hex")}
            type={ur.type}
            capacity={200}
        />
        <StellarScanner />
    </>;
}

export const StellarScanner = () => {
    const keystoneSDK = new KeystoneSDK();

    const onSucceed = (ur) => {
        const { cbor } = ur;
        ur.cbor = Buffer.from(cbor, "hex");
        const signatureResponse = keystoneSDK.stellar.parseSignature(ur)
        console.log("signatureResponse: ", signatureResponse.requestId, signatureResponse.signature);
    }
    const onError = (errorMessage) => {
        console.log("error: ", errorMessage);
    }

    const onProgress = (progress) => {
        console.log("scan progress: ", progress);
    }

    const onCameraStatus = (isCameraReady, error) => {
        if (!isCameraReady) {
            if(error === "NO_WEBCAM_FOUND"){
                console.log("No camera");
            } else if(error === "NO_WEBCAM_ACCESS"){
                console.log("No camera permission");
            }
        } else {
            console.log("Camera ready");
        }
    }

    React.useEffect(() => {
        const videoElement = document.getElementById(VIDEO_ID);
        let destroyScanner = () => {};
        if (videoElement) {
            destroyScanner = setupScanner({
                video: videoElement,
                handleScan: onSucceed,
                handleError: onError,
                // onProgress: onProgress,
                // videoLoaded: onCameraStatus,
                urTypes: [URType.StellarSignature],
            });
        }

        return destroyScanner;
    }, []);

    return <video
        id={VIDEO_ID}
        style={{
            display: "block",
            width: 100,
            height: 100,
            objectFit: "cover",
            transform: "rotateY(180deg)",
        }}
    ></video>;
}
