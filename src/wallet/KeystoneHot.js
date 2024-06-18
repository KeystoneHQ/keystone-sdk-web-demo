import {UR, URType} from "@keystonehq/keystone-sdk"
import {AnimatedQRScanner} from "@keystonehq/animated-qr"
import { decode }  from "@cvbb/qr-protocol/dist/QRProtocolCodec/decode"
export const KeystoneHot = () => {

  const onSucceed = ({type, cbor}) => {
    try {
        let ur = new UR(Buffer.from(cbor, "hex"), type)
        let compressedBuffer = ur.decodeCBOR();
        let jsonResult = decode(compressedBuffer)
        console.log("JSON: ", JSON.stringify(jsonResult.toJSON(), null, '\t'));
    } catch (e) {
        console.error(e);
    }
    
    
  }
  const onError = (errorMessage) => {
    console.log("error: ",errorMessage);
  }

  return <AnimatedQRScanner handleScan={onSucceed} handleError={onError} urTypes={[URType.XrpAccount]} />
}
