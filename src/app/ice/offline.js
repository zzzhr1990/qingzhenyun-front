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
// Generated from file `offline.ice'
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

    let offline = _ModuleRegistry.module("offline");

    offline.OfflineOperationException = class extends Ice.UserException
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
            return "::offline::OfflineOperationException";
        }

        _mostDerivedType()
        {
            return offline.OfflineOperationException;
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

    offline.OfflineTaskPageResponse = class
    {
        constructor(page = 0, pageSize = 0, totalCount = 0, totalPage = 0)
        {
            this.page = page;
            this.pageSize = pageSize;
            this.totalCount = totalCount;
            this.totalPage = totalPage;
        }

        _write(ostr)
        {
            ostr.writeInt(this.page);
            ostr.writeInt(this.pageSize);
            ostr.writeInt(this.totalCount);
            ostr.writeInt(this.totalPage);
        }

        _read(istr)
        {
            this.page = istr.readInt();
            this.pageSize = istr.readInt();
            this.totalCount = istr.readInt();
            this.totalPage = istr.readInt();
        }

        static get minWireSize()
        {
            return  16;
        }
    };

    Slice.defineStruct(offline.OfflineTaskPageResponse, true, false);

    offline.OfflineTaskAddResponse = class
    {
        constructor(taskId = new Ice.Long(0, 0))
        {
            this.taskId = taskId;
        }

        _write(ostr)
        {
            ostr.writeLong(this.taskId);
        }

        _read(istr)
        {
            this.taskId = istr.readLong();
        }

        static get minWireSize()
        {
            return  8;
        }
    };

    Slice.defineStruct(offline.OfflineTaskAddResponse, true, false);

    offline.TaskDetailResponse = class
    {
        constructor(taskHash = "", taskOrder = 0, filename = "", localPath = "", serverId = "", taskUrl = "", taskFastUrl = "", operation = 0, taskProgress = 0, createTime = new Ice.Long(0, 0), updateTime = new Ice.Long(0, 0), storeType = 0, storeBucket = "", storeKey = "", addon = "", status = 0)
        {
            this.taskHash = taskHash;
            this.taskOrder = taskOrder;
            this.filename = filename;
            this.localPath = localPath;
            this.serverId = serverId;
            this.taskUrl = taskUrl;
            this.taskFastUrl = taskFastUrl;
            this.operation = operation;
            this.taskProgress = taskProgress;
            this.createTime = createTime;
            this.updateTime = updateTime;
            this.storeType = storeType;
            this.storeBucket = storeBucket;
            this.storeKey = storeKey;
            this.addon = addon;
            this.status = status;
        }

        _write(ostr)
        {
            ostr.writeString(this.taskHash);
            ostr.writeInt(this.taskOrder);
            ostr.writeString(this.filename);
            ostr.writeString(this.localPath);
            ostr.writeString(this.serverId);
            ostr.writeString(this.taskUrl);
            ostr.writeString(this.taskFastUrl);
            ostr.writeInt(this.operation);
            ostr.writeInt(this.taskProgress);
            ostr.writeLong(this.createTime);
            ostr.writeLong(this.updateTime);
            ostr.writeInt(this.storeType);
            ostr.writeString(this.storeBucket);
            ostr.writeString(this.storeKey);
            ostr.writeString(this.addon);
            ostr.writeInt(this.status);
        }

        _read(istr)
        {
            this.taskHash = istr.readString();
            this.taskOrder = istr.readInt();
            this.filename = istr.readString();
            this.localPath = istr.readString();
            this.serverId = istr.readString();
            this.taskUrl = istr.readString();
            this.taskFastUrl = istr.readString();
            this.operation = istr.readInt();
            this.taskProgress = istr.readInt();
            this.createTime = istr.readLong();
            this.updateTime = istr.readLong();
            this.storeType = istr.readInt();
            this.storeBucket = istr.readString();
            this.storeKey = istr.readString();
            this.addon = istr.readString();
            this.status = istr.readInt();
        }

        static get minWireSize()
        {
            return  45;
        }
    };

    Slice.defineStruct(offline.TaskDetailResponse, true, true);

    Slice.defineSequence(offline, "UserFileResponseListHelper", "offline.TaskDetailResponse", false);

    const iceC_offline_OfflineDownloadServiceHandler_ids = [
        "::Ice::Object",
        "::offline::OfflineDownloadServiceHandler"
    ];

    offline.OfflineDownloadServiceHandler = class extends Ice.Object
    {
    };

    offline.OfflineDownloadServiceHandlerPrx = class extends Ice.ObjectPrx
    {
    };

    Slice.defineOperations(offline.OfflineDownloadServiceHandler, offline.OfflineDownloadServiceHandlerPrx, iceC_offline_OfflineDownloadServiceHandler_ids, 1,
    {
        "addTask": [, , , , [offline.OfflineTaskAddResponse], [[7], [3], [7], [7], [4]], ,
        [
            offline.OfflineOperationException
        ], , ],
        "refreshTorrent": [, , , , ["offline.UserFileResponseListHelper"], [["offline.UserFileResponseListHelper"], [1]], ,
        [
            offline.OfflineOperationException
        ], , ]
    });
    exports.offline = offline;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : this.Ice._require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : this));