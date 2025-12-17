/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const pb = $root.pb = (() => {

    /**
     * Namespace pb.
     * @exports pb
     * @namespace
     */
    const pb = {};

    pb.PayService = (function() {

        /**
         * Constructs a new PayService service.
         * @memberof pb
         * @classdesc Represents a PayService
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function PayService(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (PayService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = PayService;

        /**
         * Creates new PayService service using the specified rpc implementation.
         * @function create
         * @memberof pb.PayService
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {PayService} RPC service. Useful where requests and/or responses are streamed.
         */
        PayService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link pb.PayService#getPackages}.
         * @memberof pb.PayService
         * @typedef GetPackagesCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {pb.GetPackagesResponse} [response] GetPackagesResponse
         */

        /**
         * Calls GetPackages.
         * @function getPackages
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetPackagesRequest} request GetPackagesRequest message or plain object
         * @param {pb.PayService.GetPackagesCallback} callback Node-style callback called with the error, if any, and GetPackagesResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(PayService.prototype.getPackages = function getPackages(request, callback) {
            return this.rpcCall(getPackages, $root.pb.GetPackagesRequest, $root.pb.GetPackagesResponse, request, callback);
        }, "name", { value: "GetPackages" });

        /**
         * Calls GetPackages.
         * @function getPackages
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetPackagesRequest} request GetPackagesRequest message or plain object
         * @returns {Promise<pb.GetPackagesResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link pb.PayService#createOrder}.
         * @memberof pb.PayService
         * @typedef CreateOrderCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {pb.CreateOrderResponse} [response] CreateOrderResponse
         */

        /**
         * Calls CreateOrder.
         * @function createOrder
         * @memberof pb.PayService
         * @instance
         * @param {pb.ICreateOrderRequest} request CreateOrderRequest message or plain object
         * @param {pb.PayService.CreateOrderCallback} callback Node-style callback called with the error, if any, and CreateOrderResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(PayService.prototype.createOrder = function createOrder(request, callback) {
            return this.rpcCall(createOrder, $root.pb.CreateOrderRequest, $root.pb.CreateOrderResponse, request, callback);
        }, "name", { value: "CreateOrder" });

        /**
         * Calls CreateOrder.
         * @function createOrder
         * @memberof pb.PayService
         * @instance
         * @param {pb.ICreateOrderRequest} request CreateOrderRequest message or plain object
         * @returns {Promise<pb.CreateOrderResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link pb.PayService#getNativePrepay}.
         * @memberof pb.PayService
         * @typedef GetNativePrepayCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {pb.GetNativePrepayResponse} [response] GetNativePrepayResponse
         */

        /**
         * Calls GetNativePrepay.
         * @function getNativePrepay
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetNativePrepayRequest} request GetNativePrepayRequest message or plain object
         * @param {pb.PayService.GetNativePrepayCallback} callback Node-style callback called with the error, if any, and GetNativePrepayResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(PayService.prototype.getNativePrepay = function getNativePrepay(request, callback) {
            return this.rpcCall(getNativePrepay, $root.pb.GetNativePrepayRequest, $root.pb.GetNativePrepayResponse, request, callback);
        }, "name", { value: "GetNativePrepay" });

        /**
         * Calls GetNativePrepay.
         * @function getNativePrepay
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetNativePrepayRequest} request GetNativePrepayRequest message or plain object
         * @returns {Promise<pb.GetNativePrepayResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link pb.PayService#getStoragePurchaseStatus}.
         * @memberof pb.PayService
         * @typedef GetStoragePurchaseStatusCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {pb.GetStoragePurchaseStatusResponse} [response] GetStoragePurchaseStatusResponse
         */

        /**
         * Calls GetStoragePurchaseStatus.
         * @function getStoragePurchaseStatus
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetStoragePurchaseStatusRequest} request GetStoragePurchaseStatusRequest message or plain object
         * @param {pb.PayService.GetStoragePurchaseStatusCallback} callback Node-style callback called with the error, if any, and GetStoragePurchaseStatusResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(PayService.prototype.getStoragePurchaseStatus = function getStoragePurchaseStatus(request, callback) {
            return this.rpcCall(getStoragePurchaseStatus, $root.pb.GetStoragePurchaseStatusRequest, $root.pb.GetStoragePurchaseStatusResponse, request, callback);
        }, "name", { value: "GetStoragePurchaseStatus" });

        /**
         * Calls GetStoragePurchaseStatus.
         * @function getStoragePurchaseStatus
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetStoragePurchaseStatusRequest} request GetStoragePurchaseStatusRequest message or plain object
         * @returns {Promise<pb.GetStoragePurchaseStatusResponse>} Promise
         * @variation 2
         */

        return PayService;
    })();

    pb.GetPackagesRequest = (function() {

        /**
         * Properties of a GetPackagesRequest.
         * @memberof pb
         * @interface IGetPackagesRequest
         * @property {number|null} [pkgType] GetPackagesRequest pkgType
         * @property {string|null} [lang] GetPackagesRequest lang
         * @property {string|null} [currency] GetPackagesRequest currency
         */

        /**
         * Constructs a new GetPackagesRequest.
         * @memberof pb
         * @classdesc Represents a GetPackagesRequest.
         * @implements IGetPackagesRequest
         * @constructor
         * @param {pb.IGetPackagesRequest=} [properties] Properties to set
         */
        function GetPackagesRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetPackagesRequest pkgType.
         * @member {number} pkgType
         * @memberof pb.GetPackagesRequest
         * @instance
         */
        GetPackagesRequest.prototype.pkgType = 0;

        /**
         * GetPackagesRequest lang.
         * @member {string} lang
         * @memberof pb.GetPackagesRequest
         * @instance
         */
        GetPackagesRequest.prototype.lang = "";

        /**
         * GetPackagesRequest currency.
         * @member {string} currency
         * @memberof pb.GetPackagesRequest
         * @instance
         */
        GetPackagesRequest.prototype.currency = "";

        /**
         * Creates a new GetPackagesRequest instance using the specified properties.
         * @function create
         * @memberof pb.GetPackagesRequest
         * @static
         * @param {pb.IGetPackagesRequest=} [properties] Properties to set
         * @returns {pb.GetPackagesRequest} GetPackagesRequest instance
         */
        GetPackagesRequest.create = function create(properties) {
            return new GetPackagesRequest(properties);
        };

        /**
         * Encodes the specified GetPackagesRequest message. Does not implicitly {@link pb.GetPackagesRequest.verify|verify} messages.
         * @function encode
         * @memberof pb.GetPackagesRequest
         * @static
         * @param {pb.IGetPackagesRequest} message GetPackagesRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetPackagesRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.pkgType != null && Object.hasOwnProperty.call(message, "pkgType"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.pkgType);
            if (message.lang != null && Object.hasOwnProperty.call(message, "lang"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.lang);
            if (message.currency != null && Object.hasOwnProperty.call(message, "currency"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.currency);
            return writer;
        };

        /**
         * Encodes the specified GetPackagesRequest message, length delimited. Does not implicitly {@link pb.GetPackagesRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetPackagesRequest
         * @static
         * @param {pb.IGetPackagesRequest} message GetPackagesRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetPackagesRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetPackagesRequest message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetPackagesRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetPackagesRequest} GetPackagesRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetPackagesRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetPackagesRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.pkgType = reader.int32();
                    break;
                case 2:
                    message.lang = reader.string();
                    break;
                case 3:
                    message.currency = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetPackagesRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetPackagesRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetPackagesRequest} GetPackagesRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetPackagesRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetPackagesRequest message.
         * @function verify
         * @memberof pb.GetPackagesRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetPackagesRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.pkgType != null && message.hasOwnProperty("pkgType"))
                if (!$util.isInteger(message.pkgType))
                    return "pkgType: integer expected";
            if (message.lang != null && message.hasOwnProperty("lang"))
                if (!$util.isString(message.lang))
                    return "lang: string expected";
            if (message.currency != null && message.hasOwnProperty("currency"))
                if (!$util.isString(message.currency))
                    return "currency: string expected";
            return null;
        };

        /**
         * Creates a GetPackagesRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetPackagesRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetPackagesRequest} GetPackagesRequest
         */
        GetPackagesRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetPackagesRequest)
                return object;
            let message = new $root.pb.GetPackagesRequest();
            if (object.pkgType != null)
                message.pkgType = object.pkgType | 0;
            if (object.lang != null)
                message.lang = String(object.lang);
            if (object.currency != null)
                message.currency = String(object.currency);
            return message;
        };

        /**
         * Creates a plain object from a GetPackagesRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetPackagesRequest
         * @static
         * @param {pb.GetPackagesRequest} message GetPackagesRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetPackagesRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.pkgType = 0;
                object.lang = "";
                object.currency = "";
            }
            if (message.pkgType != null && message.hasOwnProperty("pkgType"))
                object.pkgType = message.pkgType;
            if (message.lang != null && message.hasOwnProperty("lang"))
                object.lang = message.lang;
            if (message.currency != null && message.hasOwnProperty("currency"))
                object.currency = message.currency;
            return object;
        };

        /**
         * Converts this GetPackagesRequest to JSON.
         * @function toJSON
         * @memberof pb.GetPackagesRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetPackagesRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GetPackagesRequest;
    })();

    pb.GetPackagesResponse = (function() {

        /**
         * Properties of a GetPackagesResponse.
         * @memberof pb
         * @interface IGetPackagesResponse
         * @property {number|null} [code] GetPackagesResponse code
         * @property {string|null} [msg] GetPackagesResponse msg
         * @property {Array.<pb.IPackageInfo>|null} [data] GetPackagesResponse data
         */

        /**
         * Constructs a new GetPackagesResponse.
         * @memberof pb
         * @classdesc Represents a GetPackagesResponse.
         * @implements IGetPackagesResponse
         * @constructor
         * @param {pb.IGetPackagesResponse=} [properties] Properties to set
         */
        function GetPackagesResponse(properties) {
            this.data = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetPackagesResponse code.
         * @member {number} code
         * @memberof pb.GetPackagesResponse
         * @instance
         */
        GetPackagesResponse.prototype.code = 0;

        /**
         * GetPackagesResponse msg.
         * @member {string} msg
         * @memberof pb.GetPackagesResponse
         * @instance
         */
        GetPackagesResponse.prototype.msg = "";

        /**
         * GetPackagesResponse data.
         * @member {Array.<pb.IPackageInfo>} data
         * @memberof pb.GetPackagesResponse
         * @instance
         */
        GetPackagesResponse.prototype.data = $util.emptyArray;

        /**
         * Creates a new GetPackagesResponse instance using the specified properties.
         * @function create
         * @memberof pb.GetPackagesResponse
         * @static
         * @param {pb.IGetPackagesResponse=} [properties] Properties to set
         * @returns {pb.GetPackagesResponse} GetPackagesResponse instance
         */
        GetPackagesResponse.create = function create(properties) {
            return new GetPackagesResponse(properties);
        };

        /**
         * Encodes the specified GetPackagesResponse message. Does not implicitly {@link pb.GetPackagesResponse.verify|verify} messages.
         * @function encode
         * @memberof pb.GetPackagesResponse
         * @static
         * @param {pb.IGetPackagesResponse} message GetPackagesResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetPackagesResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            if (message.data != null && message.data.length)
                for (let i = 0; i < message.data.length; ++i)
                    $root.pb.PackageInfo.encode(message.data[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GetPackagesResponse message, length delimited. Does not implicitly {@link pb.GetPackagesResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetPackagesResponse
         * @static
         * @param {pb.IGetPackagesResponse} message GetPackagesResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetPackagesResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetPackagesResponse message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetPackagesResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetPackagesResponse} GetPackagesResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetPackagesResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetPackagesResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.code = reader.int32();
                    break;
                case 2:
                    message.msg = reader.string();
                    break;
                case 3:
                    if (!(message.data && message.data.length))
                        message.data = [];
                    message.data.push($root.pb.PackageInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetPackagesResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetPackagesResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetPackagesResponse} GetPackagesResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetPackagesResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetPackagesResponse message.
         * @function verify
         * @memberof pb.GetPackagesResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetPackagesResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                if (!Array.isArray(message.data))
                    return "data: array expected";
                for (let i = 0; i < message.data.length; ++i) {
                    let error = $root.pb.PackageInfo.verify(message.data[i]);
                    if (error)
                        return "data." + error;
                }
            }
            return null;
        };

        /**
         * Creates a GetPackagesResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetPackagesResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetPackagesResponse} GetPackagesResponse
         */
        GetPackagesResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetPackagesResponse)
                return object;
            let message = new $root.pb.GetPackagesResponse();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            if (object.data) {
                if (!Array.isArray(object.data))
                    throw TypeError(".pb.GetPackagesResponse.data: array expected");
                message.data = [];
                for (let i = 0; i < object.data.length; ++i) {
                    if (typeof object.data[i] !== "object")
                        throw TypeError(".pb.GetPackagesResponse.data: object expected");
                    message.data[i] = $root.pb.PackageInfo.fromObject(object.data[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a GetPackagesResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetPackagesResponse
         * @static
         * @param {pb.GetPackagesResponse} message GetPackagesResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetPackagesResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.data = [];
            if (options.defaults) {
                object.code = 0;
                object.msg = "";
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            if (message.data && message.data.length) {
                object.data = [];
                for (let j = 0; j < message.data.length; ++j)
                    object.data[j] = $root.pb.PackageInfo.toObject(message.data[j], options);
            }
            return object;
        };

        /**
         * Converts this GetPackagesResponse to JSON.
         * @function toJSON
         * @memberof pb.GetPackagesResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetPackagesResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GetPackagesResponse;
    })();

    pb.PackageInfo = (function() {

        /**
         * Properties of a PackageInfo.
         * @memberof pb
         * @interface IPackageInfo
         * @property {number|null} [pkgId] PackageInfo pkgId
         * @property {number|null} [pkgType] PackageInfo pkgType
         * @property {string|null} [pkgName] PackageInfo pkgName
         * @property {string|null} [lang] PackageInfo lang
         * @property {number|null} [amount] PackageInfo amount
         * @property {string|null} [currency] PackageInfo currency
         * @property {number|null} [validDays] PackageInfo validDays
         * @property {number|null} [callTimes] PackageInfo callTimes
         * @property {number|null} [chainPkgId] PackageInfo chainPkgId
         * @property {number|null} [spaceSize] PackageInfo spaceSize
         * @property {string|null} [createTime] PackageInfo createTime
         */

        /**
         * Constructs a new PackageInfo.
         * @memberof pb
         * @classdesc Represents a PackageInfo.
         * @implements IPackageInfo
         * @constructor
         * @param {pb.IPackageInfo=} [properties] Properties to set
         */
        function PackageInfo(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PackageInfo pkgId.
         * @member {number} pkgId
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.pkgId = 0;

        /**
         * PackageInfo pkgType.
         * @member {number} pkgType
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.pkgType = 0;

        /**
         * PackageInfo pkgName.
         * @member {string} pkgName
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.pkgName = "";

        /**
         * PackageInfo lang.
         * @member {string} lang
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.lang = "";

        /**
         * PackageInfo amount.
         * @member {number} amount
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.amount = 0;

        /**
         * PackageInfo currency.
         * @member {string} currency
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.currency = "";

        /**
         * PackageInfo validDays.
         * @member {number} validDays
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.validDays = 0;

        /**
         * PackageInfo callTimes.
         * @member {number} callTimes
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.callTimes = 0;

        /**
         * PackageInfo chainPkgId.
         * @member {number} chainPkgId
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.chainPkgId = 0;

        /**
         * PackageInfo spaceSize.
         * @member {number} spaceSize
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.spaceSize = 0;

        /**
         * PackageInfo createTime.
         * @member {string} createTime
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.createTime = "";

        /**
         * Creates a new PackageInfo instance using the specified properties.
         * @function create
         * @memberof pb.PackageInfo
         * @static
         * @param {pb.IPackageInfo=} [properties] Properties to set
         * @returns {pb.PackageInfo} PackageInfo instance
         */
        PackageInfo.create = function create(properties) {
            return new PackageInfo(properties);
        };

        /**
         * Encodes the specified PackageInfo message. Does not implicitly {@link pb.PackageInfo.verify|verify} messages.
         * @function encode
         * @memberof pb.PackageInfo
         * @static
         * @param {pb.IPackageInfo} message PackageInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PackageInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.pkgId != null && Object.hasOwnProperty.call(message, "pkgId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.pkgId);
            if (message.pkgType != null && Object.hasOwnProperty.call(message, "pkgType"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.pkgType);
            if (message.pkgName != null && Object.hasOwnProperty.call(message, "pkgName"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.pkgName);
            if (message.lang != null && Object.hasOwnProperty.call(message, "lang"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.lang);
            if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.amount);
            if (message.currency != null && Object.hasOwnProperty.call(message, "currency"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.currency);
            if (message.validDays != null && Object.hasOwnProperty.call(message, "validDays"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.validDays);
            if (message.callTimes != null && Object.hasOwnProperty.call(message, "callTimes"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.callTimes);
            if (message.chainPkgId != null && Object.hasOwnProperty.call(message, "chainPkgId"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.chainPkgId);
            if (message.spaceSize != null && Object.hasOwnProperty.call(message, "spaceSize"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.spaceSize);
            if (message.createTime != null && Object.hasOwnProperty.call(message, "createTime"))
                writer.uint32(/* id 11, wireType 2 =*/90).string(message.createTime);
            return writer;
        };

        /**
         * Encodes the specified PackageInfo message, length delimited. Does not implicitly {@link pb.PackageInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.PackageInfo
         * @static
         * @param {pb.IPackageInfo} message PackageInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PackageInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PackageInfo message from the specified reader or buffer.
         * @function decode
         * @memberof pb.PackageInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.PackageInfo} PackageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PackageInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.PackageInfo();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.pkgId = reader.int32();
                    break;
                case 2:
                    message.pkgType = reader.int32();
                    break;
                case 3:
                    message.pkgName = reader.string();
                    break;
                case 4:
                    message.lang = reader.string();
                    break;
                case 5:
                    message.amount = reader.int32();
                    break;
                case 6:
                    message.currency = reader.string();
                    break;
                case 7:
                    message.validDays = reader.int32();
                    break;
                case 8:
                    message.callTimes = reader.int32();
                    break;
                case 9:
                    message.chainPkgId = reader.int32();
                    break;
                case 10:
                    message.spaceSize = reader.int32();
                    break;
                case 11:
                    message.createTime = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PackageInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.PackageInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.PackageInfo} PackageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PackageInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PackageInfo message.
         * @function verify
         * @memberof pb.PackageInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PackageInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.pkgId != null && message.hasOwnProperty("pkgId"))
                if (!$util.isInteger(message.pkgId))
                    return "pkgId: integer expected";
            if (message.pkgType != null && message.hasOwnProperty("pkgType"))
                if (!$util.isInteger(message.pkgType))
                    return "pkgType: integer expected";
            if (message.pkgName != null && message.hasOwnProperty("pkgName"))
                if (!$util.isString(message.pkgName))
                    return "pkgName: string expected";
            if (message.lang != null && message.hasOwnProperty("lang"))
                if (!$util.isString(message.lang))
                    return "lang: string expected";
            if (message.amount != null && message.hasOwnProperty("amount"))
                if (!$util.isInteger(message.amount))
                    return "amount: integer expected";
            if (message.currency != null && message.hasOwnProperty("currency"))
                if (!$util.isString(message.currency))
                    return "currency: string expected";
            if (message.validDays != null && message.hasOwnProperty("validDays"))
                if (!$util.isInteger(message.validDays))
                    return "validDays: integer expected";
            if (message.callTimes != null && message.hasOwnProperty("callTimes"))
                if (!$util.isInteger(message.callTimes))
                    return "callTimes: integer expected";
            if (message.chainPkgId != null && message.hasOwnProperty("chainPkgId"))
                if (!$util.isInteger(message.chainPkgId))
                    return "chainPkgId: integer expected";
            if (message.spaceSize != null && message.hasOwnProperty("spaceSize"))
                if (!$util.isInteger(message.spaceSize))
                    return "spaceSize: integer expected";
            if (message.createTime != null && message.hasOwnProperty("createTime"))
                if (!$util.isString(message.createTime))
                    return "createTime: string expected";
            return null;
        };

        /**
         * Creates a PackageInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.PackageInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.PackageInfo} PackageInfo
         */
        PackageInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.PackageInfo)
                return object;
            let message = new $root.pb.PackageInfo();
            if (object.pkgId != null)
                message.pkgId = object.pkgId | 0;
            if (object.pkgType != null)
                message.pkgType = object.pkgType | 0;
            if (object.pkgName != null)
                message.pkgName = String(object.pkgName);
            if (object.lang != null)
                message.lang = String(object.lang);
            if (object.amount != null)
                message.amount = object.amount | 0;
            if (object.currency != null)
                message.currency = String(object.currency);
            if (object.validDays != null)
                message.validDays = object.validDays | 0;
            if (object.callTimes != null)
                message.callTimes = object.callTimes | 0;
            if (object.chainPkgId != null)
                message.chainPkgId = object.chainPkgId | 0;
            if (object.spaceSize != null)
                message.spaceSize = object.spaceSize | 0;
            if (object.createTime != null)
                message.createTime = String(object.createTime);
            return message;
        };

        /**
         * Creates a plain object from a PackageInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.PackageInfo
         * @static
         * @param {pb.PackageInfo} message PackageInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PackageInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.pkgId = 0;
                object.pkgType = 0;
                object.pkgName = "";
                object.lang = "";
                object.amount = 0;
                object.currency = "";
                object.validDays = 0;
                object.callTimes = 0;
                object.chainPkgId = 0;
                object.spaceSize = 0;
                object.createTime = "";
            }
            if (message.pkgId != null && message.hasOwnProperty("pkgId"))
                object.pkgId = message.pkgId;
            if (message.pkgType != null && message.hasOwnProperty("pkgType"))
                object.pkgType = message.pkgType;
            if (message.pkgName != null && message.hasOwnProperty("pkgName"))
                object.pkgName = message.pkgName;
            if (message.lang != null && message.hasOwnProperty("lang"))
                object.lang = message.lang;
            if (message.amount != null && message.hasOwnProperty("amount"))
                object.amount = message.amount;
            if (message.currency != null && message.hasOwnProperty("currency"))
                object.currency = message.currency;
            if (message.validDays != null && message.hasOwnProperty("validDays"))
                object.validDays = message.validDays;
            if (message.callTimes != null && message.hasOwnProperty("callTimes"))
                object.callTimes = message.callTimes;
            if (message.chainPkgId != null && message.hasOwnProperty("chainPkgId"))
                object.chainPkgId = message.chainPkgId;
            if (message.spaceSize != null && message.hasOwnProperty("spaceSize"))
                object.spaceSize = message.spaceSize;
            if (message.createTime != null && message.hasOwnProperty("createTime"))
                object.createTime = message.createTime;
            return object;
        };

        /**
         * Converts this PackageInfo to JSON.
         * @function toJSON
         * @memberof pb.PackageInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PackageInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PackageInfo;
    })();

    pb.CreateOrderRequest = (function() {

        /**
         * Properties of a CreateOrderRequest.
         * @memberof pb
         * @interface ICreateOrderRequest
         * @property {string|null} [account] CreateOrderRequest account
         * @property {number|null} [pkgId] CreateOrderRequest pkgId
         * @property {string|null} [description] CreateOrderRequest description
         * @property {pb.IAmountInfo|null} [amount] CreateOrderRequest amount
         * @property {string|null} [dappid] CreateOrderRequest dappid
         */

        /**
         * Constructs a new CreateOrderRequest.
         * @memberof pb
         * @classdesc Represents a CreateOrderRequest.
         * @implements ICreateOrderRequest
         * @constructor
         * @param {pb.ICreateOrderRequest=} [properties] Properties to set
         */
        function CreateOrderRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateOrderRequest account.
         * @member {string} account
         * @memberof pb.CreateOrderRequest
         * @instance
         */
        CreateOrderRequest.prototype.account = "";

        /**
         * CreateOrderRequest pkgId.
         * @member {number} pkgId
         * @memberof pb.CreateOrderRequest
         * @instance
         */
        CreateOrderRequest.prototype.pkgId = 0;

        /**
         * CreateOrderRequest description.
         * @member {string} description
         * @memberof pb.CreateOrderRequest
         * @instance
         */
        CreateOrderRequest.prototype.description = "";

        /**
         * CreateOrderRequest amount.
         * @member {pb.IAmountInfo|null|undefined} amount
         * @memberof pb.CreateOrderRequest
         * @instance
         */
        CreateOrderRequest.prototype.amount = null;

        /**
         * CreateOrderRequest dappid.
         * @member {string} dappid
         * @memberof pb.CreateOrderRequest
         * @instance
         */
        CreateOrderRequest.prototype.dappid = "";

        /**
         * Creates a new CreateOrderRequest instance using the specified properties.
         * @function create
         * @memberof pb.CreateOrderRequest
         * @static
         * @param {pb.ICreateOrderRequest=} [properties] Properties to set
         * @returns {pb.CreateOrderRequest} CreateOrderRequest instance
         */
        CreateOrderRequest.create = function create(properties) {
            return new CreateOrderRequest(properties);
        };

        /**
         * Encodes the specified CreateOrderRequest message. Does not implicitly {@link pb.CreateOrderRequest.verify|verify} messages.
         * @function encode
         * @memberof pb.CreateOrderRequest
         * @static
         * @param {pb.ICreateOrderRequest} message CreateOrderRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateOrderRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.account != null && Object.hasOwnProperty.call(message, "account"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.account);
            if (message.pkgId != null && Object.hasOwnProperty.call(message, "pkgId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.pkgId);
            if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.description);
            if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
                $root.pb.AmountInfo.encode(message.amount, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.dappid != null && Object.hasOwnProperty.call(message, "dappid"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.dappid);
            return writer;
        };

        /**
         * Encodes the specified CreateOrderRequest message, length delimited. Does not implicitly {@link pb.CreateOrderRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.CreateOrderRequest
         * @static
         * @param {pb.ICreateOrderRequest} message CreateOrderRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateOrderRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateOrderRequest message from the specified reader or buffer.
         * @function decode
         * @memberof pb.CreateOrderRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.CreateOrderRequest} CreateOrderRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateOrderRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.CreateOrderRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.account = reader.string();
                    break;
                case 2:
                    message.pkgId = reader.int32();
                    break;
                case 3:
                    message.description = reader.string();
                    break;
                case 4:
                    message.amount = $root.pb.AmountInfo.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.dappid = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CreateOrderRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.CreateOrderRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.CreateOrderRequest} CreateOrderRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateOrderRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateOrderRequest message.
         * @function verify
         * @memberof pb.CreateOrderRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateOrderRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.account != null && message.hasOwnProperty("account"))
                if (!$util.isString(message.account))
                    return "account: string expected";
            if (message.pkgId != null && message.hasOwnProperty("pkgId"))
                if (!$util.isInteger(message.pkgId))
                    return "pkgId: integer expected";
            if (message.description != null && message.hasOwnProperty("description"))
                if (!$util.isString(message.description))
                    return "description: string expected";
            if (message.amount != null && message.hasOwnProperty("amount")) {
                let error = $root.pb.AmountInfo.verify(message.amount);
                if (error)
                    return "amount." + error;
            }
            if (message.dappid != null && message.hasOwnProperty("dappid"))
                if (!$util.isString(message.dappid))
                    return "dappid: string expected";
            return null;
        };

        /**
         * Creates a CreateOrderRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.CreateOrderRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.CreateOrderRequest} CreateOrderRequest
         */
        CreateOrderRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.CreateOrderRequest)
                return object;
            let message = new $root.pb.CreateOrderRequest();
            if (object.account != null)
                message.account = String(object.account);
            if (object.pkgId != null)
                message.pkgId = object.pkgId | 0;
            if (object.description != null)
                message.description = String(object.description);
            if (object.amount != null) {
                if (typeof object.amount !== "object")
                    throw TypeError(".pb.CreateOrderRequest.amount: object expected");
                message.amount = $root.pb.AmountInfo.fromObject(object.amount);
            }
            if (object.dappid != null)
                message.dappid = String(object.dappid);
            return message;
        };

        /**
         * Creates a plain object from a CreateOrderRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.CreateOrderRequest
         * @static
         * @param {pb.CreateOrderRequest} message CreateOrderRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateOrderRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.account = "";
                object.pkgId = 0;
                object.description = "";
                object.amount = null;
                object.dappid = "";
            }
            if (message.account != null && message.hasOwnProperty("account"))
                object.account = message.account;
            if (message.pkgId != null && message.hasOwnProperty("pkgId"))
                object.pkgId = message.pkgId;
            if (message.description != null && message.hasOwnProperty("description"))
                object.description = message.description;
            if (message.amount != null && message.hasOwnProperty("amount"))
                object.amount = $root.pb.AmountInfo.toObject(message.amount, options);
            if (message.dappid != null && message.hasOwnProperty("dappid"))
                object.dappid = message.dappid;
            return object;
        };

        /**
         * Converts this CreateOrderRequest to JSON.
         * @function toJSON
         * @memberof pb.CreateOrderRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateOrderRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CreateOrderRequest;
    })();

    pb.AmountInfo = (function() {

        /**
         * Properties of an AmountInfo.
         * @memberof pb
         * @interface IAmountInfo
         * @property {number|null} [total] AmountInfo total
         */

        /**
         * Constructs a new AmountInfo.
         * @memberof pb
         * @classdesc Represents an AmountInfo.
         * @implements IAmountInfo
         * @constructor
         * @param {pb.IAmountInfo=} [properties] Properties to set
         */
        function AmountInfo(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AmountInfo total.
         * @member {number} total
         * @memberof pb.AmountInfo
         * @instance
         */
        AmountInfo.prototype.total = 0;

        /**
         * Creates a new AmountInfo instance using the specified properties.
         * @function create
         * @memberof pb.AmountInfo
         * @static
         * @param {pb.IAmountInfo=} [properties] Properties to set
         * @returns {pb.AmountInfo} AmountInfo instance
         */
        AmountInfo.create = function create(properties) {
            return new AmountInfo(properties);
        };

        /**
         * Encodes the specified AmountInfo message. Does not implicitly {@link pb.AmountInfo.verify|verify} messages.
         * @function encode
         * @memberof pb.AmountInfo
         * @static
         * @param {pb.IAmountInfo} message AmountInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AmountInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.total != null && Object.hasOwnProperty.call(message, "total"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.total);
            return writer;
        };

        /**
         * Encodes the specified AmountInfo message, length delimited. Does not implicitly {@link pb.AmountInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.AmountInfo
         * @static
         * @param {pb.IAmountInfo} message AmountInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AmountInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AmountInfo message from the specified reader or buffer.
         * @function decode
         * @memberof pb.AmountInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.AmountInfo} AmountInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AmountInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.AmountInfo();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.total = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AmountInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.AmountInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.AmountInfo} AmountInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AmountInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AmountInfo message.
         * @function verify
         * @memberof pb.AmountInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AmountInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.total != null && message.hasOwnProperty("total"))
                if (!$util.isInteger(message.total))
                    return "total: integer expected";
            return null;
        };

        /**
         * Creates an AmountInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.AmountInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.AmountInfo} AmountInfo
         */
        AmountInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.AmountInfo)
                return object;
            let message = new $root.pb.AmountInfo();
            if (object.total != null)
                message.total = object.total | 0;
            return message;
        };

        /**
         * Creates a plain object from an AmountInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.AmountInfo
         * @static
         * @param {pb.AmountInfo} message AmountInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AmountInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.total = 0;
            if (message.total != null && message.hasOwnProperty("total"))
                object.total = message.total;
            return object;
        };

        /**
         * Converts this AmountInfo to JSON.
         * @function toJSON
         * @memberof pb.AmountInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AmountInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AmountInfo;
    })();

    pb.CreateOrderResponse = (function() {

        /**
         * Properties of a CreateOrderResponse.
         * @memberof pb
         * @interface ICreateOrderResponse
         * @property {number|null} [code] CreateOrderResponse code
         * @property {string|null} [msg] CreateOrderResponse msg
         * @property {pb.ICreateOrderData|null} [data] CreateOrderResponse data
         */

        /**
         * Constructs a new CreateOrderResponse.
         * @memberof pb
         * @classdesc Represents a CreateOrderResponse.
         * @implements ICreateOrderResponse
         * @constructor
         * @param {pb.ICreateOrderResponse=} [properties] Properties to set
         */
        function CreateOrderResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateOrderResponse code.
         * @member {number} code
         * @memberof pb.CreateOrderResponse
         * @instance
         */
        CreateOrderResponse.prototype.code = 0;

        /**
         * CreateOrderResponse msg.
         * @member {string} msg
         * @memberof pb.CreateOrderResponse
         * @instance
         */
        CreateOrderResponse.prototype.msg = "";

        /**
         * CreateOrderResponse data.
         * @member {pb.ICreateOrderData|null|undefined} data
         * @memberof pb.CreateOrderResponse
         * @instance
         */
        CreateOrderResponse.prototype.data = null;

        /**
         * Creates a new CreateOrderResponse instance using the specified properties.
         * @function create
         * @memberof pb.CreateOrderResponse
         * @static
         * @param {pb.ICreateOrderResponse=} [properties] Properties to set
         * @returns {pb.CreateOrderResponse} CreateOrderResponse instance
         */
        CreateOrderResponse.create = function create(properties) {
            return new CreateOrderResponse(properties);
        };

        /**
         * Encodes the specified CreateOrderResponse message. Does not implicitly {@link pb.CreateOrderResponse.verify|verify} messages.
         * @function encode
         * @memberof pb.CreateOrderResponse
         * @static
         * @param {pb.ICreateOrderResponse} message CreateOrderResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateOrderResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                $root.pb.CreateOrderData.encode(message.data, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CreateOrderResponse message, length delimited. Does not implicitly {@link pb.CreateOrderResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.CreateOrderResponse
         * @static
         * @param {pb.ICreateOrderResponse} message CreateOrderResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateOrderResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateOrderResponse message from the specified reader or buffer.
         * @function decode
         * @memberof pb.CreateOrderResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.CreateOrderResponse} CreateOrderResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateOrderResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.CreateOrderResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.code = reader.int32();
                    break;
                case 2:
                    message.msg = reader.string();
                    break;
                case 3:
                    message.data = $root.pb.CreateOrderData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CreateOrderResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.CreateOrderResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.CreateOrderResponse} CreateOrderResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateOrderResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateOrderResponse message.
         * @function verify
         * @memberof pb.CreateOrderResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateOrderResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                let error = $root.pb.CreateOrderData.verify(message.data);
                if (error)
                    return "data." + error;
            }
            return null;
        };

        /**
         * Creates a CreateOrderResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.CreateOrderResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.CreateOrderResponse} CreateOrderResponse
         */
        CreateOrderResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.CreateOrderResponse)
                return object;
            let message = new $root.pb.CreateOrderResponse();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            if (object.data != null) {
                if (typeof object.data !== "object")
                    throw TypeError(".pb.CreateOrderResponse.data: object expected");
                message.data = $root.pb.CreateOrderData.fromObject(object.data);
            }
            return message;
        };

        /**
         * Creates a plain object from a CreateOrderResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.CreateOrderResponse
         * @static
         * @param {pb.CreateOrderResponse} message CreateOrderResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateOrderResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.code = 0;
                object.msg = "";
                object.data = null;
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = $root.pb.CreateOrderData.toObject(message.data, options);
            return object;
        };

        /**
         * Converts this CreateOrderResponse to JSON.
         * @function toJSON
         * @memberof pb.CreateOrderResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateOrderResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CreateOrderResponse;
    })();

    pb.CreateOrderData = (function() {

        /**
         * Properties of a CreateOrderData.
         * @memberof pb
         * @interface ICreateOrderData
         * @property {string|null} [outTradeNo] CreateOrderData outTradeNo
         */

        /**
         * Constructs a new CreateOrderData.
         * @memberof pb
         * @classdesc Represents a CreateOrderData.
         * @implements ICreateOrderData
         * @constructor
         * @param {pb.ICreateOrderData=} [properties] Properties to set
         */
        function CreateOrderData(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateOrderData outTradeNo.
         * @member {string} outTradeNo
         * @memberof pb.CreateOrderData
         * @instance
         */
        CreateOrderData.prototype.outTradeNo = "";

        /**
         * Creates a new CreateOrderData instance using the specified properties.
         * @function create
         * @memberof pb.CreateOrderData
         * @static
         * @param {pb.ICreateOrderData=} [properties] Properties to set
         * @returns {pb.CreateOrderData} CreateOrderData instance
         */
        CreateOrderData.create = function create(properties) {
            return new CreateOrderData(properties);
        };

        /**
         * Encodes the specified CreateOrderData message. Does not implicitly {@link pb.CreateOrderData.verify|verify} messages.
         * @function encode
         * @memberof pb.CreateOrderData
         * @static
         * @param {pb.ICreateOrderData} message CreateOrderData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateOrderData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.outTradeNo != null && Object.hasOwnProperty.call(message, "outTradeNo"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.outTradeNo);
            return writer;
        };

        /**
         * Encodes the specified CreateOrderData message, length delimited. Does not implicitly {@link pb.CreateOrderData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.CreateOrderData
         * @static
         * @param {pb.ICreateOrderData} message CreateOrderData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateOrderData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateOrderData message from the specified reader or buffer.
         * @function decode
         * @memberof pb.CreateOrderData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.CreateOrderData} CreateOrderData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateOrderData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.CreateOrderData();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.outTradeNo = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CreateOrderData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.CreateOrderData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.CreateOrderData} CreateOrderData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateOrderData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateOrderData message.
         * @function verify
         * @memberof pb.CreateOrderData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateOrderData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.outTradeNo != null && message.hasOwnProperty("outTradeNo"))
                if (!$util.isString(message.outTradeNo))
                    return "outTradeNo: string expected";
            return null;
        };

        /**
         * Creates a CreateOrderData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.CreateOrderData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.CreateOrderData} CreateOrderData
         */
        CreateOrderData.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.CreateOrderData)
                return object;
            let message = new $root.pb.CreateOrderData();
            if (object.outTradeNo != null)
                message.outTradeNo = String(object.outTradeNo);
            return message;
        };

        /**
         * Creates a plain object from a CreateOrderData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.CreateOrderData
         * @static
         * @param {pb.CreateOrderData} message CreateOrderData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateOrderData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.outTradeNo = "";
            if (message.outTradeNo != null && message.hasOwnProperty("outTradeNo"))
                object.outTradeNo = message.outTradeNo;
            return object;
        };

        /**
         * Converts this CreateOrderData to JSON.
         * @function toJSON
         * @memberof pb.CreateOrderData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateOrderData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CreateOrderData;
    })();

    pb.GetNativePrepayRequest = (function() {

        /**
         * Properties of a GetNativePrepayRequest.
         * @memberof pb
         * @interface IGetNativePrepayRequest
         * @property {string|null} [outTradeNo] GetNativePrepayRequest outTradeNo
         */

        /**
         * Constructs a new GetNativePrepayRequest.
         * @memberof pb
         * @classdesc Represents a GetNativePrepayRequest.
         * @implements IGetNativePrepayRequest
         * @constructor
         * @param {pb.IGetNativePrepayRequest=} [properties] Properties to set
         */
        function GetNativePrepayRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetNativePrepayRequest outTradeNo.
         * @member {string} outTradeNo
         * @memberof pb.GetNativePrepayRequest
         * @instance
         */
        GetNativePrepayRequest.prototype.outTradeNo = "";

        /**
         * Creates a new GetNativePrepayRequest instance using the specified properties.
         * @function create
         * @memberof pb.GetNativePrepayRequest
         * @static
         * @param {pb.IGetNativePrepayRequest=} [properties] Properties to set
         * @returns {pb.GetNativePrepayRequest} GetNativePrepayRequest instance
         */
        GetNativePrepayRequest.create = function create(properties) {
            return new GetNativePrepayRequest(properties);
        };

        /**
         * Encodes the specified GetNativePrepayRequest message. Does not implicitly {@link pb.GetNativePrepayRequest.verify|verify} messages.
         * @function encode
         * @memberof pb.GetNativePrepayRequest
         * @static
         * @param {pb.IGetNativePrepayRequest} message GetNativePrepayRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetNativePrepayRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.outTradeNo != null && Object.hasOwnProperty.call(message, "outTradeNo"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.outTradeNo);
            return writer;
        };

        /**
         * Encodes the specified GetNativePrepayRequest message, length delimited. Does not implicitly {@link pb.GetNativePrepayRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetNativePrepayRequest
         * @static
         * @param {pb.IGetNativePrepayRequest} message GetNativePrepayRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetNativePrepayRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetNativePrepayRequest message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetNativePrepayRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetNativePrepayRequest} GetNativePrepayRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetNativePrepayRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetNativePrepayRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.outTradeNo = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetNativePrepayRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetNativePrepayRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetNativePrepayRequest} GetNativePrepayRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetNativePrepayRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetNativePrepayRequest message.
         * @function verify
         * @memberof pb.GetNativePrepayRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetNativePrepayRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.outTradeNo != null && message.hasOwnProperty("outTradeNo"))
                if (!$util.isString(message.outTradeNo))
                    return "outTradeNo: string expected";
            return null;
        };

        /**
         * Creates a GetNativePrepayRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetNativePrepayRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetNativePrepayRequest} GetNativePrepayRequest
         */
        GetNativePrepayRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetNativePrepayRequest)
                return object;
            let message = new $root.pb.GetNativePrepayRequest();
            if (object.outTradeNo != null)
                message.outTradeNo = String(object.outTradeNo);
            return message;
        };

        /**
         * Creates a plain object from a GetNativePrepayRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetNativePrepayRequest
         * @static
         * @param {pb.GetNativePrepayRequest} message GetNativePrepayRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetNativePrepayRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.outTradeNo = "";
            if (message.outTradeNo != null && message.hasOwnProperty("outTradeNo"))
                object.outTradeNo = message.outTradeNo;
            return object;
        };

        /**
         * Converts this GetNativePrepayRequest to JSON.
         * @function toJSON
         * @memberof pb.GetNativePrepayRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetNativePrepayRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GetNativePrepayRequest;
    })();

    pb.GetNativePrepayResponse = (function() {

        /**
         * Properties of a GetNativePrepayResponse.
         * @memberof pb
         * @interface IGetNativePrepayResponse
         * @property {number|null} [code] GetNativePrepayResponse code
         * @property {string|null} [msg] GetNativePrepayResponse msg
         * @property {pb.INativePrepayData|null} [data] GetNativePrepayResponse data
         */

        /**
         * Constructs a new GetNativePrepayResponse.
         * @memberof pb
         * @classdesc Represents a GetNativePrepayResponse.
         * @implements IGetNativePrepayResponse
         * @constructor
         * @param {pb.IGetNativePrepayResponse=} [properties] Properties to set
         */
        function GetNativePrepayResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetNativePrepayResponse code.
         * @member {number} code
         * @memberof pb.GetNativePrepayResponse
         * @instance
         */
        GetNativePrepayResponse.prototype.code = 0;

        /**
         * GetNativePrepayResponse msg.
         * @member {string} msg
         * @memberof pb.GetNativePrepayResponse
         * @instance
         */
        GetNativePrepayResponse.prototype.msg = "";

        /**
         * GetNativePrepayResponse data.
         * @member {pb.INativePrepayData|null|undefined} data
         * @memberof pb.GetNativePrepayResponse
         * @instance
         */
        GetNativePrepayResponse.prototype.data = null;

        /**
         * Creates a new GetNativePrepayResponse instance using the specified properties.
         * @function create
         * @memberof pb.GetNativePrepayResponse
         * @static
         * @param {pb.IGetNativePrepayResponse=} [properties] Properties to set
         * @returns {pb.GetNativePrepayResponse} GetNativePrepayResponse instance
         */
        GetNativePrepayResponse.create = function create(properties) {
            return new GetNativePrepayResponse(properties);
        };

        /**
         * Encodes the specified GetNativePrepayResponse message. Does not implicitly {@link pb.GetNativePrepayResponse.verify|verify} messages.
         * @function encode
         * @memberof pb.GetNativePrepayResponse
         * @static
         * @param {pb.IGetNativePrepayResponse} message GetNativePrepayResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetNativePrepayResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                $root.pb.NativePrepayData.encode(message.data, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GetNativePrepayResponse message, length delimited. Does not implicitly {@link pb.GetNativePrepayResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetNativePrepayResponse
         * @static
         * @param {pb.IGetNativePrepayResponse} message GetNativePrepayResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetNativePrepayResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetNativePrepayResponse message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetNativePrepayResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetNativePrepayResponse} GetNativePrepayResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetNativePrepayResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetNativePrepayResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.code = reader.int32();
                    break;
                case 2:
                    message.msg = reader.string();
                    break;
                case 3:
                    message.data = $root.pb.NativePrepayData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetNativePrepayResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetNativePrepayResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetNativePrepayResponse} GetNativePrepayResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetNativePrepayResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetNativePrepayResponse message.
         * @function verify
         * @memberof pb.GetNativePrepayResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetNativePrepayResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                let error = $root.pb.NativePrepayData.verify(message.data);
                if (error)
                    return "data." + error;
            }
            return null;
        };

        /**
         * Creates a GetNativePrepayResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetNativePrepayResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetNativePrepayResponse} GetNativePrepayResponse
         */
        GetNativePrepayResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetNativePrepayResponse)
                return object;
            let message = new $root.pb.GetNativePrepayResponse();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            if (object.data != null) {
                if (typeof object.data !== "object")
                    throw TypeError(".pb.GetNativePrepayResponse.data: object expected");
                message.data = $root.pb.NativePrepayData.fromObject(object.data);
            }
            return message;
        };

        /**
         * Creates a plain object from a GetNativePrepayResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetNativePrepayResponse
         * @static
         * @param {pb.GetNativePrepayResponse} message GetNativePrepayResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetNativePrepayResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.code = 0;
                object.msg = "";
                object.data = null;
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = $root.pb.NativePrepayData.toObject(message.data, options);
            return object;
        };

        /**
         * Converts this GetNativePrepayResponse to JSON.
         * @function toJSON
         * @memberof pb.GetNativePrepayResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetNativePrepayResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GetNativePrepayResponse;
    })();

    pb.NativePrepayData = (function() {

        /**
         * Properties of a NativePrepayData.
         * @memberof pb
         * @interface INativePrepayData
         * @property {string|null} [codeUrl] NativePrepayData codeUrl
         */

        /**
         * Constructs a new NativePrepayData.
         * @memberof pb
         * @classdesc Represents a NativePrepayData.
         * @implements INativePrepayData
         * @constructor
         * @param {pb.INativePrepayData=} [properties] Properties to set
         */
        function NativePrepayData(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * NativePrepayData codeUrl.
         * @member {string} codeUrl
         * @memberof pb.NativePrepayData
         * @instance
         */
        NativePrepayData.prototype.codeUrl = "";

        /**
         * Creates a new NativePrepayData instance using the specified properties.
         * @function create
         * @memberof pb.NativePrepayData
         * @static
         * @param {pb.INativePrepayData=} [properties] Properties to set
         * @returns {pb.NativePrepayData} NativePrepayData instance
         */
        NativePrepayData.create = function create(properties) {
            return new NativePrepayData(properties);
        };

        /**
         * Encodes the specified NativePrepayData message. Does not implicitly {@link pb.NativePrepayData.verify|verify} messages.
         * @function encode
         * @memberof pb.NativePrepayData
         * @static
         * @param {pb.INativePrepayData} message NativePrepayData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NativePrepayData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.codeUrl != null && Object.hasOwnProperty.call(message, "codeUrl"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.codeUrl);
            return writer;
        };

        /**
         * Encodes the specified NativePrepayData message, length delimited. Does not implicitly {@link pb.NativePrepayData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.NativePrepayData
         * @static
         * @param {pb.INativePrepayData} message NativePrepayData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NativePrepayData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a NativePrepayData message from the specified reader or buffer.
         * @function decode
         * @memberof pb.NativePrepayData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.NativePrepayData} NativePrepayData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NativePrepayData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.NativePrepayData();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.codeUrl = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a NativePrepayData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.NativePrepayData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.NativePrepayData} NativePrepayData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NativePrepayData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a NativePrepayData message.
         * @function verify
         * @memberof pb.NativePrepayData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NativePrepayData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.codeUrl != null && message.hasOwnProperty("codeUrl"))
                if (!$util.isString(message.codeUrl))
                    return "codeUrl: string expected";
            return null;
        };

        /**
         * Creates a NativePrepayData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.NativePrepayData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.NativePrepayData} NativePrepayData
         */
        NativePrepayData.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.NativePrepayData)
                return object;
            let message = new $root.pb.NativePrepayData();
            if (object.codeUrl != null)
                message.codeUrl = String(object.codeUrl);
            return message;
        };

        /**
         * Creates a plain object from a NativePrepayData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.NativePrepayData
         * @static
         * @param {pb.NativePrepayData} message NativePrepayData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NativePrepayData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.codeUrl = "";
            if (message.codeUrl != null && message.hasOwnProperty("codeUrl"))
                object.codeUrl = message.codeUrl;
            return object;
        };

        /**
         * Converts this NativePrepayData to JSON.
         * @function toJSON
         * @memberof pb.NativePrepayData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NativePrepayData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return NativePrepayData;
    })();

    pb.GetStoragePurchaseStatusRequest = (function() {

        /**
         * Properties of a GetStoragePurchaseStatusRequest.
         * @memberof pb
         * @interface IGetStoragePurchaseStatusRequest
         * @property {string|null} [outTradeNo] GetStoragePurchaseStatusRequest outTradeNo
         */

        /**
         * Constructs a new GetStoragePurchaseStatusRequest.
         * @memberof pb
         * @classdesc Represents a GetStoragePurchaseStatusRequest.
         * @implements IGetStoragePurchaseStatusRequest
         * @constructor
         * @param {pb.IGetStoragePurchaseStatusRequest=} [properties] Properties to set
         */
        function GetStoragePurchaseStatusRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetStoragePurchaseStatusRequest outTradeNo.
         * @member {string} outTradeNo
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @instance
         */
        GetStoragePurchaseStatusRequest.prototype.outTradeNo = "";

        /**
         * Creates a new GetStoragePurchaseStatusRequest instance using the specified properties.
         * @function create
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @static
         * @param {pb.IGetStoragePurchaseStatusRequest=} [properties] Properties to set
         * @returns {pb.GetStoragePurchaseStatusRequest} GetStoragePurchaseStatusRequest instance
         */
        GetStoragePurchaseStatusRequest.create = function create(properties) {
            return new GetStoragePurchaseStatusRequest(properties);
        };

        /**
         * Encodes the specified GetStoragePurchaseStatusRequest message. Does not implicitly {@link pb.GetStoragePurchaseStatusRequest.verify|verify} messages.
         * @function encode
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @static
         * @param {pb.IGetStoragePurchaseStatusRequest} message GetStoragePurchaseStatusRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetStoragePurchaseStatusRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.outTradeNo != null && Object.hasOwnProperty.call(message, "outTradeNo"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.outTradeNo);
            return writer;
        };

        /**
         * Encodes the specified GetStoragePurchaseStatusRequest message, length delimited. Does not implicitly {@link pb.GetStoragePurchaseStatusRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @static
         * @param {pb.IGetStoragePurchaseStatusRequest} message GetStoragePurchaseStatusRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetStoragePurchaseStatusRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetStoragePurchaseStatusRequest message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetStoragePurchaseStatusRequest} GetStoragePurchaseStatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetStoragePurchaseStatusRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetStoragePurchaseStatusRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.outTradeNo = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetStoragePurchaseStatusRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetStoragePurchaseStatusRequest} GetStoragePurchaseStatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetStoragePurchaseStatusRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetStoragePurchaseStatusRequest message.
         * @function verify
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetStoragePurchaseStatusRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.outTradeNo != null && message.hasOwnProperty("outTradeNo"))
                if (!$util.isString(message.outTradeNo))
                    return "outTradeNo: string expected";
            return null;
        };

        /**
         * Creates a GetStoragePurchaseStatusRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetStoragePurchaseStatusRequest} GetStoragePurchaseStatusRequest
         */
        GetStoragePurchaseStatusRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetStoragePurchaseStatusRequest)
                return object;
            let message = new $root.pb.GetStoragePurchaseStatusRequest();
            if (object.outTradeNo != null)
                message.outTradeNo = String(object.outTradeNo);
            return message;
        };

        /**
         * Creates a plain object from a GetStoragePurchaseStatusRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @static
         * @param {pb.GetStoragePurchaseStatusRequest} message GetStoragePurchaseStatusRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetStoragePurchaseStatusRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.outTradeNo = "";
            if (message.outTradeNo != null && message.hasOwnProperty("outTradeNo"))
                object.outTradeNo = message.outTradeNo;
            return object;
        };

        /**
         * Converts this GetStoragePurchaseStatusRequest to JSON.
         * @function toJSON
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetStoragePurchaseStatusRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GetStoragePurchaseStatusRequest;
    })();

    pb.GetStoragePurchaseStatusResponse = (function() {

        /**
         * Properties of a GetStoragePurchaseStatusResponse.
         * @memberof pb
         * @interface IGetStoragePurchaseStatusResponse
         * @property {number|null} [code] GetStoragePurchaseStatusResponse code
         * @property {string|null} [msg] GetStoragePurchaseStatusResponse msg
         * @property {pb.IGetStoragePurchaseStatusData|null} [data] GetStoragePurchaseStatusResponse data
         */

        /**
         * Constructs a new GetStoragePurchaseStatusResponse.
         * @memberof pb
         * @classdesc Represents a GetStoragePurchaseStatusResponse.
         * @implements IGetStoragePurchaseStatusResponse
         * @constructor
         * @param {pb.IGetStoragePurchaseStatusResponse=} [properties] Properties to set
         */
        function GetStoragePurchaseStatusResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetStoragePurchaseStatusResponse code.
         * @member {number} code
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @instance
         */
        GetStoragePurchaseStatusResponse.prototype.code = 0;

        /**
         * GetStoragePurchaseStatusResponse msg.
         * @member {string} msg
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @instance
         */
        GetStoragePurchaseStatusResponse.prototype.msg = "";

        /**
         * GetStoragePurchaseStatusResponse data.
         * @member {pb.IGetStoragePurchaseStatusData|null|undefined} data
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @instance
         */
        GetStoragePurchaseStatusResponse.prototype.data = null;

        /**
         * Creates a new GetStoragePurchaseStatusResponse instance using the specified properties.
         * @function create
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @static
         * @param {pb.IGetStoragePurchaseStatusResponse=} [properties] Properties to set
         * @returns {pb.GetStoragePurchaseStatusResponse} GetStoragePurchaseStatusResponse instance
         */
        GetStoragePurchaseStatusResponse.create = function create(properties) {
            return new GetStoragePurchaseStatusResponse(properties);
        };

        /**
         * Encodes the specified GetStoragePurchaseStatusResponse message. Does not implicitly {@link pb.GetStoragePurchaseStatusResponse.verify|verify} messages.
         * @function encode
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @static
         * @param {pb.IGetStoragePurchaseStatusResponse} message GetStoragePurchaseStatusResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetStoragePurchaseStatusResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                $root.pb.GetStoragePurchaseStatusData.encode(message.data, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GetStoragePurchaseStatusResponse message, length delimited. Does not implicitly {@link pb.GetStoragePurchaseStatusResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @static
         * @param {pb.IGetStoragePurchaseStatusResponse} message GetStoragePurchaseStatusResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetStoragePurchaseStatusResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetStoragePurchaseStatusResponse message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetStoragePurchaseStatusResponse} GetStoragePurchaseStatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetStoragePurchaseStatusResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetStoragePurchaseStatusResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.code = reader.int32();
                    break;
                case 2:
                    message.msg = reader.string();
                    break;
                case 3:
                    message.data = $root.pb.GetStoragePurchaseStatusData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetStoragePurchaseStatusResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetStoragePurchaseStatusResponse} GetStoragePurchaseStatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetStoragePurchaseStatusResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetStoragePurchaseStatusResponse message.
         * @function verify
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetStoragePurchaseStatusResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                let error = $root.pb.GetStoragePurchaseStatusData.verify(message.data);
                if (error)
                    return "data." + error;
            }
            return null;
        };

        /**
         * Creates a GetStoragePurchaseStatusResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetStoragePurchaseStatusResponse} GetStoragePurchaseStatusResponse
         */
        GetStoragePurchaseStatusResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetStoragePurchaseStatusResponse)
                return object;
            let message = new $root.pb.GetStoragePurchaseStatusResponse();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            if (object.data != null) {
                if (typeof object.data !== "object")
                    throw TypeError(".pb.GetStoragePurchaseStatusResponse.data: object expected");
                message.data = $root.pb.GetStoragePurchaseStatusData.fromObject(object.data);
            }
            return message;
        };

        /**
         * Creates a plain object from a GetStoragePurchaseStatusResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @static
         * @param {pb.GetStoragePurchaseStatusResponse} message GetStoragePurchaseStatusResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetStoragePurchaseStatusResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.code = 0;
                object.msg = "";
                object.data = null;
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = $root.pb.GetStoragePurchaseStatusData.toObject(message.data, options);
            return object;
        };

        /**
         * Converts this GetStoragePurchaseStatusResponse to JSON.
         * @function toJSON
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetStoragePurchaseStatusResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GetStoragePurchaseStatusResponse;
    })();

    pb.GetStoragePurchaseStatusData = (function() {

        /**
         * Properties of a GetStoragePurchaseStatusData.
         * @memberof pb
         * @interface IGetStoragePurchaseStatusData
         * @property {number|null} [status] GetStoragePurchaseStatusData status
         */

        /**
         * Constructs a new GetStoragePurchaseStatusData.
         * @memberof pb
         * @classdesc Represents a GetStoragePurchaseStatusData.
         * @implements IGetStoragePurchaseStatusData
         * @constructor
         * @param {pb.IGetStoragePurchaseStatusData=} [properties] Properties to set
         */
        function GetStoragePurchaseStatusData(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetStoragePurchaseStatusData status.
         * @member {number} status
         * @memberof pb.GetStoragePurchaseStatusData
         * @instance
         */
        GetStoragePurchaseStatusData.prototype.status = 0;

        /**
         * Creates a new GetStoragePurchaseStatusData instance using the specified properties.
         * @function create
         * @memberof pb.GetStoragePurchaseStatusData
         * @static
         * @param {pb.IGetStoragePurchaseStatusData=} [properties] Properties to set
         * @returns {pb.GetStoragePurchaseStatusData} GetStoragePurchaseStatusData instance
         */
        GetStoragePurchaseStatusData.create = function create(properties) {
            return new GetStoragePurchaseStatusData(properties);
        };

        /**
         * Encodes the specified GetStoragePurchaseStatusData message. Does not implicitly {@link pb.GetStoragePurchaseStatusData.verify|verify} messages.
         * @function encode
         * @memberof pb.GetStoragePurchaseStatusData
         * @static
         * @param {pb.IGetStoragePurchaseStatusData} message GetStoragePurchaseStatusData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetStoragePurchaseStatusData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.status);
            return writer;
        };

        /**
         * Encodes the specified GetStoragePurchaseStatusData message, length delimited. Does not implicitly {@link pb.GetStoragePurchaseStatusData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetStoragePurchaseStatusData
         * @static
         * @param {pb.IGetStoragePurchaseStatusData} message GetStoragePurchaseStatusData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetStoragePurchaseStatusData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetStoragePurchaseStatusData message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetStoragePurchaseStatusData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetStoragePurchaseStatusData} GetStoragePurchaseStatusData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetStoragePurchaseStatusData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetStoragePurchaseStatusData();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.status = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetStoragePurchaseStatusData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetStoragePurchaseStatusData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetStoragePurchaseStatusData} GetStoragePurchaseStatusData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetStoragePurchaseStatusData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetStoragePurchaseStatusData message.
         * @function verify
         * @memberof pb.GetStoragePurchaseStatusData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetStoragePurchaseStatusData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isInteger(message.status))
                    return "status: integer expected";
            return null;
        };

        /**
         * Creates a GetStoragePurchaseStatusData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetStoragePurchaseStatusData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetStoragePurchaseStatusData} GetStoragePurchaseStatusData
         */
        GetStoragePurchaseStatusData.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetStoragePurchaseStatusData)
                return object;
            let message = new $root.pb.GetStoragePurchaseStatusData();
            if (object.status != null)
                message.status = object.status | 0;
            return message;
        };

        /**
         * Creates a plain object from a GetStoragePurchaseStatusData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetStoragePurchaseStatusData
         * @static
         * @param {pb.GetStoragePurchaseStatusData} message GetStoragePurchaseStatusData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetStoragePurchaseStatusData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.status = 0;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            return object;
        };

        /**
         * Converts this GetStoragePurchaseStatusData to JSON.
         * @function toJSON
         * @memberof pb.GetStoragePurchaseStatusData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetStoragePurchaseStatusData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GetStoragePurchaseStatusData;
    })();

    return pb;
})();

export { $root as default };
