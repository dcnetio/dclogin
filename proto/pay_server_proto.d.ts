import * as $protobuf from "protobufjs";
/** Namespace pb. */
export namespace pb {

    /** Represents a PayService */
    class PayService extends $protobuf.rpc.Service {

        /**
         * Constructs a new PayService service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new PayService service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): PayService;

        /**
         * Calls GetPackages.
         * @param request GetPackagesRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and GetPackagesResponse
         */
        public getPackages(request: pb.IGetPackagesRequest, callback: pb.PayService.GetPackagesCallback): void;

        /**
         * Calls GetPackages.
         * @param request GetPackagesRequest message or plain object
         * @returns Promise
         */
        public getPackages(request: pb.IGetPackagesRequest): Promise<pb.GetPackagesResponse>;

        /**
         * Calls CreateOrder.
         * @param request CreateOrderRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and CreateOrderResponse
         */
        public createOrder(request: pb.ICreateOrderRequest, callback: pb.PayService.CreateOrderCallback): void;

        /**
         * Calls CreateOrder.
         * @param request CreateOrderRequest message or plain object
         * @returns Promise
         */
        public createOrder(request: pb.ICreateOrderRequest): Promise<pb.CreateOrderResponse>;

        /**
         * Calls GetNativePrepay.
         * @param request GetNativePrepayRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and GetNativePrepayResponse
         */
        public getNativePrepay(request: pb.IGetNativePrepayRequest, callback: pb.PayService.GetNativePrepayCallback): void;

        /**
         * Calls GetNativePrepay.
         * @param request GetNativePrepayRequest message or plain object
         * @returns Promise
         */
        public getNativePrepay(request: pb.IGetNativePrepayRequest): Promise<pb.GetNativePrepayResponse>;

        /**
         * Calls GetStoragePurchaseStatus.
         * @param request GetStoragePurchaseStatusRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and GetStoragePurchaseStatusResponse
         */
        public getStoragePurchaseStatus(request: pb.IGetStoragePurchaseStatusRequest, callback: pb.PayService.GetStoragePurchaseStatusCallback): void;

        /**
         * Calls GetStoragePurchaseStatus.
         * @param request GetStoragePurchaseStatusRequest message or plain object
         * @returns Promise
         */
        public getStoragePurchaseStatus(request: pb.IGetStoragePurchaseStatusRequest): Promise<pb.GetStoragePurchaseStatusResponse>;
    }

    namespace PayService {

        /**
         * Callback as used by {@link pb.PayService#getPackages}.
         * @param error Error, if any
         * @param [response] GetPackagesResponse
         */
        type GetPackagesCallback = (error: (Error|null), response?: pb.GetPackagesResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#createOrder}.
         * @param error Error, if any
         * @param [response] CreateOrderResponse
         */
        type CreateOrderCallback = (error: (Error|null), response?: pb.CreateOrderResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#getNativePrepay}.
         * @param error Error, if any
         * @param [response] GetNativePrepayResponse
         */
        type GetNativePrepayCallback = (error: (Error|null), response?: pb.GetNativePrepayResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#getStoragePurchaseStatus}.
         * @param error Error, if any
         * @param [response] GetStoragePurchaseStatusResponse
         */
        type GetStoragePurchaseStatusCallback = (error: (Error|null), response?: pb.GetStoragePurchaseStatusResponse) => void;
    }

    /** Properties of a GetPackagesRequest. */
    interface IGetPackagesRequest {

        /** GetPackagesRequest pkgType */
        pkgType?: (number|null);

        /** GetPackagesRequest lang */
        lang?: (string|null);

        /** GetPackagesRequest currency */
        currency?: (string|null);
    }

    /** Represents a GetPackagesRequest. */
    class GetPackagesRequest implements IGetPackagesRequest {

        /**
         * Constructs a new GetPackagesRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetPackagesRequest);

        /** GetPackagesRequest pkgType. */
        public pkgType: number;

        /** GetPackagesRequest lang. */
        public lang: string;

        /** GetPackagesRequest currency. */
        public currency: string;

        /**
         * Creates a new GetPackagesRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetPackagesRequest instance
         */
        public static create(properties?: pb.IGetPackagesRequest): pb.GetPackagesRequest;

        /**
         * Encodes the specified GetPackagesRequest message. Does not implicitly {@link pb.GetPackagesRequest.verify|verify} messages.
         * @param message GetPackagesRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetPackagesRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetPackagesRequest message, length delimited. Does not implicitly {@link pb.GetPackagesRequest.verify|verify} messages.
         * @param message GetPackagesRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetPackagesRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetPackagesRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetPackagesRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetPackagesRequest;

        /**
         * Decodes a GetPackagesRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetPackagesRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetPackagesRequest;

        /**
         * Verifies a GetPackagesRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetPackagesRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetPackagesRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.GetPackagesRequest;

        /**
         * Creates a plain object from a GetPackagesRequest message. Also converts values to other types if specified.
         * @param message GetPackagesRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetPackagesRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetPackagesRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetPackagesResponse. */
    interface IGetPackagesResponse {

        /** GetPackagesResponse code */
        code?: (number|null);

        /** GetPackagesResponse msg */
        msg?: (string|null);

        /** GetPackagesResponse data */
        data?: (pb.IPackageInfo[]|null);
    }

    /** Represents a GetPackagesResponse. */
    class GetPackagesResponse implements IGetPackagesResponse {

        /**
         * Constructs a new GetPackagesResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetPackagesResponse);

        /** GetPackagesResponse code. */
        public code: number;

        /** GetPackagesResponse msg. */
        public msg: string;

        /** GetPackagesResponse data. */
        public data: pb.IPackageInfo[];

        /**
         * Creates a new GetPackagesResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetPackagesResponse instance
         */
        public static create(properties?: pb.IGetPackagesResponse): pb.GetPackagesResponse;

        /**
         * Encodes the specified GetPackagesResponse message. Does not implicitly {@link pb.GetPackagesResponse.verify|verify} messages.
         * @param message GetPackagesResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetPackagesResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetPackagesResponse message, length delimited. Does not implicitly {@link pb.GetPackagesResponse.verify|verify} messages.
         * @param message GetPackagesResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetPackagesResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetPackagesResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetPackagesResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetPackagesResponse;

        /**
         * Decodes a GetPackagesResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetPackagesResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetPackagesResponse;

        /**
         * Verifies a GetPackagesResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetPackagesResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetPackagesResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.GetPackagesResponse;

        /**
         * Creates a plain object from a GetPackagesResponse message. Also converts values to other types if specified.
         * @param message GetPackagesResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetPackagesResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetPackagesResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PackageInfo. */
    interface IPackageInfo {

        /** PackageInfo pkgId */
        pkgId?: (number|null);

        /** PackageInfo pkgType */
        pkgType?: (number|null);

        /** PackageInfo pkgName */
        pkgName?: (string|null);

        /** PackageInfo lang */
        lang?: (string|null);

        /** PackageInfo amount */
        amount?: (number|null);

        /** PackageInfo currency */
        currency?: (string|null);

        /** PackageInfo validDays */
        validDays?: (number|null);

        /** PackageInfo callTimes */
        callTimes?: (number|null);

        /** PackageInfo chainPkgId */
        chainPkgId?: (number|null);

        /** PackageInfo spaceSize */
        spaceSize?: (number|null);

        /** PackageInfo createTime */
        createTime?: (string|null);
    }

    /** Represents a PackageInfo. */
    class PackageInfo implements IPackageInfo {

        /**
         * Constructs a new PackageInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IPackageInfo);

        /** PackageInfo pkgId. */
        public pkgId: number;

        /** PackageInfo pkgType. */
        public pkgType: number;

        /** PackageInfo pkgName. */
        public pkgName: string;

        /** PackageInfo lang. */
        public lang: string;

        /** PackageInfo amount. */
        public amount: number;

        /** PackageInfo currency. */
        public currency: string;

        /** PackageInfo validDays. */
        public validDays: number;

        /** PackageInfo callTimes. */
        public callTimes: number;

        /** PackageInfo chainPkgId. */
        public chainPkgId: number;

        /** PackageInfo spaceSize. */
        public spaceSize: number;

        /** PackageInfo createTime. */
        public createTime: string;

        /**
         * Creates a new PackageInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PackageInfo instance
         */
        public static create(properties?: pb.IPackageInfo): pb.PackageInfo;

        /**
         * Encodes the specified PackageInfo message. Does not implicitly {@link pb.PackageInfo.verify|verify} messages.
         * @param message PackageInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IPackageInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PackageInfo message, length delimited. Does not implicitly {@link pb.PackageInfo.verify|verify} messages.
         * @param message PackageInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IPackageInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PackageInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PackageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.PackageInfo;

        /**
         * Decodes a PackageInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PackageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.PackageInfo;

        /**
         * Verifies a PackageInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PackageInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PackageInfo
         */
        public static fromObject(object: { [k: string]: any }): pb.PackageInfo;

        /**
         * Creates a plain object from a PackageInfo message. Also converts values to other types if specified.
         * @param message PackageInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.PackageInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PackageInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CreateOrderRequest. */
    interface ICreateOrderRequest {

        /** CreateOrderRequest account */
        account?: (string|null);

        /** CreateOrderRequest pkgId */
        pkgId?: (number|null);

        /** CreateOrderRequest description */
        description?: (string|null);

        /** CreateOrderRequest amount */
        amount?: (pb.IAmountInfo|null);

        /** CreateOrderRequest dappid */
        dappid?: (string|null);
    }

    /** Represents a CreateOrderRequest. */
    class CreateOrderRequest implements ICreateOrderRequest {

        /**
         * Constructs a new CreateOrderRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.ICreateOrderRequest);

        /** CreateOrderRequest account. */
        public account: string;

        /** CreateOrderRequest pkgId. */
        public pkgId: number;

        /** CreateOrderRequest description. */
        public description: string;

        /** CreateOrderRequest amount. */
        public amount?: (pb.IAmountInfo|null);

        /** CreateOrderRequest dappid. */
        public dappid: string;

        /**
         * Creates a new CreateOrderRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreateOrderRequest instance
         */
        public static create(properties?: pb.ICreateOrderRequest): pb.CreateOrderRequest;

        /**
         * Encodes the specified CreateOrderRequest message. Does not implicitly {@link pb.CreateOrderRequest.verify|verify} messages.
         * @param message CreateOrderRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.ICreateOrderRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CreateOrderRequest message, length delimited. Does not implicitly {@link pb.CreateOrderRequest.verify|verify} messages.
         * @param message CreateOrderRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.ICreateOrderRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreateOrderRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreateOrderRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.CreateOrderRequest;

        /**
         * Decodes a CreateOrderRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CreateOrderRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.CreateOrderRequest;

        /**
         * Verifies a CreateOrderRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CreateOrderRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CreateOrderRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.CreateOrderRequest;

        /**
         * Creates a plain object from a CreateOrderRequest message. Also converts values to other types if specified.
         * @param message CreateOrderRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.CreateOrderRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CreateOrderRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AmountInfo. */
    interface IAmountInfo {

        /** AmountInfo total */
        total?: (number|null);
    }

    /** Represents an AmountInfo. */
    class AmountInfo implements IAmountInfo {

        /**
         * Constructs a new AmountInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAmountInfo);

        /** AmountInfo total. */
        public total: number;

        /**
         * Creates a new AmountInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AmountInfo instance
         */
        public static create(properties?: pb.IAmountInfo): pb.AmountInfo;

        /**
         * Encodes the specified AmountInfo message. Does not implicitly {@link pb.AmountInfo.verify|verify} messages.
         * @param message AmountInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAmountInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AmountInfo message, length delimited. Does not implicitly {@link pb.AmountInfo.verify|verify} messages.
         * @param message AmountInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAmountInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AmountInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AmountInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AmountInfo;

        /**
         * Decodes an AmountInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AmountInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AmountInfo;

        /**
         * Verifies an AmountInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AmountInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AmountInfo
         */
        public static fromObject(object: { [k: string]: any }): pb.AmountInfo;

        /**
         * Creates a plain object from an AmountInfo message. Also converts values to other types if specified.
         * @param message AmountInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AmountInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AmountInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CreateOrderResponse. */
    interface ICreateOrderResponse {

        /** CreateOrderResponse code */
        code?: (number|null);

        /** CreateOrderResponse msg */
        msg?: (string|null);

        /** CreateOrderResponse data */
        data?: (pb.ICreateOrderData|null);
    }

    /** Represents a CreateOrderResponse. */
    class CreateOrderResponse implements ICreateOrderResponse {

        /**
         * Constructs a new CreateOrderResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.ICreateOrderResponse);

        /** CreateOrderResponse code. */
        public code: number;

        /** CreateOrderResponse msg. */
        public msg: string;

        /** CreateOrderResponse data. */
        public data?: (pb.ICreateOrderData|null);

        /**
         * Creates a new CreateOrderResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreateOrderResponse instance
         */
        public static create(properties?: pb.ICreateOrderResponse): pb.CreateOrderResponse;

        /**
         * Encodes the specified CreateOrderResponse message. Does not implicitly {@link pb.CreateOrderResponse.verify|verify} messages.
         * @param message CreateOrderResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.ICreateOrderResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CreateOrderResponse message, length delimited. Does not implicitly {@link pb.CreateOrderResponse.verify|verify} messages.
         * @param message CreateOrderResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.ICreateOrderResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreateOrderResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreateOrderResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.CreateOrderResponse;

        /**
         * Decodes a CreateOrderResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CreateOrderResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.CreateOrderResponse;

        /**
         * Verifies a CreateOrderResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CreateOrderResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CreateOrderResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.CreateOrderResponse;

        /**
         * Creates a plain object from a CreateOrderResponse message. Also converts values to other types if specified.
         * @param message CreateOrderResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.CreateOrderResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CreateOrderResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CreateOrderData. */
    interface ICreateOrderData {

        /** CreateOrderData outTradeNo */
        outTradeNo?: (string|null);
    }

    /** Represents a CreateOrderData. */
    class CreateOrderData implements ICreateOrderData {

        /**
         * Constructs a new CreateOrderData.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.ICreateOrderData);

        /** CreateOrderData outTradeNo. */
        public outTradeNo: string;

        /**
         * Creates a new CreateOrderData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreateOrderData instance
         */
        public static create(properties?: pb.ICreateOrderData): pb.CreateOrderData;

        /**
         * Encodes the specified CreateOrderData message. Does not implicitly {@link pb.CreateOrderData.verify|verify} messages.
         * @param message CreateOrderData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.ICreateOrderData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CreateOrderData message, length delimited. Does not implicitly {@link pb.CreateOrderData.verify|verify} messages.
         * @param message CreateOrderData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.ICreateOrderData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreateOrderData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreateOrderData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.CreateOrderData;

        /**
         * Decodes a CreateOrderData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CreateOrderData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.CreateOrderData;

        /**
         * Verifies a CreateOrderData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CreateOrderData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CreateOrderData
         */
        public static fromObject(object: { [k: string]: any }): pb.CreateOrderData;

        /**
         * Creates a plain object from a CreateOrderData message. Also converts values to other types if specified.
         * @param message CreateOrderData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.CreateOrderData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CreateOrderData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetNativePrepayRequest. */
    interface IGetNativePrepayRequest {

        /** GetNativePrepayRequest outTradeNo */
        outTradeNo?: (string|null);
    }

    /** Represents a GetNativePrepayRequest. */
    class GetNativePrepayRequest implements IGetNativePrepayRequest {

        /**
         * Constructs a new GetNativePrepayRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetNativePrepayRequest);

        /** GetNativePrepayRequest outTradeNo. */
        public outTradeNo: string;

        /**
         * Creates a new GetNativePrepayRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetNativePrepayRequest instance
         */
        public static create(properties?: pb.IGetNativePrepayRequest): pb.GetNativePrepayRequest;

        /**
         * Encodes the specified GetNativePrepayRequest message. Does not implicitly {@link pb.GetNativePrepayRequest.verify|verify} messages.
         * @param message GetNativePrepayRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetNativePrepayRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetNativePrepayRequest message, length delimited. Does not implicitly {@link pb.GetNativePrepayRequest.verify|verify} messages.
         * @param message GetNativePrepayRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetNativePrepayRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetNativePrepayRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetNativePrepayRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetNativePrepayRequest;

        /**
         * Decodes a GetNativePrepayRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetNativePrepayRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetNativePrepayRequest;

        /**
         * Verifies a GetNativePrepayRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetNativePrepayRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetNativePrepayRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.GetNativePrepayRequest;

        /**
         * Creates a plain object from a GetNativePrepayRequest message. Also converts values to other types if specified.
         * @param message GetNativePrepayRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetNativePrepayRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetNativePrepayRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetNativePrepayResponse. */
    interface IGetNativePrepayResponse {

        /** GetNativePrepayResponse code */
        code?: (number|null);

        /** GetNativePrepayResponse msg */
        msg?: (string|null);

        /** GetNativePrepayResponse data */
        data?: (pb.INativePrepayData|null);
    }

    /** Represents a GetNativePrepayResponse. */
    class GetNativePrepayResponse implements IGetNativePrepayResponse {

        /**
         * Constructs a new GetNativePrepayResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetNativePrepayResponse);

        /** GetNativePrepayResponse code. */
        public code: number;

        /** GetNativePrepayResponse msg. */
        public msg: string;

        /** GetNativePrepayResponse data. */
        public data?: (pb.INativePrepayData|null);

        /**
         * Creates a new GetNativePrepayResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetNativePrepayResponse instance
         */
        public static create(properties?: pb.IGetNativePrepayResponse): pb.GetNativePrepayResponse;

        /**
         * Encodes the specified GetNativePrepayResponse message. Does not implicitly {@link pb.GetNativePrepayResponse.verify|verify} messages.
         * @param message GetNativePrepayResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetNativePrepayResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetNativePrepayResponse message, length delimited. Does not implicitly {@link pb.GetNativePrepayResponse.verify|verify} messages.
         * @param message GetNativePrepayResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetNativePrepayResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetNativePrepayResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetNativePrepayResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetNativePrepayResponse;

        /**
         * Decodes a GetNativePrepayResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetNativePrepayResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetNativePrepayResponse;

        /**
         * Verifies a GetNativePrepayResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetNativePrepayResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetNativePrepayResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.GetNativePrepayResponse;

        /**
         * Creates a plain object from a GetNativePrepayResponse message. Also converts values to other types if specified.
         * @param message GetNativePrepayResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetNativePrepayResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetNativePrepayResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a NativePrepayData. */
    interface INativePrepayData {

        /** NativePrepayData codeUrl */
        codeUrl?: (string|null);
    }

    /** Represents a NativePrepayData. */
    class NativePrepayData implements INativePrepayData {

        /**
         * Constructs a new NativePrepayData.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.INativePrepayData);

        /** NativePrepayData codeUrl. */
        public codeUrl: string;

        /**
         * Creates a new NativePrepayData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NativePrepayData instance
         */
        public static create(properties?: pb.INativePrepayData): pb.NativePrepayData;

        /**
         * Encodes the specified NativePrepayData message. Does not implicitly {@link pb.NativePrepayData.verify|verify} messages.
         * @param message NativePrepayData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.INativePrepayData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NativePrepayData message, length delimited. Does not implicitly {@link pb.NativePrepayData.verify|verify} messages.
         * @param message NativePrepayData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.INativePrepayData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NativePrepayData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NativePrepayData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.NativePrepayData;

        /**
         * Decodes a NativePrepayData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NativePrepayData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.NativePrepayData;

        /**
         * Verifies a NativePrepayData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NativePrepayData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NativePrepayData
         */
        public static fromObject(object: { [k: string]: any }): pb.NativePrepayData;

        /**
         * Creates a plain object from a NativePrepayData message. Also converts values to other types if specified.
         * @param message NativePrepayData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.NativePrepayData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NativePrepayData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetStoragePurchaseStatusRequest. */
    interface IGetStoragePurchaseStatusRequest {

        /** GetStoragePurchaseStatusRequest outTradeNo */
        outTradeNo?: (string|null);
    }

    /** Represents a GetStoragePurchaseStatusRequest. */
    class GetStoragePurchaseStatusRequest implements IGetStoragePurchaseStatusRequest {

        /**
         * Constructs a new GetStoragePurchaseStatusRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetStoragePurchaseStatusRequest);

        /** GetStoragePurchaseStatusRequest outTradeNo. */
        public outTradeNo: string;

        /**
         * Creates a new GetStoragePurchaseStatusRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetStoragePurchaseStatusRequest instance
         */
        public static create(properties?: pb.IGetStoragePurchaseStatusRequest): pb.GetStoragePurchaseStatusRequest;

        /**
         * Encodes the specified GetStoragePurchaseStatusRequest message. Does not implicitly {@link pb.GetStoragePurchaseStatusRequest.verify|verify} messages.
         * @param message GetStoragePurchaseStatusRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetStoragePurchaseStatusRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetStoragePurchaseStatusRequest message, length delimited. Does not implicitly {@link pb.GetStoragePurchaseStatusRequest.verify|verify} messages.
         * @param message GetStoragePurchaseStatusRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetStoragePurchaseStatusRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetStoragePurchaseStatusRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetStoragePurchaseStatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetStoragePurchaseStatusRequest;

        /**
         * Decodes a GetStoragePurchaseStatusRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetStoragePurchaseStatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetStoragePurchaseStatusRequest;

        /**
         * Verifies a GetStoragePurchaseStatusRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetStoragePurchaseStatusRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetStoragePurchaseStatusRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.GetStoragePurchaseStatusRequest;

        /**
         * Creates a plain object from a GetStoragePurchaseStatusRequest message. Also converts values to other types if specified.
         * @param message GetStoragePurchaseStatusRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetStoragePurchaseStatusRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetStoragePurchaseStatusRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetStoragePurchaseStatusResponse. */
    interface IGetStoragePurchaseStatusResponse {

        /** GetStoragePurchaseStatusResponse code */
        code?: (number|null);

        /** GetStoragePurchaseStatusResponse msg */
        msg?: (string|null);

        /** GetStoragePurchaseStatusResponse data */
        data?: (pb.IGetStoragePurchaseStatusData|null);
    }

    /** Represents a GetStoragePurchaseStatusResponse. */
    class GetStoragePurchaseStatusResponse implements IGetStoragePurchaseStatusResponse {

        /**
         * Constructs a new GetStoragePurchaseStatusResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetStoragePurchaseStatusResponse);

        /** GetStoragePurchaseStatusResponse code. */
        public code: number;

        /** GetStoragePurchaseStatusResponse msg. */
        public msg: string;

        /** GetStoragePurchaseStatusResponse data. */
        public data?: (pb.IGetStoragePurchaseStatusData|null);

        /**
         * Creates a new GetStoragePurchaseStatusResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetStoragePurchaseStatusResponse instance
         */
        public static create(properties?: pb.IGetStoragePurchaseStatusResponse): pb.GetStoragePurchaseStatusResponse;

        /**
         * Encodes the specified GetStoragePurchaseStatusResponse message. Does not implicitly {@link pb.GetStoragePurchaseStatusResponse.verify|verify} messages.
         * @param message GetStoragePurchaseStatusResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetStoragePurchaseStatusResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetStoragePurchaseStatusResponse message, length delimited. Does not implicitly {@link pb.GetStoragePurchaseStatusResponse.verify|verify} messages.
         * @param message GetStoragePurchaseStatusResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetStoragePurchaseStatusResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetStoragePurchaseStatusResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetStoragePurchaseStatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetStoragePurchaseStatusResponse;

        /**
         * Decodes a GetStoragePurchaseStatusResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetStoragePurchaseStatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetStoragePurchaseStatusResponse;

        /**
         * Verifies a GetStoragePurchaseStatusResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetStoragePurchaseStatusResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetStoragePurchaseStatusResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.GetStoragePurchaseStatusResponse;

        /**
         * Creates a plain object from a GetStoragePurchaseStatusResponse message. Also converts values to other types if specified.
         * @param message GetStoragePurchaseStatusResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetStoragePurchaseStatusResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetStoragePurchaseStatusResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetStoragePurchaseStatusData. */
    interface IGetStoragePurchaseStatusData {

        /** GetStoragePurchaseStatusData status */
        status?: (number|null);
    }

    /** Represents a GetStoragePurchaseStatusData. */
    class GetStoragePurchaseStatusData implements IGetStoragePurchaseStatusData {

        /**
         * Constructs a new GetStoragePurchaseStatusData.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetStoragePurchaseStatusData);

        /** GetStoragePurchaseStatusData status. */
        public status: number;

        /**
         * Creates a new GetStoragePurchaseStatusData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetStoragePurchaseStatusData instance
         */
        public static create(properties?: pb.IGetStoragePurchaseStatusData): pb.GetStoragePurchaseStatusData;

        /**
         * Encodes the specified GetStoragePurchaseStatusData message. Does not implicitly {@link pb.GetStoragePurchaseStatusData.verify|verify} messages.
         * @param message GetStoragePurchaseStatusData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetStoragePurchaseStatusData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetStoragePurchaseStatusData message, length delimited. Does not implicitly {@link pb.GetStoragePurchaseStatusData.verify|verify} messages.
         * @param message GetStoragePurchaseStatusData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetStoragePurchaseStatusData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetStoragePurchaseStatusData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetStoragePurchaseStatusData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetStoragePurchaseStatusData;

        /**
         * Decodes a GetStoragePurchaseStatusData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetStoragePurchaseStatusData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetStoragePurchaseStatusData;

        /**
         * Verifies a GetStoragePurchaseStatusData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetStoragePurchaseStatusData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetStoragePurchaseStatusData
         */
        public static fromObject(object: { [k: string]: any }): pb.GetStoragePurchaseStatusData;

        /**
         * Creates a plain object from a GetStoragePurchaseStatusData message. Also converts values to other types if specified.
         * @param message GetStoragePurchaseStatusData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetStoragePurchaseStatusData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetStoragePurchaseStatusData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
