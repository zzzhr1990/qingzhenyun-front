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
        constructor(name = "", parent = "", token = "", type = 0, uploadUrl = "", version = 0)
        {
            this.name = name;
            this.parent = parent;
            this.token = token;
            this.type = type;
            this.uploadUrl = uploadUrl;
            this.version = version;
        }

        _write(ostr)
        {
            ostr.writeString(this.name);
            ostr.writeString(this.parent);
            ostr.writeString(this.token);
            ostr.writeInt(this.type);
            ostr.writeString(this.uploadUrl);
            ostr.writeInt(this.version);
        }

        _read(istr)
        {
            this.name = istr.readString();
            this.parent = istr.readString();
            this.token = istr.readString();
            this.type = istr.readInt();
            this.uploadUrl = istr.readString();
            this.version = istr.readInt();
        }

        static get minWireSize()
        {
            return  12;
        }
    };

    Slice.defineStruct(store.CloudStoreTokenResponse, true, true);

    store.CloudStoreResponse = class
    {
        constructor(fileHash = "", fileSize = new Ice.Long(0, 0), mime = "", uploadUser = new Ice.Long(0, 0), ctime = new Ice.Long(0, 0), originalFilename = "", fileBucket = "", fileKey = "", storeType = 0, preview = 0, previewAddon = "", uploadIp = "", flag = 0)
        {
            this.fileHash = fileHash;
            this.fileSize = fileSize;
            this.mime = mime;
            this.uploadUser = uploadUser;
            this.ctime = ctime;
            this.originalFilename = originalFilename;
            this.fileBucket = fileBucket;
            this.fileKey = fileKey;
            this.storeType = storeType;
            this.preview = preview;
            this.previewAddon = previewAddon;
            this.uploadIp = uploadIp;
            this.flag = flag;
        }

        _write(ostr)
        {
            ostr.writeString(this.fileHash);
            ostr.writeLong(this.fileSize);
            ostr.writeString(this.mime);
            ostr.writeLong(this.uploadUser);
            ostr.writeLong(this.ctime);
            ostr.writeString(this.originalFilename);
            ostr.writeString(this.fileBucket);
            ostr.writeString(this.fileKey);
            ostr.writeInt(this.storeType);
            ostr.writeInt(this.preview);
            ostr.writeString(this.previewAddon);
            ostr.writeString(this.uploadIp);
            ostr.writeInt(this.flag);
        }

        _read(istr)
        {
            this.fileHash = istr.readString();
            this.fileSize = istr.readLong();
            this.mime = istr.readString();
            this.uploadUser = istr.readLong();
            this.ctime = istr.readLong();
            this.originalFilename = istr.readString();
            this.fileBucket = istr.readString();
            this.fileKey = istr.readString();
            this.storeType = istr.readInt();
            this.preview = istr.readInt();
            this.previewAddon = istr.readString();
            this.uploadIp = istr.readString();
            this.flag = istr.readInt();
        }

        static get minWireSize()
        {
            return  43;
        }
    };

    Slice.defineStruct(store.CloudStoreResponse, true, true);

    store.PreviewTaskResponse = class
    {
        constructor(taskId = new Ice.Long(0, 0), fileHash = "", mime = "", fileBucket = "", fileKey = "", storeType = 0, preview = 0, previewType = 0, actionTime = new Ice.Long(0, 0))
        {
            this.taskId = taskId;
            this.fileHash = fileHash;
            this.mime = mime;
            this.fileBucket = fileBucket;
            this.fileKey = fileKey;
            this.storeType = storeType;
            this.preview = preview;
            this.previewType = previewType;
            this.actionTime = actionTime;
        }

        _write(ostr)
        {
            ostr.writeLong(this.taskId);
            ostr.writeString(this.fileHash);
            ostr.writeString(this.mime);
            ostr.writeString(this.fileBucket);
            ostr.writeString(this.fileKey);
            ostr.writeInt(this.storeType);
            ostr.writeInt(this.preview);
            ostr.writeInt(this.previewType);
            ostr.writeLong(this.actionTime);
        }

        _read(istr)
        {
            this.taskId = istr.readLong();
            this.fileHash = istr.readString();
            this.mime = istr.readString();
            this.fileBucket = istr.readString();
            this.fileKey = istr.readString();
            this.storeType = istr.readInt();
            this.preview = istr.readInt();
            this.previewType = istr.readInt();
            this.actionTime = istr.readLong();
        }

        static get minWireSize()
        {
            return  32;
        }
    };

    Slice.defineStruct(store.PreviewTaskResponse, true, true);

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
        "createUploadToken": [, , , , [store.CloudStoreTokenResponse], [[4], [7], [7]], ,
        [
            store.RemoteOperationFailedException
        ], , ],
        "uploadFile": [, , , , [store.CloudStoreResponse], [[7]], ,
        [
            store.RemoteOperationFailedException
        ], , ],
        "getFile": [, , , , [store.CloudStoreResponse], [[7]], ,
        [
            store.RemoteOperationFailedException
        ], , ],
        "updateFilePreviewStatus": [, , , , [store.CloudStoreResponse], [[4], [7], [7], [3], [7], [7], [7], [3], [3]], ,
        [
            store.RemoteOperationFailedException
        ], , ],
        "fetchPreviewTask": [, , , , [store.PreviewTaskResponse], [[3], [3], [3]], ,
        [
            store.RemoteOperationFailedException
        ], , ],
        "updatePreviewTaskStatus": [, , , , [store.PreviewTaskResponse], [[4], [7], [3], [3], [7]], ,
        [
            store.RemoteOperationFailedException
        ], , ]
    });
    exports.store = store;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : this.Ice._require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : this));
