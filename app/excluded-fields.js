"use strict";


module.exports = ExcludedFields();


////////////////////////////////////////////////////////////


function ExcludedFields() {
  const Timestamps = [
    'created_at',
    'updated_at',
    'deleted_at'
  ];


  //Start Token
  const Token = [
    'id',
    ...Timestamps
  ];
  //End Token


  //Start User
  const UserCreated = [
    'password',
    ...Timestamps
  ];

  const GetUser = [
    'password',
    ...Timestamps
  ];
  //End User

  return {
    UserCreated,
    GetUser,
    Token
  };
}



