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
// Generated from file `userservice.ice'
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

    let user = _ModuleRegistry.module("user");

    user.RegisterFailedException = class extends Ice.UserException
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
            return "::user::RegisterFailedException";
        }

        _mostDerivedType()
        {
            return user.RegisterFailedException;
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

    user.LoginFailedException = class extends Ice.UserException
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
            return "::user::LoginFailedException";
        }

        _mostDerivedType()
        {
            return user.LoginFailedException;
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

    user.UserResponse = class
    {
        constructor(uuid = "", name = "", email = "", phone = "", createTime = new Ice.Long(0, 0), ssid = "", level = 0, type = 0, ban = 0, banTime = new Ice.Long(0, 0), refreshTime = new Ice.Long(0, 0), lastLoginTime = new Ice.Long(0, 0))
        {
            this.uuid = uuid;
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.createTime = createTime;
            this.ssid = ssid;
            this.level = level;
            this.type = type;
            this.ban = ban;
            this.banTime = banTime;
            this.refreshTime = refreshTime;
            this.lastLoginTime = lastLoginTime;
        }

        _write(ostr)
        {
            ostr.writeString(this.uuid);
            ostr.writeString(this.name);
            ostr.writeString(this.email);
            ostr.writeString(this.phone);
            ostr.writeLong(this.createTime);
            ostr.writeString(this.ssid);
            ostr.writeInt(this.level);
            ostr.writeInt(this.type);
            ostr.writeInt(this.ban);
            ostr.writeLong(this.banTime);
            ostr.writeLong(this.refreshTime);
            ostr.writeLong(this.lastLoginTime);
        }

        _read(istr)
        {
            this.uuid = istr.readString();
            this.name = istr.readString();
            this.email = istr.readString();
            this.phone = istr.readString();
            this.createTime = istr.readLong();
            this.ssid = istr.readString();
            this.level = istr.readInt();
            this.type = istr.readInt();
            this.ban = istr.readInt();
            this.banTime = istr.readLong();
            this.refreshTime = istr.readLong();
            this.lastLoginTime = istr.readLong();
        }

        static get minWireSize()
        {
            return  49;
        }
    };

    Slice.defineStruct(user.UserResponse, true, true);

    const iceC_user_UserServiceHandler_ids = [
        "::Ice::Object",
        "::user::UserServiceHandler"
    ];

    user.UserServiceHandler = class extends Ice.Object
    {
    };

    user.UserServiceHandlerPrx = class extends Ice.ObjectPrx
    {
    };

    Slice.defineOperations(user.UserServiceHandler, user.UserServiceHandlerPrx, iceC_user_UserServiceHandler_ids, 1,
    {
        "registerUser": [, , , , [user.UserResponse], [[7], [7], [7], [7], [7]], ,
        [
            user.RegisterFailedException
        ], , ],
        "getUserByUuid": [, , , , [user.UserResponse], [[7]], , , , ],
        "checkUserExistsByName": [, , , , [1], [[7]], , , , ],
        "checkUserExistsByEmail": [, , , , [1], [[7]], , , , ],
        "checkUserExistsByPhone": [, , , , [1], [[7]], , , , ],
        "checkUserValidByName": [, , , , [user.UserResponse], [[7], [7]], ,
        [
            user.LoginFailedException
        ], , ],
        "checkUserValidByEmail": [, , , , [user.UserResponse], [[7], [7]], ,
        [
            user.LoginFailedException
        ], , ],
        "checkUserValidByPhone": [, , , , [user.UserResponse], [[7], [7]], ,
        [
            user.LoginFailedException
        ], , ]
    });
    exports.user = user;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : this.Ice._require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : this));
