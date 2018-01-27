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
// Generated from file `userfile.ice'
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

    let userfile = _ModuleRegistry.module("userfile");

    userfile.FileOperationException = class extends Ice.UserException
    {
        constructor(innerCode = 0, innerMessage = "", fileType = 0, _cause = "")
        {
            super(_cause);
            this.innerCode = innerCode;
            this.innerMessage = innerMessage;
            this.fileType = fileType;
        }

        static get _parent()
        {
            return Ice.UserException;
        }

        static get _id()
        {
            return "::userfile::FileOperationException";
        }

        _mostDerivedType()
        {
            return userfile.FileOperationException;
        }

        _writeMemberImpl(ostr)
        {
            ostr.writeInt(this.innerCode);
            ostr.writeString(this.innerMessage);
            ostr.writeInt(this.fileType);
        }

        _readMemberImpl(istr)
        {
            this.innerCode = istr.readInt();
            this.innerMessage = istr.readString();
            this.fileType = istr.readInt();
        }
    };

    const iceC_userfile_UserFileResponse_ids = [
        "::Ice::Object",
        "::userfile::UserFileResponse"
    ];

    userfile.UserFileResponse = class extends Ice.Value
    {
        constructor(uuid = "", storeId = "", userId = new Ice.Long(0, 0), size = new Ice.Long(0, 0), parent = "", mime = "", type = 0, atime = new Ice.Long(0, 0), mtime = new Ice.Long(0, 0), ctime = new Ice.Long(0, 0), alias = "", name = "", ext = "", preview = "", flag = 0, recycle = 0)
        {
            super();
            this.uuid = uuid;
            this.storeId = storeId;
            this.userId = userId;
            this.size = size;
            this.parent = parent;
            this.mime = mime;
            this.type = type;
            this.atime = atime;
            this.mtime = mtime;
            this.ctime = ctime;
            this.alias = alias;
            this.name = name;
            this.ext = ext;
            this.preview = preview;
            this.flag = flag;
            this.recycle = recycle;
        }

        _iceWriteMemberImpl(ostr)
        {
            ostr.writeString(this.uuid);
            ostr.writeString(this.storeId);
            ostr.writeLong(this.userId);
            ostr.writeLong(this.size);
            ostr.writeString(this.parent);
            ostr.writeString(this.mime);
            ostr.writeInt(this.type);
            ostr.writeLong(this.atime);
            ostr.writeLong(this.mtime);
            ostr.writeLong(this.ctime);
            ostr.writeString(this.alias);
            ostr.writeString(this.name);
            ostr.writeString(this.ext);
            ostr.writeString(this.preview);
            ostr.writeInt(this.flag);
            ostr.writeInt(this.recycle);
        }

        _iceReadMemberImpl(istr)
        {
            this.uuid = istr.readString();
            this.storeId = istr.readString();
            this.userId = istr.readLong();
            this.size = istr.readLong();
            this.parent = istr.readString();
            this.mime = istr.readString();
            this.type = istr.readInt();
            this.atime = istr.readLong();
            this.mtime = istr.readLong();
            this.ctime = istr.readLong();
            this.alias = istr.readString();
            this.name = istr.readString();
            this.ext = istr.readString();
            this.preview = istr.readString();
            this.flag = istr.readInt();
            this.recycle = istr.readInt();
        }
    };

    Slice.defineValue(userfile.UserFileResponse, iceC_userfile_UserFileResponse_ids[1], false);

    userfile.UserFileResponseDisp = class extends Ice.Object
    {
    };

    Slice.defineOperations(userfile.UserFileResponseDisp, undefined, iceC_userfile_UserFileResponse_ids, 1);

    Slice.defineSequence(userfile, "UserFileResponseListHelper", "Ice.ObjectHelper", false, "userfile.UserFileResponse");

    const iceC_userfile_UserFileResponseEx_ids = [
        "::Ice::Object",
        "::userfile::UserFileResponse",
        "::userfile::UserFileResponseEx"
    ];

    userfile.UserFileResponseEx = class extends userfile.UserFileResponse
    {
        constructor(uuid, storeId, userId, size, parent, mime, type, atime, mtime, ctime, alias, name, ext, preview, flag, recycle, path = null)
        {
            super(uuid, storeId, userId, size, parent, mime, type, atime, mtime, ctime, alias, name, ext, preview, flag, recycle);
            this.path = path;
        }

        _iceWriteMemberImpl(ostr)
        {
            userfile.UserFileResponseListHelper.write(ostr, this.path);
        }

        _iceReadMemberImpl(istr)
        {
            this.path = userfile.UserFileResponseListHelper.read(istr);
        }
    };

    Slice.defineValue(userfile.UserFileResponseEx, iceC_userfile_UserFileResponseEx_ids[2], false);

    userfile.UserFileResponseExDisp = class extends userfile.UserFileResponseDisp
    {
    };

    Slice.defineOperations(userfile.UserFileResponseExDisp, undefined, iceC_userfile_UserFileResponseEx_ids, 2);

    userfile.UserFilePageResponse = class
    {
        constructor(page = 0, pageSize = 0, totalCount = 0, totalPage = 0, list = null, path = null, info = null)
        {
            this.page = page;
            this.pageSize = pageSize;
            this.totalCount = totalCount;
            this.totalPage = totalPage;
            this.list = list;
            this.path = path;
            this.info = info;
        }

        _write(ostr)
        {
            ostr.writeInt(this.page);
            ostr.writeInt(this.pageSize);
            ostr.writeInt(this.totalCount);
            ostr.writeInt(this.totalPage);
            userfile.UserFileResponseListHelper.write(ostr, this.list);
            userfile.UserFileResponseListHelper.write(ostr, this.path);
            ostr.writeValue(this.info);
        }

        _read(istr)
        {
            this.page = istr.readInt();
            this.pageSize = istr.readInt();
            this.totalCount = istr.readInt();
            this.totalPage = istr.readInt();
            this.list = userfile.UserFileResponseListHelper.read(istr);
            this.path = userfile.UserFileResponseListHelper.read(istr);
            istr.readValue(obj => this.info = obj, userfile.UserFileResponse);
        }

        static get minWireSize()
        {
            return  19;
        }
    };

    Slice.defineStruct(userfile.UserFilePageResponse, false, true);

    const iceC_userfile_UserFileServiceHandler_ids = [
        "::Ice::Object",
        "::userfile::UserFileServiceHandler"
    ];

    userfile.UserFileServiceHandler = class extends Ice.Object
    {
    };

    userfile.UserFileServiceHandlerPrx = class extends Ice.ObjectPrx
    {
    };

    Slice.defineOperations(userfile.UserFileServiceHandler, userfile.UserFileServiceHandlerPrx, iceC_userfile_UserFileServiceHandler_ids, 1,
    {
        "listDirectoryPage": [, , , , [userfile.UserFilePageResponse], [[7], [4], [3], [3], [3]], ,
        [
            userfile.FileOperationException
        ], , true],
        "createDirectory": [, , , , ["userfile.UserFileResponse", true], [[7], [4], [7]], ,
        [
            userfile.FileOperationException
        ], , true],
        "getFilePath": [, , , , ["userfile.UserFileResponseListHelper"], [[7], [4]], ,
        [
            userfile.FileOperationException
        ], , true],
        "get": [, , , , ["userfile.UserFileResponseEx", true], [[7], [4]], ,
        [
            userfile.FileOperationException
        ], , true],
        "move": [, , , , [3], [[7], [7], [4]], ,
        [
            userfile.FileOperationException
        ], , ],
        "recycle": [, , , , [3], [[7], [4]], ,
        [
            userfile.FileOperationException
        ], , ]
    });
    exports.userfile = userfile;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : this.Ice._require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : this));