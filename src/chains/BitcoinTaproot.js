import { useState } from "react";
import KeystoneSDK, { UR, URType } from "@keystonehq/keystone-sdk";
import { AnimatedQRCode, AnimatedQRScanner } from "@keystonehq/animated-qr";
import * as bitcoinjs from 'bitcoinjs-lib';
import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs';

bitcoinjs.initEccLib(ecc);

const generatePSBT = () => {
  const psbt = new bitcoinjs.Psbt();
  psbt.addInput({
    witnessUtxo: {
      script: Buffer.from(
        "5120441775289ee1c01bdf9afa7ae450c0e07edc279c10fe3d188381a6630522cd3a",
        "hex"
      ),
      value: 24079,
    },
    index: 1,
    hash: Buffer.from(
      "1004c22e2ff1f6eaca4e605da0039deee430f198aefe34c929a001f34078257f",
      "hex"
    ),
    sequence: 4294967293,
    tapBip32Derivation: [
      {
        masterFingerprint: Buffer.from("eb16731f", "hex"),
        pubkey: Buffer.from(
          "803126a3ffb0263620215fc7ad6164f8fc2d6a2da0647716e8def1951e7147aa",
          "hex"
        ),
        path: "m/86'/0'/0'/1/0",
        leafHashes: [],
      },
    ],
    tapInternalKey: Buffer.from(
      "803126a3ffb0263620215fc7ad6164f8fc2d6a2da0647716e8def1951e7147aa",
      "hex"
    ),
  });

  psbt.addOutput({
    script: Buffer.from("00146eb3ba58bb0086cdc145557296d93b4bc477fd47", "hex"),
    address: "bc1qd6em5k9mqzrvms2924efdkfmf0z80l28yuz339",
    value: 2000,
  });

  psbt.setLocktime(828228);

  psbt.addOutput({
    value: 16684,
    script: Buffer.from(
      "512055994539b6c947e51a4a10046852aa3aa58cba5b760315b79c675060675348c5",
      "hex"
    ),
    tapInternalKey: Buffer.from(
      "14678a47d5f7f4e6141bae409a567654e9319eaaeea6e704b0cebafcf853396e",
      "hex"
    ),
    tapBip32Derivation: [
      {
        masterFingerprint: Buffer.from("eb16731f", "hex"),
        pubkey: Buffer.from(
          "14678a47d5f7f4e6141bae409a567654e9319eaaeea6e704b0cebafcf853396e",
          "hex"
        ),
        path: "m/86'/0'/0'/1/1",
        leafHashes: [],
      },
    ],
  });

  psbt.updateGlobal({
    globalXpub: [
      {
        masterFingerprint: Buffer.from("eb16731f", "hex"),
        path: "m/86'/0'/0'",
        extendedPubkey: Buffer.from(
          "0488b21e038dec43f0800000009cf1c7acc5a5f8b66198530b97ab551d2961ae29abf2c8e1af2fdf67fd5562ce029fc255cb068500fca94f45fd38b9409a02886d92cb7314ceca77d0bd655212d6",
          "hex"
        ),
      },
    ],
  });

  return psbt.toHex();
};

const extractTransaction = (psbtHex) => {
  const psbt = bitcoinjs.Psbt.fromHex(psbtHex);
  let extractedTransaction;
  try {
    extractedTransaction = psbt.finalizeAllInputs().extractTransaction();
  } catch (_) {
    extractedTransaction = psbt.extractTransaction();
  }
  // network serialized transaction
  return extractedTransaction.toHex();
};

export const BitcoinTaproot = () => {
  const [isScanning, setIsScanning] = useState(false);

  const psbtHex = generatePSBT();
  const keystoneSDK = new KeystoneSDK();
  const ur = keystoneSDK.btc.generatePSBT(Buffer.from(psbtHex, "hex"));

  const onSucceed = ({ type, cbor }) => {
    const psbtHex = keystoneSDK.btc.parsePSBT(
      new UR(Buffer.from(cbor, "hex"), type)
    );
    console.log("psbt: ", psbtHex);
    console.log("tx: ", extractTransaction(psbtHex));
    setIsScanning(false);
  };

  const onError = (errorMessage) => {
    console.log("error: ", errorMessage);
    setIsScanning(false);
  };

  return isScanning ? (
    <AnimatedQRScanner
      handleScan={onSucceed}
      handleError={onError}
      urTypes={[URType.CryptoPSBT]}
      options={{
        width: 400,
        height: 300,
      }}
    />
  ) : (
    <>
      <AnimatedQRCode type={ur.type} cbor={ur.cbor.toString("hex")} />
      <button
        onClick={() => {
          setIsScanning(true);
        }}
      >
        Scan Keystone
      </button>
    </>
  );
};
