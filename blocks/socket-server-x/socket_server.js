"use strict";

module.exports = { initialize, getInstance };


let io = require('socket.io');
let socketServerInstance = null;


/**
 * Module to manage a socket server using socket.io
 */
class SocketServer {

  /**
   * Init the socket server
   */
  constructor (intPort, objController) {
    this.port = intPort || 8080;
    this.io = io(this.port);
    this.objController = objController;
    console.log('Socket server listening on port', this.port);
    this._setAuthorization();
    this._setDefaultListeners();
  }


  /**
   * Set default listeners like joining a room
   */
  _setDefaultListeners () {
    this.io.on('connection', (objSocket) => {
      console.log('Socket client connected', this.io.engine.clientsCount);
      objSocket.on('join_room', (strRoom) => {
        console.log('Joining room', strRoom);
        objSocket.join(strRoom);
      });
    })
  }


  _setAuthorization() {
    this.io.use((objSocket, fnNext) => {
      if (objSocket.handshake.query.token) {
        this.objController.getByToken(objSocket.handshake.query.token).then((objUser) => {
          fnNext();
        }).catch(() => {
          fnNext(new Error('Authentication error'));
        });
      } else {
        fnNext(new Error('Authentication error'));
      }
    });
  }


  /**
   * Set handler for onConnection event
   */
  onConnection (fn) {
    this.io.on('connection',  (objSocket) => {
      fn(objSocket);
    });
    return this;
  }


  /**
   * Set handler for onDisconnection event
   */
  onDisconnection (fn) {
    this.io.on('disconnection', (objSocket) => {
      fn(objSocket);
    });
    return this;
  }


  /**
   * Emit a message to all clients
   * @param  {String} strRoom    Room name to broadcast
   * @param  {String} strMessage Message string to emit to all connected
   *                          sockets within the room provided.
   * @param  {Object} data    Data to emit
   * @return {Object}         Current socket server instance
   */
  broadcast (strRoom, strMessage, objData) {
    this.io.to(strRoom).emit(strMessage, objData);
    return this;
  }


  /**
   * Add a listener to a specific message
   * @param  {String}   message  Message to listen
   * @param  {Function} callback Callback function for message listener
   * @return {Object}            Current socket server instance
   */
  on (strMessage, fnCallback) {
    this.io.on(strMessage, fnCallback);
    return this;
  }

}


/**
 * Init socket server and return running instance
 * @param  {Integer} port Port number
 * @return {SocketServer} Socket server instance
 */
function initialize (intPort, objController) {
  socketServerInstance = new SocketServer(intPort, objController);
  return getInstance();
}


/**
 * Returns the current instance for the socket server
 * @return {SocketServer} Socket server instance
 */
function getInstance () {
  return socketServerInstance;
}
