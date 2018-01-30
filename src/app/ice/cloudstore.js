// **********************************************************************
//
// Copyright (c) 2003-2017 ZeroC, Inc. All rights reserved.
//
// This copy of Ice is licensed to you under the terms described in the
// ICE_LICENSE file included in this distribution.
//
// **********************************************************************
//
// Ice version 3.7.0
//
// <auto-generated>
//
// Generated from file `cloudstore.ice'
//
// Warning: do not edit this file.
//
// </auto-generated>
//

(function(module, require, exports)
{
    const Ice = require("ice").Ice;
    const _ModuleRegistry = Ice._ModuleRegistry;
    const Slice = Ice.Slice;

    let store = _ModuleRegistry.module("store");

    store.RemoteOperationFailedException = class extends Ice.UserException
    {
        constructor(innerCode = 0, innerMessage = "", _cause = "")
        {
            super(_cause);
            this.innerCode = innerCode;
            this.innerMessage = innerMessage;
        }

        static get _parent()
        {
            return Ice.UserException;
        }

        static get _id()
        {
            return "::store::RemoteOperationFailedException";
        }

        _mostDerivedType()
        {
            return store.RemoteOperationFailedException;
        }

        _writeMemberImpl(ostr)
        {
            ostr.writeInt(this.innerCode);
            ostr.writeString(this.innerMessage);
        }

        _readMemberImpl(istr)
        {
            this.innerCode = istr.readInt();
            this.innerMessage = istr.readString();
        }
    };

    store.CloudStoreTokenResponse = class
    {
        constructor(userId = new Ice.Long(0, 0), token = "", type = 0, uploadUrl = "", version = 0)
        {
            this.userId = userId;
            this.token = token;
            this.type = type;
            this.uploadUrl = uploadUrl;
            this.version = version;
        }

        _write(ostr)
        {
            ostr.writeLong(this.userId);
            ostr.writeString(this.token);
            ostr.writeInt(this.type);
            ostr.writeString(this.uploadUrl);
            ostr.writeInt(this.version);
        }

        _read(istr)
        {
            this.userId = istr.readLong();
            this.token = istr.readString();
            this.type = istr.readInt();
            this.uploadUrl = istr.readString();
            this.version = istr.readInt();
        }

        static get minWireSize()
        {
            return  18;
        }
    };

    Slice.defineStruct(store.CloudStoreTokenResponse, true, true);

    const iceC_store_CloudStoreServiceHandler_ids = [
        "::Ice::Object",
        "::store::CloudStoreServiceHandler"
    ];

    store.CloudStoreServiceHandler = class extends Ice.Object
    {
    };

    store.CloudStoreServiceHandlerPrx = class extends Ice.ObjectPrx
    {
    };

    Slice.defineOperations(store.CloudStoreServiceHandler, store.CloudStoreServiceHandlerPrx, iceC_store_CloudStoreServiceHandler_ids, 1,
    {
        "createUploadToken": [, , , , [store.CloudStoreTokenResponse], [[4]], ,
        [
            store.RemoteOperationFailedException
        ], , ]
    });
    exports.store = store;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : this.Ice._require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : this));
