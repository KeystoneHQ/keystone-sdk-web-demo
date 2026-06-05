import {AnimatedQRScanner} from "@keystonehq/animated-qr"
import {parseURBytes, UR, URType } from "@keystonehq/keystone-sdk"
import {useState} from "react";

export const KeystoneBytes = () => {
  const [result, setResult] = useState(null)

  const onSucceed = ({type, cbor}) => {
        
    const bytes = parseURBytes(new UR(Buffer.from(cbor, "hex"), type));
    const parsedResult = {
      hex: bytes.toString("hex"),
      utf8: bytes.toString("utf8"),
    }
    setResult(parsedResult);
    console.log("bytes hex: ", parsedResult.hex);
  }

  const onError = (errorMessage) => {
    console.log("error: ", errorMessage);
  }

  return (
    <>
      <AnimatedQRScanner
        handleScan={onSucceed}
        handleError={onError}
        urTypes={["bytes"]}
        options={{
          width: 400,
          height: 300
        }}
      />
      {
        !!result && (
          <div style={{maxWidth: 800, wordBreak: "break-word", textAlign: "left"}}>
            <p>hex: {result.hex}</p>
            <p>utf8: {result.utf8}</p>
          </div>
        )
      }
    </>
  )
}
