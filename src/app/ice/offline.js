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

    offline.OfflineTaskInfoResponse = class
    {
        constructor(taskHash = "", progress = 0, fileSize = new Ice.Long(0, 0), downloadSize = new Ice.Long(0, 0), speed = new Ice.Long(0, 0), name = "", type = 0, addon = "", serverId = "", createTime = new Ice.Long(0, 0), updateTime = new Ice.Long(0, 0), cmds = "", status = 0, createUser = new Ice.Long(0, 0), createIp = "", flag = 0)
        {
            this.taskHash = taskHash;
            this.progress = progress;
            this.fileSize = fileSize;
            this.downloadSize = downloadSize;
            this.speed = speed;
            this.name = name;
            this.type = type;
            this.addon = addon;
            this.serverId = serverId;
            this.createTime = createTime;
            this.updateTime = updateTime;
            this.cmds = cmds;
            this.status = status;
            this.createUser = createUser;
            this.createIp = createIp;
            this.flag = flag;
        }

        _write(ostr)
        {
            ostr.writeString(this.taskHash);
            ostr.writeInt(this.progress);
            ostr.writeLong(this.fileSize);
            ostr.writeLong(this.downloadSize);
            ostr.writeLong(this.speed);
            ostr.writeString(this.name);
            ostr.writeInt(this.type);
            ostr.writeString(this.addon);
            ostr.writeString(this.serverId);
            ostr.writeLong(this.createTime);
            ostr.writeLong(this.updateTime);
            ostr.writeString(this.cmds);
            ostr.writeInt(this.status);
            ostr.writeLong(this.createUser);
            ostr.writeString(this.createIp);
            ostr.writeInt(this.flag);
        }

        _read(istr)
        {
            this.taskHash = istr.readString();
            this.progress = istr.readInt();
            this.fileSize = istr.readLong();
            this.downloadSize = istr.readLong();
            this.speed = istr.readLong();
            this.name = istr.readString();
            this.type = istr.readInt();
            this.addon = istr.readString();
            this.serverId = istr.readString();
            this.createTime = istr.readLong();
            this.updateTime = istr.readLong();
            this.cmds = istr.readString();
            this.status = istr.readInt();
            this.createUser = istr.readLong();
            this.createIp = istr.readString();
            this.flag = istr.readInt();
        }

        static get minWireSize()
        {
            return  70;
        }
    };

    Slice.defineStruct(offline.OfflineTaskInfoResponse, true, true);

    offline.TaskDetailResponse = class
    {
        constructor(taskHash = "", taskOrder = 0, filename = "", fileSize = new Ice.Long(0, 0), downloadSize = new Ice.Long(0, 0), speed = new Ice.Long(0, 0), localPath = "", serverId = "", taskUrl = "", taskFastUrl = "", operation = 0, taskProgress = 0, createTime = new Ice.Long(0, 0), updateTime = new Ice.Long(0, 0), storeId = "", addon = "", status = 0)
        {
            this.taskHash = taskHash;
            this.taskOrder = taskOrder;
            this.filename = filename;
            this.fileSize = fileSize;
            this.downloadSize = downloadSize;
            this.speed = speed;
            this.localPath = localPath;
            this.serverId = serverId;
            this.taskUrl = taskUrl;
            this.taskFastUrl = taskFastUrl;
            this.operation = operation;
            this.taskProgress = taskProgress;
            this.createTime = createTime;
            this.updateTime = updateTime;
            this.storeId = storeId;
            this.addon = addon;
            this.status = status;
        }

        _write(ostr)
        {
            ostr.writeString(this.taskHash);
            ostr.writeInt(this.taskOrder);
            ostr.writeString(this.filename);
            ostr.writeLong(this.fileSize);
            ostr.writeLong(this.downloadSize);
            ostr.writeLong(this.speed);
            ostr.writeString(this.localPath);
            ostr.writeString(this.serverId);
            ostr.writeString(this.taskUrl);
            ostr.writeString(this.taskFastUrl);
            ostr.writeInt(this.operation);
            ostr.writeInt(this.taskProgress);
            ostr.writeLong(this.createTime);
            ostr.writeLong(this.updateTime);
            ostr.writeString(this.storeId);
            ostr.writeString(this.addon);
            ostr.writeInt(this.status);
        }

        _read(istr)
        {
            this.taskHash = istr.readString();
            this.taskOrder = istr.readInt();
            this.filename = istr.readString();
            this.fileSize = istr.readLong();
            this.downloadSize = istr.readLong();
            this.speed = istr.readLong();
            this.localPath = istr.readString();
            this.serverId = istr.readString();
            this.taskUrl = istr.readString();
            this.taskFastUrl = istr.readString();
            this.operation = istr.readInt();
            this.taskProgress = istr.readInt();
            this.createTime = istr.readLong();
            this.updateTime = istr.readLong();
            this.storeId = istr.readString();
            this.addon = istr.readString();
            this.status = istr.readInt();
        }

        static get minWireSize()
        {
            return  64;
        }
    };

    Slice.defineStruct(offline.TaskDetailResponse, true, true);

    offline.TaskStatisticsResponse = class
    {
        constructor(serverId = "", taskHash = "", taskIndex = 0, fileSize = new Ice.Long(0, 0), localPath = "", status = 0, lastUpdateTime = new Ice.Long(0, 0), taskSpeed = new Ice.Long(0, 0), taskType = 0)
        {
            this.serverId = serverId;
            this.taskHash = taskHash;
            this.taskIndex = taskIndex;
            this.fileSize = fileSize;
            this.localPath = localPath;
            this.status = status;
            this.lastUpdateTime = lastUpdateTime;
            this.taskSpeed = taskSpeed;
            this.taskType = taskType;
        }

        _write(ostr)
        {
            ostr.writeString(this.serverId);
            ostr.writeString(this.taskHash);
            ostr.writeInt(this.taskIndex);
            ostr.writeLong(this.fileSize);
            ostr.writeString(this.localPath);
            ostr.writeInt(this.status);
            ostr.writeLong(this.lastUpdateTime);
            ostr.writeLong(this.taskSpeed);
            ostr.writeInt(this.taskType);
        }

        _read(istr)
        {
            this.serverId = istr.readString();
            this.taskHash = istr.readString();
            this.taskIndex = istr.readInt();
            this.fileSize = istr.readLong();
            this.localPath = istr.readString();
            this.status = istr.readInt();
            this.lastUpdateTime = istr.readLong();
            this.taskSpeed = istr.readLong();
            this.taskType = istr.readInt();
        }

        static get minWireSize()
        {
            return  39;
        }
    };

    Slice.defineStruct(offline.TaskStatisticsResponse, true, true);

    offline.OfflineTaskListenerResponse = class
    {
        constructor(taskHash = "", userId = new Ice.Long(0, 0), status = 0, createTime = new Ice.Long(0, 0))
        {
            this.taskHash = taskHash;
            this.userId = userId;
            this.status = status;
            this.createTime = createTime;
        }

        _write(ostr)
        {
            ostr.writeString(this.taskHash);
            ostr.writeLong(this.userId);
            ostr.writeInt(this.status);
            ostr.writeLong(this.createTime);
        }

        _read(istr)
        {
            this.taskHash = istr.readString();
            this.userId = istr.readLong();
            this.status = istr.readInt();
            this.createTime = istr.readLong();
        }

        static get minWireSize()
        {
            return  21;
        }
    };

    Slice.defineStruct(offline.OfflineTaskListenerResponse, true, true);

    Slice.defineSequence(offline, "TaskDetailResponseListHelper", "offline.TaskDetailResponse", false);

    Slice.defineSequence(offline, "OfflineTaskInfoResponseListHelper", "offline.OfflineTaskInfoResponse", false);

    Slice.defineSequence(offline, "intListHelper", "Ice.IntHelper", true);

    Slice.defineSequence(offline, "TaskStatisticsResponseListHelper", "offline.TaskStatisticsResponse", false);

    offline.DownloadStatusRefreshRequest = class
    {
        constructor(taskInfo = new offline.OfflineTaskInfoResponse(), files = null)
        {
            this.taskInfo = taskInfo;
            this.files = files;
        }

        _write(ostr)
        {
            offline.OfflineTaskInfoResponse.write(ostr, this.taskInfo);
            offline.TaskDetailResponseListHelper.write(ostr, this.files);
        }

        _read(istr)
        {
            this.taskInfo = offline.OfflineTaskInfoResponse.read(istr, this.taskInfo);
            this.files = offline.TaskDetailResponseListHelper.read(istr);
        }

        static get minWireSize()
        {
            return  71;
        }
    };

    Slice.defineStruct(offline.DownloadStatusRefreshRequest, true, true);

    Slice.defineSequence(offline, "DownloadStatusRefreshRequestListHelper", "offline.DownloadStatusRefreshRequest", false);

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
        "refreshDownloadStatus": [, , , , [1], [["offline.DownloadStatusRefreshRequestListHelper"]], ,
        [
            offline.OfflineOperationException
        ], , ],
        "addTask": [, , , , [offline.OfflineTaskInfoResponse], [[offline.OfflineTaskInfoResponse]], ,
        [
            offline.OfflineOperationException
        ], , ],
        "resumeTask": [, , , , ["offline.OfflineTaskInfoResponseListHelper"], [[3], [7], ["offline.intListHelper"]], ,
        [
            offline.OfflineOperationException
        ], , ],
        "fetchTask": [, , , , [offline.OfflineTaskInfoResponse], [[3], [3], [7], ["offline.intListHelper"]], ,
        [
            offline.OfflineOperationException
        ], , ],
        "fetchUploadTask": [, , , , [offline.TaskStatisticsResponse], [[3], [3], [7]], ,
        [
            offline.OfflineOperationException
        ], , ],
        "fetchUploadTaskList": [, , , , ["offline.TaskStatisticsResponseListHelper"], [[3], [3], [7]], ,
        [
            offline.OfflineOperationException
        ], , ],
        "refreshTorrent": [, , , , ["offline.TaskDetailResponseListHelper"], [["offline.TaskDetailResponseListHelper"], [1]], ,
        [
            offline.OfflineOperationException
        ], , ],
        "getTaskDetailList": [, , , , ["offline.TaskDetailResponseListHelper"], [[7]], ,
        [
            offline.OfflineOperationException
        ], , ],
        "singleFileFinish": [, , , , [1], [[7], [3], [7]], ,
        [
            offline.OfflineOperationException
        ], , ],
        "taskFinish": [, , , , [1], [[7]], ,
        [
            offline.OfflineOperationException
        ], , ]
    });
    exports.offline = offline;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : this.Ice._require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : this));
