
import { ed25519 } from 'https://esm.sh/@noble/curves@1.2.0/ed25519'  
import { base32 } from 'https://esm.sh/multiformats@13.3.6/bases/base32.js' 
import { bytesToHex, hexToBytes } from 'https://esm.sh/@noble/hashes@1.3.2/utils.js'
import { Encryption } from "./curve25519Encryption.js";

const keyType = {  
    RSA: 0,  
    Ed25519: 1,  
    Secp256k1: 2,  
    ECDSA: 3  
}

//比较两个 Uint8Array  
const arrayEquals = (a, b) => {  
    if (a.length !== b.length) return false;  
    return a.every((val, i) => val === b[i]);  
};  
// ED25519私钥实现  
export class Ed25519PrivKey {  
    constructor(privateKey) {  
        if (privateKey.length !== 64) {  
            throw new Error('ed25519: bad private key length')  
        }  
        // 用复制的方式保存私钥
        this.raw = new Uint8Array(privateKey)
        this.type = 'Ed25519'
        // 公钥是私钥的后32字节  
        this.publicKey = new Ed25519PubKey(privateKey.slice(32))  
    }  

    static fromSeed(seed) {  
        if (seed.length !== 32) {  
            throw new Error('ed25519: bad seed length')  
        }  

        // 生成公钥  
        const publicKey = ed25519.getPublicKey(seed)  

        // 构造64字节私钥  
        const privateKey = new Uint8Array(64)  
        privateKey.set(seed)  
        privateKey.set(publicKey, 32)  

        return new Ed25519PrivKey(privateKey)  
    }  

    bytes() {  
        return this.raw  
    }  

    sign(msg) {  
        // 使用私钥的前32字节（种子）进行签名  
        return ed25519.sign(msg, this.raw.slice(0, 32))  
    }  

    async decrypt(data) {  
        const decrypted = await Encryption.decrypt(this.raw, data);
        return decrypted 
    } 

    equals(other) {  
        return arrayEquals(this.bytes(), other.bytes())
    }  

    // privateKeyToProto converts a public key object into an unserialized
    // protobuf PrivateKey message.
    static privateKeyToProto(k) {
        const message = {  
            type: keyType.Ed25519,  
            data: k.bytes(),  
        }
        const buffer = Ed25519PrivKey.proto.encode(message).finish(); 
        return buffer
    }

    // privateKeyFromProto converts a protobuf PrivateKey message into a public key object.
    static privateKeyFromProto(buf) {
        const decoded = Ed25519PrivKey.proto.decode(buf);  
        if (decoded.type !== keyType.Ed25519) {  
            throw new Error('Invalid key type')  
        }  
        return new Ed25519PrivKey(decoded.data)
    }

    //与dc中的go代码兼容
    string() {
        const protoBytes = Ed25519PrivKey.privateKeyToProto(this)
        // 使用 base32 编码
        return base32.encode(protoBytes)
    }
    
    // 从字符串创建私钥
    static unmarshalString(str) {
        const protoBytes = base32.decode(str)
        return Ed25519PrivKey.privateKeyFromProto(protoBytes)
    }

    toString() {  
        return bytesToHex(this.bytes()) 
    }  

    static fromString(str) {  
        return new Ed25519PrivKey(hexToBytes(str))  
    }  
}
